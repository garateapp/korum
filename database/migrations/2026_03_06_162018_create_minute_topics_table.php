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
        Schema::create('minute_topics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('minute_id')->constrained('meeting_minutes')->onDelete('cascade');
            $table->string('title');
            $table->text('detail')->nullable();
            $table->text('conclusions')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('minute_topics');
    }
};
