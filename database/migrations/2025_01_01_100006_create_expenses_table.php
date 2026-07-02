<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('driver_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('trip_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('category', [
                'fuel', 'toll', 'parking', 'repair', 'insurance',
                'tax', 'driver_allowance', 'spare_parts', 'others',
            ]);
            $table->date('date');
            $table->decimal('amount', 10, 2);
            $table->string('description');
            $table->string('department')->nullable();
            $table->string('approved_by')->nullable();
            $table->string('receipt_number')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
