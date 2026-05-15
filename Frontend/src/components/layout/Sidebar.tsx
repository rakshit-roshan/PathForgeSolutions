"use client";

import { useAuth } from "@/contexts/AuthContext";
import { siteConfig } from "@/config/site.config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  Users,
  Mail,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const candidateLinks = [
    { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { label: "Daily Logs", path: "/dashboard/daily-log", icon: CalendarDays },
    { label: "Export Report", path: "/dashboard/report", icon: FileText },
  ];

  const adminLinks = [
    { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { label: "Candidates", path: "/dashboard/candidates", icon: Users },
    { label: "Send Mail", path: "/dashboard/mail", icon: Mail },
  ];

  const links = user?.role === "ADMIN" ? adminLinks : candidateLinks;

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-white border-r border-slate-200 flex flex-col ${
        isOpen ? "w-64" : "w-20"
      } pt-16`}
    >
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <ul className="space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.path;
            const Icon = link.icon;
            return (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`flex items-center p-3 rounded-lg transition-colors group ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  title={!isOpen ? link.label : ""}
                >
                  <Icon size={22} className={`shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                  {isOpen && <span className="ml-3 whitespace-nowrap">{link.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-3 border-t border-slate-200">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard/settings"
              className="flex items-center p-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors group"
              title={!isOpen ? "Settings" : ""}
            >
              <Settings size={22} className="shrink-0 text-slate-400 group-hover:text-slate-600" />
              {isOpen && <span className="ml-3">Settings</span>}
            </Link>
          </li>
          <li>
            <button
              onClick={logout}
              className="flex items-center w-full p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors group"
              title={!isOpen ? "Logout" : ""}
            >
              <LogOut size={22} className="shrink-0 text-red-500 group-hover:text-red-600" />
              {isOpen && <span className="ml-3">Logout</span>}
            </button>
          </li>
        </ul>
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-colors z-50"
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </aside>
  );
}
