<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\Trip;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TripController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Trip::with(['vehicle', 'driver']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('trip_number', 'like', "%$search%")
                    ->orWhere('start_location', 'like', "%$search%")
                    ->orWhere('destination', 'like', "%$search%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $trips = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('trips/index', [
            'trips' => $trips,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('trips/create', [
            'vehicles' => Vehicle::whereIn('status', ['active', 'in_service'])->get(['id', 'registration_number', 'brand', 'model']),
            'drivers' => Driver::where('status', 'active')->get(['id', 'name', 'employee_id']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'driver_id' => 'nullable|exists:drivers,id',
            'start_location' => 'required|string',
            'destination' => 'required|string',
            'purpose' => 'required|string',
            'client_department' => 'nullable|string',
            'start_datetime' => 'required|date',
            'end_datetime' => 'nullable|date|after_or_equal:start_datetime',
            'odometer_start' => 'required|integer|min:0',
            'odometer_end' => 'nullable|integer|gte:odometer_start',
            'status' => 'required|in:scheduled,running,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        $validated['trip_number'] = 'TRP-'.strtoupper(Str::random(8));

        if (isset($validated['odometer_end']) && $validated['odometer_end']) {
            $validated['distance'] = $validated['odometer_end'] - $validated['odometer_start'];
        }

        Trip::create($validated);

        return redirect()->route('trips.index')->with('success', 'Trip created successfully.');
    }

    public function show(Trip $trip): Response
    {
        $trip->load(['vehicle', 'driver']);

        return Inertia::render('trips/show', ['trip' => $trip]);
    }

    public function edit(Trip $trip): Response
    {
        return Inertia::render('trips/edit', [
            'trip' => $trip,
            'vehicles' => Vehicle::whereIn('status', ['active', 'in_service'])->get(['id', 'registration_number', 'brand', 'model']),
            'drivers' => Driver::where('status', 'active')->get(['id', 'name', 'employee_id']),
        ]);
    }

    public function update(Request $request, Trip $trip): RedirectResponse
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'driver_id' => 'nullable|exists:drivers,id',
            'start_location' => 'required|string',
            'destination' => 'required|string',
            'purpose' => 'required|string',
            'client_department' => 'nullable|string',
            'start_datetime' => 'required|date',
            'end_datetime' => 'nullable|date|after_or_equal:start_datetime',
            'odometer_start' => 'required|integer|min:0',
            'odometer_end' => 'nullable|integer',
            'status' => 'required|in:scheduled,running,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        if (isset($validated['odometer_end']) && $validated['odometer_end']) {
            $validated['distance'] = $validated['odometer_end'] - $validated['odometer_start'];
        }

        $trip->update($validated);

        return redirect()->route('trips.index')->with('success', 'Trip updated successfully.');
    }

    public function destroy(Trip $trip): RedirectResponse
    {
        $trip->delete();

        return redirect()->route('trips.index')->with('success', 'Trip deleted.');
    }
}
