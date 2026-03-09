<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class MinuteExportController extends Controller
{
    public function export(Meeting $meeting)
    {
        $meeting->load([
            'department',
            'meetingType',
            'organizer',
            'participants.user',
            'agendaItems.speaker',
            'minute.topics',
            'minute.decisions',
            'minute.agreements.responsible',
            'minute.agreements.responsibles',
        ]);

        if (!$meeting->minute) {
            return back()->with('error', 'Esta reunión aún no tiene un acta generada.');
        }

        if ($meeting->minute->status !== 'published') {
            return back()->with('error', 'La minuta está en borrador. Publícala para exportar el PDF oficial.');
        }

        $pdf = Pdf::loadView('pdf.minute', compact('meeting'));
        
        return $pdf->download("Acta_{$meeting->code}.pdf");
    }
}
