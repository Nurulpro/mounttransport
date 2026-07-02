<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fuel_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->foreignId('driver_id')->nullable()->constrained()->nullOnDelete();
            $table->date('date');
            $table->string('fuel_type');
            $table->string('fuel_station')->nullable();
            $table->decimal('quantity', 8, 2);
            $table->decimal('price_per_liter', 8, 2);
            $table->decimal('total_cost', 10, 2);
            $table->unsignedInteger('odometer_reading');
            $table->decimal('mileage', 8, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fuel_records');
    }
};
