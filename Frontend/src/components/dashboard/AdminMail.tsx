"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Send, X } from "lucide-react";

const EMPLOYEES = ["All Employees", "Arjun Sharma", "Priya Nair", "Rahul Verma", "Sneha Das"];
const PRESETS = [
  { label: "Timesheet Rejected", body: "Your recent timesheet submission requires revision. Please review and resubmit." },
  { label: "Milestone Cleared", body: "Congratulations! You have successfully completed a key milestone in your program." },
  { label: "Meeting Reminder", body: "This is a reminder about your upcoming scheduled meeting. Please join on time." },
  { label: "Document Ready", body: "Your requested document has been issued and is now available in your vault." },
  { label: "Custom Message", body: "" },
];

export default function AdminMail() {
  const [recipient, setRecipient] = useState("All Employees");
  const [preset, setPreset] = useState(PRESETS[4]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sentList, setSentList] = useState([
    { id: 1, to: "All Employees", subject: "Weekly Standup Reminder", date: "May 18, 2026", type: "Announcement" },
    { id: 2, to: "Arjun Sharma", subject: "Timesheet Approved", date: "May 17, 2026", type: "Individual" },
  ]);

  const handlePresetChange = (p: typeof PRESETS[0]) => {
    setPreset(p);
    setBody(p.body);
    setSubject(p.label !== "Custom Message" ? p.label : "");
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSentList(prev => [{ id: Date.now(), to: recipient, subject, date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}), type: recipient === "All Employees" ? "Announcement" : "Individual" }, ...prev]);
      setSubject(""); setBody(""); setSending(false);
      toast.success(`Mail sent to ${recipient}.`);
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      {/* Compose */}
      <div className="lg:col-span-7 glass-card p-7">
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-[#003ec7]">mail</span>
          <h3 className="text-base font-semibold text-[#191c1e]">Outreach Mail Engine</h3>
        </div>
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#737688] block mb-1.5">Recipient</label>
            <select value={recipient} onChange={e => setRecipient(e.target.value)} className="pf-input text-sm">
              {EMPLOYEES.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#737688] block mb-1.5">Message Preset</label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map(p => (
                <button key={p.label} type="button" onClick={() => handlePresetChange(p)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${preset.label === p.label ? "bg-[#003ec7] text-white" : "border border-[#c3c5d9]/40 text-[#505f76] hover:border-[#003ec7]/40"}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#737688] block mb-1.5">Subject</label>
            <input required value={subject} onChange={e => setSubject(e.target.value)} className="pf-input text-sm" placeholder="Email subject..." />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#737688] block mb-1.5">Message Body</label>
            <textarea required rows={5} value={body} onChange={e => setBody(e.target.value)}
              className="pf-input text-sm resize-none" placeholder="Write your message..." />
          </div>
          <button type="submit" disabled={sending}
            className="pf-btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm">
            {sending ? "Sending..." : <><Send size={15} /> Send Mail</>}
          </button>
        </form>
      </div>

      {/* Sent history */}
      <div className="lg:col-span-5 glass-card p-6">
        <h3 className="text-sm font-semibold text-[#191c1e] mb-4">Sent History</h3>
        <div className="space-y-3 max-h-[520px] overflow-y-auto custom-scrollbar">
          {sentList.map(m => (
            <div key={m.id} className="p-4 rounded-xl border border-[#c3c5d9]/30 hover:border-[#003ec7]/30 transition-all">
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold text-[#191c1e]">{m.subject}</p>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${m.type === "Announcement" ? "badge-issued" : "badge-active"}`}>{m.type}</span>
              </div>
              <p className="text-[11px] text-[#505f76] mt-0.5">To: {m.to}</p>
              <p className="text-[10px] text-[#737688] mt-1">{m.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
