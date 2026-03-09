<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\RedirectResponse;

class GoogleAuthController extends Controller
{
    private const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events';

    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')
            ->scopes(['openid', 'profile', 'email', self::CALENDAR_SCOPE])
            ->with([
                'access_type' => 'offline',
                'prompt' => 'consent',
                'include_granted_scopes' => 'true',
            ])
            ->redirect();
    }

    public function callback(Request $request): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Throwable $exception) {
            return redirect()->route('login')
                ->withErrors(['email' => 'No se pudo autenticar con Google. Inténtalo nuevamente.']);
        }

        $email = $googleUser->getEmail();
        if (!$email) {
            return redirect()->route('login')
                ->withErrors(['email' => 'Google no entregó un correo electrónico válido para tu cuenta.']);
        }

        $user = User::where('google_id', $googleUser->getId())->first();

        if (!$user) {
            $user = User::where('email', $email)->first();
        }

        if ($user) {
            $payload = [
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'email_verified_at' => $user->email_verified_at ?? now(),
            ];

            $this->attachCalendarTokens($payload, $googleUser, $user);
            $user->forceFill($payload)->save();
        } else {
            $payload = [
                'name' => $googleUser->getName() ?: 'Usuario Google',
                'email' => $email,
                'password' => Hash::make(Str::random(48)),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'email_verified_at' => now(),
            ];

            $this->attachCalendarTokens($payload, $googleUser);
            $user = User::create($payload);

            $defaultRole = Role::where('name', 'User')->first();
            if ($defaultRole) {
                $user->assignRole($defaultRole);
            }
        }

        Auth::login($user, true);
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    private function attachCalendarTokens(array &$payload, $googleUser, ?User $existingUser = null): void
    {
        if (!Schema::hasColumns('users', ['google_access_token', 'google_refresh_token', 'google_token_expires_at'])) {
            return;
        }

        $accessToken = (string) ($googleUser->token ?? '');
        $refreshToken = (string) ($googleUser->refreshToken ?? $existingUser?->google_refresh_token ?? '');

        if ($accessToken !== '') {
            $payload['google_access_token'] = $accessToken;
            $payload['google_token_expires_at'] = now()->addSeconds(max(60, (int) ($googleUser->expiresIn ?? 3600)));
        }

        if ($refreshToken !== '') {
            $payload['google_refresh_token'] = $refreshToken;
            $payload['google_calendar_connected_at'] = now();
        }
    }
}
