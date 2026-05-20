"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Send, Lock } from "lucide-react";
import { dailyLogAPI } from "@/lib/api";
import type { LogMood } from "@/types";

interface LogEntry { id: number; logDate: string; hoursWorked: number; tasksDone: string; mood: string; tools: string[]; status?: string; revisionNote?: string; }

interface Props {
  logs: LogEntry[];
  onAddLog: (entry: LogEntry) => void;
}

const MOODS: { key: LogMood; label: string; icon: string; color: string }[] = [
  { key: "GREAT", label: "Focused", icon: "sentiment_very_satisfied", color: "#059669" },
  { key: "GOOD", label: "Balanced", icon: "sentiment_satisfied", color: "#003ec7" },
  { key: "NEUTRAL", label: "Stressed", icon: "sentiment_neutral", color: "#d97706" },
  { key: "DIFFICULT", label: "Burnt Out", icon: "sentiment_dissatisfied", color: "#ba1a1a" },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  APPROVED: { label: "Approved", cls: "badge-issued" },
  PENDING: { label: "Pending Review", cls: "badge-pending" },
  REVISION: { label: "Needs Revision", cls: "badge-error" },
};

export default function EmployeeLogs({ logs, onAddLog }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const hasToday = logs.some(l => l.logDate === today);

  const [hours, setHours] = useState(8.0);
  const [tasks, setTasks] = useState("");
  const [mood, setMood] = useState<LogMood>("GOOD");
  const [toolInput, setToolInput] = useState("");
  const [tools, setTools] = useState<string[]>([]);
  const [showCounsel, setShowCounsel] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const addTool = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && toolInput.trim()) {
      e.preventDefault();
      if (!tools.includes(toolInput.trim())) setTools([...tools, toolInput.trim()]);
      setToolInput("");
    }
  };
  const removeTool = (t: string) => setTools(tools.filter(x => x !== t));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tasks.trim()) return;
    setSubmitting(true);
    try {
      const response = await dailyLogAPI.createLog({
        logDate: today,
        hoursWorked: hours,
        tasksDone: tasks,
        mood,
        challenges: "",
        planTomorrow: "",
        tools
      });
      const newLog = response.data;
      const mappedLog: LogEntry = {
        id: newLog.id,
        logDate: newLog.logDate,
        hoursWorked: newLog.hoursWorked,
        tasksDone: newLog.tasksDone,
        mood: newLog.mood || "GOOD",
        tools: newLog.tools || [],
        status: newLog.status || "PENDING",
        revisionNote: newLog.revisionNote || ""
      };
      onAddLog(mappedLog);
      setTasks(""); setHours(8); setTools([]); setToolInput(""); setMood("GOOD"); setShowCounsel(false);
      toast.success("Daily log submitted successfully.");
    } catch (err: any) {
      console.error("Failed to submit log", err);
      toast.error(err.response?.data || "Failed to submit log.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      {/* LOG FORM */}
      <div className="lg:col-span-7 glass-card p-8">
        <div className="flex justify-between items-center mb-7">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#003ec7]">history_edu</span>
            <h3 className="text-base font-semibold text-[#191c1e]">New Log Entry</h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#003ec7]/10">
            <span className="material-symbols-outlined text-[#003ec7] text-[14px]">today</span>
            <span className="text-[11px] font-bold text-[#003ec7] uppercase">{todayStr}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#505f76] mb-1.5">Hours Worked</label>
              <input type="number" min={0.5} max={16} step={0.5} value={hours}
                onChange={e => setHours(Number(e.target.value))}
                className="pf-input" placeholder="8.0" required />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#505f76] mb-1.5">Work Date</label>
              <div className="relative">
                <input value={todayStr} disabled
                  className="pf-input bg-[#eceef0] text-[#434656] cursor-not-allowed pr-10" />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c3c5d9]" size={14} />
              </div>
              <p className="text-[10px] text-[#737688] mt-1">New logs restricted to current day.</p>
            </div>
          </div>

          {/* Tasks */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#505f76] mb-1.5">Tasks Completed</label>
            <textarea rows={4} value={tasks} onChange={e => setTasks(e.target.value)} required
              placeholder="Describe your accomplishments today..."
              className="pf-input resize-none" />
          </div>

          {/* Tools */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#505f76] mb-1.5">Tools Utilized</label>
            {tools.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {tools.map(t => (
                  <span key={t} className="px-3 py-1 bg-[#d0e1fb] text-[#38485d] rounded-full text-[11px] flex items-center gap-1">
                    {t}
                    <button type="button" onClick={() => removeTool(t)}>
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  </span>
                ))}
              </div>
            )}
            <input value={toolInput} onChange={e => setToolInput(e.target.value)} onKeyDown={addTool}
              placeholder="Type a tool name and press Enter..." className="pf-input" />
          </div>

          {/* Mood */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#505f76] mb-2">Daily Mood & Stress Tracking</label>
            <div className="flex gap-3">
              {MOODS.map(m => (
                <button key={m.key} type="button" onClick={() => {
                  setMood(m.key);
                  setShowCounsel(m.key === "DIFFICULT");
                }}
                  className={`mood-btn ${mood === m.key ? "selected" : ""}`}
                  style={mood === m.key ? { borderColor: m.color, background: `${m.color}10` } : {}}>
                  <span className="material-symbols-outlined" style={{ color: mood === m.key ? m.color : "#737688" }}>{m.icon}</span>
                  <span className="text-[10px] font-bold" style={{ color: mood === m.key ? m.color : "#505f76" }}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {showCounsel && (
            <div className="p-4 rounded-xl bg-[#ffdad6]/40 border border-[#ffdad6]">
              <p className="text-[11px] font-bold text-[#93000a] uppercase tracking-wider">Confidential Counseling Advisory</p>
              <p className="text-xs text-[#ba1a1a] mt-1">Today seems difficult. You can access confidential counseling pathways.</p>
              <button type="button" onClick={() => toast.success("Stress consultation request routed confidentially.")}
                className="mt-2 px-3 py-1 bg-[#ba1a1a] text-white text-[10px] font-bold uppercase rounded-lg hover:brightness-110 transition-all">
                Schedule Callback Session
              </button>
            </div>
          )}

          <button type="submit" disabled={submitting}
            className="pf-btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm">
            {submitting
              ? <><span className="material-symbols-outlined animate-spin text-[18px]">refresh</span> Submitting...</>
              : <><Send size={16} /> Submit Daily Log</>}
          </button>
        </form>
      </div>

      {/* ACTIVITY FEED */}
      <div className="lg:col-span-5 space-y-5">
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b border-[#c3c5d9]/30 flex justify-between items-center bg-white/40">
            <h3 className="text-sm font-semibold text-[#191c1e]">Recent Activity</h3>
            <span className="text-[11px] font-bold text-[#ba1a1a] uppercase">No backdating allowed</span>
          </div>
          <div className="divide-y divide-[#c3c5d9]/20 max-h-[400px] overflow-y-auto custom-scrollbar">
            {logs.length === 0 ? (
              <div className="p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-[#c3c5d9]">list_alt</span>
                <p className="text-sm text-[#505f76] mt-2">No logs yet. Submit your first entry.</p>
              </div>
            ) : logs.map(log => {
              const st = log.logDate === today ? "PENDING" : "APPROVED";
              const badge = STATUS_MAP[st] || STATUS_MAP["PENDING"];
              return (
                <div key={log.id} className="p-5 hover:bg-[#003ec7]/[0.02] group transition-colors">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[11px] font-bold text-[#505f76]">{log.logDate}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badge.cls}`}>{badge.label}</span>
                  </div>
                  <p className="text-xs font-semibold text-[#191c1e] group-hover:text-[#003ec7] transition-colors line-clamp-2">{log.tasksDone}</p>
                  <div className="mt-2 flex items-center gap-4 text-[11px] text-[#737688]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">schedule</span> {log.hoursWorked} hrs
                    </span>
                    {log.tools?.length > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">build</span> {log.tools.length} tools
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly stats card */}
        <div className="glass-card p-5 bg-gradient-to-br from-[#003ec7]/5 to-transparent">
          <h4 className="text-sm font-semibold text-[#191c1e] mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003ec7] text-[18px]">trending_up</span> Weekly Focus
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[11px] font-bold mb-1">
                <span className="text-[#505f76]">HOURS LOGGED</span>
                <span className="text-[#003ec7]">{logs.slice(0,5).reduce((s,l) => s+l.hoursWorked,0)} / 40h</span>
              </div>
              <div className="h-2 bg-white/40 rounded-full overflow-hidden">
                <div className="h-full bg-[#003ec7] rounded-full transition-all duration-700"
                  style={{ width: `${Math.min((logs.slice(0,5).reduce((s,l)=>s+l.hoursWorked,0)/40)*100, 100)}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/60 p-3 rounded-xl border border-white/30">
                <span className="text-[10px] text-[#505f76] font-bold uppercase">MOOD AVG</span>
                <p className="text-sm font-bold text-[#191c1e] mt-1">
                  {logs.length > 0 ? MOODS.find(m => m.key === logs[0].mood)?.label || "Balanced" : "—"}
                </p>
              </div>
              <div className="bg-white/60 p-3 rounded-xl border border-white/30">
                <span className="text-[10px] text-[#505f76] font-bold uppercase">STREAK</span>
                <p className="text-sm font-bold text-[#191c1e] mt-1">{logs.length} Days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
