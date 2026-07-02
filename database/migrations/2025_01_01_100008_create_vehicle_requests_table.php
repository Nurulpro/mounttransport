<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_number')->unique();
            $table->string('employee_name');
            $table->string('employee_id');
            $table->string('department');
            $table->string('purpose');
            $table->string('destination');
            $table->dateTime('start_datetime');
            $table->dateTime('end_datetime');
            $table->unsignedSmallInteger('passenger_count')->default(1);
            $table->enum('status', ['pending', 'approved', 'rejected', 'assigned', 'completed'])->default('pending');
            $table->string('approved_by')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->foreignId('vehicle_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('driver_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('trip_id')->nullable()->constrained()->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_requests');
    }
};
