"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { dailyLogAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { LogOut, X, ShieldAlert, Lock } from "lucide-react";
import "@/styles/dashboard.css";

import EmployeeOverview from "@/components/dashboard/EmployeeOverview";
import EmployeeLogs    from "@/components/dashboard/EmployeeLogs";
import EmployeeGroups  from "@/components/dashboard/EmployeeGroups";
import EmployeeMeetings from "@/components/dashboard/EmployeeMeetings";
import EmployeeVault   from "@/components/dashboard/EmployeeVault";
import EmployeeRoadmap from "@/components/dashboard/EmployeeRoadmap";
import EmployeeProfile from "@/components/dashboard/EmployeeProfile";
import AdminOverview   from "@/components/dashboard/AdminOverview";
import AdminPipeline   from "@/components/dashboard/AdminPipeline";
import AdminGroups     from "@/components/dashboard/AdminGroups";
import AdminMeetings   from "@/components/dashboard/AdminMeetings";
import AdminTimesheets from "@/components/dashboard/AdminTimesheets";
import AdminLetters    from "@/components/dashboard/AdminLetters";
import AdminMail       from "@/components/dashboard/AdminMail";

const DEFAULT_LOGS = [
  { id: 1, logDate: "2026-05-18", hoursWorked: 8.0, tasksDone: "Completed React dashboard overhaul.", mood: "GOOD",    tools: ["React","CSS"] },
  { id: 2, logDate: "2026-05-17", hoursWorked: 7.5, tasksDone: "Backend API integration testing.",    mood: "GREAT",   tools: ["Spring","JPA"] },
  { id: 3, logDate: "2026-05-16", hoursWorked: 9.0, tasksDone: "PDF report compiler finalization.",   mood: "NEUTRAL", tools: ["jsPDF","Git"] },
];
const DEFAULT_DOCS = [
  { id: "off",  name: "Offer_Letter.pdf",             type: "Offer Letter",  date: "May 1, 2026", size: "340 KB", status: "ISSUED" },
  { id: "lor",  name: "Letter_of_Recommendation.pdf", type: "LOR",           date: "Pending",     size: "—",      status: "SUSPENDED" },
  { id: "cert", name: "Completion_Certificate.pdf",   type: "Certificate",   date: "Pending",     size: "—",      status: "PENDING" },
];
const DEFAULT_MEETINGS = [
  { id: "m1", title: "Weekly Standup", type: "GROUP",  date: "2026-05-20", time: "09:30", link: "https://meet.google.com/abc-defg-hij", status: "SCHEDULED" },
  { id: "m2", title: "Mentor 1-on-1", type: "1-ON-1", date: "2026-05-23", time: "14:00", link: "https://meet.google.com/xyz-abcd-efg", status: "CONFIRMED" },
];
const DEFAULT_NOTIFS = [
  { id: "n1", text: "Admin approved your Week 20 timesheet.", time: "2 mins ago", read: false },
  { id: "n2", text: "New document available: Offer Letter.",  time: "1 hr ago",   read: false },
  { id: "n3", text: "Meeting scheduled: Weekly Standup.",     time: "3 hrs ago",  read: true  },
];

const EMP_NAV = [
  { id: "OVERVIEW", label: "Overview",  icon: "dashboard" },
  { id: "LOGS",     label: "Daily Logs",icon: "history_edu" },
  { id: "GROUPS",   label: "My Group",   icon: "groups" },
  { id: "VAULT",    label: "Documents", icon: "folder" },
  { id: "ROADMAP",  label: "Roadmap",   icon: "explore" },
  { id: "PROFILE",  label: "Profile",   icon: "account_circle" },
];
const ADM_NAV = [
  { id: "OVERVIEW",   label: "Overview",   icon: "dashboard" },
  { id: "PIPELINE",   label: "Pipeline",   icon: "people" },
  { id: "GROUPS",     label: "Groups",     icon: "groups" },
  { id: "MEETINGS",   label: "Meetings",   icon: "video_call" },
  { id: "TIMESHEETS", label: "Timesheets", icon: "inbox" },
  { id: "LETTERS",    label: "Letters",    icon: "description" },
  { id: "MAIL",       label: "Outreach",   icon: "mail" },
];

// ── True 3D Tilt ID Card — Ultra-Premium Billionaire Art-Deco Visiting Card ───
function IDCard3D({ user, roleLabel }: { user: any; roleLabel: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [floating, setFloating] = useState(true);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    setFloating(false);
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const rotY =  (dx / (rect.width  / 2)) * 22;
      const rotX = -(dy / (rect.height / 2)) * 22;
      const gx = ((e.clientX - rect.left) / rect.width)  * 100;
      const gy = ((e.clientY - rect.top)  / rect.height) * 100;
      
      // Beautiful 3D rotation with perspective
      setTransform(`perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.06,1.06,1.06)`);
      // Spectacular iridescent glare opacity
      setGlare({ x: gx, y: gy, opacity: 0.35 });
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
    setGlare(g => ({ ...g, opacity: 0 }));
    setTimeout(() => setFloating(true), 600);
  }, []);

  const initials = user.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
    : "PF";

  return (
    <div style={{ perspective: "1000px" }} className="w-full flex items-center justify-center py-5">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform,
          transition: floating ? "transform 3.2s ease-in-out" : "transform 0.08s linear",
          transformStyle: "preserve-3d",
          willChange: "transform",
          animation: floating ? "id-float 6s ease-in-out infinite" : "none",
        }}
        className="relative w-[320px] h-[200px] rounded-2xl cursor-pointer select-none"
      >
        {/* ── Outer Gold Foil Bevel Rim ── */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden p-[1px]" style={{
          background: "linear-gradient(135deg, #d4af37 0%, #ffffff 30%, #b8860b 50%, #f5e070 70%, #8a640f 100%)",
          boxShadow: "0 35px 75px -15px rgba(0,0,0,0.85), inset 0 1px 1px rgba(255,255,255,0.4)"
        }}>
          
          {/* ── Main Matte Obsidian Body ── */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden" style={{
            background: "linear-gradient(145deg, #0e1118 0%, #06080c 60%, #020305 100%)",
          }}>

            {/* Split Diamond Accent Panel Background */}
            <div className="absolute inset-0 opacity-[0.35] mix-blend-overlay" style={{
              background: "linear-gradient(45deg, transparent 49%, rgba(212,175,55,0.2) 50%, transparent 51%)"
            }} />

            {/* Luxury Micro-Velvet Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            }} />

            {/* ── Sacred Geometry / Golden Constellation Art Deco SVG Pattern ── */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.22] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              {/* Circular astronomical orbits */}
              <circle cx="270" cy="50" r="90" stroke="url(#gold-foil)" strokeWidth="0.8" fill="none" />
              <circle cx="270" cy="50" r="130" stroke="url(#gold-foil)" strokeWidth="0.5" strokeDasharray="3,3" fill="none" />
              <circle cx="270" cy="50" r="55" stroke="url(#gold-foil)" strokeWidth="0.6" fill="none" />
              
              {/* Star-burst / alignment paths */}
              <path d="M-20,-20 L340,220" stroke="url(#gold-foil)" strokeWidth="0.4" />
              <path d="M340,-20 L-20,220" stroke="url(#gold-foil)" strokeWidth="0.4" />
              <path d="M160,-20 L160,220" stroke="url(#gold-foil)" strokeWidth="0.4" strokeDasharray="4,4" />
              <path d="M-20,100 L340,100" stroke="url(#gold-foil)" strokeWidth="0.3" strokeDasharray="4,4" />
              
              {/* Art Deco Concentric Diamond Facets */}
              <rect x="135" y="75" width="50" height="50" rx="5" transform="rotate(45 160 100)" stroke="url(#gold-foil)" strokeWidth="0.8" fill="none" />
              <rect x="125" y="65" width="70" height="70" rx="7" transform="rotate(45 160 100)" stroke="url(#gold-foil)" strokeWidth="0.5" strokeDasharray="2,2" fill="none" />
              <circle cx="160" cy="100" r="6" fill="url(#gold-foil)" />

              <defs>
                <linearGradient id="gold-foil" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8a640f" />
                  <stop offset="30%" stopColor="#f5e070" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="70%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#b8860b" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inset Gold Border Frame */}
            <div className="absolute inset-2.5 rounded-xl pointer-events-none" style={{
              border: "1px solid rgba(212,175,55,0.22)",
              background: "transparent",
              boxShadow: "inset 0 0 15px rgba(212,175,55,0.05)"
            }} />

            {/* Inset Double Thin Corner Brackets */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: "rgba(212,175,55,0.4)" }} />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: "rgba(212,175,55,0.4)" }} />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: "rgba(212,175,55,0.4)" }} />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: "rgba(212,175,55,0.4)" }} />

            {/* ── Dynamic Holographic Specular Auroral Foil Glare ── */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity * 0.7}) 0%, rgba(255,223,128,${glare.opacity * 0.45}) 20%, rgba(135,206,250,${glare.opacity * 0.3}) 45%, rgba(212,175,55,${glare.opacity * 0.15}) 60%, transparent 80%)`,
              mixBlendMode: "color-dodge",
              transition: "background 0.08s ease",
            }} />

            {/* ── Content Grid ── */}
            <div className="relative z-10 h-full flex flex-col justify-between p-6">
              
              {/* TOP ROW: Brand and Raised Emblem */}
              <div className="flex justify-between items-start">
                <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
                  <p className="text-[10px] uppercase tracking-[0.35em] font-medium" style={{
                    background: "linear-gradient(135deg, #f5e070 0%, #d4af37 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontFamily: "Inter, sans-serif"
                  }}>
                    PathForge Solutions
                  </p>
                  <p className="text-[7px] uppercase tracking-[0.2em] font-semibold mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Corporate Onboarding
                  </p>
                </div>

                {/* Gilded Monogram Seal */}
                <div className="relative" style={{ transform: "translateZ(45px)" }}>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center p-[1px]" style={{
                    background: "linear-gradient(135deg, #d4af37 0%, #ffffff 30%, #b8860b 60%, #f5e070 100%)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.2)"
                  }}>
                    <div className="w-full h-full rounded-full flex items-center justify-center bg-[#07090f] relative overflow-hidden">
                      {/* Sunburst pattern in emblem */}
                      <div className="absolute inset-0 opacity-[0.2] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,1)_0%,transparent_70%)]" />
                      <span className="text-[12px] font-black tracking-wider text-center" style={{
                        background: "linear-gradient(135deg, #f5e070 0%, #d4af37 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        textShadow: "0 1px 2px rgba(0,0,0,0.5)"
                      }}>
                        {initials}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MIDDLE ROW: Name and Role Details */}
              <div style={{ transform: "translateZ(35px)", transformStyle: "preserve-3d" }}>
                <h3 className="text-xl font-light tracking-[0.08em] text-white leading-tight">
                  {user.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                  <p className="text-[9px] uppercase tracking-[0.25em] font-medium" style={{ color: "#d4af37" }}>
                    {roleLabel}
                  </p>
                </div>
              </div>

              {/* BOTTOM ROW: System Identifiers */}
              <div className="flex justify-between items-end" style={{ transform: "translateZ(25px)" }}>
                <div>
                  <p className="text-[7px] font-mono tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.25)" }}>
                    SECURE ACCESS PIN: AUTH-ONBRD
                  </p>
                  <p className="text-[6px] font-mono tracking-[0.1em] mt-0.5" style={{ color: "rgba(255,255,255,0.15)" }}>
                    PF-ID: {new Date().getFullYear()}-PENDING
                  </p>
                </div>

                {/* Exquisite Gold Foil Badge */}
                <span className="text-[7px] uppercase tracking-[0.25em] font-bold px-2.5 py-1 rounded" style={{
                  border: "1px solid rgba(212,175,55,0.4)",
                  color: "#d4af37",
                  background: "linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.02) 100%)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                }}>
                  PENDING
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* Card bottom shadow bloom (gold ambiance glow) */}
        <div className="absolute -bottom-5 left-10 right-10 h-10 rounded-full" style={{
          background: "rgba(212,175,55,0.18)",
          filter: "blur(18px)",
          transform: "translateZ(-15px)",
          opacity: 0.8
        }} />
      </div>
    </div>
  );
}

// ── Locked pending state ──────────────────────────────────────────────────────
function LockedState({ user, roleLabel }: { user: any; roleLabel: string }) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl shrink-0">
          <ShieldAlert size={28} strokeWidth={1.5} />
        </div>
        <div className="space-y-1.5">
          <p className="text-[11px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping inline-block" />
            Account Pending Administrator Activation
          </p>
          <p className="text-sm text-[#434656] leading-relaxed">
            Welcome to PathForge Workspace, <strong className="text-[#191c1e]">{user.name}</strong>. Your account is in a secure onboarding state.
            Access to the full platform will unlock once an administrator verifies and activates your credentials.
          </p>
        </div>
      </div>

      {/* Preview row */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* 3D Identity Card */}
        <div className="lg:col-span-4 glass-card py-6 px-4 flex flex-col items-center justify-center gap-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#737688]">Identity Preview</p>
          <IDCard3D user={user} roleLabel={roleLabel} />
          <p className="text-[9px] text-[#c3c5d9] font-medium tracking-wide">Hover to interact</p>
        </div>

        {/* Skeleton locked panel */}
        <div className="lg:col-span-8 glass-card relative overflow-hidden min-h-[240px]">
          <div className="absolute inset-0 bg-[#f7f9fb]/70 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl">
            <div className="bg-white border border-[#c3c5d9] text-[#505f76] font-mono text-[10px] uppercase tracking-widest font-black px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2">
              <Lock size={14} className="text-[#003ec7]" />
              Awaiting Admin Track Activation
            </div>
          </div>
          <div className="p-8 space-y-4 opacity-10 select-none pointer-events-none">
            <div className="h-6 bg-[#e0e3e5] rounded-lg skeleton w-1/3" />
            <div className="h-14 bg-[#e0e3e5] rounded-xl skeleton" />
            <div className="grid grid-cols-3 gap-3">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-[#e0e3e5] rounded-xl skeleton" />)}
            </div>
            <div className="h-6 bg-[#e0e3e5] rounded-lg skeleton w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Notifications dropdown ────────────────────────────────────────────────────
function NotifDropdown({ 
  notifs, 
  onClose, 
  onMarkAll, 
  onMarkSingle, 
  onDeleteSingle, 
  onClearAll 
}: { 
  notifs: any[]; 
  onClose: () => void; 
  onMarkAll: () => void; 
  onMarkSingle: (id: string) => void; 
  onDeleteSingle: (id: string) => void; 
  onClearAll: () => void; 
}) {
  return (
    <div className="notif-dropdown absolute top-[calc(100%+8px)] right-0 w-80 z-50 overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.08)] rounded-2xl animate-fade-in select-none font-sans font-light">
      <div className="px-4 py-3.5 border-b border-[#c3c5d9]/10 flex justify-between items-center bg-white/20">
        <span className="text-[11px] font-medium tracking-wider uppercase text-slate-800">Notifications</span>
        <div className="flex items-center gap-2 text-[10px] font-light text-slate-500">
          <button 
            type="button"
            onClick={onMarkAll} 
            className="hover:text-[#003ec7] transition-colors"
          >
            Mark Read
          </button>
          <span className="opacity-30">|</span>
          <button 
            type="button"
            onClick={onClearAll} 
            className="hover:text-rose-600 transition-colors"
          >
            Clear All
          </button>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 hover:bg-white/30 rounded-full ml-1"
          >
            <X size={12} />
          </button>
        </div>
      </div>
      <div className="max-h-64 overflow-y-auto custom-scrollbar divide-y divide-[#c3c5d9]/10">
        {notifs.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#505f76] flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-slate-400/50 text-2xl font-light">notifications_off</span>
            <p className="font-light text-slate-500">No active notifications</p>
          </div>
        ) : (
          notifs.map(n => (
            <div 
              key={n.id} 
              onClick={() => !n.read && onMarkSingle(n.id)}
              className={`px-4 py-3.5 hover:bg-white/20 transition-all flex items-start gap-3 group cursor-pointer ${
                !n.read ? "bg-white/30" : ""
              }`}
            >
              {/* Thin Dot indicator */}
              <div className="mt-1 shrink-0">
                <span className={`block w-1.5 h-1.5 rounded-full ${!n.read ? "bg-[#003ec7] shadow-[0_0_8px_rgba(0,62,199,0.5)]" : "bg-slate-300"}`} />
              </div>
              
              {/* Content with fine light typography */}
              <div className="flex-1 min-w-0">
                <p className={`text-[11px] leading-snug transition-colors tracking-wide font-light ${!n.read ? "text-slate-900 font-normal" : "text-slate-500"}`}>
                  {n.text}
                </p>
                <p className="text-[9px] text-[#737688] font-light mt-1 opacity-70">{n.time}</p>
              </div>

              {/* Individual delete trigger */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSingle(n.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-50/50 text-slate-400 hover:text-rose-600 rounded-md transition-all shrink-0 self-center"
              >
                <span className="material-symbols-outlined text-[15px] font-light">close</span>
              </button>
            </div>
          ))
        )}
      </div>
      <div className="bg-white/10 p-2 text-center border-t border-[#c3c5d9]/10">
        <span className="text-[8px] font-light tracking-widest text-slate-500 uppercase">PathForge Notification Registry</span>
      </div>
    </div>
  );
}

// ── Enterprise App Launcher Dropdown ──────────────────────────────────────────
function AppsDropdown({ 
  onClose, 
  onLaunchApp, 
  isAdmin 
}: { 
  onClose: () => void; 
  onLaunchApp: (sec: string) => void; 
  isAdmin: boolean; 
}) {
  const apps = isAdmin 
    ? [
        { id: "OVERVIEW",   name: "Overview Hub",   desc: "System metrics & pipeline", icon: "dashboard", color: "text-[#003ec7] bg-[#003ec7]/5 border-blue-100/30" },
        { id: "PIPELINE",   name: "Intern Manager", desc: "Approve candidate enrollments",      icon: "people",    color: "text-emerald-600 bg-emerald-50/50 border-emerald-100/30" },
        { id: "GROUPS",     name: "Cohort Groups",  desc: "Form squads & map mentors",     icon: "groups",    color: "text-purple-600 bg-purple-50/50 border-purple-100/30" },
        { id: "MEETINGS",   name: "Meet Scheduler", desc: "Book Standups with Meet/Zoom",  icon: "video_call",color: "text-pink-600 bg-pink-50/50 border-pink-100/30" },
        { id: "TIMESHEETS", name: "Log Auditor",    desc: "Verify or approve daily logs", icon: "inbox",     color: "text-amber-600 bg-amber-50/50 border-amber-100/30" },
        { id: "LETTERS",    name: "Doc Factory",    desc: "Release LORs and certificates",       icon: "description",color: "text-indigo-600 bg-indigo-50/50 border-indigo-100/30" },
      ]
    : [
        { id: "OVERVIEW", name: "Overview Hub",  desc: "Personal statistics & alerts",  icon: "dashboard", color: "text-[#003ec7] bg-[#003ec7]/5 border-blue-100/30" },
        { id: "LOGS",     name: "Daily Logs",    desc: "Submit daily work logs & hours",       icon: "history_edu",color: "text-emerald-600 bg-emerald-50/50 border-emerald-100/30" },
        { id: "GROUPS",   name: "My Team Cohort", desc: "Interact with squad peers",   icon: "groups",    color: "text-purple-600 bg-purple-50/50 border-purple-100/30" },
        { id: "VAULT",    name: "Secure Vault",  desc: "Preview official letters",    icon: "folder",    color: "text-amber-600 bg-amber-50/50 border-amber-100/30" },
        { id: "ROADMAP",  name: "Career Academy", desc: "Track tasks & certificate",  icon: "explore",   color: "text-pink-600 bg-pink-50/50 border-pink-100/30" },
        { id: "PROFILE",  name: "My Profile",    desc: "Manage security & contact bio",      icon: "account_circle",color: "text-indigo-600 bg-indigo-50/50 border-indigo-100/30" },
      ];

  return (
    <div className="apps-dropdown absolute top-[calc(100%+8px)] right-0 w-[340px] z-50 overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.08)] rounded-2xl animate-fade-in select-none font-sans font-light">
      <div className="px-4 py-3.5 border-b border-[#c3c5d9]/10 flex justify-between items-center bg-white/20">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#003ec7] text-[16px] font-light">widgets</span>
          <span className="text-[11px] font-medium tracking-wider uppercase text-slate-800">PathForge App Suite</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 hover:bg-white/30 rounded-full">
          <X size={12} />
        </button>
      </div>
      <div className="p-3.5 grid grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto custom-scrollbar">
        {apps.map(app => (
          <button
            key={app.id}
            onClick={() => {
              onLaunchApp(app.id);
              onClose();
            }}
            className="flex flex-col items-start text-left p-3 rounded-xl border border-[#c3c5d9]/10 hover:border-white/60 hover:bg-white/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all group"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${app.color} border mb-2 group-hover:scale-105 transition-transform shrink-0`}>
              <span className="material-symbols-outlined text-[16px] font-light">{app.icon}</span>
            </div>
            <p className="text-[10px] font-normal text-slate-800 leading-snug">{app.name}</p>
            <p className="text-[8px] text-[#737688] font-light mt-0.5 leading-snug line-clamp-2">{app.desc}</p>
          </button>
        ))}
      </div>
      <div className="bg-white/10 p-2 text-center border-t border-[#c3c5d9]/10">
        <span className="text-[8px] font-light tracking-widest text-[#003ec7] uppercase">PathForge Suite Console</span>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [section, setSection]     = useState("OVERVIEW");
  const [logs, setLogs]           = useState<any[]>([]);

  useEffect(() => {
    if (user && user.role !== "ADMIN" && user.status !== "PENDING") {
      dailyLogAPI.getMyLogs()
        .then(res => {
          const mappedLogs = res.data.map((l: any) => ({
            ...l,
            tools: l.tools ? l.tools.split(",") : []
          }));
          setLogs(mappedLogs);
        })
        .catch(err => {
          console.error("Error fetching my logs", err);
          toast.error("Failed to sync daily logs.");
        });
    }
  }, [user]);
  const [docs]                    = useState(DEFAULT_DOCS);
  const [mobileSideOpen, setMobileSideOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [appsOpen, setAppsOpen]   = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifs, setNotifs]       = useState<any[]>([]);

  const notifWrapperRef = useRef<HTMLDivElement>(null);
  const appsWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifOpen && notifWrapperRef.current && !notifWrapperRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (appsOpen && appsWrapperRef.current && !appsWrapperRef.current.contains(event.target as Node)) {
        setAppsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notifOpen, appsOpen]);

  const loadNotifications = useCallback(() => {
    if (!user) return;
    try {
      const notifKey = "pf_system_notifications";
      const saved = localStorage.getItem(notifKey);
      let list = saved ? JSON.parse(saved) : [];

      if (!saved) {
        // Initialize default notifications if not set
        const initial = DEFAULT_NOTIFS.map(n => ({
          ...n,
          userId: user.role === "ADMIN" ? "admin" : user.id
        }));
        localStorage.setItem(notifKey, JSON.stringify(initial));
        list = initial;
      }

      // Filter notifications based on role/id
      const filtered = list.filter((n: any) => {
        if (user.role === "ADMIN") {
          return n.userId === "admin" || n.userId === null || n.userId === undefined;
        } else {
          return n.userId === user.id;
        }
      });

      setNotifs(filtered);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Poll notifications every 4 seconds to sync seamlessly between roles
      const interval = setInterval(loadNotifications, 4000);
      return () => clearInterval(interval);
    }
  }, [user, loadNotifications]);

  if (!user) return null;

  const isAdmin   = user.role === "ADMIN";
  const isPending = user.status === "PENDING";
  const roleLabel = user.internshipTrack || "Associate";
  const unread    = notifs.filter(n => !n.read).length;
  const navItems  = isAdmin ? ADM_NAV : EMP_NAV;

  const markAllRead = () => {
    if (!user) return;
    try {
      const notifKey = "pf_system_notifications";
      const saved = localStorage.getItem(notifKey);
      if (saved) {
        const list = JSON.parse(saved);
        const updated = list.map((n: any) => {
          if (user.role === "ADMIN") {
            if (n.userId === "admin" || n.userId === null || n.userId === undefined) {
              return { ...n, read: true };
            }
          } else {
            if (n.userId === user.id) {
              return { ...n, read: true };
            }
          }
          return n;
        });
        localStorage.setItem(notifKey, JSON.stringify(updated));
        loadNotifications();
        toast.success("All notifications marked as read.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markSingleRead = (id: string) => {
    try {
      const notifKey = "pf_system_notifications";
      const saved = localStorage.getItem(notifKey);
      if (saved) {
        const list = JSON.parse(saved);
        const updated = list.map((n: any) => n.id === id ? { ...n, read: true } : n);
        localStorage.setItem(notifKey, JSON.stringify(updated));
        loadNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSingleNotif = (id: string) => {
    try {
      const notifKey = "pf_system_notifications";
      const saved = localStorage.getItem(notifKey);
      if (saved) {
        const list = JSON.parse(saved);
        const updated = list.filter((n: any) => n.id !== id);
        localStorage.setItem(notifKey, JSON.stringify(updated));
        loadNotifications();
        toast.success("Notification cleared.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clearAllNotifs = () => {
    if (!user) return;
    try {
      const notifKey = "pf_system_notifications";
      const saved = localStorage.getItem(notifKey);
      if (saved) {
        const list = JSON.parse(saved);
        const updated = list.filter((n: any) => {
          if (user.role === "ADMIN") {
            return !(n.userId === "admin" || n.userId === null || n.userId === undefined);
          } else {
            return n.userId !== user.id;
          }
        });
        localStorage.setItem(notifKey, JSON.stringify(updated));
        loadNotifications();
        toast.success("All notifications cleared.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const navigate = (s: string) => {
    setSection(s);
    setMobileSideOpen(false);
  };

  const renderSection = () => {
    if (!isAdmin && isPending) return <LockedState user={user} roleLabel={roleLabel} />;
    if (isAdmin) {
      switch (section) {
        case "PIPELINE":   return <AdminPipeline />;
        case "GROUPS":     return <AdminGroups />;
        case "MEETINGS":   return <AdminMeetings />;
        case "TIMESHEETS": return <AdminTimesheets />;
        case "LETTERS":    return <AdminLetters />;
        case "MAIL":       return <AdminMail />;
        default:           return <AdminOverview onNavigate={navigate} />;
      }
    }
    switch (section) {
      case "LOGS":    return <EmployeeLogs logs={logs} onAddLog={e => setLogs(p => [e, ...p])} />;
      case "GROUPS":  return <EmployeeGroups />;
      case "MEETINGS":return <EmployeeMeetings />;
      case "VAULT":   return <EmployeeVault docs={docs} />;
      case "ROADMAP": return <EmployeeRoadmap />;
      case "PROFILE": return <EmployeeProfile user={user} roleLabel={roleLabel} />;
      default:        return <EmployeeOverview logs={logs} user={user} roleLabel={roleLabel} onNavigate={navigate} />;
    }
  };

  // Page heading matches sample UI pattern
  const EMP_HEADINGS: Record<string, { heading: string; sub: string }> = {
    OVERVIEW: { heading: "Overview Hub",      sub: `${roleLabel} Dashboard` },
    LOGS:     { heading: "Daily Log Console", sub: `${roleLabel} Dashboard` },
    GROUPS:   { heading: "My Cohort Group",   sub: `${roleLabel} Dashboard` },
    MEETINGS: { heading: "Meetings Console",  sub: `${roleLabel} Dashboard` },
    VAULT:    { heading: "Document Vault",    sub: `${roleLabel} Dashboard` },
    ROADMAP:  { heading: "Career Roadmap",    sub: `${roleLabel} Dashboard` },
    PROFILE:  { heading: "Identity & Profile", sub: `${roleLabel} Dashboard` },
  };
  const ADM_HEADINGS: Record<string, { heading: string; sub: string }> = {
    OVERVIEW:   { heading: "Management Overview", sub: "Administrator Control Panel" },
    PIPELINE:   { heading: "Employee Pipeline",   sub: "Administrator Control Panel" },
    GROUPS:     { heading: "Group Cohorts",       sub: "Administrator Control Panel" },
    MEETINGS:   { heading: "Meeting Scheduler",   sub: "Administrator Control Panel" },
    TIMESHEETS: { heading: "Timesheet Inbox",     sub: "Administrator Control Panel" },
    LETTERS:    { heading: "Document Factory",    sub: "Administrator Control Panel" },
    MAIL:       { heading: "Outreach Engine",     sub: "Administrator Control Panel" },
  };
  const pageTitle = isAdmin
    ? (ADM_HEADINGS[section] || ADM_HEADINGS.OVERVIEW)
    : (EMP_HEADINGS[section] || EMP_HEADINGS.OVERVIEW);

  return (
    <div className="dashboard-canvas min-h-screen relative font-sans font-light bg-slate-50/50">

      {/* ── END-TO-END FIXED TOP HEADER (logo sits in top-left) ────────────── */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white/40 backdrop-blur-xl border-b border-white/60 flex items-center px-6 justify-between gap-6 select-none shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        {/* Left: Desktop Logo + Mobile Menu Button + Search */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Desktop Logo branding */}
          <div className={`hidden md:flex flex-col justify-center transition-all duration-300 shrink-0 border-r border-[#c3c5d9]/20 pr-4 ${
            sidebarCollapsed ? "w-[28px]" : "w-[232px]"
          }`}>
            {sidebarCollapsed ? (
              <div className="flex items-center justify-center" title="PathForge Talent Portal">
                <span className="block w-2.5 h-2.5 rounded-full bg-[#003ec7] shadow-[0_0_8px_rgba(0,62,199,0.5)]" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="block w-2 h-2 rounded-full bg-[#003ec7] shadow-[0_0_8px_rgba(0,62,199,0.4)]" />
                  <h1 className="text-sm font-bold tracking-tight text-[#191c1e] font-sans">PathForge</h1>
                </div>
                <p className="text-[8px] font-black tracking-widest text-[#737688] uppercase mt-0.5">{isAdmin ? "Admin Suite" : "Talent Suite"}</p>
              </>
            )}
          </div>

          <button
            className="md:hidden p-1.5 hover:bg-[#eceef0] rounded-lg transition-colors shrink-0"
            onClick={() => setMobileSideOpen(true)}
          >
            <span className="material-symbols-outlined text-[#505f76] font-light">menu</span>
          </button>
          
          {/* Search — disabled when pending */}
          <div className={`relative hidden md:block flex-1 max-w-xs ${isPending ? "opacity-30 pointer-events-none" : ""}`}>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737688] text-[18px] font-light">search</span>
            <input
              disabled={isPending}
              className="w-full bg-[#eceef0]/60 border-none rounded-lg pl-9 pr-4 py-1.5 text-xs font-light focus:outline-none focus:ring-1 focus:ring-[#003ec7]/30 text-[#191c1e] placeholder:text-[#737688]/70 disabled:cursor-not-allowed"
              placeholder="Search workspaces..."
              type="text"
            />
          </div>
        </div>

        {/* Right: Page Heading + Notification + Apps + User Avatar */}
        <div className={`flex items-center gap-5 shrink-0 ${isPending ? "pointer-events-none" : ""}`}>
          {/* Page heading (desktop only) */}
          <div className="hidden lg:block text-right">
            <p className="text-[8px] font-light uppercase tracking-widest text-[#737688]">{pageTitle.sub}</p>
            <h2 className="text-xs font-bold text-[#191c1e] leading-none mt-0.5">{pageTitle.heading}</h2>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-6 bg-[#c3c5d9]/30" />

          {/* Notification bell — disabled when pending */}
          <div className={`relative ${isPending ? "opacity-30" : ""}`} ref={notifWrapperRef}>
            <button
              onClick={() => !isPending && setNotifOpen(!notifOpen)}
              disabled={isPending}
              className="material-symbols-outlined text-[#505f76] hover:text-[#003ec7] transition-colors cursor-pointer bg-transparent border-none p-0 text-[20px] font-light"
            >
              notifications
            </button>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#003ec7] text-white text-[7px] font-black rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
            {notifOpen && !isPending && (
              <NotifDropdown
                notifs={notifs}
                onClose={() => setNotifOpen(false)}
                onMarkAll={markAllRead}
                onMarkSingle={markSingleRead}
                onDeleteSingle={deleteSingleNotif}
                onClearAll={clearAllNotifs}
              />
            )}
          </div>

          {/* Apps grid icon — disabled when pending */}
          <div className="relative" ref={appsWrapperRef}>
            <button
              type="button"
              onClick={() => !isPending && setAppsOpen(!appsOpen)}
              disabled={isPending}
              className={`material-symbols-outlined text-[#505f76] hover:text-[#003ec7] transition-colors cursor-pointer bg-transparent border-none p-0 text-[20px] font-light ${
                isPending ? "opacity-30 pointer-events-none" : ""
              }`}
            >
              apps
            </button>
            {appsOpen && !isPending && (
              <AppsDropdown
                onClose={() => setAppsOpen(false)}
                onLaunchApp={navigate}
                isAdmin={isAdmin}
              />
            )}
          </div>

          {/* Avatar */}
          <div className={`h-7 w-7 rounded-full bg-[#dde1ff] border border-[#003ec7]/20 flex items-center justify-center overflow-hidden shrink-0 ${
            isPending ? "opacity-40" : ""
          }`}>
            <span className="text-[10px] font-bold text-[#003ec7]">{user.name?.charAt(0)?.toUpperCase() || "U"}</span>
          </div>
        </div>

        {/* Frosted overlay on header when PENDING */}
        {isPending && (
          <div className="absolute inset-0 z-10 pointer-events-none" style={{
            background: "linear-gradient(135deg, transparent 0%, rgba(247,249,251,0.1) 100%)"
          }} />
        )}
      </header>

      {/* ── FIXED COLLAPSIBLE DESKTOP SIDEBAR (starts below header) ──────────────── */}
      <aside className={`fixed left-0 top-16 bottom-0 z-40 sidebar-glass hidden md:flex flex-col p-4 transition-all duration-300 border-r border-[#c3c5d9]/25 select-none ${
        sidebarCollapsed ? "w-[76px]" : "w-[280px]"
      }`}>
        {/* Floating absolute toggle button in top right border edge */}
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-3.5 w-6 h-6 rounded-full bg-white border border-[#c3c5d9]/35 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center text-[#505f76] hover:text-[#003ec7] hover:bg-slate-50 transition-all z-50 cursor-pointer"
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <span className="material-symbols-outlined text-[13px] font-medium leading-none">
            {sidebarCollapsed ? "chevron_right" : "chevron_left"}
          </span>
        </button>

        {/* User Card / Circular initial */}
        {sidebarCollapsed ? (
          <div className="mb-6 h-9 w-9 rounded-full bg-[#dde1ff]/80 border border-[#003ec7]/25 flex items-center justify-center shrink-0 mx-auto transition-all duration-300" title={user.name}>
            <span className="text-xs font-bold text-[#003ec7]">{user.name?.charAt(0)?.toUpperCase()}</span>
          </div>
        ) : (
          <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-[#c3c5d9]/20 transition-all duration-300">
            <p className="text-[8px] font-black text-[#737688] uppercase tracking-widest">Active User</p>
            <p className="text-xs font-bold text-[#191c1e] truncate mt-0.5">{user.name}</p>
            <span className="mt-1 inline-block text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#dde1ff] text-[#003ec7]">
              {isAdmin ? "Admin" : roleLabel.split(" ")[0]}
            </span>
          </div>
        )}

        {/* Nav Items */}
        <div className="flex-1 relative">
          <nav className={`space-y-1 ${isPending ? "opacity-30 pointer-events-none select-none" : ""}`}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                disabled={isPending}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center transition-all ${
                  sidebarCollapsed ? "justify-center px-0 py-3 rounded-xl" : "px-4 py-3 gap-3 rounded-xl"
                } ${
                  section === item.id
                    ? "text-[#003ec7] font-bold bg-[#003ec7]/5 border-r-2 border-[#003ec7]"
                    : "text-[#505f76] hover:bg-[#003ec7]/5 hover:text-[#191c1e]"
                }`}
              >
                <span className="material-symbols-outlined text-[20px] font-light">{item.icon}</span>
                {!sidebarCollapsed && <span className="text-xs font-light tracking-wide">{item.label}</span>}
              </button>
            ))}
          </nav>
          {isPending && <div className="absolute inset-0 rounded-lg cursor-not-allowed" />}
        </div>

        {/* Bottom actions (Settings, Logout) */}
        <div className="space-y-1 border-t border-[#c3c5d9]/20 pt-4">
          {/* Settings */}
          <button
            onClick={() => !isPending && toast("Settings coming soon.")}
            disabled={isPending}
            className={`w-full flex items-center transition-colors text-left ${
              sidebarCollapsed ? "justify-center px-0 py-3" : "px-4 py-3 gap-3"
            } ${
              isPending
                ? "opacity-25 cursor-not-allowed text-[#737688] pointer-events-none"
                : "text-[#505f76] hover:bg-[#003ec7]/5 hover:text-[#191c1e] rounded-xl"
            }`}
            title={sidebarCollapsed ? "Settings" : undefined}
          >
            <span className="material-symbols-outlined text-[20px] font-light">settings</span>
            {!sidebarCollapsed && <span className="text-xs font-light tracking-wide">Settings</span>}
          </button>

          {/* Logout */}
          <button
            onClick={() => { logout(); toast.success("Logged out successfully."); }}
            className={`w-full flex items-center transition-colors text-left font-medium text-rose-600 hover:bg-rose-50 ${
              sidebarCollapsed ? "justify-center px-0 py-3" : "px-4 py-3 gap-3"
            } rounded-xl`}
            title={sidebarCollapsed ? "Logout" : undefined}
          >
            <LogOut size={16} />
            {!sidebarCollapsed && <span className="text-xs font-light tracking-wide">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ────────────────────────────────────────── */}
      {mobileSideOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/30 z-40"
            onClick={() => setMobileSideOpen(false)}
          />
          <aside className="md:hidden fixed left-0 top-0 h-screen w-[280px] sidebar-glass flex flex-col p-6 z-50">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-sm font-bold text-[#003ec7] tracking-tight">PathForge</h1>
              <button onClick={() => setMobileSideOpen(false)} className="p-1 text-[#505f76]">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 space-y-0.5">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs transition-colors text-left font-light ${
                    section === item.id
                      ? "text-[#003ec7] font-bold border-r-2 border-[#003ec7] bg-[#003ec7]/5"
                      : "text-[#505f76] hover:bg-[#003ec7]/5"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] font-light">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="border-t border-[#c3c5d9]/40 pt-4">
              <button
                onClick={() => { logout(); toast.success("Logged out."); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs text-[#505f76] hover:text-rose-600 hover:bg-rose-50 transition-colors text-left"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* ── MAIN CONTENT AREA (offsets fixed header and dynamic sidebar width) ────── */}
      <div className={`transition-all duration-300 pt-16 flex flex-col min-h-screen ${
        sidebarCollapsed ? "md:ml-[76px]" : "md:ml-[280px]"
      }`}>
        {/* Page heading for mobile (below header) */}
        <div className="md:hidden px-5 pt-5 pb-2">
          <p className="text-[8px] font-light uppercase tracking-widest text-[#737688]">{pageTitle.sub}</p>
          <h2 className="text-base font-bold text-[#191c1e] mt-0.5">{pageTitle.heading}</h2>
        </div>

        {/* Main scrollable content */}
        <main className="flex-1 px-8 pt-8 pb-10">
          {renderSection()}
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV ─────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-lg border-t border-[#c3c5d9]/40 z-40 flex items-center justify-around px-2">
        {navItems.slice(0, 5).map(item => (
          <button
            key={item.id}
            onClick={() => !isPending && navigate(item.id)}
            disabled={isPending}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors ${
              isPending
                ? "opacity-30 cursor-not-allowed text-[#c3c5d9]"
                : section === item.id ? "text-[#003ec7]" : "text-[#737688]"
            }`}
          >
            <span className="material-symbols-outlined text-[20px] font-light">{item.icon}</span>
            <span className="text-[8px] font-light uppercase tracking-wide">{item.label.split(" ")[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
