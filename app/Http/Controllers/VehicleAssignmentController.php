<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\Vehicle;
use App\Models\VehicleAssignment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleAssignmentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = VehicleAssignment::with(['vehicle', 'driver']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('employee_name', 'like', "%$search%")
                    ->orWhere('department', 'like', "%$search%")
                    ->orWhere('project', 'like', "%$search%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $assignments = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('assignments/index', [
            'assignments' => $assignments,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('assignments/create', [
            'vehicles' => Vehicle::where('status', 'active')->get(['id', 'registration_number', 'brand', 'model']),
            'drivers' => Driver::where('status', 'active')->get(['id', 'name', 'employee_id']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'driver_id' => 'nullable|exists:drivers,id',
            'employee_name' => 'nullable|string',
            'department' => 'nullable|string',
            'project' => 'nullable|string',
            'assigned_by' => 'required|string',
            'assignment_date' => 'required|date',
            'return_date' => 'nullable|date|after_or_equal:assignment_date',
            'purpose' => 'required|string',
            'status' => 'required|in:active,returned',
            'notes' => 'nullable|string',
        ]);

        VehicleAssignment::create($validated);

        Vehicle::find($validated['vehicle_id'])->update(['status' => 'in_service']);

        return redirect()->route('assignments.index')->with('success', 'Vehicle assigned successfully.');
    }

    public function destroy(VehicleAssignment $assignment): RedirectResponse
    {
        $assignment->delete();

        return redirect()->route('assignments.index')->with('success', 'Assignment removed.');
    }
}
