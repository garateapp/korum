<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\GoogleCalendarService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use Throwable;

class SyncGoogleCalendar extends Command
{
    protected $signature = 'app:sync-google-calendar {--user= : ID de usuario para sincronización puntual}';

    protected $description = 'Sincroniza eventos de Google Calendar hacia reuniones de Korum';

    public function __construct(private readonly GoogleCalendarService $googleCalendarService)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        if (!Schema::hasColumn('users', 'google_refresh_token')) {
            $this->error('Faltan columnas de Google Calendar en users. Ejecuta: php artisan migrate');
            return self::FAILURE;
        }

        $query = User::query()->whereNotNull('google_refresh_token');
        $userId = $this->option('user');

        if ($userId) {
            $query->whereKey((int) $userId);
        }

        $users = $query->get();
        if ($users->isEmpty()) {
            $this->info('No hay usuarios con Google Calendar conectado para sincronizar.');
            return self::SUCCESS;
        }

        foreach ($users as $user) {
            try {
                $stats = $this->googleCalendarService->syncUpcomingEvents($user);
                $this->line(
                    "[OK] {$user->email} -> nuevas: {$stats['created']}, actualizadas: {$stats['updated']}, canceladas: {$stats['cancelled']}"
                );
            } catch (Throwable $exception) {
                report($exception);
                $this->error("[ERROR] {$user->email} -> {$exception->getMessage()}");
            }
        }

        return self::SUCCESS;
    }
}
