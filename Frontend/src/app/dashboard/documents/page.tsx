"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardLocale } from "@/config/dashboard.locale";
import {
  FolderOpen,
  FileText,
  FileSignature,
  Award,
  Upload,
  Download,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function DocumentVaultPage() {
  const { user } = useAuth();
  const locale = dashboardLocale.candidate.vault;

  const [uploadedFiles, setUploadedFiles] = useState<any[]>([
    { name: "Final_Sprint_Presentation.pdf", size: "2.4 MB", date: "Today, 10:45 AM", type: "pdf" },
    { name: "Code_Review_Rubric.docx", size: "820 KB", date: "Yesterday, 4:15 PM", type: "docx" },
  ]);

  const [dragging, setDragging] = useState(false);

  const handleFileUpload = (e: any) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFile = {
        name: files[0].name,
        size: (files[0].size / (1024 * 1024)).toFixed(2) + " MB",
        date: "Just now",
        type: files[0].name.split(".").pop(),
      };
      setUploadedFiles([newFile, ...uploadedFiles]);
      toast.success(locale.uploadSuccess);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const newFile = {
        name: files[0].name,
        size: (files[0].size / (1024 * 1024)).toFixed(2) + " MB",
        date: "Just now",
        type: files[0].name.split(".").pop(),
      };
      setUploadedFiles([newFile, ...uploadedFiles]);
      toast.success(locale.uploadSuccess);
    }
  };

  return (
    <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
      <div className="border-b border-slate-200/60 pb-5">
        <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded text-[9px] uppercase font-bold tracking-widest font-mono">
          Security Vault
        </span>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 mt-1">{locale.title}</h1>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed mt-0.5">{locale.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Issued Documents Segment */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 font-mono mb-5">
              {locale.issuedFolder}
            </h3>

            <div className="space-y-4">
              {/* Offer Letter */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/20 hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <FileSignature size={20} className="stroke-[1.8]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{locale.offerLetter}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 font-mono">Official credentials verified</p>
                  </div>
                </div>
                <button
                  onClick={() => toast.success(`Initiated: Download ${locale.offerLetter} PDF`)}
                  className="py-1.5 px-3 bg-white border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-50 shadow-sm transition-all"
                >
                  {locale.download}
                </button>
              </div>

              {/* LOR */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/20 hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <FileText size={20} className="stroke-[1.8]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{locale.lor}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 font-mono">Dispatched post track verification</p>
                  </div>
                </div>
                <span className="text-[8px] font-mono font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded tracking-widest">
                  Under Admin Audit
                </span>
              </div>

              {/* Completion Certificate */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/20 hover:bg-slate-50 transition-all opacity-70">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-slate-100 text-slate-400 rounded-xl">
                    <Award size={20} className="stroke-[1.8]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400">{locale.completionCertificate}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 font-mono">Awaiting final milestone velocity</p>
                  </div>
                </div>
                <span className="text-[8px] font-mono font-extrabold uppercase bg-slate-100 text-slate-400 border border-slate-200 px-2 py-0.5 rounded tracking-widest flex items-center gap-1">
                  <Lock size={10} /> Locked
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Segment */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[340px]">
            <div>
              <h3 className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 font-mono mb-4">
                {locale.sharedFolder}
              </h3>

              {/* Drag Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                  dragging ? "border-indigo-600 bg-indigo-50/30" : "border-slate-200 hover:border-indigo-300"
                }`}
              >
                <input
                  type="file"
                  id="vault_upload"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <label htmlFor="vault_upload" className="cursor-pointer flex flex-col items-center w-full">
                  <Upload size={24} className="text-slate-400 mb-2 stroke-[1.8]" />
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide leading-snug">{locale.uploadPlaceholder}</span>
                  <span className="text-[9px] text-slate-400 font-medium mt-1">PDF, DOCX, ZIP (Max 10MB)</span>
                </label>
              </div>

              {/* Uploaded Stream */}
              <div className="mt-5 space-y-2 max-h-36 overflow-y-auto custom-scrollbar">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 border border-slate-100 rounded-lg">
                    <div className="flex items-center gap-2 truncate">
                      <FileText size={12} className="text-indigo-500 shrink-0" />
                      <span className="text-[11px] font-bold text-slate-700 truncate">{file.name}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">{file.size}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider border-t border-slate-100 pt-4 mt-4">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span>Directly auditable by admins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
