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
        Schema::create('agreement_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agreement_id')->constrained('minute_agreements')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        // Make responsible_id nullable on minute_agreements as we move to pivot table
        Schema::table('minute_agreements', function (Blueprint $table) {
            $table->foreignId('responsible_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agreement_user');
        
        Schema::table('minute_agreements', function (Blueprint $table) {
            $table->foreignId('responsible_id')->nullable(false)->change();
        });
    }
};
