<?php

namespace App\Services;

use App\Models\Department;
use App\Models\Meeting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Client\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use RuntimeException;

class GoogleCalendarService
{
    private const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events';
    private const CALENDAR_BASE_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

    public function redirectToAuthorization(): RedirectResponse
    {
        return Socialite::driver('google')
            ->redirectUrl($this->getCalendarRedirectUri())
            ->scopes(['openid', 'profile', 'email', self::CALENDAR_SCOPE])
            ->with([
                'access_type' => 'offline',
                'prompt' => 'consent',
                'include_granted_scopes' => 'true',
            ])
            ->redirect();
    }

    public function handleAuthorizationCallback(User $user): void
    {
        $this->assertUserColumnsExist();

        $googleUser = Socialite::driver('google')
            ->redirectUrl($this->getCalendarRedirectUri())
            ->user();

        $accessToken = (string) ($googleUser->token ?? '');
        if ($accessToken === '') {
            throw new RuntimeException('No se recibió un access token desde Google.');
        }

        $refreshToken = (string) ($googleUser->refreshToken ?? $user->google_refresh_token ?? '');
        if ($refreshToken === '') {
            throw new RuntimeException(
                'Google no devolvió refresh token. Reintenta conectando la cuenta con permiso permanente.'
            );
        }

        $expiresIn = max(60, (int) ($googleUser->expiresIn ?? 3600));

        $user->forceFill([
            'google_access_token' => $accessToken,
            'google_refresh_token' => $refreshToken,
            'google_token_expires_at' => now()->addSeconds($expiresIn),
            'google_calendar_connected_at' => now(),
        ])->save();
    }

    public function syncUpcomingEvents(User $user): array
    {
        $this->assertIntegrationColumnsExist();

        $departmentId = $this->resolveDepartmentId($user);
        $events = $this->fetchUpcomingEvents($user);

        $stats = [
            'total' => count($events),
            'created' => 0,
            'updated' => 0,
            'cancelled' => 0,
            'skipped' => 0,
        ];

        foreach ($events as $event) {
            $eventId = (string) data_get($event, 'id', '');
            if ($eventId === '') {
                $stats['skipped']++;
                continue;
            }

            if ((string) data_get($event, 'status') === 'cancelled') {
                $meeting = Meeting::where('organizer_id', $user->id)
                    ->where('google_event_id', $eventId)
                    ->first();

                if ($meeting && $meeting->status !== 'cancelada') {
                    $meeting->update([
                        'status' => 'cancelada',
                        'google_synced_at' => now(),
                    ]);
                    $stats['cancelled']++;
                }

                continue;
            }

            $range = $this->extractDateRange($event);
            if (!$range) {
                $stats['skipped']++;
                continue;
            }

            [$startAt, $endAt] = $range;
            $meeting = Meeting::firstOrNew([
                'organizer_id' => $user->id,
                'google_event_id' => $eventId,
            ]);

            $isNew = !$meeting->exists;
            $location = $this->resolveLocation($event);
            $status = ($meeting->exists && in_array($meeting->status, ['realizada', 'cerrada'], true))
                ? $meeting->status
                : 'programada';

            if ($isNew) {
                $meeting->code = $this->buildMeetingCode($user->id, $eventId);
                $meeting->organizer_id = $user->id;
            }

            $meeting->fill([
                'subject' => trim((string) data_get($event, 'summary', 'Reunión Google Calendar')),
                'description' => (string) data_get($event, 'description', 'Importada automáticamente desde Google Calendar.'),
                'date' => $startAt->toDateString(),
                'start_time' => $startAt->format('H:i:s'),
                'end_time' => $endAt->format('H:i:s'),
                'mode' => $this->inferMode($location),
                'location_link' => $location,
                'department_id' => $meeting->department_id ?: $departmentId,
                'meeting_type_id' => $meeting->meeting_type_id,
                'status' => $status,
                'google_calendar_id' => (string) data_get($event, 'organizer.email', 'primary'),
                'google_synced_at' => now(),
            ]);

            $meeting->save();
            $stats[$isNew ? 'created' : 'updated']++;
        }

        $user->forceFill(['google_calendar_synced_at' => now()])->save();

        return $stats;
    }

    public function hasConnectedCalendar(User $user): bool
    {
        if (!Schema::hasColumn('users', 'google_refresh_token')) {
            return false;
        }

        return !empty($user->google_refresh_token);
    }

    public function upsertEventFromMeeting(User $user, Meeting $meeting): string
    {
        $this->assertIntegrationColumnsExist();

        if (!$this->hasConnectedCalendar($user)) {
            throw new RuntimeException('El organizador no tiene Google Calendar conectado.');
        }

        $payload = $this->buildGoogleEventPayload($meeting);

        if ($meeting->google_event_id) {
            $encodedEventId = rawurlencode($meeting->google_event_id);
            $response = $this->requestWithTokenRefresh($user, function (string $accessToken) use ($encodedEventId, $payload) {
                return Http::acceptJson()
                    ->withToken($accessToken)
                    ->patch(self::CALENDAR_BASE_URL.'/'.$encodedEventId, $payload);
            });

            if ($response->status() === 404) {
                $meeting->forceFill(['google_event_id' => null])->save();
                return $this->createGoogleEvent($user, $meeting, $payload);
            }

            $event = $response->throw()->json();
            $meeting->forceFill([
                'google_event_id' => (string) data_get($event, 'id', $meeting->google_event_id),
                'google_calendar_id' => (string) data_get($event, 'organizer.email', 'primary'),
                'google_synced_at' => now(),
            ])->save();

            return (string) data_get($event, 'id', $meeting->google_event_id);
        }

        return $this->createGoogleEvent($user, $meeting, $payload);
    }

    public function cancelEventForMeeting(User $user, Meeting $meeting): void
    {
        $this->assertIntegrationColumnsExist();

        if (!$meeting->google_event_id || !$this->hasConnectedCalendar($user)) {
            return;
        }

        $encodedEventId = rawurlencode($meeting->google_event_id);
        $response = $this->requestWithTokenRefresh($user, function (string $accessToken) use ($encodedEventId) {
            return Http::acceptJson()
                ->withToken($accessToken)
                ->delete(self::CALENDAR_BASE_URL.'/'.$encodedEventId);
        });

        if (!in_array($response->status(), [200, 204, 404], true)) {
            $response->throw();
        }

        $meeting->forceFill(['google_synced_at' => now()])->save();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function fetchUpcomingEvents(User $user): array
    {
        $accessToken = $this->ensureFreshAccessToken($user);
        $events = [];
        $pageToken = null;

        do {
            $params = [
                'singleEvents' => 'true',
                'orderBy' => 'startTime',
                'showDeleted' => 'true',
                'maxResults' => 250,
                'timeMin' => now()->startOfDay()->toRfc3339String(),
                'timeMax' => now()->addMonths(6)->endOfDay()->toRfc3339String(),
            ];

            if ($pageToken) {
                $params['pageToken'] = $pageToken;
            }

            $response = Http::acceptJson()
                ->withToken($accessToken)
                ->get(self::CALENDAR_BASE_URL, $params);

            if ($response->status() === 401) {
                $accessToken = $this->refreshAccessToken($user);
                $response = Http::acceptJson()
                    ->withToken($accessToken)
                    ->get(self::CALENDAR_BASE_URL, $params);
            }

            $payload = $response->throw()->json();
            $events = array_merge($events, $payload['items'] ?? []);
            $pageToken = $payload['nextPageToken'] ?? null;
        } while ($pageToken);

        return $events;
    }

    private function ensureFreshAccessToken(User $user): string
    {
        if ($user->google_access_token && $user->google_token_expires_at?->gt(now()->addMinute())) {
            return $user->google_access_token;
        }

        return $this->refreshAccessToken($user);
    }

    private function refreshAccessToken(User $user): string
    {
        if (!$user->google_refresh_token) {
            throw new RuntimeException('Primero debes conectar tu cuenta de Google Calendar.');
        }

        $clientId = (string) config('services.google.client_id');
        $clientSecret = (string) config('services.google.client_secret');
        if ($clientId === '' || $clientSecret === '') {
            throw new RuntimeException('Faltan GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET en la configuración.');
        }

        $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'refresh_token' => $user->google_refresh_token,
            'grant_type' => 'refresh_token',
        ])->throw()->json();

        $accessToken = (string) ($response['access_token'] ?? '');
        if ($accessToken === '') {
            throw new RuntimeException('No fue posible refrescar el token de Google Calendar.');
        }

        $user->forceFill([
            'google_access_token' => $accessToken,
            'google_refresh_token' => (string) ($response['refresh_token'] ?? $user->google_refresh_token),
            'google_token_expires_at' => now()->addSeconds(max(60, (int) ($response['expires_in'] ?? 3600))),
        ])->save();

        return $accessToken;
    }

    private function resolveDepartmentId(User $user): int
    {
        $departmentId = $user->department_id ?: Department::query()->value('id');
        if (!$departmentId) {
            throw new RuntimeException(
                'No existe ningún departamento para asignar reuniones importadas. Crea uno en Administración.'
            );
        }

        return (int) $departmentId;
    }

    /**
     * @param  array<string, mixed>  $event
     * @return array<int, Carbon>|null
     */
    private function extractDateRange(array $event): ?array
    {
        $startDateTime = data_get($event, 'start.dateTime');
        $endDateTime = data_get($event, 'end.dateTime');

        if ($startDateTime && $endDateTime) {
            $startAt = Carbon::parse($startDateTime);
            $endAt = Carbon::parse($endDateTime);
        } else {
            $startDate = data_get($event, 'start.date');
            $endDate = data_get($event, 'end.date');
            if (!$startDate || !$endDate) {
                return null;
            }

            $startAt = Carbon::parse($startDate, config('app.timezone'))->setTime(9, 0, 0);
            $endAt = Carbon::parse($endDate, config('app.timezone'))->subDay()->setTime(10, 0, 0);
        }

        if ($endAt->lte($startAt)) {
            $endAt = $startAt->copy()->addHour();
        }

        return [$startAt, $endAt];
    }

    /**
     * @param  array<string, mixed>  $event
     */
    private function resolveLocation(array $event): ?string
    {
        $location = (string) data_get($event, 'location', '');
        $hangoutLink = (string) data_get($event, 'hangoutLink', '');

        $value = trim($location !== '' ? $location : $hangoutLink);
        if ($value === '') {
            return null;
        }

        return Str::limit($value, 255);
    }

    private function inferMode(?string $location): string
    {
        if (!$location) {
            return 'hibrida';
        }

        $normalized = Str::lower($location);
        if (Str::contains($normalized, ['http://', 'https://', 'meet.google.com', 'zoom.us', 'teams.microsoft.com'])) {
            return 'virtual';
        }

        return 'presencial';
    }

    private function buildMeetingCode(int $userId, string $eventId): string
    {
        $baseCode = 'GCL-U'.$userId.'-'.Str::upper(substr(sha1($eventId), 0, 8));
        $candidate = $baseCode;
        $counter = 1;

        while (Meeting::where('code', $candidate)->exists()) {
            $candidate = $baseCode.'-'.$counter;
            $counter++;
        }

        return $candidate;
    }

    private function getCalendarRedirectUri(): string
    {
        return (string) (config('services.google_calendar.redirect') ?: config('services.google.redirect'));
    }

    /**
     * @return array<string, mixed>
     */
    private function buildGoogleEventPayload(Meeting $meeting): array
    {
        $timezone = (string) config('app.timezone', 'UTC');
        $startAt = Carbon::parse($meeting->date.' '.$meeting->start_time, $timezone);
        $endAt = Carbon::parse($meeting->date.' '.$meeting->end_time, $timezone);

        if ($endAt->lte($startAt)) {
            $endAt = $startAt->copy()->addHour();
        }

        $description = (string) ($meeting->description ?? '');
        if ($meeting->location_link) {
            $description = trim($description."\n\nUbicación/Link: ".$meeting->location_link);
        }

        return [
            'summary' => (string) $meeting->subject,
            'description' => trim($description),
            'location' => $meeting->location_link,
            'start' => [
                'dateTime' => $startAt->toRfc3339String(),
                'timeZone' => $timezone,
            ],
            'end' => [
                'dateTime' => $endAt->toRfc3339String(),
                'timeZone' => $timezone,
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function createGoogleEvent(User $user, Meeting $meeting, array $payload): string
    {
        $response = $this->requestWithTokenRefresh($user, function (string $accessToken) use ($payload) {
            return Http::acceptJson()
                ->withToken($accessToken)
                ->post(self::CALENDAR_BASE_URL, $payload);
        });

        $event = $response->throw()->json();
        $eventId = (string) data_get($event, 'id', '');
        if ($eventId === '') {
            throw new RuntimeException('Google Calendar no devolvió ID de evento al crear la reunión.');
        }

        $meeting->forceFill([
            'google_event_id' => $eventId,
            'google_calendar_id' => (string) data_get($event, 'organizer.email', 'primary'),
            'google_synced_at' => now(),
        ])->save();

        return $eventId;
    }

    /**
     * @param  callable(string): Response  $request
     */
    private function requestWithTokenRefresh(User $user, callable $request): Response
    {
        $accessToken = $this->ensureFreshAccessToken($user);
        $response = $request($accessToken);

        if ($response->status() === 401) {
            $accessToken = $this->refreshAccessToken($user);
            $response = $request($accessToken);
        }

        return $response;
    }

    private function assertUserColumnsExist(): void
    {
        if (!Schema::hasColumns('users', ['google_access_token', 'google_refresh_token', 'google_token_expires_at'])) {
            throw new RuntimeException('Faltan columnas de integración en users. Ejecuta: php artisan migrate');
        }
    }

    private function assertIntegrationColumnsExist(): void
    {
        $this->assertUserColumnsExist();

        if (!Schema::hasColumns('meetings', ['google_event_id', 'google_calendar_id', 'google_synced_at'])) {
            throw new RuntimeException('Faltan columnas de integración en meetings. Ejecuta: php artisan migrate');
        }
    }
}
