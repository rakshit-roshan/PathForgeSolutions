"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { CheckCircle2, PlayCircle, Lock, Compass, Award, ExternalLink, Calendar, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Stage {
  id: number;
  title: string;
  status: "COMPLETE" | "ACTIVE" | "UPCOMING" | "LOCKED";
  date: string;
  desc: string;
  deliverables: string[];
  skills: string[];
}

const ROADMAP_STAGES: Stage[] = [
  {
    id: 1,
    title: "Onboarding & Orientation",
    status: "COMPLETE",
    date: "Week 1",
    desc: "Platform walkthrough, corporate toolset configuration, and initial role briefings.",
    deliverables: ["Set up local environments", "Complete Git authentication sync", "Submit initial profile bio"],
    skills: ["Company Culture", "Git/Workflow", "Communication"]
  },
  {
    id: 2,
    title: "Core Skills Sprint",
    status: "COMPLETE",
    date: "Week 2-3",
    desc: "Deep-dive training sprints on assigned track technologies and architectural guidelines.",
    deliverables: ["Finish Next.js Advanced course", "Build responsive UI layouts mockup", "Integrate mock REST APIs"],
    skills: ["React/Next.js", "Vanilla CSS", "Tailwind Grid"]
  },
  {
    id: 3,
    title: "Project Assignment & Design",
    status: "ACTIVE",
    date: "Week 4-6",
    desc: "Collaborative project assignment launch with direct mentor sprint check-ins.",
    deliverables: ["Draft technical architecture doc", "Develop timesheet logging drawer", "Setup PostgreSQL schema mapping"],
    skills: ["Spring Boot", "JPA/Hibernate", "SQL Database"]
  },
  {
    id: 4,
    title: "Mid-Term Evaluation",
    status: "UPCOMING",
    date: "Week 7",
    desc: "Comprehensive code and effort review session with cohort mentors and platform admins.",
    deliverables: ["Present demo sprint draft", "Audit timesheet approval ratings", "Address administrative feedback"],
    skills: ["System Architecture", "Security Console", "2FA Integration"]
  },
  {
    id: 5,
    title: "Advanced Deliverables",
    status: "UPCOMING",
    date: "Week 8-10",
    desc: "Final optimization sprints, unit test coverage, and documentation packaging.",
    deliverables: ["Optimize asset rendering speeds", "Write JUnit backend API tests", "Draft swagger endpoint documentation"],
    skills: ["Docker Orchestration", "JUnit Testing", "API Docs"]
  },
  {
    id: 6,
    title: "Completion & Final Report",
    status: "LOCKED",
    date: "Week 11-12",
    desc: "Submit master project dossier, deliver platform presentation, and receive Completion Certificate.",
    deliverables: ["Submit final project dossier", "Pass cohort presentation challenge", "Claim completion LOR & Certificate"],
    skills: ["Enterprise Readiness", "Presentation", "Technical Writing"]
  }
];

const RECOMMENDED_COURSES = [
  { id: "c1", title: "React Advanced Core Patterns", provider: "PathForge Academy", duration: "4h 30m", progress: 100, tag: "Track Core" },
  { id: "c2", title: "Enterprise JPA & Spring Data Masters", provider: "PathForge Academy", duration: "6h 15m", progress: 65, tag: "Track Core" },
  { id: "c3", title: "Corporate Security & JWT Auth Architectures", provider: "PathForge Security", duration: "2h 45m", progress: 0, tag: "Mandatory" }
];

export default function EmployeeRoadmap() {
  const { user } = useAuth();
  const [activeStage, setActiveStage] = useState<number>(3); // Set default to the ACTIVE stage
  const [expandedStage, setExpandedStage] = useState<number | null>(3);
  const [courses, setCourses] = useState(RECOMMENDED_COURSES);
  const [mentorName, setMentorName] = useState("Dr. Rachel Green");

  useEffect(() => {
    // Load mentor name from active cohort if set
    const groupsStr = localStorage.getItem("pf_candidate_groups");
    if (groupsStr && user) {
      const groupsList = JSON.parse(groupsStr);
      const userGroup = groupsList.find((g: any) => g.memberIds.includes(user.id));
      if (userGroup) {
        setMentorName(userGroup.mentor);
      }
    }
  }, [user]);

  const toggleExpandStage = (id: number) => {
    setExpandedStage(expandedStage === id ? null : id);
  };

  const handleStartCourse = (courseId: string, title: string) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId) {
          const nextProgress = c.progress === 0 ? 10 : c.progress === 100 ? 100 : Math.min(c.progress + 15, 100);
          if (nextProgress === 100) {
            toast.success(`Congratulations! You have completed ${title}.`);
          } else {
            toast.success(`Progress saved for ${title}: ${nextProgress}%`);
          }
          return { ...c, progress: nextProgress };
        }
        return c;
      })
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      
      {/* TIMELINE COLUMN (LEFT 7/12) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* ROADMAP CONTAINER */}
        <div className="bg-white p-6 rounded-2xl border border-[#c3c5d9]/40 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#191c1e] flex items-center gap-2">
                <Compass size={18} className="text-[#003ec7]" />
                Career Pathway Roadmap
              </h3>
              <p className="text-[11px] text-[#505f76]">Track your onboarding phases, deliverables, and competency benchmarks.</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#003ec7] bg-[#dde1ff]/45 px-3 py-1 rounded-full">
              Phase 3 of 6 Active
            </span>
          </div>

          {/* DYNAMIC VISUAL TIMELINE */}
          <div className="relative pl-8 border-l border-slate-100 space-y-5 py-2 ml-3">
            {ROADMAP_STAGES.map((stage) => {
              const isCurrent = stage.id === activeStage;
              const isComplete = stage.status === "COMPLETE";
              const isLocked = stage.status === "LOCKED";
              const isExpanded = expandedStage === stage.id;

              return (
                <div key={stage.id} className="relative group">
                  {/* Timeline Dot Indicator */}
                  <div
                    className={`absolute -left-[41px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 ${
                      isComplete
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-emerald-200 shadow-md"
                        : isCurrent
                        ? "bg-[#003ec7] border-[#003ec7] text-white shadow-[#dde1ff] shadow-lg animate-pulse"
                        : isLocked
                        ? "bg-[#eceef0] border-slate-200 text-slate-400"
                        : "bg-white border-slate-300 text-slate-600"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 size={12} strokeWidth={3} />
                    ) : (
                      <span className="text-[9px] font-black">{stage.id}</span>
                    )}
                  </div>

                  {/* Stage Card container */}
                  <div
                    onClick={() => !isLocked && toggleExpandStage(stage.id)}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      isLocked
                        ? "bg-[#f8f9fa] border-slate-200/50 opacity-55 cursor-not-allowed"
                        : isCurrent
                        ? "border-[#003ec7] bg-[#003ec7]/[0.01] hover:bg-[#003ec7]/[0.02] cursor-pointer"
                        : "border-[#c3c5d9]/30 hover:border-slate-300 bg-white cursor-pointer"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`text-xs font-bold ${isCurrent ? "text-[#003ec7]" : "text-[#191c1e]"}`}>
                            {stage.title}
                          </h4>
                          {isCurrent && (
                            <span className="text-[8px] font-black uppercase tracking-widest text-[#003ec7] bg-[#003ec7]/10 px-1.5 py-0.5 rounded">
                              Current Stage
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#505f76] mt-1 line-clamp-2">{stage.desc}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
                        <span className="text-[9px] font-bold text-[#737688]">{stage.date}</span>
                        {!isLocked && (
                          <div className="text-slate-400 hover:text-[#003ec7] transition-colors mt-1">
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* EXPANDABLE DELIVERABLES SECTION */}
                    {isExpanded && !isLocked && (
                      <div className="mt-4 pt-3 border-t border-slate-100/70 space-y-3 animate-slide-down">
                        {/* DELIVERABLES */}
                        <div>
                          <p className="text-[8px] uppercase tracking-widest font-black text-[#737688] mb-1.5">Deliverables Checklist</p>
                          <div className="space-y-1">
                            {stage.deliverables.map((del, dIdx) => (
                              <div key={dIdx} className="flex items-center gap-2 text-[10px] text-[#191c1e]">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isComplete ? "bg-emerald-500" : "bg-[#003ec7]"}`} />
                                <span>{del}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* SKILLS */}
                        <div>
                          <p className="text-[8px] uppercase tracking-widest font-black text-[#737688] mb-1">Key Focus Competencies</p>
                          <div className="flex gap-1.5 flex-wrap">
                            {stage.skills.map((skill, sIdx) => (
                              <span key={sIdx} className="text-[9px] bg-slate-50 border border-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TRAINING & MENTOR DIRECTORY (RIGHT 5/12) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* ACADEMY/COURSES SECTION */}
        <div className="bg-white p-6 rounded-2xl border border-[#c3c5d9]/40 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#191c1e] flex items-center gap-2">
              <Award size={18} className="text-[#003ec7]" />
              Recommended Academy
            </h3>
            <p className="text-[11px] text-[#505f76] mt-0.5">Assigned learning content and certifications.</p>
          </div>

          <div className="space-y-3">
            {courses.map((course) => {
              const completed = course.progress === 100;
              const notStarted = course.progress === 0;

              return (
                <div key={course.id} className="p-4 rounded-xl border border-[#c3c5d9]/25 bg-[#fafbfd] flex flex-col justify-between gap-3 hover:border-[#dde1ff] transition-all">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h4 className="text-[11px] font-bold text-[#191c1e] line-clamp-1">{course.title}</h4>
                      <p className="text-[9px] text-[#737688] mt-0.5">{course.provider} &bull; {course.duration}</p>
                    </div>
                    <span className="text-[8px] font-black uppercase bg-[#003ec7]/10 text-[#003ec7] px-2 py-0.5 rounded shrink-0">
                      {course.tag}
                    </span>
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[9px] font-bold text-[#737688]">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-[#f2f4f6] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#003ec7] h-full rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* BUTTON ACTION */}
                  <button
                    onClick={() => handleStartCourse(course.id, course.title)}
                    className={`w-full py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 border ${
                      completed
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200 cursor-not-allowed"
                        : "bg-white text-[#003ec7] border-[#003ec7]/20 hover:bg-[#003ec7] hover:text-white"
                    }`}
                    disabled={completed}
                  >
                    {completed ? (
                      <>
                        <CheckCircle2 size={12} />
                        Completed & Synced
                      </>
                    ) : notStarted ? (
                      <>
                        <PlayCircle size={12} />
                        Start Module
                      </>
                    ) : (
                      <>
                        <PlayCircle size={12} />
                        Resume Course
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* COHORT MENTOR CONTACT WORKSPACE */}
        <div className="bg-white p-5 rounded-2xl border border-[#c3c5d9]/40 shadow-sm bg-gradient-to-br from-[#003ec7]/5 to-transparent space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003ec7]/15 text-[#003ec7] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px] font-bold">supervisor_account</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#191c1e]">Your Assigned Mentor</p>
              <p className="text-[10px] text-[#505f76] mt-0.5">{mentorName} &bull; Mapped</p>
            </div>
          </div>
          <p className="text-[10px] text-[#737688] leading-relaxed">
            Need design reviews, architecture syncs, or general onboarding guidance? Connect directly with your assigned cohort technical mentor.
          </p>
          <button
            onClick={() => {
              // Redirect or show success
              toast.success("1-on-1 Session review request dispatched to mentor's dashboard!");
            }}
            className="w-full bg-[#003ec7] text-white py-2.5 text-xs font-bold rounded-lg hover:bg-[#0034a7] transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
          >
            <MessageSquare size={14} />
            Request 1-on-1 Call
          </button>
        </div>

      </div>
    </div>
  );
}
