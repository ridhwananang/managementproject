import React, { useEffect, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ListTodo, ArrowLeft, Eye } from "lucide-react";
import DeleteModal from "@/components/DeleteModal";
import toast from "react-hot-toast";

interface Project {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  status: string;
  priority: string;
  description?: string;
}

interface Sprint {
  id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: "planned" | "in_progress" | "completed";
  tasks?: Task[];
}

export default function Show({ project, sprint }: { project: Project; sprint: Sprint }) {
  const [tasks, setTasks] = useState<Task[]>(sprint.tasks || []);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);

  const openDeleteModal = (task: Task) => {
    setDeleteTask(task);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!deleteTask) return;
    setLoading(true);

    router.delete(route("projects.sprints.tasks.destroy", [project.id, sprint.id, deleteTask.id]), {
      onSuccess: () => {
        setTasks((prev) => prev.filter((t) => t.id !== deleteTask.id));
        toast.success(`Task "${deleteTask.title}" deleted.`);
        setDeleteModalOpen(false);
        setDeleteTask(null);
      },
      onError: () => {
        toast.error("Failed to delete task.");
      },
      onFinish: () => setLoading(false),
    });
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const statusColor =
    sprint.status === "completed"
      ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
      : sprint.status === "in_progress"
      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100"
      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";

  return (
    <AppLayout>
      <Head title={`Sprint: ${sprint.name}`} />

      <div className="max-w-5xl mx-auto mt-10 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href={route("projects.sprints.index", project.id)}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{sprint.name}</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href={route("projects.sprints.edit", [project.id, sprint.id])}
              className="px-3 py-2 rounded-md border border-indigo-500 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-700 transition"
            >
              Edit
            </Link>
          </div>
        </div>

        {/* Sprint Details */}
        <Card className="shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="text-xl">{sprint.name}</span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}>
                {sprint.status.replace("_", " ")}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {sprint.description || "No description provided."}
            </p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-4">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>
                  <strong>Start:</strong> {formatDate(sprint.start_date)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>
                  <strong>End:</strong> {formatDate(sprint.end_date)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
<div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-200/70 dark:border-gray-800 transition-all duration-300">
  {/* Header */}
  <div className="flex justify-between items-center mb-8 border-b border-gray-200/60 dark:border-gray-800 pb-4">
    <div className="flex items-center gap-3">
      <ListTodo className="text-indigo-500 dark:text-indigo-400" size={24} />
      <h2 className="font-extrabold text-2xl text-gray-900 dark:text-gray-100 tracking-tight">
        Tasks in this Sprint
      </h2>
    </div>
    <Link
      href={route("projects.sprints.tasks.create", [project.id, sprint.id])}
      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 font-semibold"
    >
      + Add Task
    </Link>
  </div>

  {/* Task Grid */}
  {tasks.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {tasks.map((task) => {
        const statusColor =
          task.status === "done"
            ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-100"
            : task.status === "in_progress"
            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-100"
            : task.status === "review"
            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-100"
            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";

        const priorityColor =
          task.priority === "critical"
            ? "text-red-700 font-semibold"
            : task.priority === "high"
            ? "text-red-500"
            : task.priority === "medium"
            ? "text-yellow-500"
            : "text-green-500";

        return (
          <div
            key={task.id}
            className="group relative bg-white/80 dark:bg-gray-900/60 border border-gray-200/70 dark:border-gray-800 rounded-2xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
          >
            {/* Accent bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 opacity-70 group-hover:opacity-100 transition" />

            {/* Task Content */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-snug">
                {task.title}
              </h3>

              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${statusColor} capitalize font-medium`}
                >
                  {task.status.replace("_", " ")}
                </span>
                <span className={`text-xs ${priorityColor} uppercase tracking-wide`}>
                  {task.priority}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                {task.description || "No description provided."}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 flex justify-between gap-3 border-t border-gray-200/60 dark:border-gray-800 pt-4">
              <Link
                href={route("projects.tasks.show", [project.id, task.id])}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 shadow-sm hover:shadow transition-all"
              >
                <Eye size={14} /> View
              </Link>

              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-sm hover:shadow transition-all"
                onClick={() => openDeleteModal(task)}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="text-center text-gray-500 dark:text-gray-400 py-12">
      <p className="text-lg font-medium mb-3">No tasks yet 💤</p>
      <Link
        href={route("projects.sprints.tasks.create", [project.id, sprint.id])}
        className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
      >
        + Create Task
      </Link>
    </div>
  )}
</div>

      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        title={deleteTask?.title || ""}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={loading}
      />
    </AppLayout>
  );
}
