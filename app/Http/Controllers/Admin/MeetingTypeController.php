<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MeetingType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingTypeController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/MeetingTypes/Index', [
            'meetingTypes' => MeetingType::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:meeting_types',
            'description' => 'nullable|string',
        ]);

        MeetingType::create($validated);

        return back()->with('success', 'Tipo de reunión creado exitosamente.');
    }

    public function update(Request $request, MeetingType $meetingType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:meeting_types,name,' . $meetingType->id,
            'description' => 'nullable|string',
        ]);

        $meetingType->update($validated);

        return back()->with('success', 'Tipo de reunión actualizado exitosamente.');
    }

    public function destroy(MeetingType $meetingType)
    {
        $meetingType->delete();

        return back()->with('success', 'Tipo de reunión eliminado exitosamente.');
    }
}
