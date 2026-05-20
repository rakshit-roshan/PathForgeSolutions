"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { securityAPI } from "@/lib/api";
import { User as UserIcon, Lock, ShieldCheck, Mail, Key, Loader2, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";

export default function SettingsPage() {
  const { user, login } = useAuth(); // Re-use auth context
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // Profile Form States
  const [collegeName, setCollegeName] = useState(user?.collegeName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePic, setProfilePic] = useState(user?.profilePic || "");
  const [profileLoading, setProfileLoading] = useState(false);

  // 2FA Security States
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(!!user?.twoFactorEnabled);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  // Avatar Upload Helper (Base64 conversion)
  const handleAvatarChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 200000) {
        toast.error("Avatar size exceeds limits (Max 200KB).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await securityAPI.updateProfile({
        collegeName,
        bio,
        profilePic,
      });
      
      // Update local context manually to reflect changes immediately
      if (user) {
        user.collegeName = res.data.collegeName;
        user.bio = res.data.bio;
        user.profilePic = res.data.profilePic;
      }
      
      toast.success("Profile credentials audited and saved successfully!");
    } catch (err) {
      toast.error("Failed to update profile info.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleGenerate2faOtp = async () => {
    setOtpLoading(true);
    try {
      const res = await securityAPI.generate2faOtp();
      toast.success(res.data.message || "OTP transmitted to your inbox!");
      setShowOtpBox(true);
    } catch (err) {
      toast.error("Failed to generate security OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerify2faOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length !== 6) {
      toast.error("Please enter a valid 6-digit OTP code.");
      return;
    }
    setOtpLoading(true);
    try {
      const res = await securityAPI.verify2faOtp(otpCode);
      setTwoFactorEnabled(res.data.twoFactorEnabled);
      if (user) {
        user.twoFactorEnabled = res.data.twoFactorEnabled;
      }
      setShowOtpBox(false);
      setOtpCode("");
      toast.success(res.data.message || "2FA status successfully configured!");
    } catch (err: any) {
      toast.error(err.response?.data || "Verification failed. Invalid OTP code.");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight">Console settings</h1>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Audit profile credentials and configure accounts security parameters</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1.5">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 p-3 text-sm font-medium rounded-lg transition-all focus:outline-none ${
              activeTab === "profile"
                ? "bg-indigo-50/50 text-indigo-600 active"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <UserIcon size={16} className="stroke-[2]" /> Profile info
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 p-3 text-sm font-medium rounded-lg transition-all focus:outline-none ${
              activeTab === "security"
                ? "bg-indigo-50/50 text-indigo-600 active"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Lock size={16} className="stroke-[2]" /> Security & 2FA
          </button>
        </div>

        {/* Tab Contents */}
        <div className="md:col-span-3">
          {activeTab === "profile" ? (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
              <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6 uppercase tracking-wider">
                Profile Credentials
              </h2>

              <form className="space-y-6" onSubmit={handleSaveProfile}>
                {/* Avatar Uploader */}
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                    {profilePic ? (
                      <img src={profilePic} alt="Candidate Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={24} className="text-slate-400" />
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                      Candidate Avatar
                    </label>
                    <input
                      type="file"
                      id="avatar_input"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <label
                      htmlFor="avatar_input"
                      className="cursor-pointer bg-slate-50 border border-slate-200/80 hover:bg-slate-100 text-slate-700 font-semibold text-[10px] px-3.5 py-1.5 rounded-xl transition-all inline-block shadow-sm"
                    >
                      Change Avatar
                    </label>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed"
                      defaultValue={user?.name}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed"
                      defaultValue={user?.email}
                      disabled
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      University / College Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. Stanford University"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Internship Track & Status
                    </label>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-full text-[10px] uppercase">
                        {user?.internshipTrack || "Fullstack dev"}
                      </span>
                      <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded-full text-[10px] uppercase">
                        {user?.status || "ACTIVE"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Professional Biography (Bio)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about yourself and your professional objectives..."
                    className="w-full bg-white border border-slate-200/80 rounded-xl p-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all"
                  >
                    {profileLoading ? <Loader2 size={18} className="animate-spin" /> : "Save Profile Details"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
              <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6 uppercase tracking-wider">
                Multi-Factor Security
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl shrink-0 ${twoFactorEnabled ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}>
                    <ShieldCheck size={20} className="stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      2-Factor Authentication (2FA) Code
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium mt-1">
                      Protect your timesheet records and personal information behind email 2FA verification code challenge checks on every log in session.
                    </p>
                  </div>
                </div>

                <div className="bg-[var(--dashboard-primary-light)]/40 border border-[var(--dashboard-border)] rounded-md p-5 flex flex-col justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Protection Level</span>
                    <p className="text-xs font-bold text-[var(--dashboard-text-primary)] mt-0.5">
                      {twoFactorEnabled ? "Advanced Email 2-Step OTP Security Enabled" : "Standard Password Credentials Enabled"}
                    </p>
                  </div>
                  
                  {!showOtpBox ? (
                    <button
                      onClick={handleGenerate2faOtp}
                      disabled={otpLoading}
                      className={`py-1.5 px-4 rounded-md text-xs font-semibold shadow-sm transition-all ${
                        twoFactorEnabled
                          ? "bg-[var(--dashboard-danger-light)] text-[var(--dashboard-danger)] hover:bg-[var(--dashboard-danger-light)]/85 border border-[var(--dashboard-danger)]/15"
                          : "bg-[var(--dashboard-primary)] hover:bg-[var(--dashboard-primary-hover)] text-white"
                      }`}
                    >
                      {otpLoading ? <Loader2 size={14} className="animate-spin mr-1.5 inline" /> : null}
                      {twoFactorEnabled ? "Disable 2FA Protection" : "Enable 2FA Protection"}
                    </button>
                  ) : (
                    <form onSubmit={handleVerify2faOtp} className="w-full space-y-4 pt-2 border-t border-slate-100/80">
                      <div>
                        <label htmlFor="otpCode" className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                          Verification OTP Code
                        </label>
                        <input
                          type="text"
                          id="otpCode"
                          maxLength={6}
                          placeholder="e.g. 482930"
                          className="w-full max-w-[200px] bg-white border border-slate-200/80 rounded-xl px-4 py-2 text-sm font-bold tracking-widest focus:outline-none focus:border-indigo-500 transition-colors"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        />
                        <p className="text-[10px] text-slate-400 mt-1 font-semibold">Enter the 6-digit security OTP code dispatched to your mailbox.</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={otpLoading}
                          className="py-1.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                        >
                          Submit Verification
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowOtpBox(false)}
                          className="py-1.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
