<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Maintenance::with('vehicle');

        if ($request->filled('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('maintenance_type', $request->type);
        }

        $maintenances = $query->latest('service_date')->paginate(15)->withQueryString();

        return Inertia::render('maintenance/index', [
            'maintenances' => $maintenances,
            'filters' => $request->only(['vehicle_id', 'status', 'type']),
            'vehicles' => Vehicle::all(['id', 'registration_number']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('maintenance/create', [
            'vehicles' => Vehicle::all(['id', 'registration_number', 'brand', 'model']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'maintenance_type' => 'required|in:oil_change,engine_service,tire_replacement,brake_service,battery,ac_service,general_repair',
            'service_date' => 'required|date',
            'garage' => 'nullable|string',
            'vendor' => 'nullable|string',
            'cost' => 'nullable|numeric|min:0',
            'next_service_due' => 'nullable|date',
            'description' => 'nullable|string',
            'status' => 'required|in:scheduled,in_progress,completed',
            'invoice_number' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        Maintenance::create($validated);

        if ($validated['status'] === 'in_progress') {
            Vehicle::find($validated['vehicle_id'])->update(['status' => 'under_maintenance']);
        }

        return redirect()->route('maintenance.index')->with('success', 'Maintenance record added.');
    }

    public function edit(Maintenance $maintenance): Response
    {
        return Inertia::render('maintenance/edit', [
            'maintenance' => $maintenance->load('vehicle'),
            'vehicles' => Vehicle::all(['id', 'registration_number']),
        ]);
    }

    public function update(Request $request, Maintenance $maintenance): RedirectResponse
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'maintenance_type' => 'required|in:oil_change,engine_service,tire_replacement,brake_service,battery,ac_service,general_repair',
            'service_date' => 'required|date',
            'garage' => 'nullable|string',
            'vendor' => 'nullable|string',
            'cost' => 'nullable|numeric|min:0',
            'next_service_due' => 'nullable|date',
            'description' => 'nullable|string',
            'status' => 'required|in:scheduled,in_progress,completed',
            'invoice_number' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $maintenance->update($validated);

        return redirect()->route('maintenance.index')->with('success', 'Maintenance updated.');
    }

    public function destroy(Maintenance $maintenance): RedirectResponse
    {
        $maintenance->delete();

        return redirect()->route('maintenance.index')->with('success', 'Maintenance record deleted.');
    }
}
