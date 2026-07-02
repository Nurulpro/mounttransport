<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\FuelRecord;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FuelController extends Controller
{
    public function index(Request $request): Response
    {
        $query = FuelRecord::with(['vehicle', 'driver']);

        if ($request->filled('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        if ($request->filled('from')) {
            $query->whereDate('date', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->whereDate('date', '<=', $request->to);
        }

        $records = $query->latest('date')->paginate(15)->withQueryString();

        $summary = [
            'total_cost' => FuelRecord::sum('total_cost'),
            'total_quantity' => FuelRecord::sum('quantity'),
            'avg_mileage' => FuelRecord::whereNotNull('mileage')->avg('mileage'),
        ];

        return Inertia::render('fuel/index', [
            'records' => $records,
            'filters' => $request->only(['vehicle_id', 'from', 'to']),
            'vehicles' => Vehicle::all(['id', 'registration_number']),
            'summary' => $summary,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('fuel/create', [
            'vehicles' => Vehicle::all(['id', 'registration_number', 'brand', 'model', 'fuel_type']),
            'drivers' => Driver::where('status', 'active')->get(['id', 'name', 'employee_id']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'driver_id' => 'nullable|exists:drivers,id',
            'date' => 'required|date',
            'fuel_type' => 'required|string',
            'fuel_station' => 'nullable|string',
            'quantity' => 'required|numeric|min:0.1',
            'price_per_liter' => 'required|numeric|min:0',
            'odometer_reading' => 'required|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $validated['total_cost'] = $validated['quantity'] * $validated['price_per_liter'];

        $lastRecord = FuelRecord::where('vehicle_id', $validated['vehicle_id'])
            ->where('odometer_reading', '<', $validated['odometer_reading'])
            ->latest('odometer_reading')
            ->first();

        if ($lastRecord) {
            $kmDriven = $validated['odometer_reading'] - $lastRecord->odometer_reading;
            if ($kmDriven > 0 && $validated['quantity'] > 0) {
                $validated['mileage'] = round($kmDriven / $validated['quantity'], 2);
            }
        }

        FuelRecord::create($validated);

        Vehicle::find($validated['vehicle_id'])->update(['current_odometer' => $validated['odometer_reading']]);

        return redirect()->route('fuel.index')->with('success', 'Fuel record added.');
    }

    public function edit(FuelRecord $fuel): Response
    {
        return Inertia::render('fuel/edit', [
            'record' => $fuel->load(['vehicle', 'driver']),
            'vehicles' => Vehicle::all(['id', 'registration_number']),
            'drivers' => Driver::where('status', 'active')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, FuelRecord $fuel): RedirectResponse
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'driver_id' => 'nullable|exists:drivers,id',
            'date' => 'required|date',
            'fuel_type' => 'required|string',
            'fuel_station' => 'nullable|string',
            'quantity' => 'required|numeric|min:0.1',
            'price_per_liter' => 'required|numeric|min:0',
            'odometer_reading' => 'required|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $validated['total_cost'] = $validated['quantity'] * $validated['price_per_liter'];

        $fuel->update($validated);

        return redirect()->route('fuel.index')->with('success', 'Fuel record updated.');
    }

    public function destroy(FuelRecord $fuel): RedirectResponse
    {
        $fuel->delete();

        return redirect()->route('fuel.index')->with('success', 'Fuel record deleted.');
    }
}
