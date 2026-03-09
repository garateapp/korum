<?php

namespace App\Http\Controllers;

use App\Services\GoogleCalendarService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class GoogleCalendarController extends Controller
{
    public function __construct(private readonly GoogleCalendarService $googleCalendarService)
    {
    }

    public function connect(Request $request): Response
    {
        $this->storeReturnToInSession($request);
        return $this->redirectToGoogle($request, forceConsent: false);
    }

    public function forceConsent(Request $request): Response
    {
        $this->storeReturnToInSession($request);
        return $this->redirectToGoogle($request, forceConsent: true);
    }

    public function callback(Request $request): RedirectResponse
    {
        try {
            $this->googleCalendarService->handleAuthorizationCallback($request->user());
            $returnTo = $request->session()->pull('google_calendar_return_to', route('meetings.index', absolute: false));

            return redirect($returnTo)
                ->with('success', 'Google Calendar conectado correctamente. Ahora puedes sincronizar tus reuniones.');
        } catch (Throwable $exception) {
            report($exception);

            return redirect()->route('meetings.index')
                ->withErrors(['error' => 'No fue posible conectar Google Calendar: '.$exception->getMessage()]);
        }
    }

    public function sync(Request $request): RedirectResponse
    {
        try {
            $stats = $this->googleCalendarService->syncUpcomingEvents($request->user());

            return back()->with(
                'success',
                "Sincronización completada. Nuevas: {$stats['created']}, actualizadas: {$stats['updated']}, canceladas: {$stats['cancelled']}."
            );
        } catch (Throwable $exception) {
            report($exception);

            return back()->withErrors(['error' => 'No fue posible sincronizar Google Calendar: '.$exception->getMessage()]);
        }
    }

    private function storeReturnToInSession(Request $request): void
    {
        $returnTo = (string) $request->query('return_to', route('meetings.index', absolute: false));

        if (!str_starts_with($returnTo, '/')) {
            $returnTo = route('meetings.index', absolute: false);
        }

        $request->session()->put('google_calendar_return_to', $returnTo);
    }

    private function redirectToGoogle(Request $request, bool $forceConsent): Response
    {
        $redirect = $this->googleCalendarService->redirectToAuthorization($forceConsent);

        if ($request->header('X-Inertia')) {
            return Inertia::location($redirect->getTargetUrl());
        }

        return $redirect;
    }
}
