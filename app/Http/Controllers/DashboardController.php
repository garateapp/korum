<?php

namespace App\Http\Controllers;

use App\Models\Agreement;
use App\Models\Meeting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $user = Auth::user();
        $userId = (int) $user->id;
        
        // Stats
        $meetingVisibilityQuery = Meeting::query()->visibleTo($userId);
        $agreementVisibilityQuery = Agreement::query()->visibleTo($userId);
        $totalMeetings = (clone $meetingVisibilityQuery)->count();
        $meetingsToday = (clone $meetingVisibilityQuery)->whereDate('date', now())->count();
        
        $pendingAgreements = (clone $agreementVisibilityQuery)
            ->where('status', '!=', 'realizado')
            ->count();
        $myPendingAgreements = (clone $agreementVisibilityQuery)
            ->where('status', '!=', 'realizado')
            ->where(function ($query) use ($user) {
                $query->where('responsible_id', $user->id)
                    ->orWhereHas('responsibles', fn($users) => $users->where('users.id', $user->id));
            })
            ->count();
            
        $completedAgreementsThisMonth = (clone $agreementVisibilityQuery)
            ->where('status', 'realizado')
            ->whereMonth('updated_at', now()->month)
            ->count();

        // Upcoming meetings
        $upcomingMeetings = Meeting::query()
            ->visibleTo($userId)
            ->with(['department', 'meetingType'])
            ->where('date', '>=', now())
            ->where('status', 'programada')
            ->orderBy('date')
            ->orderBy('start_time')
            ->take(5)
            ->get();

        // Recent Agreements
        $recentAgreements = Agreement::query()
            ->visibleTo($userId)
            ->with(['responsible', 'responsibles', 'department'])
            ->latest()
            ->take(5)
            ->get();

        $departmentStats = \App\Models\Department::withCount(['agreements as pending_count' => function($query) use ($userId) {
            $query->visibleTo($userId)->where('status', '!=', 'realizado');
        }])->get(['id', 'name']);

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalMeetings' => $totalMeetings,
                'meetingsToday' => $meetingsToday,
                'pendingAgreements' => $pendingAgreements,
                'myPending' => $myPendingAgreements,
                'completedMonthly' => $completedAgreementsThisMonth,
            ],
            'upcomingMeetings' => $upcomingMeetings,
            'recentAgreements' => $recentAgreements,
            'departmentStats' => $departmentStats
        ]);
    }
}
