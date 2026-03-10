<?php

namespace App\Http\Controllers;

use App\Models\Agreement;
use App\Models\AgreementUpdate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AgreementUpdateController extends Controller
{
    public function store(Request $request, Agreement $agreement)
    {
        abort_unless($agreement->isVisibleTo((int) $request->user()->id), 403);

        $validated = $request->validate([
            'notes' => 'required|string',
            'status_after' => 'required|string|in:pendiente,en proceso,realizado,atrasado',
            'progress_percentage' => 'nullable|integer|min:0|max:100',
        ]);

        DB::beginTransaction();
        try {
            $defaultProgressByStatus = [
                'pendiente' => 0,
                'en proceso' => 50,
                'atrasado' => 50,
                'realizado' => 100,
            ];

            $progress = $validated['status_after'] === 'realizado'
                ? 100
                : ($validated['progress_percentage'] ?? $defaultProgressByStatus[$validated['status_after']] ?? 0);

            $agreement->updates()->create([
                'created_by' => auth()->id(),
                'comment' => $validated['notes'],
                'status_changed_to' => $validated['status_after'],
                'progress_percentage' => $progress,
            ]);

            $agreement->update(['status' => $validated['status_after']]);

            // Notificar al responsable (si no es quien actualiza)
            if ($agreement->responsible_id && $agreement->responsible_id !== auth()->id()) {
                $agreement->responsible->notify(new \App\Notifications\AgreementStatusChanged($agreement, auth()->user()));
            }

            // Notificar al organizador de la reunión
            $organizer = $agreement->minute?->meeting?->organizer;
            if ($organizer && $organizer->id !== auth()->id()) {
                $organizer->notify(new \App\Notifications\AgreementStatusChanged($agreement, auth()->user()));
            }

            DB::commit();
            return back()->with('success', 'Avance registrado correctamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al registrar el avance: ' . $e->getMessage()]);
        }
    }
}
