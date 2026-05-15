"use client";

import { useState } from "react";
import Link from "next/link";
import { authAPI } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ message: '', type: '' });

    try {
      await authAPI.forgotPassword(email);
      setIsSent(true);
      toast.success("Reset link sent if email exists in our system.");
    } catch (error: any) {
      if(error.response) {
        setStatus({ message: error.response.data || 'Failed to process request.', type: 'error' });
      } else {
        setStatus({ message: 'Network error. Please check your connection.', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="antialiased text-slate-800 bg-gradient-to-br from-slate-50 via-white to-indigo-50 min-h-screen flex flex-col">
        <main className="flex-1 flex items-top justify-center h-full py-2 px-4 sm:px-6 lg:px-8 mt-[50px]">
          <div className="max-w-md w-full space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-7 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
              <p className="text-sm text-slate-600 mb-6">
                We've sent a password reset link to <br/>
                <strong>{email}</strong>
              </p>
              <p className="text-xs text-slate-500 mb-6 italic">
                (Check your server console since this is a local development environment!)
              </p>
              <Link href="/login" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 shadow-lg transition-all duration-200">
                Return to login
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="antialiased text-slate-800 bg-gradient-to-br from-slate-50 via-white to-indigo-50 min-h-screen flex flex-col">
      <main className="flex-1 flex items-top justify-center h-full py-2 px-4 sm:px-6 lg:px-8 mt-[50px]">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Forgot Password</h2>
            <p className="text-sm text-slate-600">Enter your email to receive a reset link</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-7">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? ( 
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending link...
                  </>
                ) : "Send reset link"}
              </button>

              {status.message && (
                <div className={`text-sm font-medium p-3 rounded-lg ${
                  status.type === 'success' 
                    ? 'text-green-800 bg-green-50 border border-green-200' 
                    : 'text-red-800 bg-red-50 border border-red-200'
                }`}>
                  {status.message}
                </div>
              )}
            </form>

            <div className="mt-4 text-center text-xs text-slate-600">
              <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                &larr; Back to login
              </Link>
            </div>
          </div>

          <div className="text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
