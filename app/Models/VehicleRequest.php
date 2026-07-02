<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleRequest extends Model
{
    protected $fillable = [
        'request_number', 'employee_name', 'employee_id',
        'department', 'purpose', 'destination',
        'start_datetime', 'end_datetime', 'passenger_count',
        'status', 'approved_by', 'rejection_reason',
        'vehicle_id', 'driver_id', 'trip_id', 'notes',
    ];

    protected $casts = [
        'start_datetime' => 'datetime',
        'end_datetime' => 'datetime',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }

    public function trip(): BelongsTo
    {
        return $this->belongsTo(Trip::class);
    }
}
