<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('registration_number')->unique();
            $table->enum('vehicle_type', ['car', 'bus', 'truck', 'pickup', 'motorcycle']);
            $table->string('brand');
            $table->string('model');
            $table->year('manufacturing_year');
            $table->string('chassis_number')->nullable()->unique();
            $table->string('engine_number')->nullable();
            $table->enum('fuel_type', ['petrol', 'diesel', 'cng', 'electric', 'hybrid']);
            $table->unsignedSmallInteger('seating_capacity')->default(1);
            $table->decimal('load_capacity', 8, 2)->nullable();
            $table->date('purchase_date')->nullable();
            $table->decimal('purchase_price', 12, 2)->nullable();
            $table->string('color')->nullable();
            $table->string('insurance_company')->nullable();
            $table->string('insurance_policy_number')->nullable();
            $table->date('insurance_expiry')->nullable();
            $table->date('fitness_certificate_expiry')->nullable();
            $table->date('tax_token_expiry')->nullable();
            $table->date('route_permit_expiry')->nullable();
            $table->unsignedInteger('current_odometer')->default(0);
            $table->enum('status', ['active', 'in_service', 'under_maintenance', 'sold', 'inactive'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
