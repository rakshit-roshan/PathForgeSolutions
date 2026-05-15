"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Users, FileText, CalendarDays, TrendingUp, Download, Plus, Mail } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { adminAPI } from "@/lib/api";
import { AdminStats } from "@/types";
import { toast } from "react-hot-toast";

export default function DashboardOverview() {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
          Welcome back, {user.name?.split(" ")[0] || "User"}! 👋
        </h1>
        <p className="text-slate-600">
          {user.role === "ADMIN" 
            ? "Here's what's happening across the internship program today."
            : "Track your progress, log your daily tasks, and generate your report."}
        </p>
      </div>

      {user.role === "ADMIN" ? <AdminOverview /> : <CandidateOverview user={user} />}
    </div>
  );
}

function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getStats();
        setStats(response.data);
      } catch (error) {
        // Fallback for UI if backend is not ready
        setStats({
          totalCandidates: 24,
          activeCandidates: 18,
          completedCandidates: 5,
          onHoldCandidates: 1,
          logsSubmittedToday: 12,
          logsSubmittedThisWeek: 64,
          averageHoursPerDay: 5.2,
        });
        toast.error("Failed to load real stats. Showing sample data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="animate-pulse space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
      </div>
    </div>;
  }

  const statCards = [
    { label: "Active Candidates", value: stats?.activeCandidates || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Logs Today", value: stats?.logsSubmittedToday || 0, icon: CalendarDays, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Completed", value: stats?.completedCandidates || 0, icon: FileText, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Candidates", value: stats?.totalCandidates || 0, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="card p-6 flex flex-col">
            <div className={`w-12 h-12 rounded-full ${card.bg} ${card.color} flex items-center justify-center mb-4`}>
              <card.icon size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-800 mb-1">{card.value}</p>
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-lg text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/candidates" className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-colors">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Users size={20} /></div>
              <span className="font-medium text-slate-700">View Candidates</span>
            </Link>
            <Link href="/dashboard/mail" className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-colors">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Mail size={20} /></div>
              <span className="font-medium text-slate-700">Send Emails</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CandidateOverview({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CalendarDays size={20} className="text-indigo-600" /> Current Status
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Internship Track</p>
              <p className="font-medium text-slate-800">{user.internshipTrack || "Not Assigned"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Status</p>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                user.status === "COMPLETED" ? "badge-completed" : 
                user.status === "ON_HOLD" ? "badge-on-hold" : "badge-active"
              }`}>
                {user.status || "ACTIVE"}
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-indigo-50 to-cyan-50 border-indigo-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <Link 
              href="/dashboard/daily-log/new" 
              className="btn-primary w-full justify-start py-3 shadow-sm hover:shadow-md"
            >
              <Plus size={18} className="mr-2" /> Add Today's Log
            </Link>
            <Link 
              href="/dashboard/report" 
              className="btn-outline w-full justify-start py-3 bg-white"
            >
              <Download size={18} className="mr-2" /> Generate Final Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
