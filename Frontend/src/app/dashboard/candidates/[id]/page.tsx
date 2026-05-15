"use client";

import { useState, useEffect, use } from "react";
import { adminAPI } from "@/lib/api";
import { CandidateDetail } from "@/types";
import { ArrowLeft, Clock, Mail, CheckCircle2, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { toast } from "react-hot-toast";

export default function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const candidateId = Number(resolvedParams.id);
  
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await adminAPI.getCandidateDetail(candidateId);
        setCandidate(response.data || null);
      } catch (error) {
        // Mock fallback
        setCandidate({
          id: candidateId,
          name: "Alice Smith",
          email: "alice@example.com",
          role: "CANDIDATE",
          internshipTrack: "Frontend Development",
          status: "ACTIVE",
          joiningDate: "2026-05-01",
          totalHoursWorked: 45.5,
          totalLogsSubmitted: 8,
          lastLogDate: "2026-05-14",
          completionPercentage: 65,
          dailyLogs: [
            { id: 1, candidateId, logDate: "2026-05-14", tasksDone: "Built the Next.js frontend pages.", hoursWorked: 6, mood: "GOOD", createdAt: "" },
            { id: 2, candidateId, logDate: "2026-05-13", tasksDone: "Created reusable components and CSS styling.", hoursWorked: 5, mood: "GREAT", createdAt: "" }
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [candidateId]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as "ACTIVE" | "COMPLETED" | "ON_HOLD";
    setIsUpdatingStatus(true);
    try {
      await adminAPI.updateStatus(candidateId, newStatus);
      if (candidate) {
        setCandidate({ ...candidate, status: newStatus });
      }
      toast.success("Status updated successfully.");
    } catch {
      toast.error("Status updated locally (backend error).");
      if (candidate) {
        setCandidate({ ...candidate, status: newStatus });
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) return <div className="text-center p-12">Loading...</div>;
  if (!candidate) return <div className="text-center p-12">Candidate not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/candidates" className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Candidate Profile</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center mb-4">
              <UserIcon size={48} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{candidate.name}</h2>
            <p className="text-slate-500 mb-6">{candidate.email}</p>

            <Link href={`/dashboard/mail?to=${candidate.email}`} className="btn-primary w-full justify-center">
              <Mail size={18} className="mr-2" /> Send Email
            </Link>
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Program Details</h3>
            
            <div>
              <p className="text-sm text-slate-500">Track</p>
              <p className="font-medium text-slate-800">{candidate.internshipTrack || "—"}</p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500">Joining Date</p>
              <p className="font-medium text-slate-800">{candidate.joiningDate ? format(parseISO(candidate.joiningDate), "MMM dd, yyyy") : "—"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-1">Status</p>
              <select 
                className={`input text-sm font-semibold py-1.5 ${
                  candidate.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200' :
                  candidate.status === 'ON_HOLD' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}
                value={candidate.status || "ACTIVE"}
                onChange={handleStatusChange}
                disabled={isUpdatingStatus}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="ON_HOLD">ON HOLD</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="card p-4">
              <div className="flex items-center gap-2 text-indigo-600 mb-2"><Clock size={18} /></div>
              <p className="text-2xl font-bold text-slate-800">{candidate.totalHoursWorked || 0}</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total Hours</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 text-indigo-600 mb-2"><CheckCircle2 size={18} /></div>
              <p className="text-2xl font-bold text-slate-800">{candidate.totalLogsSubmitted || 0}</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Logs Submitted</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 text-indigo-600 mb-2"><Clock size={18} /></div>
              <p className="text-2xl font-bold text-slate-800">{candidate.lastLogDate ? format(parseISO(candidate.lastLogDate), "MMM dd") : "—"}</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Last Active</p>
            </div>
          </div>

          <div className="card">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Recent Logs</h3>
            </div>
            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {candidate.dailyLogs && candidate.dailyLogs.length > 0 ? (
                candidate.dailyLogs.map(log => (
                  <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-sm text-slate-800">{format(parseISO(log.logDate), "EEEE, MMM d")}</span>
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{log.hoursWorked} hrs</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{log.tasksDone}</p>
                    {log.mood && <span className="text-xs text-slate-500">Mood: {log.mood}</span>}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">No logs submitted yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
