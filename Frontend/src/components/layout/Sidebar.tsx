"use client";

import { useAuth } from "@/contexts/AuthContext";
import { siteConfig } from "@/config/site.config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardLocale } from "@/config/dashboard.locale";
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
  FolderOpen,
  Compass,
  CheckSquare,
  FileSignature,
  Send,
  Users2,
  ShieldAlert,
  Inbox,
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
  const locale = dashboardLocale;

  const candidateLinks = [
    { label: locale.candidate.welcome.split(",")[0], path: "/dashboard", icon: LayoutDashboard },
    { label: locale.candidate.dailyLogForm.title, path: "/dashboard/daily-log", icon: CalendarDays },
    { label: locale.candidate.vault.title, path: "/dashboard/documents", icon: FolderOpen },
    { label: locale.candidate.mentorship.title.split("&")[0].trim(), path: "/dashboard/mentorship", icon: Compass },
    { label: locale.candidate.pdfReport.title.split(" ")[0] + " Report", path: "/dashboard/report", icon: FileText },
  ];

  const adminLinks = [
    { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { label: "Pipeline", path: "/dashboard/candidates", icon: Users },
    { label: "Timesheet Review", path: "/dashboard/review", icon: CheckSquare },
    { label: "Doc Issuer", path: "/dashboard/letters", icon: FileSignature },
    { label: "Outreach Desk", path: "/dashboard/outreach", icon: Send },
    { label: "Group Manager", path: "/dashboard/groups", icon: Users2 },
    { label: "Security Console", path: "/dashboard/security", icon: ShieldAlert },
    { label: "Inquiries Inbox", path: "/dashboard/enquiries", icon: Inbox },
  ];

  const links = user?.role === "ADMIN" ? adminLinks : candidateLinks;

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-white border-r border-slate-200/80 flex flex-col ${
        isOpen ? "w-64" : "w-20"
      } pt-16`}
    >
      <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
        <ul className="space-y-1.5">
          {links.map((link) => {
            const isActive = pathname === link.path;
            const Icon = link.icon;
            return (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`dashboard-sidebar-item flex items-center p-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "active font-medium text-indigo-600 bg-indigo-50/50"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  title={!isOpen ? link.label : ""}
                >
                  <Icon size={20} className={`shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"} transition-colors`} />
                  {isOpen && <span className="ml-3 whitespace-nowrap text-sm tracking-tight">{link.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-3 border-t border-slate-200/80">
        <ul className="space-y-1.5">
          <li>
            <Link
              href="/dashboard/settings"
              className="dashboard-sidebar-item flex items-center p-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 group"
              title={!isOpen ? "Settings" : ""}
            >
              <Settings size={20} className="shrink-0 text-slate-400 group-hover:text-slate-600 transition-colors" />
              {isOpen && <span className="ml-3 text-sm tracking-tight">Settings</span>}
            </Link>
          </li>
          <li>
            <button
              onClick={logout}
              className="flex items-center w-full p-3 rounded-lg text-red-600 hover:bg-red-50/60 transition-all duration-200 group focus:outline-none"
              title={!isOpen ? "Logout" : ""}
            >
              <LogOut size={20} className="shrink-0 text-red-500 group-hover:text-red-600 transition-colors" />
              {isOpen && <span className="ml-3 text-sm tracking-tight font-medium">Logout</span>}
            </button>
          </li>
        </ul>
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all duration-200 z-50 focus:outline-none"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>
    </aside>
  );
}
