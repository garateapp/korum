<?php

namespace App\Http\Controllers;

use App\Models\Agreement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AgreementController extends Controller
{
    public function index(Request $request)
    {
        $agreements = Agreement::query()
            ->with(['responsible', 'responsibles', 'department', 'minute.meeting'])
            ->when($request->search, fn($q, $search) => $q->where('subject', 'like', "%{$search}%"))
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->responsible_id, function ($q, $id) {
                $q->where(function ($subQuery) use ($id) {
                    $subQuery->where('responsible_id', $id)
                        ->orWhereHas('responsibles', fn($users) => $users->where('users.id', $id));
                });
            })
            ->when($request->department_id, fn($q, $id) => $q->where('department_id', $id))
            ->latest('commitment_date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Agreements/Index', [
            'agreements' => $agreements,
            'filters' => $request->only(['search', 'status', 'responsible_id', 'department_id']),
            'users' => \App\Models\User::all(['id', 'name']),
            'departments' => \App\Models\Department::all(['id', 'name']),
        ]);
    }

    public function myPending(Request $request)
    {
        $userId = auth()->id();

        $agreements = Agreement::query()
            ->with(['responsible', 'responsibles', 'department', 'minute.meeting'])
            ->where(function ($query) use ($userId) {
                $query->where('responsible_id', $userId)
                    ->orWhereHas('responsibles', fn($users) => $users->where('users.id', $userId));
            })
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->latest('commitment_date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Agreements/MyPending', [
            'agreements' => $agreements,
            'filters' => $request->only(['status'])
        ]);
    }

    public function show(Agreement $agreement)
    {
        $agreement->load(['responsible', 'responsibles', 'department', 'minute.meeting', 'updates.creator', 'attachments.uploader']);

        return Inertia::render('Agreements/Show', [
            'agreement' => $agreement
        ]);
    }
}
