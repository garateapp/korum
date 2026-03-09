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
        Schema::table('meetings', function (Blueprint $table) {
            if (!Schema::hasColumn('meetings', 'google_event_id')) {
                $table->string('google_event_id')->nullable()->after('code');
            }

            if (!Schema::hasColumn('meetings', 'google_calendar_id')) {
                $table->string('google_calendar_id')->nullable()->after('google_event_id');
            }

            if (!Schema::hasColumn('meetings', 'google_synced_at')) {
                $table->timestamp('google_synced_at')->nullable()->after('status');
            }

            $table->index('google_event_id');
            $table->unique(['organizer_id', 'google_event_id'], 'meetings_org_google_event_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('meetings', function (Blueprint $table) {
            try {
                $table->dropUnique('meetings_org_google_event_unique');
            } catch (\Throwable $exception) {
                // Ignore when index does not exist.
            }

            try {
                $table->dropIndex(['google_event_id']);
            } catch (\Throwable $exception) {
                // Ignore when index does not exist.
            }

            if (Schema::hasColumn('meetings', 'google_synced_at')) {
                $table->dropColumn('google_synced_at');
            }

            if (Schema::hasColumn('meetings', 'google_calendar_id')) {
                $table->dropColumn('google_calendar_id');
            }

            if (Schema::hasColumn('meetings', 'google_event_id')) {
                $table->dropColumn('google_event_id');
            }
        });
    }
};

