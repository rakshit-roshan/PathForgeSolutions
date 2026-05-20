"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardLocale } from "@/config/dashboard.locale";
import {
  Compass,
  Calendar,
  Clock,
  Video,
  BookOpen,
  ExternalLink,
  Lock,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function MentorshipRoomPage() {
  const { user } = useAuth();
  const locale = dashboardLocale.candidate.mentorship;
  
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);

  const roadmapSteps = [
    {
      title: "Foundational Architecture",
      desc: "Learn microservices configuration, Docker networking, and JPA data modeling foundations.",
      status: "COMPLETED",
      duration: "Weeks 1-2",
    },
    {
      title: "API Design & Enterprise Integration",
      desc: "Build secure RESTful endpoints, implement JWT authorization filters, and structure DTO layers.",
      status: "ACTIVE",
      duration: "Weeks 3-4",
    },
    {
      title: "Cloud Infrastructure & Testing",
      desc: "Configure AWS EC2 virtual compute clusters, build PostgreSQL engines, and execute JUnit/Mockito test layers.",
      status: "LOCKED",
      duration: "Weeks 5-6",
    },
  ];

  return (
    <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
      <div className="border-b border-slate-200/60 pb-5">
        <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded text-[9px] uppercase font-bold tracking-widest font-mono">
          Pathway desk
        </span>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 mt-1">{locale.title}</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Visual Roadmap Stream */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 font-mono">
                {locale.roadmapTitle}
              </h3>
              <span className="text-[9px] bg-slate-50 border border-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded font-mono">
                Track: {user?.internshipTrack || "Fullstack Software Engineering"}
              </span>
            </div>

            <div className="space-y-6 relative pl-4 before:absolute before:left-[21px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-150">
              {roadmapSteps.map((step, idx) => (
                <div key={idx} className="relative pl-8 flex gap-4 items-start group">
                  {/* Status Indicator Dot */}
                  <div className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 bg-white transition-all duration-200 ${
                    step.status === "COMPLETED" ? "border-emerald-500 bg-emerald-500" :
                    step.status === "ACTIVE" ? "border-indigo-600 ring-4 ring-indigo-50" :
                    "border-slate-350"
                  }`}></div>

                  <div className="flex-1 bg-slate-50/30 border border-slate-100 p-4 rounded-xl hover:border-indigo-200 hover:bg-slate-50/50 transition-all">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h4 className="text-xs font-bold text-slate-800">{step.title}</h4>
                      <span className={`text-[8px] font-mono font-extrabold tracking-widest uppercase px-2 py-0.5 rounded ${
                        step.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" :
                        step.status === "ACTIVE" ? "bg-indigo-50 text-indigo-700" :
                        "bg-slate-100 text-slate-500"
                      }`}>
                        {step.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-3">{step.desc}</p>
                    <div className="flex items-center gap-4 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                      <span className="flex items-center gap-1"><BookOpen size={12} /> {step.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 1-on-1 Scheduled Meetings Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[320px]">
            <div>
              <h3 className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 font-mono mb-4">
                {locale.upcomingMeetings}
              </h3>
              
              <div className="border border-indigo-100 bg-indigo-50/20 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-100/20 rounded-full blur-xl -z-10"></div>
                <div className="flex items-center gap-2 text-[9px] font-mono font-extrabold text-indigo-700 uppercase tracking-widest">
                  <Video size={14} className="stroke-[2.5]" /> Google Meet Stream
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Weekly Progress Evaluation</h4>
                  <p className="text-[10px] text-slate-450 font-semibold mt-0.5">With Lead Instructor & Mentor</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wide">
                  <span className="flex items-center gap-1"><Calendar size={12} /> Tomorrow</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> 4:00 PM</span>
                </div>
                <button
                  onClick={() => setMeetingModalOpen(true)}
                  className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all duration-200"
                >
                  {locale.joinButton}
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-6">
              <button
                onClick={() => toast.success("Request for additional 1-on-1 session dispatched.")}
                className="w-full py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-all duration-200"
              >
                Request Mentor Callback
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Detail Modal popup */}
      {meetingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/15 backdrop-blur-[6px]" onClick={() => setMeetingModalOpen(false)}></div>
          
          <div className="bg-white rounded-xl max-w-sm w-full p-6 border border-slate-250 relative z-10 shadow-2xl animate-scale-up">
            <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">Google Meet Stream Details</h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-4">
              Here is your direct connection link and agenda details for the upcoming weekly candidate sync.
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
                <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 font-mono">Google Meet URL</p>
                <a
                  href="https://meet.google.com/abc-defg-hij"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1.5 mt-1"
                >
                  meet.google.com/abc-defg-hij <ExternalLink size={12} />
                </a>
              </div>

              <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100">
                <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 font-mono">Meeting Code</p>
                <p className="text-xs font-mono font-bold text-slate-850 mt-1">abc-defg-hij</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setMeetingModalOpen(false)}
                className="py-1.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-all"
              >
                Close
              </button>
              <a
                href="https://meet.google.com/abc-defg-hij"
                target="_blank"
                rel="noreferrer"
                className="py-1.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider text-center transition-all shadow-sm"
              >
                Join Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
