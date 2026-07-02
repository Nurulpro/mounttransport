<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->unique();
            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('license_number')->unique();
            $table->string('license_type')->nullable();
            $table->date('license_expiry');
            $table->string('nid_number')->nullable();
            $table->date('joining_date');
            $table->decimal('salary', 10, 2)->nullable();
            $table->foreignId('assigned_vehicle_id')->nullable()->constrained('vehicles')->nullOnDelete();
            $table->date('medical_certificate_expiry')->nullable();
            $table->unsignedTinyInteger('rating')->default(5);
            $table->enum('status', ['active', 'inactive', 'on_leave'])->default('active');
            $table->string('photo')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
