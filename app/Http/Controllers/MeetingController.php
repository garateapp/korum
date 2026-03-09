<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Meeting;
use App\Models\MeetingType;
use App\Services\GoogleCalendarService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class MeetingController extends Controller
{
    public function __construct(private readonly GoogleCalendarService $googleCalendarService)
    {
    }

    public function index(Request $request)
    {
        $userId = (int) $request->user()->id;

        $query = Meeting::query()
            ->visibleTo($userId)
            ->with(['organizer', 'department', 'meetingType']);

        $allowedSortColumns = ['date', 'subject', 'status', 'code'];
        $sortBy = in_array($request->input('sort_by'), $allowedSortColumns, true)
            ? $request->input('sort_by')
            : 'date';
        $sortDirection = $request->input('sort_dir') === 'asc' ? 'asc' : 'desc';

        // Default: exclude cancelled meetings
        if (!$request->boolean('show_cancelled')) {
            $query->where('status', '!=', 'cancelada');
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('subject', 'like', "%{$request->search}%")
                  ->orWhere('code', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        if ($sortBy === 'date') {
            $query->orderBy('date', $sortDirection)
                ->orderBy('start_time', $sortDirection);
        } else {
            $query->orderBy($sortBy, $sortDirection)
                ->orderBy('date', 'desc')
                ->orderBy('start_time', 'desc');
        }

        // For calendar view, we might want all meetings (or a specific range)
        if ($request->get('view') === 'calendar') {
            $meetings = $query->get();
        } else {
            $meetings = $query
                ->paginate(10)
                ->withQueryString();
        }

        return Inertia::render('Meetings/Index', [
            'meetings' => $meetings,
            'filters' => $request->only(['search', 'show_cancelled', 'view', 'sort_by', 'sort_dir']),
            'googleCalendar' => [
                'connected' => (bool) $request->user()?->google_refresh_token,
                'connected_at' => $request->user()?->google_calendar_connected_at?->toISOString(),
                'last_synced_at' => $request->user()?->google_calendar_synced_at?->toISOString(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Meetings/Create', [
            'departments' => Department::all(),
            'meetingTypes' => MeetingType::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
            'mode' => 'required|in:presencial,virtual,hibrida',
            'location_link' => 'nullable|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'meeting_type_id' => 'nullable|exists:meeting_types,id',
        ]);

        $validated['code'] = 'MTG-' . now()->format('dmy') . strtoupper(Str::random(4));
        $validated['organizer_id'] = $request->user()->id;
        $validated['status'] = 'programada';

        $meeting = Meeting::create($validated);
        $syncError = $this->syncMeetingToGoogle($meeting);

        $redirect = redirect()->route('meetings.show', $meeting->id)
            ->with('success', 'Reunión creada exitosamente.');

        if ($syncError) {
            $redirect->with('error', $syncError);
        }

        return $redirect;
    }

    public function show(Request $request, Meeting $meeting)
    {
        $this->ensureMeetingVisibleToUser($meeting, (int) $request->user()->id);

        $meeting->load(['department', 'meetingType', 'organizer', 'participants.user', 'agendaItems.speaker', 'minute', 'attachments.uploader']);

        return Inertia::render('Meetings/Show', [
            'meeting' => $meeting,
            'users' => \App\Models\User::all(['id', 'name', 'email']),
        ]);
    }

    public function edit(Request $request, Meeting $meeting)
    {
        $this->ensureMeetingVisibleToUser($meeting, (int) $request->user()->id);

        return Inertia::render('Meetings/Edit', [
            'meeting' => $meeting,
            'departments' => Department::all(),
            'meetingTypes' => MeetingType::all()
        ]);
    }

    public function update(Request $request, Meeting $meeting)
    {
        $this->ensureMeetingVisibleToUser($meeting, (int) $request->user()->id);

        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
            'mode' => 'required|in:presencial,virtual,hibrida',
            'location_link' => 'nullable|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'meeting_type_id' => 'nullable|exists:meeting_types,id',
            'status' => 'required|in:programada,realizada,cancelada,cerrada'
        ]);

        $meeting->update($validated);
        $syncError = $this->syncMeetingToGoogle($meeting->fresh());

        $redirect = redirect()->route('meetings.show', $meeting->id)
            ->with('success', 'Reunión actualizada exitosamente.');

        if ($syncError) {
            $redirect->with('error', $syncError);
        }

        return $redirect;
    }

    public function destroy(Request $request, Meeting $meeting)
    {
        $this->ensureMeetingVisibleToUser($meeting, (int) $request->user()->id);

        $syncError = $this->cancelMeetingInGoogle($meeting);
        $meeting->delete();

        $redirect = redirect()->route('meetings.index')
            ->with('success', 'Reunión eliminada exitosamente.');

        if ($syncError) {
            $redirect->with('error', $syncError);
        }

        return $redirect;
    }

    public function cancel(Request $request, Meeting $meeting)
    {
        $this->ensureMeetingVisibleToUser($meeting, (int) $request->user()->id);

        $meeting->update(['status' => 'cancelada']);
        $syncError = $this->cancelMeetingInGoogle($meeting->fresh());

        $redirect = back()->with('success', 'Reunión cancelada exitosamente.');
        if ($syncError) {
            $redirect->with('error', $syncError);
        }

        return $redirect;
    }

    private function syncMeetingToGoogle(Meeting $meeting): ?string
    {
        $organizer = $meeting->organizer()->first();
        if (!$organizer) {
            return null;
        }

        if (!$this->googleCalendarService->hasConnectedCalendar($organizer)) {
            return 'La reunión se guardó en Korum. Conecta Google Calendar para sincronizarla automáticamente.';
        }

        try {
            $this->googleCalendarService->upsertEventFromMeeting($organizer, $meeting);
            return null;
        } catch (Throwable $exception) {
            report($exception);
            return 'La reunión se guardó en Korum, pero no se pudo sincronizar con Google Calendar.';
        }
    }

    private function cancelMeetingInGoogle(Meeting $meeting): ?string
    {
        $organizer = $meeting->organizer()->first();
        if (!$organizer) {
            return null;
        }

        if (!$this->googleCalendarService->hasConnectedCalendar($organizer)) {
            return 'La reunión se guardó en Korum. Conecta Google Calendar para sincronizar también las cancelaciones.';
        }

        try {
            $this->googleCalendarService->cancelEventForMeeting($organizer, $meeting);
            return null;
        } catch (Throwable $exception) {
            report($exception);
            return 'La reunión se guardó en Korum, pero no se pudo cancelar en Google Calendar.';
        }
    }

    private function ensureMeetingVisibleToUser(Meeting $meeting, int $userId): void
    {
        if (!$meeting->isVisibleTo($userId)) {
            throw new HttpException(403, 'No tienes permisos para acceder a esta reunión.');
        }
    }
}
