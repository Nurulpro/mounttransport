<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DriverController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Driver::with('assignedVehicle');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('employee_id', 'like', "%$search%")
                    ->orWhere('phone', 'like', "%$search%")
                    ->orWhere('license_number', 'like', "%$search%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $drivers = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('drivers/index', [
            'drivers' => $drivers,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        $vehicles = Vehicle::where('status', 'active')->get(['id', 'registration_number', 'brand', 'model']);

        return Inertia::render('drivers/create', ['vehicles' => $vehicles]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => 'required|string|unique:drivers',
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string',
            'emergency_contact_phone' => 'nullable|string',
            'license_number' => 'required|string|unique:drivers',
            'license_type' => 'nullable|string',
            'license_expiry' => 'required|date',
            'nid_number' => 'nullable|string',
            'joining_date' => 'required|date',
            'salary' => 'nullable|numeric',
            'assigned_vehicle_id' => 'nullable|exists:vehicles,id',
            'medical_certificate_expiry' => 'nullable|date',
            'rating' => 'nullable|integer|min:1|max:5',
            'status' => 'required|in:active,inactive,on_leave',
            'notes' => 'nullable|string',
        ]);

        Driver::create($validated);

        return redirect()->route('drivers.index')->with('success', 'Driver added successfully.');
    }

    public function show(Driver $driver): Response
    {
        $driver->load(['assignedVehicle', 'trips' => fn ($q) => $q->latest()->take(10), 'fuelRecords' => fn ($q) => $q->latest()->take(10)]);

        return Inertia::render('drivers/show', ['driver' => $driver]);
    }

    public function edit(Driver $driver): Response
    {
        $vehicles = Vehicle::where('status', 'active')->get(['id', 'registration_number', 'brand', 'model']);

        return Inertia::render('drivers/edit', ['driver' => $driver, 'vehicles' => $vehicles]);
    }

    public function update(Request $request, Driver $driver): RedirectResponse
    {
        $validated = $request->validate([
            'employee_id' => 'required|string|unique:drivers,employee_id,'.$driver->id,
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string',
            'emergency_contact_phone' => 'nullable|string',
            'license_number' => 'required|string|unique:drivers,license_number,'.$driver->id,
            'license_type' => 'nullable|string',
            'license_expiry' => 'required|date',
            'nid_number' => 'nullable|string',
            'joining_date' => 'required|date',
            'salary' => 'nullable|numeric',
            'assigned_vehicle_id' => 'nullable|exists:vehicles,id',
            'medical_certificate_expiry' => 'nullable|date',
            'rating' => 'nullable|integer|min:1|max:5',
            'status' => 'required|in:active,inactive,on_leave',
            'notes' => 'nullable|string',
        ]);

        $driver->update($validated);

        return redirect()->route('drivers.index')->with('success', 'Driver updated successfully.');
    }

    public function destroy(Driver $driver): RedirectResponse
    {
        $driver->delete();

        return redirect()->route('drivers.index')->with('success', 'Driver deleted.');
    }
}
