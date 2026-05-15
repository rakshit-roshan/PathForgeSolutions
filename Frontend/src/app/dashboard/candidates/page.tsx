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
        toast.error("Using sample data for demonstration.");
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
    if (status === "COMPLETED") return <span className="badge-completed px-2 py-1 rounded text-xs font-semibold">COMPLETED</span>;
    if (status === "ON_HOLD") return <span className="badge-on-hold px-2 py-1 rounded text-xs font-semibold">ON HOLD</span>;
    return <span className="badge-active px-2 py-1 rounded text-xs font-semibold">ACTIVE</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Candidates</h1>
          <p className="text-slate-600 mt-1">Manage and track all internship candidates.</p>
        </div>
        <Link href="/dashboard/mail" className="btn-primary shrink-0">
          <Mail size={18} className="mr-2" /> Email All
        </Link>
      </div>

      <div className="card">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 rounded-t-xl">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email or track..." 
              className="input pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-outline flex items-center gap-2">
            <Filter size={18} /> Filter Status
          </button>
        </div>

        <div className="table-wrap rounded-none border-x-0 border-b-0">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Track</th>
                <th>Joining Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-8"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
              ) : filteredCandidates.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-500">No candidates found.</td></tr>
              ) : (
                filteredCandidates.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="font-medium text-slate-900">{c.name}</div>
                      <div className="text-xs text-slate-500">{c.email}</div>
                    </td>
                    <td className="text-sm">{c.internshipTrack || "—"}</td>
                    <td className="text-sm text-slate-600">
                      {c.joiningDate ? format(parseISO(c.joiningDate), "MMM dd, yyyy") : "—"}
                    </td>
                    <td>{getStatusBadge(c.status)}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/mail?to=${c.email}`} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded bg-slate-50 hover:bg-indigo-50" title="Email Candidate">
                          <Mail size={16} />
                        </Link>
                        <Link href={`/dashboard/candidates/${c.id}`} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded bg-slate-50 hover:bg-indigo-50" title="View Profile">
                          <Eye size={16} />
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
