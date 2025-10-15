<?php
namespace App\Observers;

use App\Models\Task;
use App\Models\Report;
use App\Models\Project;

class TaskObserver
{
    public function saved(Task $task)
    {
        $project = $task->project;

        // Ambil semua sprint + task
        $sprints = $project->sprints()->with('tasks')->get();

        $reportDetails = [];
        $allTasksProgress = [];

        foreach ($sprints as $sprint) {
            $sprintTasks = $sprint->tasks;
            $sprintProgress = 0;

            foreach ($sprintTasks as $t) {
                $progress = match($t->status) {
                    'todo' => 0,
                    'in_progress' => 50,
                    'review' => 75,
                    'done' => 100,
                    default => 0,
                };
                $allTasksProgress[] = $progress;
                $sprintProgress += $progress;
            }

            $sprintAverage = $sprintTasks->count() ? round($sprintProgress / $sprintTasks->count()) : 0;

            $reportDetails[] = [
                'sprint_id' => $sprint->id,
                'sprint_name' => $sprint->name,
                'sprint_progress' => $sprintAverage,
                'tasks' => $sprintTasks->map(fn($t) => [
                    'task_id' => $t->id,
                    'title' => $t->title,
                    'description' => $t->description,
                    'status' => $t->status,
                    'progress' => match($t->status) {
                        'todo' => 0,
                        'in_progress' => 50,
                        'review' => 75,
                        'done' => 100,
                        default => 0,
                    },
                ]),
            ];
        }

        $projectAverage = $allTasksProgress ? round(array_sum($allTasksProgress) / count($allTasksProgress)) : 0;

        // Update atau buat report
        Report::updateOrCreate(
            ['project_id' => $project->id],
            [
                'progress_percentage' => $projectAverage,
                'details' => $reportDetails,
            ]
        );
    }
}
