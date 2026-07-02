<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->string('trip_number')->unique();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->foreignId('driver_id')->nullable()->constrained()->nullOnDelete();
            $table->string('start_location');
            $table->string('destination');
            $table->string('purpose');
            $table->string('client_department')->nullable();
            $table->dateTime('start_datetime');
            $table->dateTime('end_datetime')->nullable();
            $table->unsignedInteger('odometer_start')->default(0);
            $table->unsignedInteger('odometer_end')->nullable();
            $table->decimal('distance', 8, 2)->nullable();
            $table->enum('status', ['scheduled', 'running', 'completed', 'cancelled'])->default('scheduled');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
};
