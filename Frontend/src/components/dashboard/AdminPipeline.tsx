"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { ChevronRight, X, UserCheck, Shield, AlertTriangle } from "lucide-react";
import { adminAPI, securityAPI } from "@/lib/api";

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: "badge-active",
  ON_HOLD: "badge-onhold",
  PENDING: "badge-pending",
  COMPLETED: "badge-issued",
  DISABLED: "badge-error"
};

export default function AdminPipeline() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [search, setSearch] = useState("");
  const [filterTrack, setFilterTrack] = useState("All");

  // Edit fields for drawer
  const [editTrack, setEditTrack] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editDuration, setEditDuration] = useState(6);
  const [savingLifecycle, setSavingLifecycle] = useState(false);

  const loadCandidates = async () => {
    try {
      const res = await adminAPI.getAllCandidates();
      setCandidates(res.data || []);
    } catch (err: any) {
      console.error("Failed to load candidates", err);
      toast.error("Failed to sync candidate pipeline.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const handleSelectCandidate = async (cand: any) => {
    setSelected(cand);
    setEditTrack(cand.internshipTrack || "Full-Stack Dev");
    setEditStatus(cand.status || "ACTIVE");
    setEditDuration(cand.internshipDurationMonths || 6);
    setSelectedDetail(null);
    setLoadingDetail(true);

    try {
      const res = await adminAPI.getCandidateDetail(cand.id);
      setSelectedDetail(res.data);
    } catch (err: any) {
      console.error("Error loading candidate profile details", err);
      toast.error("Failed to retrieve detailed statistics.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleToggleSuspension = async () => {
    if (!selected) return;
    const currentSuspended = !!selected.disabled;
    const nextSuspended = !currentSuspended;
    try {
      await securityAPI.toggleSuspension(selected.id, nextSuspended);
      toast.success(nextSuspended ? "Candidate account access suspended." : "Candidate account access restored.");
      setSelected((prev: any) => ({ ...prev, disabled: nextSuspended }));
      loadCandidates();
    } catch (err: any) {
      console.error("Failed to toggle suspension state", err);
      toast.error("Error toggling account suspension.");
    }
  };

  const handleToggle2FA = async () => {
    if (!selected) return;
    const next2FA = !selected.twoFactorEnabled;
    try {
      await securityAPI.updateLifecycle(selected.id, { twoFactorEnabled: next2FA });
      toast.success(next2FA ? "2FA security override enabled." : "2FA security override disabled.");
      setSelected((prev: any) => ({ ...prev, twoFactorEnabled: next2FA }));
      loadCandidates();
    } catch (err: any) {
      console.error("Failed to override 2FA setting", err);
      toast.error("Error updating 2FA configuration.");
    }
  };

  const handleSaveLifecycle = async () => {
    if (!selected) return;
    setSavingLifecycle(true);
    try {
      await securityAPI.updateLifecycle(selected.id, {
        durationMonths: editDuration,
        internshipTrack: editTrack,
        status: editStatus
      });
      
      // Notify candidate on successful status activation
      if (editStatus === "ACTIVE") {
        try {
          const notifKey = "pf_system_notifications";
          const savedNotifs = localStorage.getItem(notifKey);
          const existing = savedNotifs ? JSON.parse(savedNotifs) : [];
          const newNotif = {
            id: "notif_activation_" + Date.now(),
            text: "🎉 Your candidate profile has been activated by the administrator. Welcome to PathForge!",
            time: "Just now",
            read: false,
            userId: selected.id
          };
          localStorage.setItem(notifKey, JSON.stringify([newNotif, ...existing]));
        } catch (err) {
          console.error("Failed to push activation notification", err);
        }
      }

      toast.success("Candidate lifecycle parameters updated successfully.");
      setSelected(null);
      loadCandidates();
    } catch (err: any) {
      console.error("Failed to update candidate lifecycle", err);
      toast.error("Failed to update candidate metrics.");
    } finally {
      setSavingLifecycle(false);
    }
  };

  // Get unique tracks for filter
  const tracks = ["All", ...Array.from(new Set(candidates.map(c => c.internshipTrack || "Full-Stack Dev")))];

  // Process data for list
  const processed = candidates.map(c => {
    let resolvedStatus = c.status || "ACTIVE";
    if (c.disabled) resolvedStatus = "DISABLED";
    return {
      ...c,
      displayStatus: resolvedStatus
    };
  });

  const filtered = processed.filter(c =>
    (filterTrack === "All" || (c.internshipTrack || "Full-Stack Dev") === filterTrack) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="pf-spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737688] text-[18px]">search</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by candidate name or email..." className="pf-input pl-10 text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {tracks.map(t => (
            <button key={t} onClick={() => setFilterTrack(t)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${filterTrack === t ? "bg-[#003ec7] text-white" : "border border-[#c3c5d9]/40 text-[#505f76] hover:border-[#003ec7]/40"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-[#c3c5d9]/30 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-[#191c1e]">Candidate Registry</h3>
          <span className="text-[11px] text-[#505f76]">{filtered.length} profiles found</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f2f4f6]/50">
              <tr>
                {["Candidate", "Internship Track", "Status", "Duration", "Joined", "Last Connected", ""].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#505f76]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3c5d9]/20">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-xs text-[#737688]">No candidate matches found.</td>
                </tr>
              ) : (
                filtered.map(c => {
                  const initials = c.name ? c.name.split(" ").map((n: string) => n[0]).join("").substring(0,2) : "C";
                  const duration = c.internshipDurationMonths || 6;
                  const joinedDate = c.joiningDate ? new Date(c.joiningDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A";
                  const lastConnectedStr = c.lastConnected ? new Date(c.lastConnected).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Never";

                  return (
                    <tr key={c.id} onClick={() => handleSelectCandidate(c)} className="pf-table-row cursor-pointer">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#003ec7]/10 flex items-center justify-center text-[#003ec7] font-bold text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#191c1e]">{c.name}</p>
                            <p className="text-[11px] text-[#505f76]">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 rounded bg-[#d0e1fb] text-[#38485d] text-[10px] font-bold">{c.internshipTrack || "Full-Stack Dev"}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[c.displayStatus] || "badge-onhold"}`}>
                          {c.displayStatus.replace("_"," ")}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold text-[#191c1e]">{duration} Months</td>
                      <td className="px-5 py-4 text-xs text-[#505f76]">{joinedDate}</td>
                      <td className="px-5 py-4 text-xs text-[#505f76]">{lastConnectedStr}</td>
                      <td className="px-5 py-4 text-right">
                        <ChevronRight size={16} className="text-[#c3c5d9] ml-auto" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelected(null)} />
          <div className="fixed top-0 right-0 h-full w-[440px] detail-drawer z-50 flex flex-col animate-slide-in-right bg-white shadow-2xl">
            <div className="p-6 border-b border-[#c3c5d9]/30 flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#191c1e] uppercase tracking-wider">Candidate Control Center</h3>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-[#f2f4f6] rounded-full transition-colors">
                <X size={18} className="text-[#505f76]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              {/* Avatar + info */}
              <div className="text-center bg-[#f8f9fc] p-5 rounded-2xl border border-[#c3c5d9]/20">
                <div className="w-16 h-16 rounded-full bg-[#003ec7]/10 text-[#003ec7] font-black text-xl flex items-center justify-center mx-auto mb-3 border-2 border-[#003ec7]/20">
                  {selected.name ? selected.name.split(" ").map((n: string) => n[0]).join("").substring(0,2) : "C"}
                </div>
                <h4 className="text-base font-bold text-[#191c1e]">{selected.name}</h4>
                <p className="text-xs text-[#505f76] mt-0.5">{selected.email}</p>
                <div className="flex justify-center gap-2 mt-3">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${STATUS_BADGE[selected.disabled ? "DISABLED" : selected.status] || "badge-onhold"}`}>
                    {selected.disabled ? "SUSPENDED" : (selected.status || "ACTIVE").replace("_", " ")}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#e8eaf6] text-[#3f51b5]">ID: #{selected.id}</span>
                </div>
              </div>

              {/* Progress and statistics */}
              {loadingDetail ? (
                <div className="flex justify-center items-center py-6">
                  <div className="pf-spinner" />
                </div>
              ) : selectedDetail ? (
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#737688]">Onboarding Analytics</p>
                  
                  {/* Gauge */}
                  <div className="bg-[#f7f9fb] p-4 rounded-xl border border-[#c3c5d9]/20 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#505f76]">Internship Milestones Completed</span>
                      <span className="font-black text-[#003ec7]">{Math.round(selectedDetail.completionPercentage || 0)}%</span>
                    </div>
                    <div className="h-2 bg-[#e0e3e5] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#003ec7] to-[#005cff] rounded-full transition-all duration-500" style={{ width: `${selectedDetail.completionPercentage || 0}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-[#f7f9fb] rounded-xl border border-[#c3c5d9]/20">
                      <p className="text-[9px] font-black uppercase text-[#737688]">Total Hours Logged</p>
                      <p className="text-sm font-bold text-[#191c1e] mt-0.5 tabular-nums">{selectedDetail.totalHoursWorked || 0} hrs</p>
                    </div>
                    <div className="p-3 bg-[#f7f9fb] rounded-xl border border-[#c3c5d9]/20">
                      <p className="text-[9px] font-black uppercase text-[#737688]">Logs Submitted</p>
                      <p className="text-sm font-bold text-[#191c1e] mt-0.5 tabular-nums">{selectedDetail.totalLogsSubmitted || 0}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Lifecycle Parameters */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#737688]">Modify Lifecycle parameters</p>
                <div className="space-y-3 bg-[#f8f9fc] p-4 rounded-2xl border border-[#c3c5d9]/10">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#505f76] uppercase">Internship Track</label>
                    <select value={editTrack} onChange={e => setEditTrack(e.target.value)} className="pf-input text-xs">
                      <option value="Full-Stack Dev">Full-Stack Dev</option>
                      <option value="Product Design">Product Design</option>
                      <option value="Data Analytics">Data Analytics</option>
                      <option value="Backend Dev">Backend Dev</option>
                      <option value="Cyber Security">Cyber Security</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#505f76] uppercase">Account Lifecycle Status</label>
                    <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="pf-input text-xs">
                      <option value="PENDING">PENDING (Locked Profile)</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="ON_HOLD">ON_HOLD</option>
                      <option value="COMPLETED">COMPLETED (Graduated)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#505f76] uppercase">Internship Duration (Months)</label>
                    <input type="number" value={editDuration} onChange={e => setEditDuration(parseInt(e.target.value) || 1)} className="pf-input text-xs" min={1} max={24} />
                  </div>

                  <button disabled={savingLifecycle} onClick={handleSaveLifecycle} className="pf-btn-primary w-full text-xs py-2 mt-2">
                    {savingLifecycle ? "Saving Lifecycle..." : "Update Lifecycle Details"}
                  </button>
                </div>
              </div>

              {/* Safety & 2FA overrides */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#737688]">Administrative Override Gating</p>
                <div className="flex justify-between items-center p-3 bg-[#f7f9fb] rounded-xl border border-[#c3c5d9]/20">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Shield size={14} className="text-[#003ec7]" />
                      <p className="text-xs font-semibold text-[#191c1e]">2FA Verification Status</p>
                    </div>
                    <p className="text-[10px] text-[#505f76] mt-0.5">Toggles 2-factor login authentication</p>
                  </div>
                  <button onClick={handleToggle2FA}
                    className={`toggle-track ${selected.twoFactorEnabled ? "on" : ""}`}>
                    <div className="toggle-thumb" />
                  </button>
                </div>

                <button onClick={handleToggleSuspension}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    selected.disabled
                      ? "bg-[#dcfce7] text-[#15803d] hover:bg-[#dcfce7]/80"
                      : "bg-[#ffdad6] text-[#93000a] hover:bg-[#ffdad6]/80"
                  }`}>
                  <AlertTriangle size={14} />
                  {selected.disabled ? "Reinstate Account Access" : "Suspend Account Access"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
