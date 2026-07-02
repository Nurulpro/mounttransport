<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    protected $fillable = [
        'registration_number', 'vehicle_type', 'brand', 'model',
        'manufacturing_year', 'chassis_number', 'engine_number',
        'fuel_type', 'seating_capacity', 'load_capacity',
        'purchase_date', 'purchase_price', 'color',
        'insurance_company', 'insurance_policy_number', 'insurance_expiry',
        'fitness_certificate_expiry', 'tax_token_expiry', 'route_permit_expiry',
        'current_odometer', 'status', 'notes',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'insurance_expiry' => 'date',
        'fitness_certificate_expiry' => 'date',
        'tax_token_expiry' => 'date',
        'route_permit_expiry' => 'date',
        'purchase_price' => 'decimal:2',
        'load_capacity' => 'decimal:2',
    ];

    public function drivers(): HasMany
    {
        return $this->hasMany(Driver::class, 'assigned_vehicle_id');
    }

    public function trips(): HasMany
    {
        return $this->hasMany(Trip::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(VehicleAssignment::class);
    }

    public function fuelRecords(): HasMany
    {
        return $this->hasMany(FuelRecord::class);
    }

    public function maintenances(): HasMany
    {
        return $this->hasMany(Maintenance::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function vehicleRequests(): HasMany
    {
        return $this->hasMany(VehicleRequest::class);
    }
}
