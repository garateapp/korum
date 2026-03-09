<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingAgendaItem;
use Illuminate\Http\Request;

class MeetingAgendaController extends Controller
{
    public function store(Request $request, Meeting $meeting)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'speaker_id' => 'nullable|exists:users,id',
            'estimated_time_min' => 'required|integer|min:1',
            'order' => 'nullable|integer',
        ]);

        $meeting->agendaItems()->create($validated);

        return back()->with('success', 'Tema agregado a la agenda.');
    }

    public function destroy(Meeting $meeting, MeetingAgendaItem $agendaItem)
    {
        $agendaItem->delete();
        return back()->with('success', 'Tema eliminado de la agenda.');
    }
}
