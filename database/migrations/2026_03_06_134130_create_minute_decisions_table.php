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
        Schema::create('minute_decisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('minute_id')->constrained('meeting_minutes')->cascadeOnDelete();
            $table->text('description');
            $table->string('taken_by')->nullable();
            $table->date('decision_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('minute_decisions');
    }
};
