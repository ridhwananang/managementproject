import React from "react";
import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Edit3, Trash2 } from "lucide-react";

interface Project {
  id: number;
  name: string;
}

interface Sprint {
  id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: "planned" | "in_progress" | "completed";
}

export default function Index({ project, sprints }: { project: Project; sprints: Sprint[] }) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: Sprint["status"]) => {
    switch (status) {
      case "planned":
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
      case "in_progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100";
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <AppLayout>
      <Head title={`Sprints - ${project.name}`} />

      <div className="max-w-6xl mx-auto mt-10 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
              Sprints for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                {project.name}
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Manage and track all sprints under this project
            </p>
          </div>
          <Link href={route("projects.sprints.create", project.id)}>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg hover:opacity-90 transition">
              + New Sprint
            </Button>
          </Link>
        </div>

        {/* Sprint Cards */}
        {sprints.length === 0 ? (
          <div className="text-center py-14 border border-dashed rounded-2xl bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No sprints yet. Let’s get things rolling 🚀
            </p>
            <Link
              href={route("projects.sprints.create", project.id)}
              className="mt-4 inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-lg shadow hover:opacity-90 transition"
            >
              + Create Sprint
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sprints.map((sprint) => (
              <Card
                key={sprint.id}
                className="relative border-none bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {sprint.name}
                    </CardTitle>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(
                        sprint.status
                      )}`}
                    >
                      {sprint.status.replace("_", " ")}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm">
                    {sprint.description || "No description provided."}
                  </p>

                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2 mb-4">
                    <CalendarDays size={14} />
                    <span>
                      <strong>Start:</strong> {formatDate(sprint.start_date)} —{" "}
                      <strong>End:</strong> {formatDate(sprint.end_date)}
                    </span>
                  </div>

                  {/* Actions */}
{/* Actions */}
<div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
  <Link
    href={route("projects.sprints.edit", [project.id, sprint.id])}
    className="flex items-center gap-2 px-4 py-2 rounded-lg 
      bg-gradient-to-r from-indigo-500 to-purple-600 
      text-white text-sm font-medium shadow-md 
      hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90 
      active:translate-y-0 transition-all duration-200"
  >
    <Edit3 size={15} className="opacity-90" />
    Edit
  </Link>

  <Link
    href={route("projects.sprints.destroy", [project.id, sprint.id])}
    method="delete"
    as="button"
    className="flex items-center gap-2 px-4 py-2 rounded-lg 
      bg-gradient-to-r from-rose-500 to-red-600 
      text-white text-sm font-medium shadow-md 
      hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90 
      active:translate-y-0 transition-all duration-200"
  >
    <Trash2 size={15} className="opacity-90" />
    Delete
  </Link>
</div>

                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
