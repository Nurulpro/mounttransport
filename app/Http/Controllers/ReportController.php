<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\FuelRecord;
use App\Models\Trip;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month', now()->month);

        $monthlyFuel = FuelRecord::selectRaw('DATE_FORMAT(date, "%Y-%m") as month, SUM(total_cost) as cost, SUM(quantity) as quantity')
            ->whereYear('date', $year)
            ->groupByRaw('DATE_FORMAT(date, "%Y-%m")')
            ->orderBy('month')
            ->get();

        $monthlyExpense = Expense::selectRaw('DATE_FORMAT(date, "%Y-%m") as month, SUM(amount) as total')
            ->whereYear('date', $year)
            ->groupByRaw('DATE_FORMAT(date, "%Y-%m")')
            ->orderBy('month')
            ->get();

        $vehicleExpense = Expense::with('vehicle')
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->selectRaw('vehicle_id, SUM(amount) as total')
            ->groupBy('vehicle_id')
            ->get()
            ->map(fn ($e) => [
                'vehicle' => $e->vehicle?->registration_number ?? 'N/A',
                'total' => (float) $e->total,
            ]);

        $departmentExpense = Expense::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->whereNotNull('department')
            ->selectRaw('department, SUM(amount) as total')
            ->groupBy('department')
            ->get();

        $categoryExpense = Expense::whereYear('date', $year)
            ->whereMonth('date', $month)
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->get();

        $tripSummary = [
            'total' => Trip::whereYear('start_datetime', $year)->whereMonth('start_datetime', $month)->count(),
            'completed' => Trip::where('status', 'completed')->whereYear('start_datetime', $year)->whereMonth('start_datetime', $month)->count(),
            'total_distance' => Trip::where('status', 'completed')->whereYear('start_datetime', $year)->whereMonth('start_datetime', $month)->sum('distance'),
        ];

        return Inertia::render('reports/index', [
            'monthlyFuel' => $monthlyFuel,
            'monthlyExpense' => $monthlyExpense,
            'vehicleExpense' => $vehicleExpense,
            'departmentExpense' => $departmentExpense,
            'categoryExpense' => $categoryExpense,
            'tripSummary' => $tripSummary,
            'year' => (int) $year,
            'month' => (int) $month,
        ]);
    }
}
