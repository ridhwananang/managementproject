import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import { Toaster } from "react-hot-toast";

interface AppLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export default function AppLayout({ title, children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 flex">
      {/* Head Title (SEO + Tab title) */}
      {title && <Head title={title} />}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Section */}
      <div
        className={`flex flex-col min-h-screen flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64`}
      >
        <Topbar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">{children}</main>
      </div>

      {/* Toast */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className:
            "max-w-sm border rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-3 shadow-lg transition-all duration-300",
          style: { fontFamily: "Inter, sans-serif" },
          success: {
            iconTheme: { primary: "#ea600aff", secondary: "#ffffff" },
            style: {
              background: "linear-gradient(90deg, #7400e1ff, #a56ae4ff)",
              color: "#ffffff",
              border: "1px solid #22c55e",
              boxShadow: "0 4px 14px rgba(34, 197, 94, 0.4)",
            },
          },
          error: {
            iconTheme: { primary: "#f87171", secondary: "#ffffff" },
            style: {
              background: "linear-gradient(90deg, #f87171, #ef4444)",
              color: "#ffffff",
              border: "1px solid #ef4444",
              boxShadow: "0 4px 14px rgba(239, 68, 68, 0.4)",
            },
          },
          loading: {
            iconTheme: { primary: "#2563eb", secondary: "#ffffff" },
            style: {
              background: "linear-gradient(90deg, #2563eb, #3b82f6)",
              color: "#ffffff",
              border: "1px solid #3b82f6",
              boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
            },
          },
        }}
      />
    </div>
  );
}
