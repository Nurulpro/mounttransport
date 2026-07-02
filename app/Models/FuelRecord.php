<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FuelRecord extends Model
{
    protected $fillable = [
        'vehicle_id', 'driver_id', 'date', 'fuel_type',
        'fuel_station', 'quantity', 'price_per_liter',
        'total_cost', 'odometer_reading', 'mileage', 'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'quantity' => 'decimal:2',
        'price_per_liter' => 'decimal:2',
        'total_cost' => 'decimal:2',
        'mileage' => 'decimal:2',
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
