<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Vehicle::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('registration_number', 'like', "%$search%")
                    ->orWhere('brand', 'like', "%$search%")
                    ->orWhere('model', 'like', "%$search%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('vehicle_type')) {
            $query->where('vehicle_type', $request->vehicle_type);
        }

        $vehicles = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('vehicles/index', [
            'vehicles' => $vehicles,
            'filters' => $request->only(['search', 'status', 'vehicle_type']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('vehicles/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'registration_number' => 'required|string|unique:vehicles',
            'vehicle_type' => 'required|in:car,bus,truck,pickup,motorcycle',
            'brand' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'manufacturing_year' => 'required|integer|min:1970|max:'.date('Y'),
            'chassis_number' => 'nullable|string|unique:vehicles',
            'engine_number' => 'nullable|string',
            'fuel_type' => 'required|in:petrol,diesel,cng,electric,hybrid',
            'seating_capacity' => 'required|integer|min:1',
            'load_capacity' => 'nullable|numeric',
            'purchase_date' => 'nullable|date',
            'purchase_price' => 'nullable|numeric',
            'color' => 'nullable|string',
            'insurance_company' => 'nullable|string',
            'insurance_policy_number' => 'nullable|string',
            'insurance_expiry' => 'nullable|date',
            'fitness_certificate_expiry' => 'nullable|date',
            'tax_token_expiry' => 'nullable|date',
            'route_permit_expiry' => 'nullable|date',
            'current_odometer' => 'nullable|integer|min:0',
            'status' => 'required|in:active,in_service,under_maintenance,sold,inactive',
            'notes' => 'nullable|string',
        ]);

        Vehicle::create($validated);

        return redirect()->route('vehicles.index')->with('success', 'Vehicle registered successfully.');
    }

    public function show(Vehicle $vehicle): Response
    {
        $vehicle->load(['trips' => fn ($q) => $q->latest()->take(10), 'fuelRecords' => fn ($q) => $q->latest()->take(10), 'maintenances' => fn ($q) => $q->latest()->take(5)]);

        return Inertia::render('vehicles/show', ['vehicle' => $vehicle]);
    }

    public function edit(Vehicle $vehicle): Response
    {
        return Inertia::render('vehicles/edit', ['vehicle' => $vehicle]);
    }

    public function update(Request $request, Vehicle $vehicle): RedirectResponse
    {
        $validated = $request->validate([
            'registration_number' => 'required|string|unique:vehicles,registration_number,'.$vehicle->id,
            'vehicle_type' => 'required|in:car,bus,truck,pickup,motorcycle',
            'brand' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'manufacturing_year' => 'required|integer|min:1970|max:'.date('Y'),
            'chassis_number' => 'nullable|string|unique:vehicles,chassis_number,'.$vehicle->id,
            'engine_number' => 'nullable|string',
            'fuel_type' => 'required|in:petrol,diesel,cng,electric,hybrid',
            'seating_capacity' => 'required|integer|min:1',
            'load_capacity' => 'nullable|numeric',
            'purchase_date' => 'nullable|date',
            'purchase_price' => 'nullable|numeric',
            'color' => 'nullable|string',
            'insurance_company' => 'nullable|string',
            'insurance_policy_number' => 'nullable|string',
            'insurance_expiry' => 'nullable|date',
            'fitness_certificate_expiry' => 'nullable|date',
            'tax_token_expiry' => 'nullable|date',
            'route_permit_expiry' => 'nullable|date',
            'current_odometer' => 'nullable|integer|min:0',
            'status' => 'required|in:active,in_service,under_maintenance,sold,inactive',
            'notes' => 'nullable|string',
        ]);

        $vehicle->update($validated);

        return redirect()->route('vehicles.index')->with('success', 'Vehicle updated successfully.');
    }

    public function destroy(Vehicle $vehicle): RedirectResponse
    {
        $vehicle->delete();

        return redirect()->route('vehicles.index')->with('success', 'Vehicle deleted.');
    }
}
