import React from "react";
import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";

interface Project {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "review" | "done";
  module_type: string;
  priority: string;
  progress_percentage: number;
  due_date?: string;
  assigned_user?: User;
  created_by?: User;
}

export default function Show({ project, task }: { project: Project; task: Task }) {
  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const statusColor =
    task.status === "done"
      ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
      : task.status === "in_progress"
      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100"
      : task.status === "review"
      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-100"
      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";

  const priorityColor =
    task.priority.toLowerCase() === "high"
      ? "text-red-600"
      : task.priority.toLowerCase() === "medium"
      ? "text-yellow-500"
      : "text-green-500";

  return (
    <AppLayout>
      <Head title={`Task: ${task.title}`} />

      <div className="max-w-4xl mx-auto mt-10 p-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
          <div className="flex items-center gap-3">
            <Link href={route("projects.tasks.index", project.id)}>
              <Button variant="outline" size="sm">← Back</Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {task.title}
            </h1>
          </div>
          <span className={`px-4 py-2 text-sm font-medium rounded-full ${statusColor} capitalize`}>
            {task.status.replace("_", " ")}
          </span>
        </div>

        {/* Task Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Module Type:</strong> {task.module_type}
            </div>
            <div>
              <strong>Priority:</strong>{" "}
              <span className={priorityColor}>{task.priority}</span>
            </div>
            <div>
              <strong>Progress:</strong> {task.progress_percentage}%
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${task.progress_percentage}%` }}
                ></div>
              </div>
            </div>
            <div>
              <strong>Due Date:</strong> {formatDate(task.due_date)}
            </div>
{/* Assigned To */}
<div className="flex items-center gap-2">
  <strong>Assigned To:</strong>
  {task.assigned_user ? (
    <div className="flex items-center gap-2">
      {task.assigned_user.avatar ? (
        <img
          src={`/storage/${task.assigned_user.avatar}`}
          alt={task.assigned_user.name}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 text-white flex items-center justify-center font-medium">
          {task.assigned_user.name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()}
        </div>
      )}
      <span>{task.assigned_user.name}</span>
    </div>
  ) : (
    <span>-</span>
  )}
</div>

{/* Created By */}
<div className="flex items-center gap-2">
  <strong>Created By:</strong>
  {task.created_by ? (
    <div className="flex items-center gap-2">
      {task.created_by.avatar ? (
        <img
          src={`/storage/${task.created_by.avatar}`}
          alt={task.created_by.name}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 text-white flex items-center justify-center font-medium">
          {task.created_by.name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()}
        </div>
      )}
      <span>{task.created_by.name}</span>
    </div>
  ) : (
    <span>-</span>
  )}
</div>

          </div>

          <div>
            <strong>Description:</strong>
            <p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed">{task.description || "-"}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link
            href={route("projects.tasks.edit", [project.id, task.id])}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Edit
          </Link>
          <Link
            href={route("projects.tasks.index", project.id)}
            className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Back to List
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
