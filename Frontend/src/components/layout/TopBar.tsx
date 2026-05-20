"use client";

import { useAuth } from "@/contexts/AuthContext";
import { siteConfig } from "@/config/site.config";
import Link from "next/link";
import { Menu, Bell, User as UserIcon } from "lucide-react";
import { dashboardLocale } from "@/config/dashboard.locale";

export default function TopBar({
  toggleMobileSidebar,
}: {
  toggleMobileSidebar: () => void;
}) {
  const { user } = useAuth();
  const locale = dashboardLocale.common;

  return (
    <header className="dashboard-topbar fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100/80 rounded-md transition-colors"
        >
          <Menu size={24} />
        </button>
        <Link href="/" className="font-bold text-xl text-indigo-600 tracking-tight hover:opacity-90 transition-opacity">
          {siteConfig.shortName} <span className="text-slate-800 font-medium hidden sm:inline text-sm bg-slate-100 px-2 py-0.5 rounded-full ml-1.5 border border-slate-200/50">Workspace</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-600 bell-shake-hover relative transition-colors focus:outline-none">
          <Bell size={20} className="stroke-[1.8]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200/80">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-slate-800 leading-tight">
              {user?.name || "User"}
            </p>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-0.5">
              {user?.role === "ADMIN" ? "Administrator" : "Candidate"}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-50 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/60 shadow-sm">
            <UserIcon size={18} className="stroke-[1.8]" />
          </div>
        </div>
      </div>
    </header>
  );
}
