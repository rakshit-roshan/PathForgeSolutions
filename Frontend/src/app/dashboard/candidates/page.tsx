"use client";

import { useState, useEffect } from "react";
import { adminAPI } from "@/lib/api";
import { User } from "@/types";
import Link from "next/link";
import { Eye, Search, Mail, Filter } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "react-hot-toast";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<User[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await adminAPI.getAllCandidates();
        setCandidates(response.data || []);
        setFilteredCandidates(response.data || []);
      } catch (error) {
        // Mock data fallback
        const mockData: User[] = [
          { id: 1, name: "Alice Smith", email: "alice@example.com", role: "CANDIDATE", internshipTrack: "Frontend Development", status: "ACTIVE", joiningDate: "2026-05-01" },
          { id: 2, name: "Bob Jones", email: "bob@example.com", role: "CANDIDATE", internshipTrack: "Backend Development", status: "COMPLETED", joiningDate: "2026-02-15" },
          { id: 3, name: "Charlie Davis", email: "charlie@example.com", role: "CANDIDATE", internshipTrack: "Data & Gen-AI", status: "ON_HOLD", joiningDate: "2026-04-10" },
        ];
        setCandidates(mockData);
        setFilteredCandidates(mockData);
        toast.error("Using localized employee pipeline entries.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredCandidates(
      candidates.filter(
        c => c.name.toLowerCase().includes(lower) || c.email.toLowerCase().includes(lower) || c.internshipTrack?.toLowerCase().includes(lower)
      )
    );
  }, [search, candidates]);

  const getStatusBadge = (status?: string) => {
    if (status === "COMPLETED") return <span className="px-2 py-0.5 text-[8px] font-mono font-extrabold tracking-widest uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 rounded">COMPLETED</span>;
    if (status === "ON_HOLD") return <span className="px-2 py-0.5 text-[8px] font-mono font-extrabold tracking-widest uppercase bg-amber-50 text-amber-700 border border-amber-100 rounded">ON HOLD</span>;
    return <span className="px-2 py-0.5 text-[8px] font-mono font-extrabold tracking-widest uppercase bg-indigo-50 text-indigo-700 border border-indigo-100 rounded">ACTIVE</span>;
  };

  return (
    <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded text-[9px] uppercase font-bold tracking-widest font-mono">
            Employee Console
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 mt-1">Employee Directory Pipeline</h1>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Manage track allocations, workflow operational statuses, and live statistics.
          </p>
        </div>
        <Link 
          href="/dashboard" 
          className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-all shrink-0"
        >
          <Mail size={14} className="stroke-[2.5]" /> Email Cohorts
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, email or track..." 
              className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="py-1.5 px-3 bg-white border border-slate-200 text-slate-650 hover:bg-slate-50 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all">
            <Filter size={14} /> Filter Status
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/20 text-slate-400 font-extrabold uppercase font-mono text-[9px] tracking-wider">
                <th className="py-3 px-4">Employee Name</th>
                <th className="py-3 px-4">Assigned Track</th>
                <th className="py-3 px-4">Joining Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <div className="w-5 h-5 border-2 border-indigo-650 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400 font-semibold italic">
                    No matching pipeline profiles located.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-all">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{c.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-650">{c.internshipTrack || "—"}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {c.joiningDate ? format(parseISO(c.joiningDate), "MMM dd, yyyy") : "—"}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(c.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href="/dashboard" className="p-1.5 text-slate-450 hover:text-indigo-600 rounded bg-slate-50 border border-slate-100 hover:bg-indigo-50 transition-all" title="Email Candidate">
                          <Mail size={12} />
                        </Link>
                        <Link href="/dashboard" className="p-1.5 text-slate-450 hover:text-indigo-600 rounded bg-slate-50 border border-slate-100 hover:bg-indigo-50 transition-all" title="View Profile">
                          <Eye size={12} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
