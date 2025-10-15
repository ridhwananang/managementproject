import React from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Users, FolderOpen, BarChart3, ArrowLeft } from "lucide-react";

type Task = {
  task_id: number;
  title: string;
  description: string;
  status: string;
  progress: number;
};

type Sprint = {
  sprint_id: number;
  sprint_name: string;
  sprint_progress: number;
  tasks: Task[];
};

type Report = {
  project_id: number;
  project_name: string;
  progress_percentage: number;
  details: Sprint[];
  project_members: { user: { name: string } }[];
};

type Props = {
  report: Report;
};

function renderStatusBadge(status: string) {
  const map: Record<string, string> = {
    todo: "bg-gray-200 text-gray-700",
    in_progress: "bg-yellow-200 text-yellow-800",
    review: "bg-blue-200 text-blue-800",
    done: "bg-green-200 text-green-800",
  };
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm uppercase tracking-wide ${map[status] || "bg-gray-100"}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default function Show({ report }: Props) {
  return (
    <AppLayout>
      <div className="p-8 space-y-10 ">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <FolderOpen className="text-blue-500 w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {report.project_name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Project Performance Overview
              </p>
            </div>
          </div>

          <Link
            href="/report"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to Reports
          </Link>
        </div>

        {/* PROJECT SUMMARY */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition hover:shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <BarChart3 className="text-green-500" /> Project Progress
              </h2>
              <span className="text-gray-700 dark:text-gray-300 font-semibold">
                {report.progress_percentage}%
              </span>
            </div>
            <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 transition-all duration-700"
                style={{ width: `${report.progress_percentage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition hover:shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-3">
              <Users className="text-indigo-500" /> Developers
            </h2>
            <div className="flex flex-wrap gap-2">
              {report.project_members.length > 0 ? (
                report.project_members.map((m) => (
                  <span
                    key={m.user.name}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 dark:from-gray-700 dark:to-gray-600 dark:text-gray-200 shadow-sm"
                  >
                    {m.user.name}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No members assigned.</p>
              )}
            </div>
          </div>
        </div>

        {/* SPRINTS */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Sprint Reports
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.details.map((sprint) => (
              <div
                key={sprint.sprint_id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {sprint.sprint_name}
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {sprint.sprint_progress}%
                  </span>
                </div>

                <div className="px-6 pt-3 pb-5">
                  {/* Sprint Progress Bar */}
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-5">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 transition-all"
                      style={{ width: `${sprint.sprint_progress}%` }}
                    ></div>
                  </div>

                  {/* TASKS */}
                  <ul className="space-y-3">
                    {sprint.tasks.map((task) => (
                      <li
                        key={task.task_id}
                        className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-600"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-800 dark:text-gray-100">
                            {task.title}
                          </span>
                          {renderStatusBadge(task.status)}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-300 mb-2">
                          {task.description}
                        </p>

                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-600 transition-all"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
