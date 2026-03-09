<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingMinute;
use App\Models\Agreement;
use App\Models\MinuteDecision;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class MeetingMinuteController extends Controller
{
    public function create(Meeting $meeting)
    {
        if ($meeting->minute) {
            return redirect()->route('minutes.show', $meeting->minute->id);
        }

        $meeting->load(['participants.user', 'agendaItems.speaker']);

        return Inertia::render('Minutes/Create', [
            'meeting' => $meeting,
            'users' => \App\Models\User::all(['id', 'name']),
            'departments' => \App\Models\Department::all(['id', 'name']),
        ]);
    }

    public function store(Request $request, Meeting $meeting)
    {
        $validated = $request->validate([
            'notes' => 'nullable|string',
            'observations' => 'nullable|string',
            'agreements' => 'nullable|array',
            'agreements.*.subject' => 'required|string|max:255',
            'agreements.*.responsible_ids' => 'required|array',
            'agreements.*.responsible_ids.*' => 'exists:users,id',
            'agreements.*.commitment_date' => 'required|date',
            'agreements.*.department_id' => 'required|exists:departments,id',
            'decisions' => 'nullable|array',
            'decisions.*.description' => 'required|string',
            'topics' => 'nullable|array',
            'topics.*.title' => 'required|string',
            'topics.*.detail' => 'nullable|string',
            'topics.*.conclusions' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $minute = $meeting->minute()->create([
                'summary' => $validated['notes'],
                'general_observations' => $validated['observations'],
                'published_by' => auth()->id(),
                'published_at' => now(),
                'status' => 'published'
            ]);

            foreach ($validated['agreements'] ?? [] as $agreementData) {
                $responsibleIds = $agreementData['responsible_ids'];
                unset($agreementData['responsible_ids']);
                
                // Fallback for old single column
                $agreementData['responsible_id'] = $responsibleIds[0] ?? null;

                $agreement = $minute->agreements()->create($agreementData);
                $agreement->responsibles()->sync($responsibleIds);
            }

            foreach ($validated['decisions'] ?? [] as $decisionData) {
                $minute->decisions()->create($decisionData);
            }

            foreach ($validated['topics'] ?? [] as $index => $topicData) {
                $minute->topics()->create(array_merge($topicData, ['order' => $index]));
            }

            $meeting->update(['status' => 'realizada']);

            DB::commit();
            return redirect()->route('meetings.show', $meeting->id)->with('success', 'Minuta publicada exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al guardar la minuta: ' . $e->getMessage()]);
        }
    }

    public function show(MeetingMinute $minute)
    {
        $minute->load(['meeting.department', 'meeting.meetingType', 'agreements.responsibles', 'agreements.department', 'decisions', 'topics', 'publisher']);
        return Inertia::render('Minutes/Show', [
            'minute' => $minute
        ]);
    }
}
