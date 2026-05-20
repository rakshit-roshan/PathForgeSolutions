"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Upload, Download, Eye, X, Award, FileText, CheckCircle2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Doc { 
  id: string; 
  name: string; 
  type: string; 
  date: string; 
  size: string; 
  status: string; 
  issuedBy?: string; 
}

const DOC_CATEGORIES = ["All", "Offer Letter", "LOR", "Certificate", "Other"];

export default function EmployeeVault({ docs: initialDocs }: { docs: Doc[] }) {
  const { user } = useAuth();
  const [docs, setDocs] = useState<Doc[]>(initialDocs);
  const [activeTab, setActiveTab] = useState("All");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<Doc | null>(null);

  const filtered = activeTab === "All" ? docs : docs.filter(d => d.type === activeTab);

  const candidateName = user?.name || "Marcus Sterling";
  const candidateEmail = user?.email || "candidate@pathforge.com";
  const candidateTrack = user?.internshipTrack || "Full-Stack Software Engineering";

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    setTimeout(() => {
      const nd: Doc = {
        id: `u-${Date.now()}`,
        name: f.name,
        type: "Other",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        size: `${(f.size / 1024).toFixed(0)} KB`,
        status: "UPLOADED",
      };
      setDocs(prev => [nd, ...prev]);
      setUploading(false);
      toast.success(`Successfully uploaded "${f.name}" to vault.`);
    }, 1000);
    e.target.value = "";
  };

  // Dynamic Styled HTML Document Generator for actual file download
  const triggerActualDownload = (doc: Doc) => {
    const dateStr = doc.date !== "Pending" ? doc.date : new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const secureHash = "PF-" + Math.floor(100000 + Math.random() * 900000);
    
    let htmlContent = "";
    if (doc.type === "Offer Letter") {
      htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${doc.name}</title>
  <style>
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; padding: 40px; color: #1f2937; line-height: 1.6; background: #fff; }
    .letterhead { border-bottom: 2px solid #003ec7; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 24px; font-weight: 900; color: #003ec7; letter-spacing: -0.03em; }
    .org-details { text-align: right; font-size: 11px; color: #4b5563; line-height: 1.4; }
    .recipient { margin: 25px 0; font-size: 14px; }
    .subject { font-weight: bold; margin: 20px 0; text-decoration: underline; color: #111827; font-size: 14px; }
    .footer { margin-top: 60px; border-top: 1px solid #e5e7eb; padding-top: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
    .signature { text-align: left; }
    .seal { width: 90px; height: 90px; border-radius: 50%; border: 3px double #003ec7; color: #003ec7; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 8px; font-weight: 900; text-transform: uppercase; text-align: center; transform: rotate(-12deg); margin-left: 20px; }
  </style>
</head>
<body>
  <div class="letterhead">
    <div class="logo">PATHFORGE SOLUTIONS</div>
    <div class="org-details">
      100 Innovation Boulevard, Tech Park Area<br/>
      Suite 400, Sector V, Salt Lake City<br/>
      records@pathforgesolutions.com | www.pathforge.com
    </div>
  </div>
  <div style="font-size: 12px; color: #6b7280; font-weight: 500;">Ref ID: ${secureHash}</div>
  <div style="font-size: 12px; color: #6b7280;">Date: ${dateStr}</div>
  
  <div class="recipient">
    <strong>To:</strong><br/>
    ${candidateName}<br/>
    Email: ${candidateEmail}<br/>
    Internship Track: ${candidateTrack}
  </div>

  <div class="subject">Subject: Offer of Engagement - Technical Internship</div>

  <p>Dear ${candidateName},</p>
  <p>On behalf of PathForge Solutions Pvt Ltd, we are extremely pleased to extend to you an offer of engagement as a <strong>Technical Research Intern</strong> under our specialized <strong>${candidateTrack}</strong> track.</p>
  
  <p><strong>Engagement Terms & Milestones:</strong></p>
  <ul>
    <li><strong>Commencement Date:</strong> ${dateStr}</li>
    <li><strong>Program Duration:</strong> 6 Months standard corporate roadmap.</li>
    <li><strong>Stipend Component:</strong> INR 25,000 / Month (all-inclusive consolidated).</li>
    <li><strong>Performance Audit:</strong> Weekly logs evaluation in PathForge Console.</li>
  </ul>
  
  <p>During this residency, you will work alongside enterprise software engineers, handling Docker configurations, microservice orchestrations, relational data performance tuning, and premium UI mockups. Your progress will be reviewed weekly by your assigned mentor.</p>
  <p>Please log in to your PathForge dashboard to sign and accept this official contract within seven days of receipt.</p>
  <p>Congratulations, and welcome to our summer engineering cohort!</p>

  <div class="footer">
    <div class="signature">
      <div style="font-size: 14px; font-weight: bold; color: #111827;">Aravind Swamy</div>
      <div style="font-size: 11px; color: #4b5563; margin-top: 2px;">Director of Talent Management</div>
      <div style="font-size: 9px; color: #9ca3af; font-family: monospace; margin-top: 12px;">SECURE ID: ${secureHash}</div>
    </div>
    <div class="seal">
      <div style="font-size: 7px; color: #003ec7; border-bottom: 1px solid #003ec7; padding-bottom: 2px; margin-bottom: 2px; font-weight: bold;">PATHFORGE</div>
      <div>OFFICIAL</div>
      <div>RECORD</div>
      <div style="font-size: 7px; color: #003ec7; border-top: 1px solid #003ec7; padding-top: 2px; margin-top: 2px; font-weight: bold;">SECURE LOG</div>
    </div>
  </div>
</body>
</html>
      `;
    } else if (doc.type === "Certificate") {
      htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${doc.name}</title>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background: #fdfbf7; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .cert-card { background: #fff; border: 16px solid #111827; outline: 4px solid #d97706; outline-offset: -10px; padding: 50px 30px; text-align: center; max-width: 750px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border-radius: 4px; box-sizing: border-box; }
    .cert-title { font-size: 32px; color: #111827; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 10px; }
    .cert-subtitle { font-size: 11px; text-transform: uppercase; letter-spacing: 4px; color: #4b5563; font-weight: bold; margin-bottom: 25px; }
    .candidate-name { font-size: 26px; font-weight: 800; color: #003ec7; text-decoration: underline; text-decoration-color: #d97706; text-underline-offset: 6px; margin: 20px 0; }
    .cert-text { font-size: 13px; color: #374151; line-height: 1.7; max-width: 580px; margin: 0 auto 25px; }
    .gold-badge { width: 64px; height: 64px; background: #d97706; border-radius: 50%; border: 4px solid #fef3c7; margin: 15px auto; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 900; font-size: 8px; box-shadow: 0 4px 10px rgba(217,119,6,0.25); text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="cert-card">
    <div class="cert-title">Certificate of Achievement</div>
    <div class="cert-subtitle">PathForge Solutions Technical Academy</div>
    <p style="font-size: 13px; color: #6b7280; margin-bottom: 5px;">This is proudly presented to</p>
    <div class="candidate-name">${candidateName}</div>
    <p class="cert-text">
      for outstanding demonstration of technical expertise, continuous contribution, and successful completion of the intensive <strong>${candidateTrack} Internship Residency Program</strong>.
    </p>
    <div class="gold-badge"><div style="text-align:center;">PASS<br/>100%</div></div>
    
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; font-size: 11px; color: #4b5563; border-top: 1px solid #f3f4f6; padding-top: 15px; text-align: left;">
      <div>
        <strong>Date of Release:</strong> ${dateStr}<br/>
        <span style="font-family: monospace; font-size: 8px; color: #9ca3af;">CREDENTIAL VERIFICATION ID: ${secureHash}</span>
      </div>
      <div style="text-align: right;">
        <strong>Authorized Signatory:</strong><br/>
        <span style="font-weight: bold; color: #111827;">PathForge Academic Council Director</span>
      </div>
    </div>
  </div>
</body>
</html>
      `;
    } else {
      // General custom document download
      htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${doc.name}</title>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; padding: 40px; color: #374151; line-height: 1.6; background: #f9fafb; }
    .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px; max-width: 580px; margin: 40px auto; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
    h1 { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #111827; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    td { padding: 8px 10px; border-bottom: 1px solid #f3f4f6; font-size: 12px; }
    .label { font-weight: bold; color: #6b7280; width: 140px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Document Metadata Registry File</h1>
    <p style="font-size: 11px; color: #6b7280;">Secure metadata payload compiled dynamically from the PathForge Document Vault.</p>
    <table>
      <tr><td class="label">Document ID</td><td>${doc.id}</td></tr>
      <tr><td class="label">File Name</td><td>${doc.name}</td></tr>
      <tr><td class="label">Category</td><td>${doc.type}</td></tr>
      <tr><td class="label">Released Date</td><td>${dateStr}</td></tr>
      <tr><td class="label">File Size</td><td>${doc.size}</td></tr>
      <tr><td class="label">Registry Status</td><td>${doc.status}</td></tr>
      <tr><td class="label">Intern Name</td><td>${candidateName} (${candidateEmail})</td></tr>
      <tr><td class="label">Division Track</td><td>${candidateTrack}</td></tr>
    </table>
  </div>
</body>
</html>
      `;
    }

    try {
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.name.replace(/\.pdf$/, ".html");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded: ${doc.name.replace(/\.pdf$/, ".html")}`);
    } catch (err) {
      toast.error("Failed to generate file download.");
    }
  };

  const statusMeta: Record<string, { cls: string; label: string }> = {
    ISSUED:    { cls: "bg-emerald-50 text-emerald-700 border-emerald-200 border", label: "Issued" },
    SUSPENDED: { cls: "bg-rose-50 text-rose-700 border-rose-200 border", label: "Access Revoked" },
    PENDING:   { cls: "bg-amber-50 text-amber-700 border-amber-200 border", label: "Locked" },
    UPLOADED:  { cls: "bg-blue-50 text-blue-700 border-blue-200 border", label: "Uploaded File" },
  };

  const TYPE_ICONS: Record<string, string> = {
    "Offer Letter": "work",
    LOR: "recommend",
    Certificate: "workspace_premium",
    Other: "description",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#c3c5d9]/40 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#191c1e]">Secure Document Vault</h2>
          <p className="text-xs text-[#505f76] mt-1">Review official letters, achievements, LOR assets, or upload technical certificates.</p>
        </div>
        <label className="flex items-center gap-2 bg-[#003ec7] text-white px-4 py-2 text-xs font-bold rounded-lg hover:bg-[#0034a7] transition-all cursor-pointer shadow active:scale-95 shrink-0">
          {uploading
            ? <><span className="material-symbols-outlined animate-spin text-[16px]">refresh</span> Uploading...</>
            : <><Upload size={14} /> Upload Document</>}
          <input type="file" className="hidden" accept=".pdf,.doc,.docx,.png,.jpg" onChange={handleUpload} />
        </label>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {DOC_CATEGORIES.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === cat
                ? "bg-[#003ec7] text-white shadow shadow-md"
                : "bg-white text-[#505f76] border border-[#c3c5d9]/35 hover:border-[#003ec7]/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Docs grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white border border-[#c3c5d9]/35 rounded-2xl p-10 flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-[#c3c5d9] mb-3">folder_open</span>
            <p className="text-sm font-semibold text-[#191c1e]">No vault entries registered</p>
            <p className="text-xs text-[#505f76] mt-1">No documents in category "{activeTab}" registered inside your storage block.</p>
          </div>
        ) : filtered.map(doc => {
          const meta = statusMeta[doc.status] || { cls: "bg-slate-50 text-slate-700", label: doc.status };
          const isSuspended = doc.status === "SUSPENDED";
          return (
            <div key={doc.id} className={`bg-white border border-[#c3c5d9]/40 p-5 rounded-2xl flex flex-col gap-4 shadow-sm hover:border-[#003ec7]/35 transition-all ${isSuspended ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#003ec7]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#003ec7] text-[22px]">
                    {TYPE_ICONS[doc.type] || "description"}
                  </span>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${meta.cls}`}>{meta.label}</span>
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-bold text-[#191c1e] leading-snug line-clamp-2">{doc.name}</p>
                <p className="text-xs text-[#505f76] mt-1">{doc.type}</p>
                <p className="text-[10px] text-[#737688] mt-1.5">{doc.date} {doc.size !== "—" ? `· ${doc.size}` : ""}</p>
              </div>
              
              <div className="flex gap-2 pt-3 border-t border-[#c3c5d9]/20">
                {isSuspended ? (
                  <div className="flex items-center gap-1.5 text-[10px] text-[#ba1a1a] font-bold">
                    <ShieldAlert size={14} /> Access revoked by program board
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => setPreview(doc)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 border border-[#c3c5d9]/45 rounded-lg text-xs font-bold text-[#505f76] hover:bg-[#f2f4f6] transition-colors active:scale-95"
                    >
                      <Eye size={12} /> Preview
                    </button>
                    <button
                      disabled={doc.status === "PENDING"}
                      onClick={() => doc.status !== "PENDING" ? triggerActualDownload(doc) : toast.error("This document is currently locked. Contact administration.")}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                        doc.status === "PENDING"
                          ? "bg-[#eceef0] text-[#c3c5d9] cursor-not-allowed"
                          : "bg-[#003ec7] text-white hover:bg-[#0034a7] shadow"
                      }`}
                    >
                      <Download size={12} /> {doc.status === "PENDING" ? "Locked" : "Download"}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Share Document with Admin / Mentor */}
      <div className="bg-white border border-[#c3c5d9]/40 p-6 rounded-2xl shadow-sm border-t-4 border-t-[#003ec7]">
        <div className="flex items-center gap-3 mb-3">
          <span className="material-symbols-outlined text-[#003ec7] font-bold">cloud_upload</span>
          <h3 className="text-sm font-bold text-[#191c1e]">Share Document with Academy Board</h3>
        </div>
        <p className="text-xs text-[#505f76] mb-4">Upload technical certificates, credentials, or review letters to share with your managers and assigned cohort mentors.</p>
        <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-[#c3c5d9]/50 rounded-xl hover:border-[#003ec7]/50 hover:bg-[#003ec7]/[0.01] transition-all cursor-pointer group">
          <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-[#003ec7] transition-colors">upload_file</span>
          <span className="text-xs font-bold text-[#505f76] group-hover:text-[#003ec7] transition-colors">Click to upload or drag & drop</span>
          <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF, DOC, DOCX or PNG/JPG (Max 5MB)</p>
          <input type="file" className="hidden" accept=".pdf,.doc,.docx,.png,.jpg" onChange={handleUpload} />
        </label>
      </div>

      {/* STUNNING DOCUMENT PREVIEW MODAL */}
      {preview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fade-in border border-[#c3c5d9]/40" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-[#191c1e] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#003ec7]">assignment</span>
                  {preview.name}
                </h3>
                <p className="text-[10px] text-[#737688] mt-0.5">{preview.type} · Released on {preview.date === "Pending" ? "Awaiting Release" : preview.date}</p>
              </div>
              <button 
                onClick={() => setPreview(null)} 
                className="text-[#737688] hover:text-[#191c1e] p-1.5 hover:bg-slate-200/50 rounded-full transition-all"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Document Content Simulation (LIVE HIGH-FIDELITY PREVIEW) */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-100/50 custom-scrollbar flex justify-center">
              {/* Document Sheet */}
              <div className="bg-white w-full max-w-[620px] border border-slate-200 shadow-md p-10 rounded shadow-sm text-xs text-slate-700 leading-relaxed font-serif relative overflow-hidden select-text min-h-[550px]">
                {preview.type === "Offer Letter" && (
                  <div className="space-y-6">
                    {/* Company Letterhead */}
                    <div className="border-b-2 border-[#003ec7] pb-4 flex justify-between items-end font-sans">
                      <div>
                        <span className="text-base font-black text-[#003ec7] tracking-tight">PATHFORGE SOLUTIONS</span>
                        <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Enterprise Academy</p>
                      </div>
                      <div className="text-right text-[8px] text-slate-500 leading-normal">
                        100 Innovation Blvd, Tech Area<br/>
                        Suite 400, Sector V, Salt Lake City<br/>
                        records@pathforgesolutions.com
                      </div>
                    </div>

                    <div className="flex justify-between items-start font-sans text-[9px] text-slate-500">
                      <div>Ref: PF-OFF-{preview.id.toUpperCase()}-SECURE</div>
                      <div>Date: {preview.date !== "Pending" ? preview.date : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                    </div>

                    <div className="font-sans text-[10px]">
                      <strong>To:</strong><br/>
                      <span className="font-bold text-slate-900">{candidateName}</span><br/>
                      Email: {candidateEmail}<br/>
                      Track: {candidateTrack}
                    </div>

                    <div className="font-sans font-bold text-slate-900 underline uppercase tracking-wide text-[10px]">
                      Subject: Engagement Offer for Technical Internship
                    </div>

                    <p>Dear {candidateName},</p>
                    <p>
                      On behalf of PathForge Solutions Pvt Ltd, we are extremely pleased to extend to you an offer of engagement as a <strong>Technical Research Intern</strong> under our specialized <strong>{candidateTrack}</strong> track.
                    </p>
                    <p>
                      <strong>Summary of Engagement Terms:</strong>
                    </p>
                    <table className="w-full border-collapse border border-slate-200 text-left font-sans text-[9px]">
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold bg-slate-50 w-1/3">Commencement Date</td>
                          <td className="p-2">{preview.date !== "Pending" ? preview.date : "Immediate Acceptance"}</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold bg-slate-50">Program Duration</td>
                          <td className="p-2">6 Months standard technical residency.</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold bg-slate-50">Consolidated Stipend</td>
                          <td className="p-2">INR 25,000 / Month (all-inclusive).</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold bg-slate-50">Tracking Mechanism</td>
                          <td className="p-2">Weekly daily-log timesheet submissions.</td>
                        </tr>
                      </tbody>
                    </table>

                    <p>
                      During this tenure, you will work within enterprise engineering teams, completing cloud pipeline tasks, Docker deployments, backend API integrations, and premium product design updates.
                    </p>
                    
                    <p>Please log in to your PathForge dashboard to sign and accept this official agreement.</p>
                    
                    <p className="pt-2">Welcome to the PathForge engineering cohort!</p>

                    {/* Footer / Signature Block */}
                    <div className="pt-8 border-t border-slate-100 flex justify-between items-end font-sans">
                      <div>
                        <div className="font-bold text-slate-950">Aravind Swamy</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">Director of Talent Management</div>
                        <div className="text-[7px] text-slate-400 font-mono mt-2">SECURE ID: PF-OFF-{Math.floor(100000 + Math.random() * 900000)}</div>
                      </div>
                      
                      {/* Seal simulation */}
                      <div className="w-16 h-16 border-2 border-dashed border-[#003ec7] rounded-full flex flex-col items-center justify-center font-bold text-[#003ec7] text-[6px] tracking-tighter uppercase transform rotate-[-12deg] leading-tight shrink-0 bg-white">
                        <span className="font-extrabold">PATHFORGE</span>
                        <span>OFFICIAL</span>
                        <span>SEAL</span>
                      </div>
                    </div>
                  </div>
                )}

                {preview.type === "Certificate" && (
                  <div className="flex flex-col items-center text-center justify-between min-h-[480px] border-8 border-slate-800 p-8 outline outline-2 outline-amber-600 outline-offset-[-6px]">
                    <div>
                      <span className="font-sans text-[8px] font-black uppercase tracking-[5px] text-amber-700">PathForge Technical Academy</span>
                      <h4 className="text-xl font-bold font-serif uppercase text-slate-900 tracking-wide mt-3 mb-1">Certificate of Achievement</h4>
                      <p className="font-sans text-[9px] text-slate-500 italic">This credential is proudly presented to</p>
                    </div>

                    <div className="my-6">
                      <span className="text-lg font-bold text-[#003ec7] underline decoration-amber-600 underline-offset-4 font-serif">{candidateName}</span>
                      <p className="font-sans text-[9px] text-slate-600 max-w-[420px] mx-auto mt-4 leading-relaxed">
                        for exceptional technical proficiency, milestone execution, and successful graduation from the intensive 6-Month <strong>{candidateTrack}</strong> Technical Internship Program.
                      </p>
                    </div>

                    <div className="flex items-center justify-center w-14 h-14 bg-amber-600 border-4 border-amber-100 rounded-full text-white text-[8px] font-black tracking-widest uppercase shadow transform rotate-[-10deg]">
                      PASS 100%
                    </div>

                    <div className="w-full border-t border-slate-100 pt-4 flex justify-between items-end font-sans text-[9px] text-slate-500 text-left">
                      <div>
                        <strong>Date Issued:</strong> {preview.date !== "Pending" ? preview.date : new Date().toLocaleDateString()}<br/>
                        <span className="text-[7px] text-slate-400 font-mono">ID: CERT-ACAD-{Math.floor(100000 + Math.random() * 900000)}</span>
                      </div>
                      <div className="text-right">
                        <strong>Authorized Representative</strong><br/>
                        <span className="font-bold text-slate-900">Academic Dean</span>
                      </div>
                    </div>
                  </div>
                )}

                {preview.type !== "Offer Letter" && preview.type !== "Certificate" && (
                  <div className="space-y-6 font-sans">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <span className="material-symbols-outlined text-4xl text-[#003ec7]">description</span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{preview.name}</h4>
                        <p className="text-[10px] text-slate-500">{preview.type} · File Registry Payload</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600">This document was uploaded by the candidate or automatically logged inside the secure storage block. Below is the parsed file metadata:</p>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50 space-y-2 text-[10px]">
                      <div className="flex justify-between"><strong className="text-slate-500">Registry ID:</strong> <span className="font-mono">{preview.id}</span></div>
                      <div className="flex justify-between"><strong className="text-slate-500">File Name:</strong> <span>{preview.name}</span></div>
                      <div className="flex justify-between"><strong className="text-slate-500">Category:</strong> <span>{preview.type}</span></div>
                      <div className="flex justify-between"><strong className="text-slate-500">Record Date:</strong> <span>{preview.date}</span></div>
                      <div className="flex justify-between"><strong className="text-slate-500">Size:</strong> <span>{preview.size}</span></div>
                      <div className="flex justify-between"><strong className="text-slate-500">Status:</strong> <span>{preview.status}</span></div>
                      <div className="flex justify-between"><strong className="text-slate-500">Candidate Owner:</strong> <span>{candidateName}</span></div>
                      <div className="flex justify-between"><strong className="text-slate-500">Owner Email:</strong> <span>{candidateEmail}</span></div>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200/40 rounded-xl text-[10px] text-amber-800 flex items-start gap-2">
                      <span className="material-symbols-outlined text-sm mt-0.5">info</span>
                      <span>This custom user-uploaded file does not contain a formal letterhead rendering but is secure and available for high-speed download.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <button 
                onClick={() => setPreview(null)}
                className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-slate-200/30 text-xs font-bold rounded-lg transition-all active:scale-95"
              >
                Close Preview
              </button>
              <button 
                onClick={() => {
                  triggerActualDownload(preview);
                  setPreview(null);
                }}
                className="px-4 py-2 bg-[#003ec7] text-white hover:bg-[#0034a7] text-xs font-bold rounded-lg shadow transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Download size={14} />
                Download Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
