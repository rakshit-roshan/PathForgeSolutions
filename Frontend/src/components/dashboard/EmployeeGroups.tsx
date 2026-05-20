"use client";
import { useState, useEffect } from "react";
import { Users2, Compass, BookOpen, AlertCircle, Send, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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

interface Announcement {
  id: string;
  text: string;
  date: string;
  sender: string;
}

export default function EmployeeGroups() {
  const { user } = useAuth();
  const [myGroup, setMyGroup] = useState<Group | null>(null);
  const [teammates, setTeammates] = useState<Candidate[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    if (!user) return;
    loadCohortData();
  }, [user]);

  const loadCohortData = async () => {
    if (!user) return;
    try {
      // 1. Load candidates registry
      const candRes = await adminAPI.getAllCandidates();
      const allCands: Candidate[] = candRes.data || [];

      // 2. Load groups
      const groupsStr = localStorage.getItem("pf_candidate_groups");
      let groupsList: Group[] = groupsStr ? JSON.parse(groupsStr) : [];

      // 3. Find if current user is in a group.
      // If groups is empty, or candidate is not in any group, map candidate into Alpha Trackers by default
      let activeGrp = groupsList.find(g => g.memberIds.includes(user.id));
      
      if (!activeGrp && groupsList.length > 0) {
        // Map user into first group automatically for a seamless visual experience
        activeGrp = groupsList[0];
        if (!activeGrp.memberIds.includes(user.id)) {
          activeGrp.memberIds.push(user.id);
          localStorage.setItem("pf_candidate_groups", JSON.stringify(groupsList));
        }
      }

      if (activeGrp) {
        setMyGroup(activeGrp);

        // Filter teammates
        const mates = allCands.filter(c => activeGrp!.memberIds.includes(c.id) && c.id !== user.id);
        setTeammates(mates);

        // Load cohort announcements
        const key = `pf_announcements_${activeGrp.id}`;
        const annSaved = localStorage.getItem(key);
        if (annSaved) {
          setAnnouncements(JSON.parse(annSaved));
        } else {
          // Default Announcement
          const defaultAnn: Announcement[] = [
            {
              id: "da_1",
              text: `Welcome to the "${activeGrp.name}" cohort! Make sure to align your weekly timesheet logs with our designated mentor ${activeGrp.mentor}.`,
              date: "May 18, 2026",
              sender: "System Administrator"
            }
          ];
          setAnnouncements(defaultAnn);
          localStorage.setItem(key, JSON.stringify(defaultAnn));
        }
      }
    } catch (err) {
      console.error("Failed to load cohort workspace data", err);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {myGroup ? (
        <>
          {/* COHORT SUMMARY CARD */}
          <div className="bg-white p-6 rounded-2xl border border-[#c3c5d9]/40 shadow-sm relative overflow-hidden">
            {/* Background design */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#003ec7]/[0.02] to-transparent pointer-events-none" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#003ec7] bg-[#dde1ff] px-2.5 py-1 rounded-full">
                  My Active Cohort
                </span>
                <h2 className="text-xl font-bold text-[#191c1e] mt-2.5 flex items-center gap-2">
                  <Users2 className="text-[#003ec7]" size={24} />
                  {myGroup.name}
                </h2>
                <p className="text-xs text-[#505f76] mt-1">Focus Internship Track &bull; {myGroup.track}</p>
              </div>
              <div className="flex items-center gap-6 bg-[#f8f9fa] p-4 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-black text-[#737688]">Cohort Mentor</p>
                  <p className="text-xs font-bold text-[#191c1e] mt-0.5">{myGroup.mentor}</p>
                </div>
                <div className="w-[1px] h-8 bg-[#c3c5d9]/30" />
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-black text-[#737688]">Focus Project</p>
                  <p className="text-xs font-bold text-[#191c1e] mt-0.5 max-w-[200px] truncate" title={myGroup.project}>
                    {myGroup.project}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ANNOUNCEMENT BOARD (LEFT 2/3) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#c3c5d9]/40 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-[#505f76] uppercase tracking-widest flex items-center gap-1.5">
                <Compass size={14} className="text-[#003ec7]" />
                Cohort Announcements
              </h3>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                {announcements.length === 0 ? (
                  <div className="text-center py-10 bg-[#f8f9fa] rounded-xl">
                    <AlertCircle className="text-slate-300 mx-auto mb-2" size={24} />
                    <p className="text-xs text-[#737688] italic">No announcements broadcasted yet.</p>
                  </div>
                ) : (
                  announcements.map(ann => (
                    <div key={ann.id} className="p-4 rounded-xl border border-slate-100 bg-[#fbfcfd] hover:border-[#dde1ff]/60 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-black uppercase tracking-wider text-[#003ec7] bg-[#dde1ff]/40 px-2 py-0.5 rounded">
                          {ann.sender}
                        </span>
                        <span className="text-[9px] text-[#737688]">{ann.date}</span>
                      </div>
                      <p className="text-xs text-[#191c1e] leading-relaxed whitespace-pre-wrap">{ann.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* TEAMMATES ROLL-CALL (RIGHT 1/3) */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-[#c3c5d9]/40 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-[#505f76] uppercase tracking-widest flex items-center gap-1.5">
                <Star size={14} className="text-[#003ec7]" />
                My Cohort Teammates
              </h3>
              
              <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                {teammates.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-xs text-[#737688] italic">You are the first member mapped in this cohort!</p>
                  </div>
                ) : (
                  teammates.map(mate => (
                    <div key={mate.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-[#fdfdfd] hover:bg-slate-50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-[#003ec7]/10 text-[#003ec7] flex items-center justify-center font-bold text-xs">
                        {mate.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#191c1e] truncate">{mate.name}</p>
                        <p className="text-[9px] text-[#737688] truncate">{mate.email}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-[#c3c5d9]/40 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-14 h-14 bg-[#003ec7]/5 text-[#003ec7] rounded-full flex items-center justify-center mb-3 mx-auto animate-pulse">
            <Users2 size={28} />
          </div>
          <h3 className="text-sm font-bold text-[#191c1e]">Awaiting Cohort Assignment</h3>
          <p className="text-xs text-[#737688] mt-2">
            Your profile has not been assigned to a technical cohort group by the administrator yet. Contact support or your manager to map your profile.
          </p>
        </div>
      )}
    </div>
  );
}
