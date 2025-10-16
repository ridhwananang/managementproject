import React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface ActivityLog {
  id: number;
  user?: User | null;
  action: string;
  description: string;
  subject_type: string;
  subject_id: number;
  changes?: {
    old?: Record<string, any>;
    new?: Record<string, any>;
  } | null;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
}

interface Props {
  logs: ActivityLog[];
}

export default function Index({ logs }: Props) {
  const getActionColor = (action: string) => {
    switch (action) {
      case "created":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30";
      case "updated":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30";
      case "deleted":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <AppLayout>
      <Head title="Activity Logs" />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6 transition-colors duration-300">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
              📜 Activity Logs
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sistem mencatat setiap perubahan dan aksi pengguna.
            </p>
          </div>
        </div>

        {/* Logs Card */}
        <div className="bg-white/70 dark:bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Riwayat Aktivitas Sistem
            </h2>
          </div>

          <ScrollArea className="h-[65vh] px-6">
            {logs.length === 0 ? (
              <div className="py-20 text-center text-gray-500 dark:text-gray-400 text-sm">
                Tidak ada aktivitas yang tercatat. 😴
              </div>
            ) : (
              logs.map((log, idx) => (
                <div key={log.id}>
                  <div className="flex items-start gap-4 py-4">
                    {/* Avatar */}
                    <img
                      src={
                        log.user?.avatar
                          ? `/storage/${log.user.avatar}`
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              log.user?.name ?? "System"
                            )}&background=random`
                      }
                      alt={log.user?.name ?? "System"}
                      className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 shadow-sm"
                    />

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {log.user?.name ?? "System"}
                        </span>
                        <Badge
                          className={`${getActionColor(
                            log.action
                          )} text-xs capitalize rounded-full px-2 py-0.5`}
                        >
                          {log.action}
                        </Badge>
                      </div>

                      <p
                        className="text-sm mt-1 text-gray-700 dark:text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: log.description,
                        }}
                      />

                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(log.created_at).toLocaleString("id-ID")} ·{" "}
                        <span className="text-gray-600 dark:text-gray-500">
                          {log.ip}
                        </span>
                      </div>
                    </div>
                  </div>

                  {idx !== logs.length - 1 && (
                    <Separator className="bg-gray-200 dark:bg-gray-800" />
                  )}
                </div>
              ))
            )}
          </ScrollArea>
        </div>
      </div>
    </AppLayout>
  );
}
