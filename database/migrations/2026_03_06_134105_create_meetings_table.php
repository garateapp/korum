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
        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('subject');
            $table->text('description')->nullable();
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->enum('mode', ['presencial', 'virtual', 'hibrida']);
            $table->string('location_link')->nullable();
            $table->foreignId('organizer_id')->constrained('users');
            $table->foreignId('department_id')->constrained('departments');
            $table->foreignId('meeting_type_id')->nullable()->constrained('meeting_types');
            $table->enum('status', ['programada', 'realizada', 'cancelada', 'cerrada'])->default('programada');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meetings');
    }
};
