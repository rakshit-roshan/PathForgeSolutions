"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { dailyLogAPI } from "@/lib/api";
import { generateInternshipReport } from "@/lib/pdf-export";
import { Download, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ReportExportPage() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    if (!user) return;
    setIsGenerating(true);

    try {
      const response = await dailyLogAPI.getLogsForExport();
      const logs = response.data || [];
      
      if (logs.length === 0) {
        toast.error("No logs found to generate a report.");
        return;
      }

      await generateInternshipReport(user, logs);
      toast.success("Report generated successfully!");
    } catch (error) {
      toast.error("Failed to fetch logs for report generation. Using sample data for demo.");
      
      // Fallback for demo
      const sampleLogs = [
        { id: 1, candidateId: user.id, logDate: "2026-05-10", tasksDone: "Environment setup and project planning.", hoursWorked: 6, mood: "GOOD" as any, createdAt: "" },
        { id: 2, candidateId: user.id, logDate: "2026-05-11", tasksDone: "Developed login and authentication flows.", hoursWorked: 8, mood: "GREAT" as any, createdAt: "" },
        { id: 3, candidateId: user.id, logDate: "2026-05-12", tasksDone: "Implemented dashboard layout and sidebar.", hoursWorked: 7, challenges: "CSS grid issues.", mood: "NEUTRAL" as any, createdAt: "" },
        { id: 4, candidateId: user.id, logDate: "2026-05-13", tasksDone: "Created daily log forms and connected to API.", hoursWorked: 8, mood: "GOOD" as any, createdAt: "" },
      ];
      await generateInternshipReport(user, sampleLogs);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Export Final Report</h1>
        <p className="text-slate-600 mt-1">Generate your official internship completion report as a PDF.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 card p-6 sm:p-8">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <FileText size={32} />
          </div>
          
          <h2 className="text-xl font-bold text-slate-800 mb-4">Official Document Generation</h2>
          <p className="text-slate-600 mb-6">
            This tool aggregates all your submitted daily logs and generates a professional, formatted PDF report. 
            This document serves as your official work record and is required for your completion certificate.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">What's included:</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-slate-700">
                <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                Company branding and official letterhead
              </li>
              <li className="flex gap-3 text-sm text-slate-700">
                <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                Your candidate profile and track details
              </li>
              <li className="flex gap-3 text-sm text-slate-700">
                <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                Summary statistics (total hours, duration)
              </li>
              <li className="flex gap-3 text-sm text-slate-700">
                <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                Complete chronological table of all daily activities
              </li>
              <li className="flex gap-3 text-sm text-slate-700">
                <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                Authorized signature block
              </li>
            </ul>
          </div>

          <button 
            onClick={handleGeneratePDF} 
            disabled={isGenerating}
            className="btn-primary w-full sm:w-auto py-3 px-8 text-base shadow-indigo-200"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Generating PDF...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Download size={20} /> Download PDF Report
              </span>
            )}
          </button>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="card p-6 bg-amber-50 border-amber-200">
            <h3 className="font-bold text-amber-800 flex items-center gap-2 mb-3">
              <AlertCircle size={20} /> Important Note
            </h3>
            <p className="text-sm text-amber-700 leading-relaxed">
              Make sure all your daily logs are submitted before generating the final report. 
              Only logs present in the system will be included in the document.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-slate-800 mb-3">Your Profile Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Name</span>
                <span className="font-medium text-slate-800">{user?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Track</span>
                <span className="font-medium text-slate-800">{user?.internshipTrack || "N/A"}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-500">Status</span>
                <span className={`font-semibold ${user?.status === 'COMPLETED' ? 'text-green-600' : 'text-blue-600'}`}>
                  {user?.status || "ACTIVE"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
