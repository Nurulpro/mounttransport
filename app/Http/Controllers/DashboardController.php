<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\Expense;
use App\Models\FuelRecord;
use App\Models\Maintenance;
use App\Models\Trip;
use App\Models\Vehicle;
use App\Models\VehicleRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $now = Carbon::now();

        $vehicleStats = [
            'total' => Vehicle::count(),
            'active' => Vehicle::where('status', 'active')->count(),
            'in_service' => Vehicle::where('status', 'in_service')->count(),
            'under_maintenance' => Vehicle::where('status', 'under_maintenance')->count(),
            'inactive' => Vehicle::whereIn('status', ['sold', 'inactive'])->count(),
        ];

        $driverStats = [
            'total' => Driver::count(),
            'active' => Driver::where('status', 'active')->count(),
            'on_leave' => Driver::where('status', 'on_leave')->count(),
        ];

        $tripStats = [
            'active' => Trip::whereIn('status', ['scheduled', 'running'])->count(),
            'completed_this_month' => Trip::where('status', 'completed')
                ->whereMonth('start_datetime', $now->month)
                ->whereYear('start_datetime', $now->year)
                ->count(),
        ];

        $fuelThisMonth = FuelRecord::whereMonth('date', $now->month)
            ->whereYear('date', $now->year)
            ->sum('total_cost');

        $fuelQuantityThisMonth = FuelRecord::whereMonth('date', $now->month)
            ->whereYear('date', $now->year)
            ->sum('quantity');

        $monthlyExpense = Expense::whereMonth('date', $now->month)
            ->whereYear('date', $now->year)
            ->sum('amount');

        $upcomingMaintenance = Maintenance::where('status', '!=', 'completed')
            ->whereNotNull('next_service_due')
            ->where('next_service_due', '<=', $now->copy()->addDays(30))
            ->with('vehicle')
            ->orderBy('next_service_due')
            ->take(5)
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'vehicle' => $m->vehicle->registration_number ?? 'N/A',
                'type' => $m->maintenance_type,
                'due' => $m->next_service_due?->format('Y-m-d'),
            ]);

        $expiryAlerts = collect();

        Vehicle::whereNotNull('insurance_expiry')
            ->where('insurance_expiry', '<=', $now->copy()->addDays(30))
            ->get()
            ->each(fn ($v) => $expiryAlerts->push([
                'vehicle' => $v->registration_number,
                'type' => 'Insurance',
                'expiry' => $v->insurance_expiry?->format('Y-m-d'),
            ]));

        Vehicle::whereNotNull('fitness_certificate_expiry')
            ->where('fitness_certificate_expiry', '<=', $now->copy()->addDays(30))
            ->get()
            ->each(fn ($v) => $expiryAlerts->push([
                'vehicle' => $v->registration_number,
                'type' => 'Fitness Certificate',
                'expiry' => $v->fitness_certificate_expiry?->format('Y-m-d'),
            ]));

        Vehicle::whereNotNull('tax_token_expiry')
            ->where('tax_token_expiry', '<=', $now->copy()->addDays(30))
            ->get()
            ->each(fn ($v) => $expiryAlerts->push([
                'vehicle' => $v->registration_number,
                'type' => 'Tax Token',
                'expiry' => $v->tax_token_expiry?->format('Y-m-d'),
            ]));

        $pendingRequests = VehicleRequest::where('status', 'pending')->count();

        $monthlyExpenseBreakdown = Expense::whereMonth('date', $now->month)
            ->whereYear('date', $now->year)
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->get()
            ->map(fn ($e) => ['category' => $e->category, 'total' => (float) $e->total]);

        return Inertia::render('dashboard', [
            'vehicleStats' => $vehicleStats,
            'driverStats' => $driverStats,
            'tripStats' => $tripStats,
            'fuelThisMonth' => (float) $fuelThisMonth,
            'fuelQuantityThisMonth' => (float) $fuelQuantityThisMonth,
            'monthlyExpense' => (float) $monthlyExpense,
            'upcomingMaintenance' => $upcomingMaintenance,
            'expiryAlerts' => $expiryAlerts->sortBy('expiry')->values(),
            'pendingRequests' => $pendingRequests,
            'monthlyExpenseBreakdown' => $monthlyExpenseBreakdown,
        ]);
    }
}
