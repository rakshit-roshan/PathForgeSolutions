"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Check, RotateCcw, User } from "lucide-react";
import { adminAPI } from "@/lib/api";

const MOOD_MAP: Record<string, { label: string; color: string }> = {
  GREAT:     { label: "Focused",   color: "#059669" },
  GOOD:      { label: "Balanced",  color: "#003ec7" },
  NEUTRAL:   { label: "Stressed",  color: "#d97706" },
  DIFFICULT: { label: "Burnt Out", color: "#ba1a1a" },
};

const STATUS_CLR: Record<string, string> = {
  APPROVED: "badge-active",
  PENDING: "badge-pending",
  REVISION: "badge-error"
};

export default function AdminTimesheets() {
  const [sheets, setSheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");
  const [revisionNote, setRevisionNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [actioning, setActioning] = useState(false);

  const loadTimesheets = async () => {
    try {
      const res = await adminAPI.getAllLogs();
      setSheets(res.data || []);
    } catch (err: any) {
      console.error("Failed to sync timesheets from backend", err);
      toast.error("Failed to synchronize candidate timesheets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimesheets();
  }, []);

  const updateStatus = async (id: string, status: "APPROVED" | "REVISION", note?: string) => {
    setActioning(true);
    try {
      await adminAPI.updateLogStatus(id, status, note);

      // Notify candidate on timesheet review status update
      const sheet = sheets.find(s => s.id === id);
      if (sheet && sheet.candidateId) {
        try {
          const notifKey = "pf_system_notifications";
          const savedNotifs = localStorage.getItem(notifKey);
          const existing = savedNotifs ? JSON.parse(savedNotifs) : [];
          
          const text = status === "APPROVED"
            ? `✅ Your daily log timesheet for ${sheet.week} has been APPROVED by the administrator.`
            : `⚠️ Revision requested on your daily log for ${sheet.week}: "${note || 'Please review and resubmit.'}"`;

          const newNotif = {
            id: "notif_timesheet_" + Date.now(),
            text,
            time: "Just now",
            read: false,
            userId: parseInt(sheet.candidateId)
          };
          localStorage.setItem(notifKey, JSON.stringify([newNotif, ...existing]));
        } catch (err) {
          console.error("Failed to push timesheet notification", err);
        }
      }

      toast.success(status === "APPROVED" ? "Timesheet approved successfully." : `Revision request dispatched.`);
      setRevisionNote(null);
      setNoteText("");
      await loadTimesheets();
    } catch (err: any) {
      console.error("Failed to transition status", err);
      toast.error("Failed to update timesheet review status.");
    } finally {
      setActioning(false);
    }
  };

  const filtered = filter === "ALL" ? sheets : sheets.filter(s => s.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="pf-spinner" />
      </div>
    );
  }

  const pendingCount = sheets.filter(s => s.status === "PENDING").length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="glass-card p-5 flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#191c1e]">Timesheet Review Engine</h3>
          <p className="text-xs text-[#505f76] mt-0.5">Audit, approve, or request logs revisions from candidates</p>
        </div>
        <div className="flex gap-2">
          {["PENDING", "APPROVED", "REVISION", "ALL"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1.5 ${filter === f ? "bg-[#003ec7] text-white" : "border border-[#c3c5d9]/40 text-[#505f76] hover:border-[#003ec7]/40"}`}>
              <span>{f}</span>
              {f === "PENDING" && pendingCount > 0 && (
                <span className={`px-1.5 py-0.5 text-[9px] rounded-full font-black ${filter === "PENDING" ? "bg-white text-[#003ec7]" : "bg-[#003ec7] text-white"}`}>
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <span className="material-symbols-outlined text-4xl text-[#c3c5d9]">inbox</span>
            <p className="text-sm text-[#505f76] mt-2">No timesheets match this status filter.</p>
          </div>
        ) : filtered.map(s => {
          const mood = MOOD_MAP[s.mood] || { label: s.mood || "Balanced", color: "#003ec7" };
          const initials = s.employee ? s.employee.split(" ").map((n: string) => n[0]).join("").substring(0,2) : "C";
          const subDate = s.submitted ? new Date(s.submitted).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A";

          return (
            <div key={s.id} className="glass-card p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#003ec7]/10 text-[#003ec7] font-black text-sm flex items-center justify-center shrink-0 border border-[#003ec7]/20">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#191c1e]">{s.employee}</p>
                    <p className="text-[11px] text-[#505f76]">{s.week} · {s.hours} hrs · Submitted {subDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: `${mood.color}15`, color: mood.color }}>
                    {mood.label}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${STATUS_CLR[s.status] || "badge-onhold"}`}>{s.status}</span>
                </div>
              </div>

              <div className="bg-[#f7f9fb] p-4 rounded-xl border border-[#c3c5d9]/10 space-y-2">
                <p className="text-xs font-bold text-[#505f76] uppercase tracking-wider text-[9px]">Tasks Executed</p>
                <p className="text-xs text-[#434656] leading-relaxed whitespace-pre-wrap">
                  {s.tasks}
                </p>
                {s.tools && s.tools.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap pt-2 border-t border-[#c3c5d9]/10 mt-2">
                    {s.tools.map((t: string) => (
                      <span key={t} className="text-[10px] bg-[#e3f2fd] text-[#0d47a1] px-2 py-0.5 rounded font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {s.revisionNote && (
                  <div className="bg-[#ffdad6] text-[#93000a] text-xs p-3 rounded-lg border border-[#ffdad6] mt-3 space-y-1">
                    <p className="font-bold text-[10px] uppercase">Audit Revision Requested Feedback</p>
                    <p className="leading-relaxed">{s.revisionNote}</p>
                  </div>
                )}
              </div>

              {s.status === "PENDING" && (
                <div className="flex gap-2">
                  <button disabled={actioning} onClick={() => updateStatus(s.id, "APPROVED")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#003ec7] text-white text-[11px] font-bold rounded-xl hover:bg-[#003ec7]/90 transition-all disabled:opacity-50">
                    <Check size={13} /> Approve Daily Log
                  </button>
                  <button disabled={actioning} onClick={() => setRevisionNote(revisionNote === s.id ? null : s.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-[#c3c5d9] text-[#505f76] text-[11px] font-bold rounded-xl hover:bg-[#f2f4f6] transition-all disabled:opacity-50">
                    <RotateCcw size={13} /> Request Correction
                  </button>
                </div>
              )}

              {revisionNote === s.id && (
                <div className="space-y-2 animate-fade-in">
                  <textarea rows={2} value={noteText} onChange={e => setNoteText(e.target.value)}
                    placeholder="Provide constructive feedback for correction request..."
                    className="pf-input text-xs resize-none" />
                  <div className="flex gap-2">
                    <button disabled={actioning} onClick={() => updateStatus(s.id, "REVISION", noteText)}
                      className="pf-btn-primary text-xs py-2 flex-1 disabled:opacity-50">Transmit Feedback</button>
                    <button onClick={() => { setRevisionNote(null); setNoteText(""); }}
                      className="pf-btn-ghost text-xs py-2">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
