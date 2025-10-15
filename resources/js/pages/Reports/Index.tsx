import React from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Users, FolderOpen } from "lucide-react";

type Report = {
  project_id: number;
  project_name: string;
  project_description: string;
  progress_percentage: number;
  project_members: { user: { name: string } }[];
};

type Props = {
  reports: Report[];
};

export default function Index({ reports }: Props) {
  return (
    <AppLayout>
      <div className="p-6 space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
            <FolderOpen className="text-indigo-400" /> Development Reports
          </h1>
        </div>

        {/* REPORT GRID */}
        {reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((report) => (
              <div
                key={report.project_id}
                className="bg-[#1b243b]/80 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-lg hover:shadow-indigo-700/20 hover:scale-[1.02] transition-all duration-300 p-6 flex flex-col justify-between"
              >
                {/* Project Info */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-100 mb-1">
                    {report.project_name}
                  </h2>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                    {report.project_description || "No description available."}
                  </p>

                  {/* Members */}
                  <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
                    <Users size={16} className="text-indigo-400" />
                    <span>
                      {report.project_members.length > 0
                        ? report.project_members.map((m) => m.user.name).join(", ")
                        : "No members"}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner mb-1">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 transition-all duration-700"
                      style={{ width: `${report.progress_percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {report.progress_percentage}% Completed
                  </div>
                </div>

                {/* View Report Button */}
                <Link
                  href={`/report/${report.project_id}`}
                  className="mt-6 block text-center font-semibold text-indigo-100 bg-gradient-to-r from-indigo-600 to-purple-600 py-2 rounded-xl shadow-md hover:from-indigo-500 hover:to-purple-500 transition-all"
                >
                  View Report
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#1b243b]/60 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-inner">
            <p className="text-gray-400 text-lg">No reports available.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
