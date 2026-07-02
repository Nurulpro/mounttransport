<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Trip extends Model
{
    protected $fillable = [
        'trip_number', 'vehicle_id', 'driver_id',
        'start_location', 'destination', 'purpose', 'client_department',
        'start_datetime', 'end_datetime',
        'odometer_start', 'odometer_end', 'distance',
        'status', 'notes',
    ];

    protected $casts = [
        'start_datetime' => 'datetime',
        'end_datetime' => 'datetime',
        'distance' => 'decimal:2',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }
}
