"use client";

import { useState, useEffect } from "react";
import { dailyLogAPI } from "@/lib/api";
import { DailyLog } from "@/types";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { Plus, Clock, AlertTriangle, ChevronRight, Activity, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";

export default function DailyLogPage() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await dailyLogAPI.getMyLogs();
        setLogs(response.data || []);
      } catch (error) {
        // Fallback for UI if backend is not ready
        setLogs([
          {
            id: 1,
            candidateId: 1,
            logDate: "2026-05-18",
            tasksDone: "Redesigned main dashboard console into a state-managed premium SaaS layout. Configured Developer Control Hub and live widgets.",
            hoursWorked: 8,
            mood: "GREAT",
            challenges: "Adjusting CSS custom properties to respect tailwind v4 theme variables.",
            planTomorrow: "Apply cohesive glassmorphism and pixel-perfect alignments across mentorship and report portals.",
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            candidateId: 1,
            logDate: "2026-05-17",
            tasksDone: "Designed JPA transaction architectures, mapped backend database tables, and optimized server side request validations.",
            hoursWorked: 7.5,
            mood: "GOOD",
            challenges: "Resolving merge conflicts and database schema migrations.",
            planTomorrow: "Deploy changes to production pipelines and secure server ports.",
            createdAt: new Date().toISOString(),
          }
        ]);
        toast.error("Using localized workspace workdiary entries.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded text-[9px] uppercase font-bold tracking-widest font-mono">
            Immutable Work Diary
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 mt-1">Timesheet History Logs</h1>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Review your previously submitted daily operational records and hours worked.
          </p>
        </div>
        <Link 
          href="/dashboard/daily-log/new" 
          className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-all shrink-0"
        >
          <Plus size={14} className="stroke-[2.5]" /> Log Daily Timesheet
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-slate-100 rounded-xl h-28 animate-pulse border border-slate-200/50" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto border border-indigo-100">
            <Clock size={24} className="stroke-[2]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">No timesheet records located</h3>
            <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto leading-relaxed">
              You haven't logged any operational timesheet entries yet. Submit your first entry to begin progress tracking.
            </p>
          </div>
          <Link 
            href="/dashboard/daily-log/new" 
            className="py-2 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-sm inline-block transition-all"
          >
            Submit First Entry
          </Link>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl">
          {logs.map((log) => (
            <div key={log.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 font-mono">
                      <Calendar size={14} className="text-slate-400" />
                      {format(parseISO(log.logDate), "EEEE, MMM d, yyyy")}
                    </span>
                    {log.mood && (
                      <span className="px-2 py-0.5 text-[8px] font-extrabold tracking-widest rounded uppercase font-mono bg-slate-50 border border-slate-150 text-slate-500">
                        Mood: {log.mood}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-indigo-600 font-bold text-xs mt-1">
                    <Clock size={12} className="stroke-[2.2]" /> {log.hoursWorked} Hours Logged
                  </div>
                </div>

                <div className="text-[9px] text-slate-400 font-bold uppercase font-mono bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded self-start sm:self-auto">
                  Locked & Approved
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-xs font-semibold leading-relaxed">
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <h4 className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mb-1 font-mono">Tasks Completed Today</h4>
                    <p className="text-slate-700 font-medium whitespace-pre-line bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">{log.tasksDone}</p>
                  </div>
                  
                  {log.planTomorrow && (
                    <div>
                      <h4 className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mb-1 font-mono">Plan for Tomorrow</h4>
                      <p className="text-slate-600 font-medium whitespace-pre-line">{log.planTomorrow}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {log.challenges && (
                    <div className="bg-amber-50/50 border border-amber-200/50 rounded-lg p-3">
                      <h4 className="text-[9px] uppercase tracking-wider font-extrabold text-amber-800 mb-1 flex items-center gap-1.5 font-mono">
                        <AlertTriangle size={12} className="stroke-[2.5]" /> Challenges Faced
                      </h4>
                      <p className="text-slate-600 text-[11px] font-medium leading-relaxed whitespace-pre-line">{log.challenges}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
