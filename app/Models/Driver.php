<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Driver extends Model
{
    protected $fillable = [
        'employee_id', 'name', 'phone', 'email', 'address',
        'emergency_contact_name', 'emergency_contact_phone',
        'license_number', 'license_type', 'license_expiry',
        'nid_number', 'joining_date', 'salary',
        'assigned_vehicle_id', 'medical_certificate_expiry',
        'rating', 'status', 'photo', 'notes',
    ];

    protected $casts = [
        'license_expiry' => 'date',
        'joining_date' => 'date',
        'medical_certificate_expiry' => 'date',
        'salary' => 'decimal:2',
    ];

    public function assignedVehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class, 'assigned_vehicle_id');
    }

    public function trips(): HasMany
    {
        return $this->hasMany(Trip::class);
    }

    public function fuelRecords(): HasMany
    {
        return $this->hasMany(FuelRecord::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}
