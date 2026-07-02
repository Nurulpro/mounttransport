<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\Trip;
use App\Models\Vehicle;
use App\Models\VehicleRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class VehicleRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $query = VehicleRequest::with(['vehicle', 'driver']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('employee_name', 'like', "%$search%")
                    ->orWhere('request_number', 'like', "%$search%")
                    ->orWhere('department', 'like', "%$search%");
            });
        }

        $requests = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('requests/index', [
            'requests' => $requests,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('requests/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'employee_name' => 'required|string',
            'employee_id' => 'required|string',
            'department' => 'required|string',
            'purpose' => 'required|string',
            'destination' => 'required|string',
            'start_datetime' => 'required|date',
            'end_datetime' => 'required|date|after:start_datetime',
            'passenger_count' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $validated['request_number'] = 'REQ-'.strtoupper(Str::random(8));
        $validated['status'] = 'pending';

        VehicleRequest::create($validated);

        return redirect()->route('requests.index')->with('success', 'Vehicle request submitted.');
    }

    public function show(VehicleRequest $vehicleRequest): Response
    {
        $vehicleRequest->load(['vehicle', 'driver', 'trip']);

        return Inertia::render('requests/show', [
            'request' => $vehicleRequest,
            'vehicles' => Vehicle::where('status', 'active')->get(['id', 'registration_number']),
            'drivers' => Driver::where('status', 'active')->get(['id', 'name']),
        ]);
    }

    public function approve(Request $request, VehicleRequest $vehicleRequest): RedirectResponse
    {
        $validated = $request->validate([
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'driver_id' => 'nullable|exists:drivers,id',
        ]);

        $vehicleRequest->update([
            'status' => 'approved',
            'approved_by' => auth()->user()->name,
            'vehicle_id' => $validated['vehicle_id'] ?? null,
            'driver_id' => $validated['driver_id'] ?? null,
        ]);

        return redirect()->route('requests.index')->with('success', 'Request approved.');
    }

    public function reject(Request $request, VehicleRequest $vehicleRequest): RedirectResponse
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string',
        ]);

        $vehicleRequest->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        return redirect()->route('requests.index')->with('success', 'Request rejected.');
    }

    public function destroy(VehicleRequest $vehicleRequest): RedirectResponse
    {
        $vehicleRequest->delete();

        return redirect()->route('requests.index')->with('success', 'Request deleted.');
    }
}
