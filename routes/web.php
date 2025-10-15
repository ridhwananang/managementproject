<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\{
    DashboardController,
    ProjectController,
    ProjectMemberController,
    UserController,
    SprintController,
    TaskController,
    ActivityLogController,
    ReportController
};
use App\Models\ActivityLog;

// Auth pages
Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

// Protected routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

    // Projects
    Route::resource('projects', ProjectController::class);

    // Project Members
    Route::post('projects/{project}/members', [ProjectMemberController::class, 'store'])
        ->name('projects.members.store');
 Route::resource('projects.sprints', SprintController::class);
    // Users
    Route::resource('users', UserController::class)
        ->only(['create', 'store', 'index', 'show', 'edit', 'update', 'destroy']);
        Route::resource('projects.tasks', \App\Http\Controllers\TaskController::class);
Route::resource('projects.sprints.tasks', TaskController::class);
        // Route::resource('projects.sprints.tasks', SprintTaskController::class);

});
Route::resource('projects.tasks', \App\Http\Controllers\TaskController::class);

Route::prefix('projects/{project}/sprints/{sprint}')->group(function () {
    Route::get('/tasks/create', [\App\Http\Controllers\TaskController::class, 'create'])
        ->name('projects.sprints.tasks.create');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/activity-logs', [ActivityLogController::class, 'index'])
        ->name('activity.logs.index');
});

Route::get('/report', [ReportController::class, 'index'])->name('projects.reports.show');
Route::post('/report/generate', [ReportController::class, 'generate'])->name('projects.reports.generate');
Route::get('/report/{project}', [ReportController::class, 'show'])->name('projects.reports.show.detail');
// routes/web.php
Route::get('/report', [ReportController::class, 'index'])->name('projects.reports.showAll');
Route::get('/report/{project}', [ReportController::class, 'show'])->name('projects.reports.show');

// Include other routes
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
