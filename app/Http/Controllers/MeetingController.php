<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\Department;
use App\Models\MeetingType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class MeetingController extends Controller
{
    public function index(Request $request)
    {
        $query = Meeting::with(['organizer', 'department', 'meetingType']);

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

        // For calendar view, we might want all meetings (or a specific range)
        if ($request->get('view') === 'calendar') {
            $meetings = $query->latest('date')->get();
        } else {
            $meetings = $query->latest('date')
                ->paginate(10)
                ->withQueryString();
        }
            
        return Inertia::render('Meetings/Index', [
            'meetings' => $meetings,
            'filters' => $request->only(['search', 'show_cancelled', 'view'])
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

        return redirect()->route('meetings.show', $meeting->id)
            ->with('success', 'Reunión creada exitosamente.');
    }

    public function show(Meeting $meeting)
    {
        $meeting->load(['department', 'meetingType', 'organizer', 'participants.user', 'agendaItems.speaker', 'minute', 'attachments.uploader']);
        
        return Inertia::render('Meetings/Show', [
            'meeting' => $meeting,
            'users' => \App\Models\User::all(['id', 'name', 'email']),
        ]);
    }

    public function edit(Meeting $meeting)
    {
        return Inertia::render('Meetings/Edit', [
            'meeting' => $meeting,
            'departments' => Department::all(),
            'meetingTypes' => MeetingType::all()
        ]);
    }

    public function update(Request $request, Meeting $meeting)
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
            'status' => 'required|in:programada,realizada,cancelada,cerrada'
        ]);

        $meeting->update($validated);

        return redirect()->route('meetings.show', $meeting->id)
            ->with('success', 'Reunión actualizada exitosamente.');
    }

    public function destroy(Meeting $meeting)
    {
        $meeting->delete();

        return redirect()->route('meetings.index')
            ->with('success', 'Reunión eliminada exitosamente.');
    }

    public function cancel(Meeting $meeting)
    {
        $meeting->update(['status' => 'cancelada']);

        return back()->with('success', 'Reunión cancelada exitosamente.');
    }
}
