"use client";

import { useAuth } from "@/contexts/AuthContext";
import { siteConfig } from "@/config/site.config";
import Link from "next/link";
import { Menu, Bell, User as UserIcon } from "lucide-react";

export default function TopBar({
  toggleMobileSidebar,
}: {
  toggleMobileSidebar: () => void;
}) {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-md"
        >
          <Menu size={24} />
        </button>
        <Link href="/" className="font-bold text-xl text-indigo-700">
          {siteConfig.shortName} <span className="text-slate-800 hidden sm:inline">Workspace</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-600 relative">
          <Bell size={20} />
          {/* <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span> */}
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-slate-700 leading-tight">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-slate-500 font-medium">
              {user?.role === "ADMIN" ? "Administrator" : "Candidate"}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-200">
            <UserIcon size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
