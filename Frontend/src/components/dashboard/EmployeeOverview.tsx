"use client";
import { useState, useEffect, useRef } from "react";
import { Download, Plus, ChevronRight, ExternalLink } from "lucide-react";

interface Log { id: number; logDate: string; hoursWorked: number; tasksDone: string; mood: string; tools: string[]; }

export default function EmployeeOverview({ logs, user, roleLabel, onNavigate }: {
  logs: Log[]; user: any; roleLabel: string; onNavigate: (s: string) => void;
}) {
  const totalHours = logs.reduce((s, l) => s + l.hoursWorked, 0);
  const durationMonths = user?.internshipDurationMonths || 6;
  const targetHours = durationMonths * 40;
  const pct = Math.min(Math.round((totalHours / targetHours) * 100), 100);
  const r = 54; const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  const taskTotal = 12;
  const taskDone = logs.length > 0 ? Math.min(logs.length, taskTotal) : 0;
  const taskPct = Math.round((taskDone / taskTotal) * 100);
  const taskOffset = circ - (taskPct / 100) * circ;

  // Bar chart data — aligned dynamically with calendar week
  const getStartOfWeek = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const startOfWeek = getStartOfWeek();
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxH = 10;
  
  const chartData = weekDays.map((d, idx) => {
    const targetDate = new Date(startOfWeek);
    targetDate.setDate(startOfWeek.getDate() + idx);
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const date = String(targetDate.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${date}`;
    
    const matchingLog = logs.find(l => l.logDate === dateStr);
    const hrs = matchingLog ? matchingLog.hoursWorked : 0;
    return {
      day: d,
      hrs,
      pct: (hrs / maxH) * 100,
    };
  });

  const [animChart, setAnimChart] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimChart(true); }, { threshold: 0.3 });
    if (chartRef.current) obs.observe(chartRef.current);
    return () => obs.disconnect();
  }, []);

  const assignments = [
    { id: "A1", name: "Onboarding Module Review", dept: "Human Resources", due: "Assigned by Admin", status: "PENDING" },
    { id: "A2", name: "Internal API Documentation", dept: "Engineering", due: "Assigned by Admin", status: "PENDING" },
  ];

  const meetings = [
    { title: "Weekly Standup", time: "Tomorrow, 09:30 AM", type: "GROUP", link: "#" },
    { title: "Mentorship Session", time: "Friday, 02:00 PM", type: "1-ON-1", link: "#" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero strip */}
      <div className="glass-card p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#003ec7] font-mono">Workspace Active</p>
          <p className="text-sm font-semibold text-[#191c1e] mt-0.5">
            Welcome back, <span className="text-[#003ec7]">{user?.name}</span>. Your logs are synchronized.
          </p>
        </div>
        <button
          onClick={() => onNavigate("LOGS")}
          className="pf-btn-primary flex items-center gap-2 text-[11px]"
        >
          <Plus size={14} /> Log Today
        </button>
      </div>

      {/* Progress Rings + Chart row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Progress rings */}
        <div className="lg:col-span-5 glass-card p-7">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-base font-semibold text-[#191c1e]">Internship Milestones</h3>
              <p className="text-xs text-[#505f76] mt-0.5">Track your progress against targets</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-8 py-2">
            {/* Ring 1 */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r={r} fill="transparent" stroke="#e0e3e5" strokeWidth="9" />
                  <circle cx="60" cy="60" r={r} fill="transparent" stroke="#003ec7" strokeWidth="9"
                    strokeDasharray={circ} strokeDashoffset={offset}
                    strokeLinecap="round" transform="rotate(-90 60 60)"
                    style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)" }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-[#003ec7]">{pct}%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#434656]">Internship Hours</p>
                <p className="text-xs text-[#505f76] mt-0.5">{totalHours} / {targetHours} hrs</p>
              </div>
            </div>
            {/* Ring 2 */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r={r} fill="transparent" stroke="#e0e3e5" strokeWidth="9" />
                  <circle cx="60" cy="60" r={r} fill="transparent" stroke="#bf3003" strokeWidth="9"
                    strokeDasharray={circ} strokeDashoffset={taskDone > 0 ? taskOffset : circ}
                    strokeLinecap="round" transform="rotate(-90 60 60)"
                    style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1) 0.2s" }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-lg font-bold ${taskDone > 0 ? "text-[#bf3003]" : "text-[#c3c5d9]"}`}>
                    {taskDone > 0 ? `${taskPct}%` : "--%"}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#434656]">Task Completion</p>
                <p className="text-xs text-[#505f76] mt-0.5">{taskDone} / {taskTotal} Assigned</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-[#c3c5d9]/30 flex items-center gap-2 text-xs text-[#505f76]">
            <span className="material-symbols-outlined text-[16px]">info</span>
            Next sync scheduled for 00:00 UTC
          </div>
        </div>

        {/* Bar chart */}
        <div className="lg:col-span-7 glass-card p-7" ref={chartRef}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-base font-semibold text-[#191c1e]">Day-to-Day Effort</h3>
              <p className="text-xs text-[#505f76]">Hours logged this week</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#003ec7]/10 text-[#003ec7]">Daily</button>
              <button className="px-3 py-1 rounded-full text-[11px] font-medium text-[#505f76] hover:bg-[#eceef0] transition-colors">Weekly</button>
            </div>
          </div>

          {logs.length > 0 ? (
            <div className="flex items-end justify-between gap-2 h-40 px-2">
              {chartData.map((d, i) => (
                <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-[10px] font-bold text-[#505f76]">{d.hrs > 0 ? `${d.hrs}h` : ""}</span>
                  <div className="w-full flex items-end justify-center h-28 relative">
                    <div
                      className="w-full rounded-t-lg bg-[#003ec7] transition-all"
                      style={{
                        height: animChart ? `${Math.max(d.pct, 3)}%` : "0%",
                        transitionDelay: `${i * 80}ms`,
                        transitionDuration: "0.7s",
                        transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
                        opacity: d.hrs > 0 ? 1 : 0.15,
                        background: d.hrs >= 8
                          ? "linear-gradient(180deg,#0052ff,#003ec7)"
                          : d.hrs > 0
                          ? "linear-gradient(180deg,#4f73e0,#003ec7)"
                          : "#e0e3e5",
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-[#737688]">{d.day}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center border border-dashed border-[#c3c5d9] rounded-2xl bg-[#f7f9fb]/50">
              <span className="material-symbols-outlined text-5xl text-[#c3c5d9] mb-2">monitoring</span>
              <p className="text-sm font-medium text-[#434656]">No tracking activity yet</p>
              <p className="text-xs text-[#505f76] mt-1">Start your daily log to see effort visualization.</p>
            </div>
          )}

          <div className="mt-4 flex gap-5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#003ec7]" />
              <span className="text-xs text-[#505f76]">Actual Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#e0e3e5]" />
              <span className="text-xs text-[#505f76]">No Activity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-[#c3c5d9]/30 flex justify-between items-center">
          <div>
            <h3 className="text-base font-semibold text-[#191c1e]">Pending vs Completed Assignments</h3>
            <p className="text-xs text-[#505f76] mt-0.5">Current active task pipeline</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffdad6]/40 text-[#93000a]">
            <span className="material-symbols-outlined text-[14px]">lock_clock</span>
            <span className="text-[11px] font-bold">Admin Approval Pending</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f2f4f6]/50">
              <tr>
                {["Assignment", "Department", "Due Date", "Status", ""].map(h => (
                  <th key={h} className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#505f76]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3c5d9]/20">
              {assignments.map(a => (
                <tr key={a.id} className="pf-table-row hover:bg-[#003ec7]/[0.02]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#eceef0] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#737688] text-[18px]">draft</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#191c1e]">{a.name}</p>
                        <p className="text-[11px] text-[#505f76]">Ref: {a.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#505f76]">{a.dept}</td>
                  <td className="px-6 py-4 text-sm text-[#505f76]">{a.due}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#e0e3e5] text-[#434656]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#737688]" />
                      Not Started
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#003ec7] text-[11px] font-bold hover:underline">View Brief</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-[#f2f4f6]/30 text-center">
          <button className="flex items-center gap-1.5 text-[#505f76] text-[11px] font-bold hover:text-[#003ec7] mx-auto transition-colors">
            Show All Assignments <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Meetings */}
      <div className="glass-card p-6">
        <h3 className="text-base font-semibold text-[#191c1e] mb-4">Upcoming Meetings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetings.map((m, i) => (
            <div key={i} className="p-4 rounded-2xl border border-[#c3c5d9]/40 hover:border-[#003ec7]/40 transition-all group cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#003ec7]/10 text-[#003ec7] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined">{m.type === "GROUP" ? "groups" : "lightbulb"}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#191c1e]">{m.title}</p>
                  <p className="text-[11px] text-[#505f76] mt-0.5">{m.time}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#d3e4fe] text-[#38485d]">{m.type}</span>
                    <a href={m.link} className="flex items-center gap-1 text-[11px] text-[#003ec7] font-bold hover:underline">
                      Join <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick PDF compile */}
      <div className="glass-card p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#003ec7]/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#003ec7]">picture_as_pdf</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#191c1e]">Generate Official Report PDF</p>
            <p className="text-xs text-[#505f76]">Compile all logs into a university-ready document</p>
          </div>
        </div>
        <button onClick={() => onNavigate("REPORT")} className="pf-btn-primary flex items-center gap-2 text-[11px] whitespace-nowrap">
          <Download size={14} /> Generate PDF
        </button>
      </div>
    </div>
  );
}
