<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Maintenance extends Model
{
    protected $fillable = [
        'vehicle_id', 'maintenance_type', 'service_date',
        'garage', 'vendor', 'cost', 'next_service_due',
        'description', 'status', 'invoice_number', 'invoice_file', 'notes',
    ];

    protected $casts = [
        'service_date' => 'date',
        'next_service_due' => 'date',
        'cost' => 'decimal:2',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }
}
