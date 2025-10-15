import { Home, FolderKanban, Clock, Users, Menu } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { useEffect } from "react";

const menu = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Projects", icon: FolderKanban, href: "/projects" },
  { name: "Timelog", icon: Clock, href: "/activity-logs" },
  { name: "Members", icon: Users, href: "/users" },
  { name: "Reports", icon: Clock, href: "/report" }, // Placeholder, adjust as needed
];

export default function Sidebar({
  isOpen,
  setSidebarOpen,
}: {
  isOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const { url } = usePage();

  // Tutup sidebar otomatis kalau layar kecil dan resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // Pastikan tetap terbuka di desktop
      } else {
        setSidebarOpen(false); // Tutup di mobile
      }
    };
    handleResize(); // panggil sekali di awal
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  return (
    <>
      {/* Toggle Button (Mobile Only) */}
      {!isOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-red-600 rounded-md text-white md:hidden shadow-md"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Overlay (klik luar untuk menutup di mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 
          bg-gradient-to-b from-red-600 to-orange-400 
          text-white flex flex-col shadow-md rounded-r-2xl
          transform transition-transform duration-300 ease-in-out
          z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        {/* Background Icon */}
        <div className="absolute bottom-[-20px] right-[-20px] text-[180px] font-extrabold text-white/10 select-none rotate-[-25deg] z-0 pointer-events-none">
          &lt;/&gt;
        </div>

        {/* Header Title */}
        <div className="relative z-10 p-3 text-3xl font-extrabold tracking-tight text-right drop-shadow-lg leading-tight">
          <p>Project </p>
          <span className="text-yellow-300">Management</span>
          <p>System</p>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 space-y-2 px-4 mt-2 overflow-y-auto">
          {menu.map(({ name, icon: Icon, href }) => {
            const isActive = url.startsWith(href);
            return (
              <Link
                key={name}
                href={href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-white/25 backdrop-blur-md shadow-lg scale-[1.02]"
                    : "hover:bg-white/10 hover:scale-[1.02]"
                }`}
                onClick={() => {
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-yellow-300" : "text-white"}
                />
                <span className="text-sm font-medium">{name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="relative z-10 text-xs text-center text-white p-4">
          © {new Date().getFullYear()} SysManagePro
        </div>
      </aside>
    </>
  );
}
