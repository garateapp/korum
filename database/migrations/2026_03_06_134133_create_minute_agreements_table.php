<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('minute_agreements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('minute_id')->constrained('meeting_minutes')->cascadeOnDelete();
            $table->text('subject'); // Renamed from description
            $table->foreignId('responsible_id')->constrained('users');
            $table->foreignId('department_id')->nullable()->constrained('departments');
            $table->enum('priority', ['baja', 'media', 'alta'])->default('media');
            $table->date('commitment_date'); // Renamed from due_date
            $table->enum('status', ['pendiente', 'en proceso', 'atrasado', 'realizado'])->default('pendiente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('minute_agreements');
    }
};
