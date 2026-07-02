<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Driver;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Document::with(['vehicle', 'driver']);

        if ($request->filled('document_type')) {
            $query->where('document_type', $request->document_type);
        }

        if ($request->filled('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        $expiringSoon = Document::whereNotNull('expiry_date')
            ->where('expiry_date', '<=', Carbon::now()->addDays(30))
            ->with(['vehicle', 'driver'])
            ->get()
            ->count();

        $documents = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('documents/index', [
            'documents' => $documents,
            'filters' => $request->only(['document_type', 'vehicle_id']),
            'vehicles' => Vehicle::all(['id', 'registration_number']),
            'expiringSoon' => $expiringSoon,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('documents/create', [
            'vehicles' => Vehicle::all(['id', 'registration_number']),
            'drivers' => Driver::all(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'driver_id' => 'nullable|exists:drivers,id',
            'document_type' => 'required|in:insurance,registration,tax_token,fitness,route_permit,pollution_certificate,driver_license,purchase_invoice,other',
            'title' => 'required|string',
            'document_number' => 'nullable|string',
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        if ($request->hasFile('file')) {
            $validated['file_path'] = $request->file('file')->store('documents', 'public');
        }

        Document::create($validated);

        return redirect()->route('documents.index')->with('success', 'Document saved.');
    }

    public function destroy(Document $document): RedirectResponse
    {
        $document->delete();

        return redirect()->route('documents.index')->with('success', 'Document deleted.');
    }
}
