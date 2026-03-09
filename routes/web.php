<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\MeetingAgendaController;
use App\Http\Controllers\MeetingParticipantController;
use App\Http\Controllers\MeetingMinuteController;
use App\Http\Controllers\AgreementController;
use App\Http\Controllers\AgreementUpdateController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\MinuteExportController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SearchController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', DashboardController::class)->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Meetings
    Route::resource('meetings', MeetingController::class);
    Route::patch('meetings/{meeting}/cancel', [MeetingController::class, 'cancel'])->name('meetings.cancel');
    Route::post('meetings/{meeting}/agenda', [MeetingAgendaController::class, 'store'])->name('meetings.agenda.store');
    Route::delete('meetings/{meeting}/agenda/{agendaItem}', [MeetingAgendaController::class, 'destroy'])->name('meetings.agenda.destroy');
    
    Route::post('meetings/{meeting}/participants', [MeetingParticipantController::class, 'store'])->name('meetings.participants.store');
    Route::patch('meetings/{meeting}/participants/{participant}', [MeetingParticipantController::class, 'update'])->name('meetings.participants.update');
    Route::delete('meetings/{meeting}/participants/{participant}', [MeetingParticipantController::class, 'destroy'])->name('meetings.participants.destroy');

    // Minutes
    Route::get('meetings/{meeting}/minute/create', [MeetingMinuteController::class, 'create'])->name('meetings.minute.create');
    Route::post('meetings/{meeting}/minute', [MeetingMinuteController::class, 'store'])->name('meetings.minute.store');
    Route::get('minutes/{minute}', [MeetingMinuteController::class, 'show'])->name('minutes.show');

    // Agreements & Tracking
    Route::get('agreements/mypending', [AgreementController::class, 'myPending'])->name('agreements.mypending');
    Route::get('agreements', [AgreementController::class, 'index'])->name('agreements.index');
    Route::get('agreements/{agreement}', [AgreementController::class, 'show'])->name('agreements.show');
    Route::post('agreements/{agreement}/updates', [AgreementUpdateController::class, 'store'])->name('agreements.updates.store');

    Route::post('/attachments', [AttachmentController::class, 'store'])->name('attachments.store');
    Route::delete('/attachments/{attachment}', [AttachmentController::class, 'destroy'])->name('attachments.destroy');

    Route::post('/notifications/mark-read', function () {
        auth()->user()->unreadNotifications->markAsRead();
        return back();
    })->name('notifications.mark-read');

    Route::get('/meetings/{meeting}/export', [MinuteExportController::class, 'export'])->name('meetings.export');
    Route::get('/api/search', [SearchController::class, 'index'])->name('api.search');

    // Admin
    Route::middleware('role:Admin')->prefix('admin')->name('admin.')->group(function () {
        Route::resource('departments', \App\Http\Controllers\Admin\DepartmentController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('meeting-types', \App\Http\Controllers\Admin\MeetingTypeController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('roles', \App\Http\Controllers\Admin\RoleController::class)->only(['index', 'store', 'update', 'destroy']);
    });
});

require __DIR__.'/auth.php';
