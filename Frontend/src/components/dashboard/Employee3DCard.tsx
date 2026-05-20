"use client";

import { useState, useRef } from "react";
import { Sparkles, ShieldCheck } from "lucide-react";

interface Employee3DCardProps {
  user: {
    name: string;
    email: string;
    employeeCode?: string;
    internshipTrack?: string;
    joiningDate?: string;
  };
}

export default function Employee3DCard({ user }: Employee3DCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const el = cardRef.current;
    const rect = el.getBoundingClientRect();
    
    // Relative coordinates inside the card container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Centering calculation
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    // Maximum tilt angles (15 degrees max)
    const angleX = (yc - y) / 8;
    const angleY = (x - xc) / 8;
    
    setRotate({ x: angleX, y: angleY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const employeeCode = user.employeeCode || "PF-2026-PENDING";
  const assignedRole = user.internshipTrack || "Verification Pending";

  return (
    <div
      className="perspective-[1000px] w-full max-w-[360px] h-[220px] cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className="w-full h-full rounded-2xl relative p-5 select-none transition-all duration-200 ease-out border border-white/10"
        style={{
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${isHovered ? 1.04 : 1}, ${isHovered ? 1.04 : 1}, 1)`,
          boxShadow: isHovered
            ? `${rotate.y * -0.8}px ${rotate.x * 0.8}px 25px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.2) inset`
            : "0 10px 20px rgba(0, 0, 0, 0.2)",
          background: "linear-gradient(135deg, rgba(23, 27, 44, 0.95) 0%, rgba(13, 16, 27, 0.98) 100%)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Glossy Reflective Sheen effect */}
        {isHovered && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-40 mix-blend-overlay transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle at ${rotate.y * 5 + 50}% ${rotate.x * 5 + 50}%, rgba(255, 255, 255, 0.8) 0%, transparent 60%)`,
            }}
          />
        )}

        {/* Card Border Highlights (Ultra Metallic Look) */}
        <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none" />

        {/* 1. Header Area */}
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-amber-500/90 uppercase font-mono">
              PATHFORGE SOLUTIONS
            </span>
            <span className="block text-[6px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
              OFFICIAL EMPLOYEE CREDENTIAL
            </span>
          </div>
          <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/10">
            <ShieldCheck size={10} className="text-amber-500" />
            <span className="text-[7px] font-bold text-white uppercase tracking-widest font-mono">PFSEC</span>
          </div>
        </div>

        {/* 2. Golden EMV Metallic Chip */}
        <div className="mt-4 flex justify-between items-center">
          <div className="w-9 h-7 rounded bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 relative overflow-hidden shadow-inner border border-amber-600/30">
            {/* Chip Grid Lines */}
            <div className="absolute inset-x-0 top-1/2 h-[0.5px] bg-amber-800/40" />
            <div className="absolute inset-y-0 left-1/3 w-[0.5px] bg-amber-800/40" />
            <div className="absolute inset-y-0 right-1/3 w-[0.5px] bg-amber-800/40" />
            <div className="absolute top-1 left-2 right-2 bottom-1 rounded-[1px] border border-amber-800/20" />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[7px] text-slate-400 uppercase tracking-widest font-bold">EMPID</span>
            <span className="text-[11px] text-slate-200 font-extrabold tracking-widest font-mono">
              {employeeCode}
            </span>
          </div>
        </div>

        {/* 3. Card Bottom Area (Details & Signature) */}
        <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end">
          <div className="space-y-1 max-w-[60%]">
            <div>
              <span className="text-[5px] text-slate-400 font-bold uppercase tracking-wider block">NAME</span>
              <span className="text-xs font-bold text-white tracking-wide block truncate uppercase">
                {user.name}
              </span>
            </div>
            <div>
              <span className="text-[5px] text-slate-400 font-bold uppercase tracking-wider block">ASSIGNED ROLE</span>
              <span className="text-[9px] font-extrabold text-amber-500 tracking-wide block truncate uppercase">
                {assignedRole}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-1">
            <span className="text-[5px] text-slate-400 font-bold uppercase tracking-wider">AUTHORIZED SIGNATURE</span>
            <div className="relative h-7 w-24 flex items-center justify-center">
              {/* Handdrawn SVG signature */}
              <svg className="w-full h-full text-indigo-200/80 stroke-current fill-none stroke-[1.5]" viewBox="0 0 100 30">
                <path d="M10,20 Q25,5 35,25 T60,10 T85,20 M20,15 L90,15" strokeLinecap="round" />
              </svg>
              <span className="absolute bottom-0 text-[6px] text-slate-500 font-mono scale-[0.8]">R. Roshan (MD)</span>
            </div>
          </div>
        </div>

        {/* Hologram security stamp (with changing color gradient background and silver sheen) */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 via-pink-400 to-cyan-400 opacity-60 blur-[0.5px] border border-white/20 flex items-center justify-center overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(255,255,255,0.8)_80%)] animate-pulse" />
          <Sparkles size={8} className="text-white drop-shadow" />
        </div>
      </div>
    </div>
  );
}
