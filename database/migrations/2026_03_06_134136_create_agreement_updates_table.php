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
        Schema::create('agreement_updates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agreement_id')->constrained('minute_agreements')->cascadeOnDelete();
            $table->text('comment')->nullable();
            $table->integer('progress_percentage')->default(0);
            $table->string('status_changed_to')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agreement_updates');
    }
};
