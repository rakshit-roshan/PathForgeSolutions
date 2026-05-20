"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { CalendarDays, Plus, Video, Trash2, Check, Clock, User, Users2, Copy, Search, CheckCircle, ShieldCheck } from "lucide-react";
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
}

interface Meeting {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  link: string;
  platform: "MEET" | "ZOOM" | "CUSTOM";
  targetType: "CANDIDATE" | "COHORT" | "ALL";
  targetIds: string[]; // List of candidate IDs or group ID
  targetName: string;
  description: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
}

export default function AdminMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  // Form State
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [meetingType, setMeetingType] = useState("Weekly Standup");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [targetType, setTargetType] = useState<"CANDIDATE" | "COHORT" | "ALL">("ALL");
  
  // Multiple checklist state for candidates
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<number[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [candidateSearch, setCandidateSearch] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadCandidates();
    loadGroups();
    loadMeetingsFromStorage();
  }, []);

  const loadCandidates = async () => {
    try {
      const res = await adminAPI.getAllCandidates();
      setCandidates(res.data || []);
    } catch (err) {
      console.error("Failed to load candidates", err);
    }
  };

  const loadGroups = () => {
    const saved = localStorage.getItem("pf_candidate_groups");
    if (saved) {
      setGroups(JSON.parse(saved));
    }
  };

  const loadMeetingsFromStorage = () => {
    const saved = localStorage.getItem("pf_corporate_meetings");
    if (saved) {
      setMeetings(JSON.parse(saved));
    } else {
      // Default Mock Data
      const defaultMeetings: Meeting[] = [
        {
          id: "m_1",
          title: "Platform Orientation Standup",
          type: "Orientation",
          date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
          time: "10:00",
          link: "https://meet.google.com/abc-defg-hij",
          platform: "MEET",
          targetType: "ALL",
          targetIds: ["all"],
          targetName: "All Active Interns",
          description: "Introduction to PathForge enterprise dashboard tools, timesheet logging guidelines, and weekly targets.",
          status: "SCHEDULED"
        },
        {
          id: "m_2",
          title: "Technical Roadmap Sync",
          type: "Technical Review",
          date: new Date(Date.now() + 172800000).toISOString().split("T")[0], // Day after
          time: "14:30",
          link: "https://meet.google.com/xyz-abcd-efg",
          platform: "MEET",
          targetType: "COHORT",
          targetIds: ["g1"],
          targetName: "Alpha Trackers",
          description: "Deep dive into Docker orchestration architectures and AWS cloud security setups.",
          status: "SCHEDULED"
        }
      ];
      setMeetings(defaultMeetings);
      localStorage.setItem("pf_corporate_meetings", JSON.stringify(defaultMeetings));
    }
  };

  const saveMeetings = (newMeetings: Meeting[]) => {
    setMeetings(newMeetings);
    localStorage.setItem("pf_corporate_meetings", JSON.stringify(newMeetings));
  };

  const generateMockLink = (plat: "MEET" | "ZOOM") => {
    const code = Math.random().toString(36).substring(2, 5) + "-" + Math.random().toString(36).substring(2, 6) + "-" + Math.random().toString(36).substring(2, 5);
    return plat === "MEET" ? `https://meet.google.com/${code}` : `https://zoom.us/j/${Math.floor(100000000 + Math.random() * 900000000)}`;
  };

  const handleCopyLink = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Meeting link copied to clipboard!");
  };

  const toggleCandidateSelection = (id: number) => {
    setSelectedCandidateIds(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleSelectAllCandidates = () => {
    if (selectedCandidateIds.length === candidates.length) {
      setSelectedCandidateIds([]);
    } else {
      setSelectedCandidateIds(candidates.map(c => c.id));
    }
  };

  const pushMeetingNotification = (meetingTitle: string, userIds: number[]) => {
    try {
      const notifKey = "pf_system_notifications";
      const savedNotifs = localStorage.getItem(notifKey);
      const existing = savedNotifs ? JSON.parse(savedNotifs) : [];
      
      const newNotifications = userIds.map(userId => ({
        id: "notif_" + Date.now() + "_" + Math.random().toString(36).substring(2, 5),
        text: `📅 New meeting scheduled: "${meetingTitle}"`,
        time: "Just now",
        read: false,
        userId: userId
      }));

      localStorage.setItem(notifKey, JSON.stringify([...newNotifications, ...existing]));
    } catch (err) {
      console.error("Failed to push meeting notification", err);
    }
  };

  const handleScheduleMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time) {
      toast.error("Please fill in meeting title, date, and start time.");
      return;
    }

    // Determine platform link
    if (!meetingLink.trim()) {
      toast.error("Please enter or generate a meeting link.");
      return;
    }
    const finalLink = meetingLink.trim();
    const linkLower = finalLink.toLowerCase();
    const platform = linkLower.includes("zoom.us")
      ? "ZOOM"
      : linkLower.includes("meet.google.com")
      ? "MEET"
      : "CUSTOM";

    // Determine targets and invitees list
    let targetName = "All Active Interns";
    let targetIdsList: string[] = [];
    let notifyUserIds: number[] = [];

    if (targetType === "CANDIDATE") {
      if (selectedCandidateIds.length === 0) {
        toast.error("Please tick at least one candidate checkbox.");
        return;
      }
      const selectedNames = candidates
        .filter(c => selectedCandidateIds.includes(c.id))
        .map(c => c.name);
      
      targetName = selectedNames.length > 2 
        ? `${selectedNames.slice(0, 2).join(", ")} and ${selectedNames.length - 2} others`
        : selectedNames.join(", ");
      
      targetIdsList = selectedCandidateIds.map(id => id.toString());
      notifyUserIds = selectedCandidateIds;

    } else if (targetType === "COHORT") {
      if (!selectedGroupId) {
        toast.error("Please select a target cohort group.");
        return;
      }
      const grp = groups.find(g => g.id === selectedGroupId);
      targetName = grp ? grp.name : "Cohort Group";
      targetIdsList = [selectedGroupId];

      // Get members of this cohort to notify
      const groupsStr = localStorage.getItem("pf_candidate_groups");
      if (groupsStr) {
        const groupsList = JSON.parse(groupsStr);
        const activeGrp = groupsList.find((g: any) => g.id === selectedGroupId);
        if (activeGrp) {
          notifyUserIds = activeGrp.memberIds || [];
        }
      }

    } else {
      targetIdsList = ["all"];
      notifyUserIds = candidates.map(c => c.id);
    }

    const newMeeting: Meeting = {
      id: "meet_" + Date.now(),
      title: title.trim(),
      type: meetingType,
      date,
      time,
      link: finalLink,
      platform,
      targetType,
      targetIds: targetIdsList,
      targetName,
      description: description.trim() || "Regular touchbase standing call.",
      status: "SCHEDULED"
    };

    const updated = [newMeeting, ...meetings];
    saveMeetings(updated);

    // Push notification dynamically
    pushMeetingNotification(title.trim(), notifyUserIds);

    toast.success(`Meeting "${title}" scheduled and dispatched!`);

    // Reset Form
    setTitle("");
    setDate("");
    setTime("");
    setMeetingLink("");
    setTargetType("ALL");
    setSelectedCandidateIds([]);
    setSelectedGroupId("");
    setDescription("");
    setShowCreate(false);
  };

  const handleToggleStatus = (id: string, currentStatus: "SCHEDULED" | "COMPLETED" | "CANCELLED") => {
    const nextStatus: "SCHEDULED" | "COMPLETED" | "CANCELLED" = currentStatus === "SCHEDULED" ? "COMPLETED" : "SCHEDULED";
    const updated = meetings.map(m => m.id === id ? { ...m, status: nextStatus } : m);
    saveMeetings(updated);
    toast.success(`Meeting status updated to ${nextStatus}.`);
  };

  const handleDeleteMeeting = (id: string, name: string) => {
    if (confirm(`Cancel and remove meeting "${name}"?`)) {
      const updated = meetings.filter(m => m.id !== id);
      saveMeetings(updated);
      toast.success("Meeting removed from calendar.");
    }
  };

  // Filter candidates checklist
  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(candidateSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER BAR */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[#c3c5d9]/40 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#191c1e] flex items-center gap-2">
            <CalendarDays className="text-[#003ec7]" size={24} />
            Enterprise Meeting Scheduler
          </h2>
          <p className="text-xs text-[#505f76] mt-1">Schedule Google Meet/Zoom standups, invite cohorts, or tick individual candidates from a checklist.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 bg-[#003ec7] text-white px-4 py-2 text-xs font-bold rounded-lg hover:bg-[#0034a7] transition-all shadow-md active:scale-95 shrink-0"
        >
          <Plus size={16} />
          {showCreate ? "Close Form" : "Schedule Meeting"}
        </button>
      </div>

      {/* SCHEDULE MEETING FORM */}
      {showCreate && (
        <form onSubmit={handleScheduleMeeting} className="bg-white p-6 rounded-2xl border border-[#c3c5d9]/40 shadow-md space-y-5 animate-fade-in">
          <h3 className="text-sm font-bold text-[#191c1e] border-b border-slate-100 pb-3">Setup Meeting Workspace</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-1.5">Meeting Agenda Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Weekly Technical Sprint Demo"
                className="w-full bg-[#f2f4f6] border-none rounded-lg px-3 py-2 text-sm text-[#191c1e] focus:ring-2 focus:ring-[#003ec7]/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-1.5">Meeting Scope Type *</label>
              <select
                value={meetingType}
                onChange={e => setMeetingType(e.target.value)}
                className="w-full bg-[#f2f4f6] border-none rounded-lg px-3 py-2 text-sm text-[#191c1e] focus:ring-2 focus:ring-[#003ec7]/20 focus:outline-none"
              >
                <option value="Weekly Standup">Weekly Standup</option>
                <option value="1-on-1 Session">1-on-1 Session</option>
                <option value="Technical Review">Technical Review</option>
                <option value="Orientation">Orientation</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-1.5">Scheduled Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-[#f2f4f6] border-none rounded-lg px-3 py-2 text-sm text-[#191c1e] focus:ring-2 focus:ring-[#003ec7]/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-1.5">Start Time *</label>
              <input
                type="time"
                required
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full bg-[#f2f4f6] border-none rounded-lg px-3 py-2 text-sm text-[#191c1e] focus:ring-2 focus:ring-[#003ec7]/20 focus:outline-none"
              />
            </div>

            {/* DIRECT MEETING LINK FIELD */}
            <div className="md:col-span-3">
              <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-1.5">Meeting Join Link (Google Meet / Zoom / Custom URL) *</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  required
                  value={meetingLink}
                  onChange={e => setMeetingLink(e.target.value)}
                  placeholder="e.g. https://meet.google.com/abc-defg-hij or https://zoom.us/j/987654321"
                  className="flex-1 bg-[#f2f4f6] border-none rounded-lg px-3 py-2.5 text-sm text-[#191c1e] focus:ring-2 focus:ring-[#003ec7]/20 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const code = Math.random().toString(36).substring(2, 5) + "-" + Math.random().toString(36).substring(2, 6) + "-" + Math.random().toString(36).substring(2, 5);
                      setMeetingLink(`https://meet.google.com/${code}`);
                      toast.success("🪄 Secure Google Meet URL generated!");
                    }}
                    className="flex-1 sm:flex-initial bg-[#dde1ff]/60 hover:bg-[#dde1ff] text-[#003ec7] text-xs font-bold px-3 py-2.5 rounded-lg border border-[#003ec7]/20 transition-all whitespace-nowrap active:scale-95 flex items-center justify-center gap-1"
                  >
                    <span>🪄 Auto-Generate Meet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMeetingLink(`https://zoom.us/j/${Math.floor(100000000 + Math.random() * 900000000)}`);
                      toast.success("🪄 Zoom Meeting URL generated!");
                    }}
                    className="flex-1 sm:flex-initial bg-[#dde1ff]/60 hover:bg-[#dde1ff] text-[#003ec7] text-xs font-bold px-3 py-2.5 rounded-lg border border-[#003ec7]/20 transition-all whitespace-nowrap active:scale-95 flex items-center justify-center gap-1"
                  >
                    <span>🪄 Auto-Generate Zoom</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-2">Audience Scope Target *</label>
              <div className="flex gap-4 p-2 bg-[#f8f9fa] border border-slate-100 rounded-xl max-w-md">
                <label className="flex items-center gap-1.5 text-xs text-[#191c1e] cursor-pointer">
                  <input type="radio" checked={targetType === "ALL"} onChange={() => setTargetType("ALL")} />
                  Global Broadcast (All Active Interns)
                </label>
                <label className="flex items-center gap-1.5 text-xs text-[#191c1e] cursor-pointer">
                  <input type="radio" checked={targetType === "COHORT"} onChange={() => setTargetType("COHORT")} />
                  Cohort Group
                </label>
                <label className="flex items-center gap-1.5 text-xs text-[#191c1e] cursor-pointer">
                  <input type="radio" checked={targetType === "CANDIDATE"} onChange={() => setTargetType("CANDIDATE")} />
                  Tick Candidates
                </label>
              </div>
            </div>

            {/* DYNAMIC TARGET DETAILED FIELD */}
            <div>
              {targetType === "COHORT" && (
                <div className="animate-fade-in max-w-md">
                  <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-1.5">Select Target Cohort Group *</label>
                  <select
                    required
                    value={selectedGroupId}
                    onChange={e => setSelectedGroupId(e.target.value)}
                    className="w-full bg-[#f2f4f6] border-none rounded-lg px-3 py-2 text-sm text-[#191c1e] focus:ring-2 focus:ring-[#003ec7]/20 focus:outline-none"
                  >
                    <option value="">Select target...</option>
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
              )}

              {targetType === "CANDIDATE" && (
                <div className="animate-fade-in space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76]">Select Invitees ({selectedCandidateIds.length} checked)</label>
                    <button
                      type="button"
                      onClick={handleSelectAllCandidates}
                      className="text-[10px] font-bold text-[#003ec7] hover:underline"
                    >
                      {selectedCandidateIds.length === candidates.length ? "Deselect All" : "Select All"}
                    </button>
                  </div>
                  
                  {/* SEARCH BAR */}
                  <div className="relative max-w-xs">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={candidateSearch}
                      onChange={e => setCandidateSearch(e.target.value)}
                      placeholder="Search candidates..."
                      className="w-full bg-[#f2f4f6] rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none text-[#191c1e] placeholder:text-slate-400"
                    />
                  </div>

                  {/* CHECKBOX GRID */}
                  <div className="border border-[#c3c5d9]/30 rounded-xl overflow-hidden max-h-48 overflow-y-auto custom-scrollbar bg-[#fbfcfd] p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {filteredCandidates.length === 0 ? (
                      <p className="text-[11px] text-slate-500 p-2 col-span-3 text-center">No active candidates found matching search query.</p>
                    ) : (
                      filteredCandidates.map(candidate => {
                        const checked = selectedCandidateIds.includes(candidate.id);
                        return (
                          <label
                            key={candidate.id}
                            className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all ${
                              checked
                                ? "bg-[#dde1ff]/45 border-[#003ec7] text-[#003ec7]"
                                : "bg-white border-[#c3c5d9]/20 hover:border-slate-300 text-[#191c1e]"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleCandidateSelection(candidate.id)}
                              className="w-3.5 h-3.5 border-slate-300 rounded text-[#003ec7] focus:ring-[#003ec7]/20"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate">{candidate.name}</p>
                              <p className="text-[9px] text-[#737688] truncate">{candidate.email}</p>
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-1.5">Agenda / Discussion Points</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="List down meeting agenda, pre-reads, or technical objectives..."
              className="w-full bg-[#f2f4f6] border-none rounded-xl p-3 text-xs text-[#191c1e] focus:ring-2 focus:ring-[#003ec7]/20 focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="bg-[#003ec7] text-white px-5 py-2 text-xs font-bold rounded-lg hover:bg-[#0034a7] transition-all shadow-md active:scale-95"
            >
              Dispatch Scheduled Call
            </button>
          </div>
        </form>
      )}

      {/* MEETINGS TIMELINE DIRECTORY */}
      <div className="bg-white p-6 rounded-2xl border border-[#c3c5d9]/40 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-[#505f76] uppercase tracking-widest">Upcoming Standing Calls Calendar</h3>
        {meetings.length === 0 ? (
          <div className="text-center py-10">
            <Video size={36} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-[#737688]">No upcoming corporate standups scheduled.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {meetings.map(meeting => {
              const isScheduled = meeting.status === "SCHEDULED";
              const platName = meeting.platform || "MEET";
              return (
                <div
                  key={meeting.id}
                  className={`p-5 rounded-xl border flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 transition-all ${
                    isScheduled
                      ? "border-[#c3c5d9]/35 hover:border-[#003ec7]/20 bg-white"
                      : "bg-[#f8f9fa] border-slate-200 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isScheduled ? "bg-[#003ec7]/10 text-[#003ec7]" : "bg-slate-200 text-slate-500"
                    }`}>
                      <Video size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-[#191c1e] truncate">{meeting.title}</h4>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          meeting.type === "Orientation"
                            ? "bg-amber-50 text-amber-600"
                            : meeting.type === "1-on-1 Session"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-indigo-50 text-[#003ec7]"
                        }`}>
                          {meeting.type}
                        </span>
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {platName === "MEET" ? "Google Meet" : platName === "ZOOM" ? "Zoom" : "Custom"}
                        </span>
                      </div>
                      <p className="text-xs text-[#505f76] mt-1 line-clamp-2">{meeting.description}</p>
                      
                      <div className="flex items-center gap-4 mt-2.5 flex-wrap">
                        <span className="text-[10px] text-[#737688] flex items-center gap-1">
                          <Clock size={12} />
                          {meeting.date} &bull; {meeting.time}
                        </span>
                        <span className="text-[10px] text-[#737688] flex items-center gap-1.5 min-w-0">
                          {meeting.targetType === "COHORT" ? (
                            <Users2 size={12} className="text-indigo-600 shrink-0" />
                          ) : (
                            <User size={12} className="text-emerald-600 shrink-0" />
                          )}
                          <span className="truncate">
                            Audience: <strong className="text-slate-700">{meeting.targetName}</strong>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    <button
                      onClick={() => handleCopyLink(meeting.link)}
                      className="p-2 bg-[#f2f4f6] text-[#505f76] hover:bg-slate-200 rounded-lg transition-colors border border-[#c3c5d9]/20"
                      title="Copy Call Invite URL"
                    >
                      <Copy size={14} />
                    </button>
                    
                    <a
                      href={meeting.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#f2f4f6] text-[#191c1e] hover:bg-[#003ec7] hover:text-white px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 border border-[#c3c5d9]/25 hover:border-transparent"
                    >
                      <Video size={14} />
                      Join Call
                    </a>

                    <button
                      onClick={() => handleToggleStatus(meeting.id, meeting.status)}
                      className={`p-2 rounded-lg border transition-all ${
                        isScheduled
                          ? "border-[#c3c5d9]/35 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600"
                          : "border-emerald-200 bg-emerald-50 text-emerald-600"
                      }`}
                      title={isScheduled ? "Mark as Done" : "Mark as Active"}
                    >
                      <Check size={14} />
                    </button>

                    <button
                      onClick={() => handleDeleteMeeting(meeting.id, meeting.title)}
                      className="p-2 rounded-lg border border-[#c3c5d9]/35 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all"
                      title="Cancel Call"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
