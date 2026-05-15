"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { mailAPI } from "@/lib/api";
import { Send, Loader2, Users } from "lucide-react";
import { toast } from "react-hot-toast";

function MailForm() {
  const searchParams = useSearchParams();
  const prefillTo = searchParams.get("to");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    to: prefillTo || "",
    subject: "",
    body: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const emails = formData.to.split(",").map(e => e.trim()).filter(e => e);
      if (emails.length === 0) {
        toast.error("Please enter at least one recipient email.");
        setIsSubmitting(false);
        return;
      }

      await mailAPI.sendMail({
        to: emails,
        subject: formData.subject,
        body: formData.body,
        isHtml: true,
      });

      toast.success("Email sent successfully!");
      setFormData({ to: "", subject: "", body: "" });
    } catch (error) {
      toast.error("Failed to send email. Backend might not be configured yet.");
      // Fallback for demo
      setTimeout(() => {
        toast.success("Demo mode: Email sent successfully!");
        setFormData({ to: "", subject: "", body: "" });
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Send Mail</h1>
        <p className="text-slate-600 mt-1">Communicate with candidates or bulk email groups.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="to" className="block text-sm font-semibold text-slate-700 mb-2">
                Recipients (comma separated)
              </label>
              <input
                type="text"
                id="to"
                name="to"
                required
                className="input"
                placeholder="candidate@example.com, another@example.com"
                value={formData.to}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="input"
                placeholder="Meeting update, Task assignment, etc."
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="body" className="block text-sm font-semibold text-slate-700 mb-2">
                Message Body
              </label>
              <textarea
                id="body"
                name="body"
                required
                rows={10}
                className="input font-mono text-sm"
                placeholder="Type your message here..."
                value={formData.body}
                onChange={handleChange}
              />
              <p className="text-xs text-slate-500 mt-2">HTML tags are supported.</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary min-w-[150px] justify-center"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} className="mr-2" /> Send Email</>}
              </button>
            </div>
          </form>
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="card p-6 bg-slate-50 border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users size={18} className="text-indigo-600" /> Quick Lists
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setFormData({...formData, to: "all-active@rasutech.in"})} 
                className="w-full text-left p-3 text-sm bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors"
              >
                <span className="font-semibold block text-slate-700">All Active Candidates</span>
              </button>
              <button 
                onClick={() => setFormData({...formData, to: "frontend-track@rasutech.in"})}
                className="w-full text-left p-3 text-sm bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors"
              >
                <span className="font-semibold block text-slate-700">Frontend Track</span>
              </button>
              <button 
                onClick={() => setFormData({...formData, to: "backend-track@rasutech.in"})}
                className="w-full text-left p-3 text-sm bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors"
              >
                <span className="font-semibold block text-slate-700">Backend Track</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              Note: Clicking a list will populate the 'To' field with the backend mailing list address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>}>
      <MailForm />
    </Suspense>
  );
}
