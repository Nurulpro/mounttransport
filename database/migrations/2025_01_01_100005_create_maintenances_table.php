<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->enum('maintenance_type', [
                'oil_change', 'engine_service', 'tire_replacement',
                'brake_service', 'battery', 'ac_service', 'general_repair',
            ]);
            $table->date('service_date');
            $table->string('garage')->nullable();
            $table->string('vendor')->nullable();
            $table->decimal('cost', 10, 2)->default(0);
            $table->date('next_service_due')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['scheduled', 'in_progress', 'completed'])->default('scheduled');
            $table->string('invoice_number')->nullable();
            $table->string('invoice_file')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenances');
    }
};
