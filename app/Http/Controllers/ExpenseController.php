<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\Expense;
use App\Models\Trip;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Expense::with(['vehicle', 'driver', 'trip']);

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        if ($request->filled('from')) {
            $query->whereDate('date', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->whereDate('date', '<=', $request->to);
        }

        $expenses = $query->latest('date')->paginate(15)->withQueryString();

        $now = Carbon::now();
        $monthlyTotal = Expense::whereMonth('date', $now->month)->whereYear('date', $now->year)->sum('amount');

        $byCategory = Expense::selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        return Inertia::render('expenses/index', [
            'expenses' => $expenses,
            'filters' => $request->only(['category', 'vehicle_id', 'from', 'to']),
            'vehicles' => Vehicle::all(['id', 'registration_number']),
            'monthlyTotal' => (float) $monthlyTotal,
            'byCategory' => $byCategory,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('expenses/create', [
            'vehicles' => Vehicle::all(['id', 'registration_number']),
            'drivers' => Driver::where('status', 'active')->get(['id', 'name']),
            'trips' => Trip::whereIn('status', ['running', 'completed'])->latest()->take(50)->get(['id', 'trip_number', 'start_location', 'destination']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'driver_id' => 'nullable|exists:drivers,id',
            'trip_id' => 'nullable|exists:trips,id',
            'category' => 'required|in:fuel,toll,parking,repair,insurance,tax,driver_allowance,spare_parts,others',
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string',
            'department' => 'nullable|string',
            'approved_by' => 'nullable|string',
            'receipt_number' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        Expense::create($validated);

        return redirect()->route('expenses.index')->with('success', 'Expense recorded.');
    }

    public function destroy(Expense $expense): RedirectResponse
    {
        $expense->delete();

        return redirect()->route('expenses.index')->with('success', 'Expense deleted.');
    }
}
