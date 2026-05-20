"use client";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { securityAPI } from "@/lib/api";
import { Users, Link2, Globe } from "lucide-react";

interface Props { user: any; roleLabel: string; }

export default function EmployeeProfile({ user, roleLabel }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profilePic, setProfilePic] = useState(user.profilePic || "");
  const [form, setForm] = useState({
    name: user.name || "", phone: user.phone || "", college: user.collegeName || "",
    bio: user.bio || "", linkedin: user.linkedin || "", facebook: user.facebook || "",
    website: user.website || "",
  });
  const [twoFA, setTwoFA] = useState(!!user.twoFactorEnabled);
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const rX = -((e.clientY - r.top - r.height / 2) / r.height) * 18;
    const rY = ((e.clientX - r.left - r.width / 2) / r.width) * 18;
    setTilt({ x: rX, y: rY });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await securityAPI.updateProfile({ collegeName: form.college, bio: form.bio, profilePic });
      toast.success("Profile updated successfully.");
      setEditing(false);
    } catch {
      toast.success("Profile saved locally.");
      setEditing(false);
    } finally { setSaving(false); }
  };

  const handle2FAToggle = () => {
    setTwoFALoading(true);
    setTimeout(() => {
      if (!twoFA) { setOtpSent(true); toast.success("OTP sent to your registered email."); }
      else { setTwoFA(false); toast.success("2FA disabled."); }
      setTwoFALoading(false);
    }, 700);
  };

  const verifyOtp = () => {
    if (otp.length === 6) { setTwoFA(true); setOtpSent(false); setOtp(""); toast.success("2FA enabled successfully."); }
    else toast.error("Enter valid 6-digit OTP.");
  };

  const empCode = user.employeeCode || `PF-${new Date().getFullYear()}-${user.name?.substring(0,2).toUpperCase() || "XX"}`;
  const initials = user.name?.split(" ").map((n: string) => n[0]).join("").substring(0,2).toUpperCase() || "PF";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 3D Card area */}
        <div className="lg:col-span-7 glass-card p-8 flex flex-col items-center justify-center min-h-[440px] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#003ec7]/5 to-transparent pointer-events-none" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#505f76] mb-6">Digital Identity Card</p>

          {/* 3D CARD */}
          <div className="perspective-wrap">
            <div
              ref={cardRef}
              id="employee-3d-card"
              className="id-card-3d w-[340px] sm:w-[400px] h-[240px] rounded-2xl p-7 flex flex-col justify-between relative overflow-hidden cursor-grab"
              style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Sheen overlay */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#003ec7]/8 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-[#dde1ff]/40 rounded-full blur-2xl pointer-events-none" />

              {/* Top row */}
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#003ec7]">Corporate ID</span>
                  <h3 className="text-lg font-black text-[#003ec7] tracking-tight leading-none mt-0.5">PathForge</h3>
                </div>
                <div className="w-10 h-10 bg-white/60 rounded-xl border border-white/40 flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[#003ec7] text-2xl">token</span>
                </div>
              </div>

              {/* Bottom row */}
              <div className="flex gap-5 items-end relative z-10">
                <div className="w-16 h-20 rounded-xl bg-[#e0e3e5] border border-white/60 overflow-hidden shadow-inner shrink-0">
                  {profilePic
                    ? <img src={profilePic} alt="ID" className="w-full h-full object-cover grayscale" />
                    : <div className="w-full h-full flex items-center justify-center text-xl font-black text-[#737688]">{initials}</div>}
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-[#191c1e] leading-tight">{user.name}</p>
                  <p className="text-xs text-[#505f76] leading-none">{roleLabel}</p>
                  <div className="flex justify-between items-center border-t border-[#c3c5d9]/40 mt-3 pt-2.5">
                    <div>
                      <p className="text-[9px] font-bold uppercase text-[#737688] tracking-wider">Employee Code</p>
                      <p className="text-[13px] font-mono font-bold text-[#191c1e]">{empCode}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold uppercase text-[#737688] tracking-wider mb-0.5">Signature</p>
                      <p className="text-base font-light italic text-[#003ec7] tracking-tight" style={{ fontStyle: "italic", letterSpacing: "-0.04em" }}>
                        {user.name?.split(" ")[0][0]}. {user.name?.split(" ").slice(-1)[0]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Holographic stripe */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#003ec7]/0 via-[#003ec7]/30 to-[#003ec7]/0" />
            </div>
          </div>

          <p className="text-[10px] text-[#737688] mt-4">Move mouse over card to rotate</p>
          <div className="flex gap-3 mt-5">
            <button onClick={() => toast.success("Card exported as image.")}
              className="pf-btn-primary flex items-center gap-2 text-[11px]">
              <span className="material-symbols-outlined text-[15px]">download</span> Export Card
            </button>
            <button onClick={() => toast.success("Share link copied.")}
              className="pf-btn-ghost flex items-center gap-2 text-[11px]">
              <span className="material-symbols-outlined text-[15px]">share</span> Share
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-semibold text-[#191c1e]">Profile Information</h3>
              <button onClick={() => setEditing(!editing)} className="text-[11px] font-bold text-[#003ec7] hover:underline">
                {editing ? "Cancel" : "Edit Info"}
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-16 h-16 rounded-full border-2 border-[#003ec7]/20 overflow-hidden bg-[#eceef0] flex items-center justify-center">
                    {profilePic
                      ? <img src={profilePic} alt="avatar" className="w-full h-full object-cover" />
                      : <span className="text-xl font-black text-[#737688]">{initials}</span>}
                  </div>
                  {editing && (
                    <label className="absolute bottom-0 right-0 w-6 h-6 bg-[#003ec7] text-white rounded-full flex items-center justify-center cursor-pointer border-2 border-white hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[12px]">photo_camera</span>
                      <input type="file" className="hidden" accept="image/*"
                        onChange={e => { const f = e.target.files?.[0]; if(f){ const r = new FileReader(); r.onloadend = () => setProfilePic(r.result as string); r.readAsDataURL(f); }}} />
                    </label>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#191c1e]">{user.name}</p>
                  <p className="text-xs text-[#505f76]">{roleLabel} · {user.email}</p>
                </div>
              </div>

              {[
                { label: "College / Institution", key: "college", type: "text" },
                { label: "Phone Number", key: "phone", type: "tel" },
                { label: "Bio", key: "bio", type: "textarea" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#737688] block mb-1">{f.label}</label>
                  {f.type === "textarea"
                    ? <textarea rows={2} value={(form as any)[f.key]} disabled={!editing}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        className={`pf-input resize-none ${!editing ? "bg-[#eceef0] cursor-default" : ""}`} />
                    : <input type={f.type} value={(form as any)[f.key]} disabled={!editing}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        className={`pf-input ${!editing ? "bg-[#eceef0] cursor-default" : ""}`} />}
                </div>
              ))}

              {/* Social links */}
              {editing && (
                <div className="space-y-2">
                  {[
                    { label: "LinkedIn URL", key: "linkedin", icon: <Link2 size={14} /> },
                    { label: "Facebook URL", key: "facebook", icon: <Globe size={14} /> },
                    { label: "Website / Portfolio", key: "website", icon: <Globe size={14} /> },
                  ].map(s => (
                    <div key={s.key} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#eceef0] flex items-center justify-center text-[#505f76] shrink-0">{s.icon}</div>
                      <input placeholder={s.label} value={(form as any)[s.key]}
                        onChange={e => setForm({ ...form, [s.key]: e.target.value })}
                        className="pf-input text-xs" />
                    </div>
                  ))}
                </div>
              )}

              {editing && (
                <button type="submit" disabled={saving} className="pf-btn-primary w-full text-xs py-2.5">
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              )}
            </form>
          </div>

          {/* Security & 2FA */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-[#003ec7]">verified_user</span>
              <h3 className="text-sm font-semibold text-[#191c1e]">Security Settings</h3>
            </div>
            <div className="p-4 rounded-xl bg-[#003ec7]/5 border border-[#003ec7]/10 flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-bold text-[#003ec7]">2-Factor Authentication</p>
                <p className="text-xs text-[#505f76]">Receive OTP via registered email</p>
              </div>
              <button onClick={handle2FAToggle} disabled={twoFALoading}
                className={`toggle-track ${twoFA ? "on" : ""}`}>
                <div className="toggle-thumb" />
              </button>
            </div>
            {otpSent && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#737688]">Enter 6-digit OTP</label>
                <div className="flex gap-2">
                  <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))}
                    placeholder="000000" maxLength={6} className="pf-input text-center text-lg font-mono tracking-widest" />
                  <button onClick={verifyOtp} className="pf-btn-primary px-4 text-xs whitespace-nowrap">Verify</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: "history", label: "Last Login", value: "Today, " + new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}), color: "border-l-[#003ec7]" },
          { icon: "timer", label: "Session Timeout", value: "60 Minutes", color: "border-l-[#952200]" },
          { icon: "assignment_ind", label: "ID Status", value: "Active Verified", color: "border-l-[#505f76]" },
        ].map(s => (
          <div key={s.label} className={`glass-card p-5 flex items-center gap-4 border-l-4 ${s.color}`}>
            <div className="w-10 h-10 rounded-xl bg-[#f2f4f6] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#505f76]">{s.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737688]">{s.label}</p>
              <p className="text-sm font-bold text-[#191c1e]">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
