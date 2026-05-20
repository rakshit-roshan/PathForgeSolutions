"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Video, Clock, User, CalendarDays, ExternalLink, MessageSquare, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Meeting {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  link: string;
  targetType: "CANDIDATE" | "COHORT" | "ALL";
  targetId: string;
  targetName: string;
  description: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
}

interface Group {
  id: string;
  name: string;
  memberIds: number[];
}

export default function EmployeeMeetings() {
  const { user } = useAuth();
  const [myMeetings, setMyMeetings] = useState<Meeting[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  // Request Modal State
  const [reqTitle, setReqTitle] = useState("");
  const [reqType, setReqType] = useState("1-on-1 Session");
  const [reqDate, setReqDate] = useState("");
  const [reqTime, setReqTime] = useState("");
  const [reqNotes, setReqNotes] = useState("");

  useEffect(() => {
    if (!user) return;
    loadFilteredMeetings();
  }, [user]);

  const loadFilteredMeetings = () => {
    if (!user) return;
    try {
      // 1. Get meetings
      const meetStr = localStorage.getItem("pf_corporate_meetings");
      const allMeetings: Meeting[] = meetStr ? JSON.parse(meetStr) : [];

      // 2. Get groups
      const grpStr = localStorage.getItem("pf_candidate_groups");
      const groupsList: Group[] = grpStr ? JSON.parse(grpStr) : [];
      const userGroup = groupsList.find(g => g.memberIds.includes(user.id));

      // 3. Filter meetings: either targetType is ALL, or is COHORT and group matches, or is CANDIDATE and matches candidate id
      const filtered = allMeetings.filter(m => {
        if (m.targetType === "ALL") return true;
        if (m.targetType === "COHORT" && userGroup && m.targetId === userGroup.id) return true;
        if (m.targetType === "CANDIDATE" && m.targetId === user.id.toString()) return true;
        return false;
      });

      setMyMeetings(filtered);
    } catch (err) {
      console.error("Failed to filter candidate meetings", err);
    }
  };

  const handleRequestMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!reqTitle.trim() || !reqDate || !reqTime) {
      toast.error("Please fill in agenda, requested date, and time.");
      return;
    }

    // Get existing corporate meetings to append the requested session
    const meetStr = localStorage.getItem("pf_corporate_meetings");
    const allMeetings: Meeting[] = meetStr ? JSON.parse(meetStr) : [];

    const newMeeting: Meeting = {
      id: "meet_req_" + Date.now(),
      title: `[Requested] ${reqTitle.trim()}`,
      type: reqType,
      date: reqDate,
      time: reqTime,
      link: "https://meet.google.com/mock-requested-" + Math.random().toString(36).substring(2, 5),
      targetType: "CANDIDATE",
      targetId: user.id.toString(),
      targetName: user.name,
      description: reqNotes.trim() || "Intern requested mentorship 1-on-1 slot.",
      status: "SCHEDULED"
    };

    const updated = [newMeeting, ...allMeetings];
    localStorage.setItem("pf_corporate_meetings", JSON.stringify(updated));
    
    toast.success("1-on-1 Session Requested! Status is set to Scheduled.");
    
    // Reset Form & reload
    setReqTitle("");
    setReqDate("");
    setReqTime("");
    setReqNotes("");
    setShowRequestModal(false);
    loadFilteredMeetings();
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[#c3c5d9]/40 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#191c1e] flex items-center gap-2">
            <CalendarDays className="text-[#003ec7]" size={24} />
            My Corporate Standups
          </h2>
          <p className="text-xs text-[#505f76] mt-1">Review scheduled cohort sprint standups, orientation syncs, or request 1-on-1 mentor calls.</p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="flex items-center gap-2 bg-[#003ec7] text-white px-4 py-2 text-xs font-bold rounded-lg hover:bg-[#0034a7] transition-all shadow shadow-md active:scale-95"
        >
          <MessageSquare size={16} />
          Request 1-on-1
        </button>
      </div>

      {/* REQUEST CALL MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl border border-[#c3c5d9]/40 shadow-2xl w-full max-w-md p-6 relative animate-fade-in">
            <h3 className="text-sm font-bold text-[#191c1e] border-b border-slate-100 pb-3 mb-4">Request Mentorship 1-on-1 Call</h3>
            
            <form onSubmit={handleRequestMeeting} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-1">Agenda Topic *</label>
                <input
                  type="text"
                  required
                  value={reqTitle}
                  onChange={e => setReqTitle(e.target.value)}
                  placeholder="e.g. Docker Deployment Code Review"
                  className="w-full bg-[#f2f4f6] border-none rounded-lg px-3 py-2 text-xs text-[#191c1e] focus:ring-2 focus:ring-[#003ec7]/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-1">Requested Date *</label>
                  <input
                    type="date"
                    required
                    value={reqDate}
                    onChange={e => setReqDate(e.target.value)}
                    className="w-full bg-[#f2f4f6] border-none rounded-lg px-3 py-2 text-xs text-[#191c1e] focus:ring-2 focus:ring-[#003ec7]/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-1">Preferred Time *</label>
                  <input
                    type="time"
                    required
                    value={reqTime}
                    onChange={e => setReqTime(e.target.value)}
                    className="w-full bg-[#f2f4f6] border-none rounded-lg px-3 py-2 text-xs text-[#191c1e] focus:ring-2 focus:ring-[#003ec7]/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-1">Select Call Scope</label>
                <select
                  value={reqType}
                  onChange={e => setReqType(e.target.value)}
                  className="w-full bg-[#f2f4f6] border-none rounded-lg px-3 py-2 text-xs text-[#191c1e] focus:ring-2 focus:ring-[#003ec7]/20 focus:outline-none"
                >
                  <option value="1-on-1 Session">1-on-1 Session</option>
                  <option value="Technical Review">Technical Review</option>
                  <option value="Mock Interview">Mock Interview</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-[#505f76] mb-1">Short Notes / Context</label>
                <textarea
                  rows={3}
                  value={reqNotes}
                  onChange={e => setReqNotes(e.target.value)}
                  placeholder="Tell your mentor what questions you'd like to ask..."
                  className="w-full bg-[#f2f4f6] border-none rounded-xl p-3 text-xs text-[#191c1e] focus:ring-2 focus:ring-[#003ec7]/20 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="bg-[#f2f4f6] text-[#505f76] hover:bg-[#eceef0] px-4 py-2 text-xs font-bold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#003ec7] text-white px-4 py-2 text-xs font-bold rounded-lg hover:bg-[#0034a7] transition-all shadow"
                >
                  Submit Booking Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEETINGS TIMELINE PANEL */}
      <div className="bg-white p-6 rounded-2xl border border-[#c3c5d9]/40 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-[#505f76] uppercase tracking-widest flex items-center gap-1">
          <Clock size={14} className="text-[#003ec7]" />
          Timeline Agenda
        </h3>
        
        {myMeetings.length === 0 ? (
          <div className="text-center py-12">
            <Video size={36} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-[#737688] italic">No standups or active feedback slots are scheduled.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myMeetings.map(meeting => {
              const isScheduled = meeting.status === "SCHEDULED";
              return (
                <div
                  key={meeting.id}
                  className={`p-5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                    isScheduled
                      ? "border-[#c3c5d9]/35 hover:border-[#003ec7]/25 bg-white shadow-sm"
                      : "bg-[#f8f9fa] border-slate-200 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isScheduled ? "bg-[#003ec7]/10 text-[#003ec7]" : "bg-slate-200 text-slate-500"
                    }`}>
                      <Video size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-[#191c1e]">{meeting.title}</h4>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          meeting.type === "Orientation"
                            ? "bg-amber-50 text-amber-600"
                            : meeting.type === "1-on-1 Session"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-[#dde1ff] text-[#003ec7]"
                        }`}>
                          {meeting.type}
                        </span>
                      </div>
                      <p className="text-xs text-[#505f76] mt-1">{meeting.description}</p>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] text-[#737688] flex items-center gap-1">
                          <Clock size={12} />
                          {meeting.date} at {meeting.time}
                        </span>
                        <span className="text-[10px] text-[#737688] flex items-center gap-1.5">
                          <User size={12} className="text-[#003ec7]" />
                          Invitation Audience: <strong className="text-slate-700">{meeting.targetName}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <a
                      href={meeting.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#003ec7] text-white hover:bg-[#0034a7] px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
                    >
                      <Video size={14} />
                      Join Standup
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* METRIC CARD INFO BOX */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/50 flex items-start gap-3">
        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={16} />
        <div>
          <h4 className="text-xs font-bold text-amber-900">Important Instructions Regarding Standing Calls</h4>
          <p className="text-[11px] text-amber-800 mt-1">
            Standups are hosted securely via encrypted enterprise channels. You must be signed in with your official registered corporational email before clicking the Google Meet invite link. If your scheduled standup link does not activate, check with your assigned cohort mentor.
          </p>
        </div>
      </div>
    </div>
  );
}
