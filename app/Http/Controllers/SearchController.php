<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\Agreement;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->query('q');

        if (!$q) {
            return response()->json(['results' => []]);
        }

        $meetings = Meeting::where('subject', 'like', "%{$q}%")
            ->orWhere('code', 'like', "%{$q}%")
            ->latest()
            ->take(5)
            ->get(['id', 'subject', 'code', 'status'])
            ->map(fn($m) => [
                'type' => 'meeting',
                'title' => $m->subject,
                'subtitle' => $m->code,
                'url' => route('meetings.show', $m->id),
                'status' => $m->status
            ]);

        $agreements = Agreement::where('subject', 'like', "%{$q}%")
            ->latest()
            ->take(5)
            ->get(['id', 'subject', 'status'])
            ->map(fn($a) => [
                'type' => 'agreement',
                'title' => $a->subject,
                'subtitle' => 'Compromiso',
                'url' => route('agreements.show', $a->id),
                'status' => $a->status
            ]);

        return response()->json([
            'results' => $meetings->concat($agreements)
        ]);
    }
}
