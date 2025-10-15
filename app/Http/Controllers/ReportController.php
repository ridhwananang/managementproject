<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;

class ReportController extends Controller
{
    public function index()
    {
        $projects = Project::with(['projectMembers.user', 'sprints.tasks'])->get();

        $reports = $projects->map(function ($project) {
            $sprints = $project->sprints->map(function ($sprint) {
                $tasks = $sprint->tasks->map(function ($task) {
                    // Progress per task berdasarkan status
                    $progressMap = [
                        'todo' => 0,
                        'in_progress' => 50,
                        'review' => 75,
                        'done' => 100,
                    ];
                    return [
                        'task_id' => $task->id,
                        'title' => $task->title,
                        'description' => $task->description,
                        'status' => $task->status,
                        'progress' => $progressMap[$task->status] ?? 0,
                    ];
                });

                $sprintProgress = $tasks->avg('progress');

                return [
                    'sprint_id' => $sprint->id,
                    'sprint_name' => $sprint->name,
                    'sprint_progress' => round($sprintProgress),
                    'tasks' => $tasks,
                ];
            });

            $projectProgress = $sprints->avg('sprint_progress');

            return [
                'project_id' => $project->id,
                'project_name' => $project->name,
                'project_description' => $project->description,
                'progress_percentage' => round($projectProgress),
                'details' => $sprints,
                'project_members' => $project->projectMembers,
            ];
        });

        return inertia('Reports/Index', ['reports' => $reports]);
    }

    public function show(Project $project)
    {
        $project->load(['projectMembers.user', 'sprints.tasks']);

        $sprints = $project->sprints->map(function ($sprint) {
            $tasks = $sprint->tasks->map(function ($task) {
                $progressMap = [
                    'todo' => 0,
                    'in_progress' => 50,
                    'review' => 75,
                    'done' => 100,
                ];
                return [
                    'task_id' => $task->id,
                    'title' => $task->title,
                    'description' => $task->description,
                    'status' => $task->status,
                    'progress' => $progressMap[$task->status] ?? 0,
                ];
            });

            $sprintProgress = $tasks->avg('progress');

            return [
                'sprint_id' => $sprint->id,
                'sprint_name' => $sprint->name,
                'sprint_progress' => round($sprintProgress),
                'tasks' => $tasks,
            ];
        });

        $projectProgress = $sprints->avg('sprint_progress');

        $report = [
            'project_id' => $project->id,
            'project_name' => $project->name,
            'progress_percentage' => round($projectProgress),
            'details' => $sprints,
            'project_members' => $project->projectMembers,
        ];

        return inertia('Reports/Show', ['report' => $report]);
    }
}
