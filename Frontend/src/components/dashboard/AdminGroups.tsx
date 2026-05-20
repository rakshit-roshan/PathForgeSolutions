"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Users2, Plus, Calendar, Mail, Check, Trash2, BookOpen, ShieldAlert } from "lucide-react";
import { adminAPI } from "@/lib/api";

interface Candidate {
  id: number;
  name: string;
  email: string;
  internshipTrack?: string;
}

interface Group {
  id: string;
  name: string;
  track: string;
  mentor: string;
  project: string;
  memberIds: number[];
}

export default function AdminGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("");
  const [mentorName, setMentorName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  // Broadcast State
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [broadcastText, setBroadcastText] = useState("");
  const [broadcasting, setBroadcasting] = useState(false);

  useEffect(() => {
    loadCandidates();
    loadGroupsFromStorage();
  }, []);

  const loadCandidates = async () => {
    try {
      const res = await adminAPI.getAllCandidates();
      setCandidates(res.data || []);
    } catch (err) {
      console.error("Failed to load candidates", err);
    }
  };

  const loadGroupsFromStorage = () => {
    const saved = localStorage.getItem("pf_candidate_groups");
    if (saved) {
      setGroups(JSON.parse(saved));
    } else {
      // Seed default groups
      const defaultGroups: Group[] = [
        {
          id: "g1",
          name: "Alpha Trackers",
          track: "Full-Stack Dev",
          mentor: "Dr. Rachel Green",
          project: "PathForge Cloud Dashboard Overhaul",
          memberIds: []
        },
        {
          id: "g2",
          name: "Beta Builders",
          track: "Data Science",
          mentor: "Prof. Ross Geller",
          project: "Predictive Analytics Model for Talent Matching",
          memberIds: []
        }
      ];
      setGroups(defaultGroups);
      localStorage.setItem("pf_candidate_groups", JSON.stringify(defaultGroups));
    }
  };

  const saveGroups = (newGroups: Group[]) => {
    setGroups(newGroups);
    localStorage.setItem("pf_candidate_groups", JSON.stringify(newGroups));
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !selectedTrack || !mentorName.trim()) {
      toast.error("Please fill in cohort name, track, and assigned mentor.");
      return;
    }

    const newGroup: Group = {
      id: "g_" + Date.now(),
      name: groupName.trim(),
      track: selectedTrack,
      mentor: mentorName.trim(),
      project: projectName.trim() || "Unassigned",
      memberIds: selectedMembers
    };

    const updated = [newGroup, ...groups];
    saveGroups(updated);
    toast.success(`Group "${groupName}" created successfully!`);

    // Reset fields
    setGroupName("");
    setSelectedTrack("");
    setMentorName("");
    setProjectName("");
    setSelectedMembers([]);
    setShowCreate(false);
  };

  const handleDeleteGroup = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete cohort "${name}"?`)) {
      const updated = groups.filter(g => g.id !== id);
      saveGroups(updated);
      if (selectedGroup?.id === id) {
        setSelectedGroup(null);
      }
      toast.success("Cohort deleted.");
    }
  };

  const toggleMemberSelection = (id: number) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const handleBroadcast = async () => {
    if (!selectedGroup) return;
    if (!broadcastText.trim()) {
      toast.error("Please write an announcement text.");
      return;
    }

    setBroadcasting(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Save announcement in localstorage for cohort members
      const key = `pf_announcements_${selectedGroup.id}`;
      const existing = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : [];
      const updatedAnnouncements = [
        {
          id: "a_" + Date.now(),
          text: broadcastText.trim(),
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          sender: "System Administrator"
        },
        ...existing
      ];
      localStorage.setItem(key, JSON.stringify(updatedAnnouncements));

      toast.success("Broadcast announcement posted to cohort dashboard!");
      setBroadcastText("");
    } catch (err) {
      toast.error("Failed to broadcast message.");
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[#c3c5d9]/40 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#191c1e] flex items-center gap-2">
            <Users2 className="text-[#003ec7]" size={24} />
            Cohort Group Manager
          </h2>
          <p className="text-xs text-[#505f76] mt-1">Create candidate group workspaces, assign technical mentors, and manage group projects.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 bg-[#003ec7] text-white px-4 py-2 text-xs font-bold rounded-lg hover:bg-[#0034a7] transition-all shadow-md active:scale-95"
        >
          <Plus size={16} />
          {showCreate ? "Cancel Creation" : "Create Group"}
        </button>
      </div>

      {/* CREATE GROUP MODULE */}
      {showCreate && (
        <form onSubmit={handleCreateGroup} className="bg-white p-6 rounded-2xl border border-[#c3c5d9]/40 shadow-md animate-fade-in space-y-4">
          <h3 className="text-sm font-bold text-[#191c1e] border-b border-slate-100 pb-3">Define New Cohort</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-1.5">Group Cohort Title *</label>
              <input
                type="text"
                required
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                placeholder="e.g. Omega Analytics"
                className="w-full bg-[#f2f4f6] border-none rounded-lg px-3 py-2 text-sm text-[#191c1e] focus:ring-2 focus:ring-[#003ec7]/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-1.5">Assigned Internship Track *</label>
              <select
                required
                value={selectedTrack}
                onChange={e => setSelectedTrack(e.target.value)}
                className="w-full bg-[#f2f4f6] border-none rounded-lg px-3 py-2 text-sm text-[#191c1e] focus:ring-2 focus:ring-[#003ec7]/20 focus:outline-none"
              >
                <option value="">Select track...</option>
                <option value="Full-Stack Dev">Full-Stack Dev</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Cloud Architect">Cloud Architect</option>
                <option value="Data Science">Data Science</option>
                <option value="Associate">Associate</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-1.5">Assigned Mentor Name *</label>
              <input
                type="text"
                required
                value={mentorName}
                onChange={e => setMentorName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full bg-[#f2f4f6] border-none rounded-lg px-3 py-2 text-sm text-[#191c1e] focus:ring-2 focus:ring-[#003ec7]/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-1.5">Current Project Assignment</label>
              <input
                type="text"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder="e.g. AWS Security Audit Portal"
                className="w-full bg-[#f2f4f6] border-none rounded-lg px-3 py-2 text-sm text-[#191c1e] focus:ring-2 focus:ring-[#003ec7]/20 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-2">Select Cohort Members ({selectedMembers.length} selected)</label>
            <div className="border border-[#c3c5d9]/30 rounded-xl overflow-hidden max-h-48 overflow-y-auto custom-scrollbar bg-[#f8f9fa] p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              {candidates.length === 0 ? (
                <p className="text-[11px] text-[#505f76] p-2 col-span-2 text-center">No candidates found in registry database.</p>
              ) : (
                candidates.map(candidate => {
                  const isSelected = selectedMembers.includes(candidate.id);
                  return (
                    <button
                      type="button"
                      key={candidate.id}
                      onClick={() => toggleMemberSelection(candidate.id)}
                      className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? "bg-[#dde1ff]/45 border-[#003ec7] text-[#003ec7]"
                          : "bg-white border-[#c3c5d9]/30 hover:border-slate-300 text-[#191c1e]"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold truncate">{candidate.name}</p>
                        <p className="text-[9px] text-[#505f76] truncate mt-0.5">{candidate.internshipTrack || "Candidate"} &bull; {candidate.email}</p>
                      </div>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-[#003ec7] border-[#003ec7] text-white" : "border-slate-300"
                      }`}>
                        {isSelected && <Check size={10} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="bg-[#003ec7] text-white px-5 py-2 text-xs font-bold rounded-lg hover:bg-[#0034a7] transition-all shadow-md active:scale-95"
            >
              Finalize & Launch Group
            </button>
          </div>
        </form>
      )}

      {/* COHORTS AND BROADCAST WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COHORTS DIRECTORY (LEFT 1/3) */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-[#c3c5d9]/40 shadow-sm flex flex-col space-y-4">
          <h3 className="text-xs font-black text-[#505f76] uppercase tracking-widest">Active Cohorts ({groups.length})</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
            {groups.map(group => {
              const isSelected = selectedGroup?.id === group.id;
              return (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-start ${
                    isSelected
                      ? "border-[#003ec7] bg-[#003ec7]/[0.02]"
                      : "border-[#c3c5d9]/35 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-bold truncate ${isSelected ? "text-[#003ec7]" : "text-[#191c1e]"}`}>
                      {group.name}
                    </p>
                    <p className="text-[10px] text-[#505f76] truncate mt-1">Track: {group.track}</p>
                    <p className="text-[10px] text-[#737688] truncate mt-0.5">Mentor: {group.mentor}</p>
                    <span className="inline-block mt-2 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#dde1ff] text-[#003ec7]">
                      {group.memberIds.length} Members
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGroup(group.id, group.name);
                    }}
                    className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Delete Cohort"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* DETAILS & BROADCAST CENTER (RIGHT 2/3) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#c3c5d9]/40 shadow-sm flex flex-col justify-between min-h-[400px]">
          {selectedGroup ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              {/* GROUP DETAIL HEADER */}
              <div>
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#191c1e]">{selectedGroup.name}</h3>
                    <p className="text-xs text-[#505f76] mt-0.5">Focus Area: {selectedGroup.track} &bull; Mentor: {selectedGroup.mentor}</p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#003ec7] bg-[#003ec7]/10 px-3 py-1 rounded-full">
                    {selectedGroup.track} Cohort
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#f8f9fa] p-3 rounded-xl border border-slate-100">
                    <p className="text-[9px] uppercase tracking-widest font-black text-[#737688]">Group Project Assigned</p>
                    <p className="text-xs font-bold text-[#191c1e] mt-1 flex items-center gap-1.5">
                      <BookOpen size={14} className="text-[#003ec7]" />
                      {selectedGroup.project}
                    </p>
                  </div>
                  <div className="bg-[#f8f9fa] p-3 rounded-xl border border-slate-100">
                    <p className="text-[9px] uppercase tracking-widest font-black text-[#737688]">Workspace Status</p>
                    <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
                      <Check size={14} />
                      Active &bull; Synced
                    </p>
                  </div>
                </div>

                {/* MEMBERS LIST */}
                <div className="mt-5">
                  <p className="text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-2">Cohort Roll-Call Directory</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {selectedGroup.memberIds.length === 0 ? (
                      <p className="text-[11px] text-[#737688] italic py-2 col-span-2 text-center">No candidates mapped into this cohort yet.</p>
                    ) : (
                      selectedGroup.memberIds.map(mId => {
                        const m = candidates.find(c => c.id === mId);
                        if (!m) return null;
                        return (
                          <div key={mId} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-[#fbfcfd]">
                            <div className="w-8 h-8 rounded-full bg-[#003ec7]/10 text-[#003ec7] flex items-center justify-center font-bold text-xs">
                              {m.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#191c1e] truncate">{m.name}</p>
                              <p className="text-[9px] text-[#737688] truncate">{m.email}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* COHORT ANNOUNCEMENT BROADCASTER */}
              <div className="border-t border-slate-100 pt-5 mt-auto">
                <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-2">Cohort Broadcaster Board</label>
                <div className="space-y-3">
                  <textarea
                    rows={3}
                    value={broadcastText}
                    onChange={e => setBroadcastText(e.target.value)}
                    placeholder={`Post a new announcement directly to all members of "${selectedGroup.name}"...`}
                    className="w-full bg-[#f2f4f6] border-none rounded-xl p-3 text-xs text-[#191c1e] placeholder:text-[#737688] focus:ring-2 focus:ring-[#003ec7]/20 focus:outline-none resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] text-[#737688] flex items-center gap-1">
                      <ShieldAlert size={10} className="text-amber-500" />
                      Posts will immediately reflect in the candidate's dashboard workspace.
                    </p>
                    <button
                      type="button"
                      disabled={broadcasting}
                      onClick={handleBroadcast}
                      className="flex items-center gap-2 bg-[#003ec7] text-white px-4 py-2 text-xs font-bold rounded-lg hover:bg-[#0034a7] transition-all disabled:opacity-40 shadow active:scale-95"
                    >
                      <Mail size={14} />
                      {broadcasting ? "Broadcasting..." : "Broadcast Announcement"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-14 h-14 bg-[#003ec7]/5 text-[#003ec7] rounded-full flex items-center justify-center mb-3">
                <Users2 size={28} />
              </div>
              <h4 className="text-sm font-bold text-[#191c1e]">No Cohort Selected</h4>
              <p className="text-xs text-[#737688] max-w-xs mt-1">Select a group cohort from the directory panel on the left to edit, audit members, and publish announcements.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
