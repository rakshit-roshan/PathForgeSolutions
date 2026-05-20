"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { adminAPI, contactAPI, mailAPI } from "@/lib/api";

interface Props { onNavigate: (s: string) => void; }

function Counter({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target <= 0) {
      setVal(0);
      return;
    }
    const steps = 40; const inc = target / steps; const ms = duration / steps;
    let cur = 0; const t = setInterval(() => { cur += inc; if (cur >= target) { setVal(target); clearInterval(t); } else setVal(Math.round(cur)); }, ms);
    return () => clearInterval(t);
  }, [target, duration]);
  return <>{val.toLocaleString()}</>;
}

export default function AdminOverview({ onNavigate }: Props) {
  const [stats, setStats] = useState({
    activeCandidates: 0,
    onHoldCandidates: 0,
    logsSubmittedToday: 0,
    totalCandidates: 0,
    logsSubmittedThisWeek: 0,
    averageHoursPerDay: 0.0
  });
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState<number | null>(null);
  const [msg, setMsg] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const loadData = async () => {
    try {
      const [statsRes, enquiriesRes] = await Promise.all([
        adminAPI.getStats(),
        contactAPI.getAllInquiries()
      ]);
      setStats(statsRes.data);
      // Sort enquiries: pending/new first
      const sorted = (enquiriesRes.data || []).sort((a: any, b: any) => {
        if (a.status !== "REPLIED" && b.status === "REPLIED") return -1;
        if (a.status === "REPLIED" && b.status !== "REPLIED") return 1;
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
      setEnquiries(sorted);
    } catch (err: any) {
      console.error("Failed to load admin overview details", err);
      toast.error("Error synchronizing admin metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReply = async (q: any) => {
    if (!msg.trim()) {
      toast.error("Reply message cannot be empty.");
      return;
    }
    setSubmittingReply(true);
    try {
      // 1. Send the email reply
      await mailAPI.sendMail({
        to: q.email,
        subject: `Re: PathForge Inquiry - ${q.serviceType || "Support Enquiry"}`,
        body: msg
      });

      // 2. Update contact record status in database
      await contactAPI.updateStatus(q.id, "REPLIED");

      toast.success(`Reply successfully dispatched to ${q.name}.`);
      setReply(null);
      setMsg("");
      loadData();
    } catch (err: any) {
      console.error("Failed to send reply", err);
      toast.error(err.response?.data || "Failed to transmit reply.");
    } finally {
      setSubmittingReply(false);
    }
  };

  const statCards = [
    { label: "Active Employees", value: stats.activeCandidates, icon: "group", color: "#003ec7", sub: `${stats.totalCandidates} registered candidate profiles` },
    { label: "On-Hold Applications", value: stats.onHoldCandidates, icon: "hourglass_empty", color: "#952200", sub: "Awaiting activation" },
    { label: "Submitted Tasks (Today)", value: stats.logsSubmittedToday, icon: "task_alt", color: "#191c1e", sub: `+${stats.logsSubmittedThisWeek} logs this week` },
  ];

  const QUICK = [
    { label: "Employee Pipeline", icon: "people", section: "PIPELINE" },
    { label: "Timesheet Inbox", icon: "inbox", section: "TIMESHEETS" },
    { label: "Send Mail", icon: "mail", section: "MAIL" },
    { label: "Issue Letter", icon: "description", section: "LETTERS" },
    { label: "Schedule Meeting", icon: "event", section: "MEETINGS" },
    { label: "View Enquiries", icon: "contact_mail", section: "ENQUIRIES" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="pf-spinner" />
      </div>
    );
  }

  const pendingEnquiries = enquiries.filter(q => q.status !== "REPLIED");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map(s => (
          <div key={s.label} className="glass-card p-6 flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#505f76] tracking-wider uppercase">{s.label}</span>
              <h2 className="text-3xl font-bold tracking-tight text-[#191c1e] tabular-nums">
                <Counter target={s.value} />
              </h2>
              <span className="text-[11px] text-[#737688] block">{s.sub}</span>
            </div>
            <div className="w-10 h-10 rounded-full flex justify-center items-center" style={{ backgroundColor: `${s.color}15` }}>
              <span className="material-symbols-outlined text-[20px]" style={{ color: s.color }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-[#191c1e] mb-4">Quick Panel Control</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {QUICK.map(q => (
            <button key={q.label} onClick={() => onNavigate(q.section)} className="pf-action-btn flex flex-col items-center justify-center p-4 rounded-xl border border-[#c3c5d9]/20 hover:border-[#003ec7]/30 hover:bg-[#003ec7]/5 transition-all text-center group">
              <span className="material-symbols-outlined text-[24px] text-[#505f76] group-hover:color-[#003ec7] group-hover:scale-110 transition-all duration-200 mb-2">{q.icon}</span>
              <span className="text-xs font-medium text-[#191c1e]">{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries section */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-[#c3c5d9]/30 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-[#191c1e]">Recent Portal Enquiries</h3>
          <span className="text-[10px] font-bold text-[#003ec7]">{pendingEnquiries.length} pending</span>
        </div>
        <div className="divide-y divide-[#c3c5d9]/20">
          {enquiries.length === 0 ? (
            <p className="p-6 text-center text-xs text-[#737688]">No inquiries logged in the portal.</p>
          ) : (
            enquiries.map(q => {
              const via = (q.preferredContactMethod || "Email").toUpperCase() === "PHONE" ? "CALL" : "MAIL";
              const dateStr = q.createdAt ? new Date(q.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Today";
              return (
                <div key={q.id} className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#191c1e]">{q.name}</p>
                        {q.status === "REPLIED" && (
                          <span className="badge-issued text-[9px] px-1.5 py-0.5 rounded font-black uppercase">Replied</span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#505f76]">{q.email} · {q.phone}</p>
                      {q.serviceType && (
                        <span className="inline-block mt-1 text-[10px] font-medium text-[#003ec7] bg-[#003ec7]/5 px-2 py-0.5 rounded">
                          Track: {q.serviceType}
                        </span>
                      )}
                      <p className="text-xs text-[#434656] mt-2 leading-relaxed bg-[#f6f7fa] p-3 rounded-lg border border-[#c3c5d9]/10">{q.message}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-3 shrink-0">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${via === "MAIL" ? "badge-issued" : "badge-active"}`}>{via}</span>
                      <span className="text-[10px] text-[#737688]">{dateStr}</span>
                    </div>
                  </div>
                  {q.status !== "REPLIED" && (
                    reply === q.id ? (
                      <div className="space-y-2">
                        <textarea rows={2} value={msg} onChange={e => setMsg(e.target.value)} placeholder={`Draft your reply to ${q.name}...`} className="pf-input text-xs resize-none" />
                        <div className="flex gap-2">
                          <button disabled={submittingReply} onClick={() => handleReply(q)} className="pf-btn-primary text-xs py-1.5 px-4 flex items-center gap-1">
                            {submittingReply ? "Transmitting..." : `Send via ${via}`}
                          </button>
                          <button onClick={() => { setReply(null); setMsg(""); }} className="pf-btn-ghost text-xs py-1.5 px-3">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setReply(q.id)} className="pf-btn-ghost text-[11px] py-1.5 px-3 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">reply</span> Reply via {via}
                      </button>
                    )
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
