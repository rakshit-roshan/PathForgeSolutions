"use client";

import { useState, useEffect } from "react";
import { dailyLogAPI } from "@/lib/api";
import { DailyLog } from "@/types";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { Plus, Clock, AlertCircle } from "lucide-react";
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
            logDate: "2026-05-14",
            tasksDone: "Completed React component migration. Started Next.js layout.",
            hoursWorked: 6,
            mood: "GOOD",
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            candidateId: 1,
            logDate: "2026-05-13",
            tasksDone: "Database schema design and API documentation.",
            hoursWorked: 5,
            challenges: "Understanding JPA relationships.",
            mood: "NEUTRAL",
            createdAt: new Date().toISOString(),
          }
        ]);
        toast.error("Failed to load real logs. Showing sample data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Daily Logs</h1>
          <p className="text-slate-600 mt-1">Track your daily progress and hours.</p>
        </div>
        <Link href="/dashboard/daily-log/new" className="btn-primary shrink-0">
          <Plus size={18} className="mr-2" /> Add Log
        </Link>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>)}
        </div>
      ) : logs.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No logs found</h3>
          <p className="text-slate-500 mb-6">You haven't submitted any daily logs yet.</p>
          <Link href="/dashboard/daily-log/new" className="btn-primary">
            Submit Your First Log
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {logs.map((log) => (
            <div key={log.id} className="card p-5 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg text-slate-800">
                      {format(parseISO(log.logDate), "EEEE, MMM d, yyyy")}
                    </span>
                    {log.mood && (
                      <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">
                        Mood: {log.mood}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-indigo-600 font-medium text-sm">
                    <Clock size={16} /> {log.hoursWorked} hours logged
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-1">Tasks Completed</h4>
                  <p className="text-slate-600 text-sm whitespace-pre-line">{log.tasksDone}</p>
                </div>
                
                {log.challenges && (
                  <div>
                    <h4 className="text-sm font-semibold text-amber-700 mb-1 flex items-center gap-1.5">
                      <AlertCircle size={14} /> Challenges Faced
                    </h4>
                    <p className="text-slate-600 text-sm whitespace-pre-line">{log.challenges}</p>
                  </div>
                )}

                {log.planTomorrow && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">Plan for Tomorrow</h4>
                    <p className="text-slate-600 text-sm whitespace-pre-line">{log.planTomorrow}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
