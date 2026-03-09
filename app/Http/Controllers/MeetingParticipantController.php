<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingParticipant;
use Illuminate\Http\Request;

class MeetingParticipantController extends Controller
{
    public function store(Request $request, Meeting $meeting)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'external_name' => 'nullable|string|max:255',
            'external_email' => 'nullable|email|max:255',
            'role_in_meeting' => 'nullable|string|max:100',
        ]);

        // Prevent duplicates
        if ($validated['user_id'] && $meeting->participants()->where('user_id', $validated['user_id'])->exists()) {
            return back()->withErrors(['user_id' => 'El usuario ya es participante de esta reunión.']);
        }

        $meeting->participants()->create($validated);

        return back()->with('success', 'Participante agregado.');
    }

    public function update(Request $request, Meeting $meeting, MeetingParticipant $participant)
    {
        $validated = $request->validate([
            'attendance_status' => 'required|in:presente,ausente,justificado',
            'role_in_meeting' => 'nullable|string|max:100',
        ]);

        $participant->update($validated);

        return back()->with('success', 'Participante actualizado.');
    }

    public function destroy(Meeting $meeting, MeetingParticipant $participant)
    {
        $participant->delete();
        return back()->with('success', 'Participante eliminado.');
    }
}
