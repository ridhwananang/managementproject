<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;

class DashboardController extends Controller
{
    /**
     * Tampilkan halaman dashboard utama.
     */
   public function index()
    {
        $totalProjects = Project::count();
        $tasksInProgress = Task::where('status', 'in_progress')->count();
        $activeMembers = User::count(); // bisa diganti filter aktif login dsb

$totalBudget = Project::sum('nilai_budget');


        return inertia('Dashboard/Index', [
            'stats' => [
                'totalProjects' => $totalProjects,
                'tasksInProgress' => $tasksInProgress,
                'activeMembers' => $activeMembers,
                'totalBudget' => $totalBudget,
            ],
        ]);
    }
}
