import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Briefcase, CheckCircle, Users, Wallet } from "lucide-react";

interface Stats {
  totalProjects: number;
  tasksInProgress: number;
  activeMembers: number;
  totalBudget: number;
}

export default function Dashboard({ stats }: { stats: Stats }) {
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <AppLayout>
      <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>

      <div className="grid md:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="relative bg-white dark:bg-neutral-800 p-4 rounded-xl shadow overflow-hidden">
          <Briefcase className="absolute -top-4 -right-4 w-24 h-24 opacity-10 text-green-400 dark:text-neutral-700 transform rotate-45 z-0" />
          <p className="text-sm text-neutral-500 relative z-10">Total Projects</p>
          <h3 className="text-3xl font-bold mt-1 relative z-10">{stats.totalProjects}</h3>
        </div>

        {/* Tasks In Progress */}
        <div className="relative bg-white dark:bg-neutral-800 p-4 rounded-xl shadow overflow-hidden">
          <CheckCircle className="absolute -top-4 -right-4 w-24 h-24 opacity-10 text-green-400 dark:text-neutral-700 transform -rotate-12 z-0" />
          <p className="text-sm text-neutral-500 relative z-10">Tasks In Progress</p>
          <h3 className="text-3xl font-bold mt-1 relative z-10">{stats.tasksInProgress}</h3>
        </div>

        {/* Active Members */}
        <div className="relative bg-white dark:bg-neutral-800 p-4 rounded-xl shadow overflow-hidden">
          <Users className="absolute -top-4 -right-4 w-24 h-24 opacity-10 text-green-400 dark:text-neutral-700 transform rotate-30 z-0" />
          <p className="text-sm text-neutral-500 relative z-10">Active Members</p>
          <h3 className="text-3xl font-bold mt-1 relative z-10">{stats.activeMembers}</h3>
        </div>

        {/* Total Budget */}
        <div className="relative bg-white dark:bg-neutral-800 p-4 rounded-xl shadow overflow-hidden">
          <Wallet className="absolute -top-4 -right-4 w-24 h-24 opacity-10 text-green-400 transform rotate-12 z-0" />
          <p className="text-sm text-neutral-500 relative z-10">Total Budget</p>
          <h3 className="text-2xl font-bold mt-1 relative z-10">{formatRupiah(stats.totalBudget)}</h3>
        </div>
      </div>
    </AppLayout>
  );
}
