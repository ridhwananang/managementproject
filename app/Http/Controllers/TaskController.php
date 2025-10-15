<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\Project;
use App\Models\Sprint;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
        use AuthorizesRequests;
    public function index(Request $request, $projectId)
    {
        $project = Project::findOrFail($projectId);

        $tasks = Task::where('project_id', $projectId)
            ->orderByDesc('created_at')
            ->get();

        return inertia('Project/Task/Index', [
            'project' => $project,
            'tasks' => $tasks,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($projectId)
    {
        $project = Project::with('sprints')->findOrFail($projectId);
        $sprints = $project->sprints()->orderBy('start_date')->get();

        // ✅ Tambahkan ini biar UserPicker dapat data
        $users = User::select('id', 'name', 'email', 'avatar')->get();

        return inertia('Project/Task/Create', [
            'project' => $project,
            'sprints' => $sprints,
            'users' => $users, // ✅ dikirim ke frontend
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'sprint_id' => 'nullable|exists:sprints,id',
            'assigned_to' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'module_type' => 'in:backend,frontend,uiux,project_manager,marketing,fullstack',
            'priority' => 'in:low,medium,high,critical',
            'status' => 'in:todo,in_progress,review,done',
            'progress_percentage' => 'numeric|min:0|max:100',
            'due_date' => 'nullable|date',
        ]);

        $validated['created_by'] = Auth::id();
        $validated['progress_percentage'] = 0;

        Task::create($validated);

        return back()->with('success', 'Task created.');
    }

    /**
     * Display the specified resource.
     */
// TaskController.php
public function show(Project $project, Sprint $sprint, Task $task)
{
    $task->load(['assignedUser', 'createdBy']); // 🔑 wajib load relasi
    // dd($task->toArray());
    return inertia('Project/Task/Show', [
        'project' => $project,
        'sprint' => $sprint,
        'task' => $task,
    ]);
}



    /**
     * Show the form for editing the specified resource.
     */
    public function edit($projectId, $taskId)
    {
        $task = Task::findOrFail($taskId);
        $projects = Project::all();
        $sprints = Sprint::where('project_id', $task->project_id)->get();

        // Optional: tambahkan juga users biar bisa ubah assigned_to di Edit
        $users = User::select('id', 'name', 'email', 'avatar')->get();

        return inertia('Project/Task/Edit', [
            'task' => $task,
            'projects' => $projects,
            'sprints' => $sprints,
            'users' => $users, // ✅ supaya edit page bisa pilih user juga
        ]);
    }

    /**
     * Update the specified resource.
     */
    public function update(Request $request, Project $project, Task $task)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'sprint_id' => 'nullable|exists:sprints,id',
            'assigned_to' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'module_type' => 'in:backend,frontend,uiux,project_manager,marketing,fullstack',
            'priority' => 'in:low,medium,high,critical',
            'status' => 'in:todo,in_progress,review,done',
            'progress_percentage' => 'numeric|min:0|max:100',
            'due_date' => 'nullable|date',
        ]);

        $task->update($validated);

        return back()->with('success', 'Task updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
public function destroy(Project $project, Sprint $sprint, Task $task)
{
    $this->authorize('delete', $task);

    $task->delete();

    return redirect()
        ->route('projects.sprints.show', [$project->id, $sprint->id])
        ->with('success', 'Task berhasil dihapus.');
}

}
