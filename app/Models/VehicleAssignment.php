<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleAssignment extends Model
{
    protected $fillable = [
        'vehicle_id', 'driver_id', 'employee_name', 'department',
        'project', 'assigned_by', 'assignment_date', 'return_date',
        'purpose', 'status', 'notes',
    ];

    protected $casts = [
        'assignment_date' => 'date',
        'return_date' => 'date',
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
