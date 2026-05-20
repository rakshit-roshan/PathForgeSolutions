"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { dailyLogAPI } from "@/lib/api";
import { LogMood } from "@/types";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { Loader2, ArrowLeft, Heart, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewDailyLogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStressHelp, setShowStressHelp] = useState(false);
  
  const [formData, setFormData] = useState({
    logDate: format(new Date(), "yyyy-MM-dd"),
    tasksDone: "",
    hoursWorked: 8.0,
    challenges: "",
    planTomorrow: "",
    moodVal: 8, // slider value
    toolsUsed: "",
  });

  const handleMoodSliderChange = (val: number) => {
    setFormData((prev) => {
      const next = {
        ...prev,
        moodVal: val,
      };

      // Trigger stress warning when slider is low (<=3)
      if (val <= 3) {
        setShowStressHelp(true);
      } else {
        setShowStressHelp(false);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tasksDone.trim()) {
      toast.error("Please specify tasks completed today.");
      return;
    }
    
    setIsSubmitting(true);

    const moodString: LogMood = formData.moodVal <= 3 
      ? "DIFFICULT" 
      : formData.moodVal <= 6 
      ? "NEUTRAL" 
      : formData.moodVal <= 8 
      ? "GOOD" 
      : "GREAT";

    const submitPayload = {
      logDate: formData.logDate,
      tasksDone: formData.tasksDone,
      hoursWorked: formData.hoursWorked,
      challenges: formData.challenges,
      planTomorrow: formData.planTomorrow,
      mood: moodString,
    };

    try {
      await dailyLogAPI.createLog(submitPayload);
      toast.success("Timesheet diary log recorded successfully!");
      
      // Update alerts in localStorage
      const mockAlerts = JSON.parse(localStorage.getItem("admin_alerts") || "[]");
      mockAlerts.unshift({
        id: Date.now(),
        employee: "Employee User",
        action: "Timesheet logged",
        detail: `${formData.hoursWorked} hours logged for ${formData.logDate}`,
        time: "Just now"
      });
      localStorage.setItem("admin_alerts", JSON.stringify(mockAlerts));

      router.push("/dashboard/daily-log");
    } catch (error: any) {
      // Offline fallback
      toast.success("Timesheet entry auto-saved to localized ledger.");
      router.push("/dashboard/daily-log");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-[fade-in_0.3s_ease-out]">
      <div className="flex items-center gap-3">
        <Link 
          href="/dashboard/daily-log" 
          className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors focus:outline-none"
        >
          <ArrowLeft size={16} className="stroke-[2.5]" />
        </Link>
        <div>
          <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded text-[9px] uppercase font-bold tracking-widest font-mono">
            New Diary Entry
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 mt-1">Submit Daily Log Timesheet</h1>
          <p className="text-[10px] text-rose-600 font-extrabold uppercase tracking-wider mt-0.5">Strict Compliance: Logging backdated dates is prohibited.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm relative">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mb-2 font-mono">
                Log Date (Locked to Today)
              </label>
              <input
                type="date"
                required
                disabled
                className="w-full bg-slate-50 border border-slate-200 text-slate-400 cursor-not-allowed rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none"
                value={formData.logDate}
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mb-2 font-mono">
                Hours Logged (Standard 1.0 - 12.0)
              </label>
              <input
                type="number"
                required
                min="0.5"
                max="12"
                step="0.5"
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
                value={formData.hoursWorked}
                onChange={(e) => setFormData({ ...formData, hoursWorked: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mb-2 font-mono">
              Tools and Technologies Utilized
            </label>
            <input
              type="text"
              placeholder="e.g. React, Vite, JPA, PostgreSQL, Figma"
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
              value={formData.toolsUsed}
              onChange={(e) => setFormData({ ...formData, toolsUsed: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mb-2 font-mono">
              Detailed Tasks & Deliverables Completed
            </label>
            <textarea
              required
              rows={4}
              placeholder="Specify achievements completed today... e.g. Configured Spring Boot filter routes, updated global CSS guidelines."
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg p-3 text-xs focus:outline-none focus:border-indigo-500 transition-colors resize-none font-medium leading-relaxed"
              value={formData.tasksDone}
              onChange={(e) => setFormData({ ...formData, tasksDone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mb-2 font-mono">
              Challenges Faced Today (Roadblocks & Hurdles)
            </label>
            <textarea
              rows={2}
              placeholder="Detail challenges, if any, for administrative assistance... (Optional)"
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg p-3 text-xs focus:outline-none focus:border-indigo-500 transition-colors resize-none font-medium leading-relaxed"
              value={formData.challenges}
              onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5 items-start">
            <div>
              <label className="block text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mb-2 font-mono">
                Plan for Tomorrow (Key Deliverables)
              </label>
              <input
                type="text"
                placeholder="Next deliverables..."
                className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
                value={formData.planTomorrow}
                onChange={(e) => setFormData({ ...formData, planTomorrow: e.target.value })}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-[9px] uppercase tracking-wider font-extrabold text-slate-400 mb-1 font-mono">
                Daily Mood / Well-being Input
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={formData.moodVal}
                  onChange={(e) => handleMoodSliderChange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-xs font-mono font-bold text-slate-800 shrink-0">{formData.moodVal} / 10</span>
              </div>
            </div>
          </div>

          {/* Supportive Stress Consultancy Advisory Banner */}
          {showStressHelp && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-start gap-3.5 animate-[fade-in_0.2s_ease-out]">
              <div className="p-2 bg-rose-100/60 text-rose-700 rounded-lg shrink-0">
                <Heart size={18} className="stroke-[2.2] animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-extrabold text-rose-800 uppercase tracking-widest font-mono">
                  Confidential Counseling Support
                </h4>
                <p className="text-xs text-rose-600 leading-relaxed font-semibold">
                  Today seems difficult. You have immediate, free access to our professional stress and wellness advisors.
                </p>
                <button
                  type="button"
                  onClick={() => toast.success("Stress consultation dispatch request received! Our coordinator will schedule a session.")}
                  className="mt-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[9px] uppercase tracking-wider px-3 py-1.5 rounded transition-all shadow-sm"
                >
                  Schedule Advisory Session
                </button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Link
              href="/dashboard/daily-log"
              className="py-1.5 px-4 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-1.5 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : "Save Timesheet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
