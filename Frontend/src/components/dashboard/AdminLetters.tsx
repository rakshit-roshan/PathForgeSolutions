"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Send, Download } from "lucide-react";

const LETTER_TYPES = ["Offer Letter", "Completion Certificate", "LOR", "Experience Letter", "NOC", "Custom"];
const EMPLOYEES = ["Arjun Sharma", "Priya Nair", "Rahul Verma", "Sneha Das"];

interface Letter { id: string; type: string; recipient: string; date: string; visible: boolean; sent: boolean; }

export default function AdminLetters() {
  const [letters, setLetters] = useState<Letter[]>([
    { id: "L01", type: "Offer Letter",           recipient: "Arjun Sharma", date: "May 1, 2026",  visible: true,  sent: true },
    { id: "L02", type: "Completion Certificate", recipient: "Sneha Das",    date: "May 10, 2026", visible: true,  sent: true },
    { id: "L03", type: "LOR",                    recipient: "Priya Nair",   date: "May 15, 2026", visible: false, sent: true },
  ]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ type: "Offer Letter", recipient: "Arjun Sharma", body: "" });
  const [sending, setSending] = useState(false);

  const toggleVisibility = (id: string) => {
    setLetters(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
    toast.success("Letter visibility updated.");
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      const nl: Letter = {
        id: `L${Date.now()}`, type: form.type, recipient: form.recipient,
        date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
        visible: true, sent: true,
      };
      setLetters(prev => [nl, ...prev]);
      setCreating(false); setForm({ type: "Offer Letter", recipient: "Arjun Sharma", body: "" }); setSending(false);
      toast.success(`${form.type} sent to ${form.recipient}.`);
    }, 900);
  };

  const STATUS_BADGE: Record<string, string> = {
    "Offer Letter": "badge-issued", "Completion Certificate": "badge-active",
    LOR: "badge-pending", "Experience Letter": "badge-onhold", Custom: "badge-onhold",
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="glass-card p-5 flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-[#191c1e]">Document Factory</h3>
          <p className="text-xs text-[#505f76] mt-0.5">Create and send official letters to employees</p>
        </div>
        <button onClick={() => setCreating(!creating)} className="pf-btn-primary text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">{creating ? "close" : "add"}</span>
          {creating ? "Cancel" : "Create Letter"}
        </button>
      </div>

      {creating && (
        <div className="glass-card p-6">
          <h4 className="text-sm font-semibold text-[#191c1e] mb-5">New Official Letter</h4>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-[#737688] block mb-1.5">Letter Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="pf-input text-sm">
                  {LETTER_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-[#737688] block mb-1.5">Recipient</label>
                <select value={form.recipient} onChange={e => setForm({...form, recipient: e.target.value})} className="pf-input text-sm">
                  {EMPLOYEES.map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-[#737688] block mb-1.5">Letter Content</label>
              <textarea rows={5} value={form.body} onChange={e => setForm({...form, body: e.target.value})}
                placeholder="Write the letter content here..." className="pf-input text-sm resize-none" required />
            </div>
            <button type="submit" disabled={sending} className="pf-btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm">
              {sending ? "Sending..." : <><Send size={14} /> Generate & Send Letter</>}
            </button>
          </form>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-[#c3c5d9]/30">
          <h4 className="text-sm font-semibold text-[#191c1e]">All Issued Letters</h4>
        </div>
        <div className="divide-y divide-[#c3c5d9]/20">
          {letters.map(l => (
            <div key={l.id} className={`p-5 flex items-center justify-between gap-4 ${!l.visible ? "opacity-50" : ""}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#003ec7]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#003ec7] text-[18px]">description</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#191c1e]">{l.type}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${STATUS_BADGE[l.type] || "badge-onhold"}`}>{l.type}</span>
                  </div>
                  <p className="text-[11px] text-[#505f76]">{l.recipient} · {l.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleVisibility(l.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#c3c5d9]/40 text-[11px] font-bold text-[#505f76] hover:bg-[#f2f4f6] transition-colors">
                  {l.visible ? <><EyeOff size={12} /> Suspend</> : <><Eye size={12} /> Restore</>}
                </button>
                <button onClick={() => toast.success(`Downloading ${l.type}`)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#003ec7] text-white text-[11px] font-bold hover:brightness-110 transition-all">
                  <Download size={12} /> PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
