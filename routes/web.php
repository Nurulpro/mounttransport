<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\FuelController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TripController;
use App\Http\Controllers\VehicleAssignmentController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\VehicleRequestController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('vehicles', VehicleController::class);
    Route::resource('drivers', DriverController::class);
    Route::resource('trips', TripController::class);

    Route::resource('assignments', VehicleAssignmentController::class)->only(['index', 'create', 'store', 'destroy']);

    Route::resource('fuel', FuelController::class)->except(['show']);

    Route::resource('maintenance', MaintenanceController::class)->except(['show']);

    Route::resource('expenses', ExpenseController::class)->only(['index', 'create', 'store', 'destroy']);

    Route::resource('documents', DocumentController::class)->only(['index', 'create', 'store', 'destroy']);

    Route::resource('requests', VehicleRequestController::class)->only(['index', 'create', 'store', 'show', 'destroy'])
        ->parameters(['requests' => 'vehicleRequest']);
    Route::post('requests/{vehicleRequest}/approve', [VehicleRequestController::class, 'approve'])->name('requests.approve');
    Route::post('requests/{vehicleRequest}/reject', [VehicleRequestController::class, 'reject'])->name('requests.reject');

    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
});

require __DIR__.'/settings.php';
