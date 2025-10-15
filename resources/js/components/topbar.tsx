import React, { Fragment, useState, useEffect } from "react";
import { Bell, Sun, Moon, Menu as MenuIcon } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import { usePage, Link } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function Topbar({
  setSidebarOpen,
}: {
  setSidebarOpen?: (open: boolean) => void;
}) {
  const { auth } = (usePage().props as unknown) as {
    auth: { user: { id: number; name: string; email: string; avatar?: string } };
  };

  const [theme, setTheme] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme")
      ? localStorage.getItem("theme")!
      : "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme || "light");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className="sticky top-0 z-40 flex justify-between items-center px-6 py-3 
      bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl 
      border-b border-gray-200/50 dark:border-gray-700/50
      shadow-md"
    >
      <div className="flex items-center gap-4">
        {/* Tombol Toggle Sidebar (Mobile) */}
        {setSidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-full hover:bg-blue-500/10 dark:hover:bg-blue-500/20 transition"
          >
            <MenuIcon size={24} />
          </button>
        )}

        {/* Branding / Title */}
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          Project Management
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark/Light toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-blue-500/10 dark:hover:bg-blue-500/20 transition"
        >
          {theme === "dark" ? (
            <Sun size={20} className="text-yellow-400" />
          ) : (
            <Moon size={20} className="text-gray-700" />
          )}
        </button>

        {/* Bell notification */}
        <button className="relative p-2 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 rounded-full transition group">
          <Bell
            size={20}
            className="text-gray-600 dark:text-gray-300 group-hover:text-blue-500"
          />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full shadow-sm"></span>
        </button>

        {/* User Dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-2 cursor-pointer focus:outline-none">
            {auth.user.avatar ? (
              <img
                src={`/storage/${auth.user.avatar}`}
                alt={auth.user.name}
                className="w-9 h-9 rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                {auth.user.name.charAt(0)}
              </div>
            )}
            <span className="font-medium hidden sm:inline">{auth.user.name}</span>
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="transform opacity-0 translate-y-1 scale-95"
            enterTo="transform opacity-100 translate-y-0 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="transform opacity-100 translate-y-0 scale-100"
            leaveTo="transform opacity-0 translate-y-1 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-3 w-48 origin-top-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden z-50 ring-1 ring-black/5">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/profile"
                      className={`flex items-center gap-2 px-4 py-2 text-sm transition ${
                        active
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      👤 Profile
                    </Link>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href={route("users.edit", auth.user.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm transition ${
                        active
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      ⚙️ Settings
                    </Link>
                  )}
                </Menu.Item>

                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href={route("logout")}
                      method="post"
                      as="button"
                      className={`w-full flex items-center gap-2 text-left px-4 py-2 text-sm transition ${
                        active
                          ? "bg-red-500/10 text-red-600 dark:text-red-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      🚪 Logout
                    </Link>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}
