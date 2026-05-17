"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authAPI } from "@/lib/api";
import { toast } from "react-hot-toast";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState({ message: '', type: '' });

  if (!token) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-7 text-center">
        <h3 className="text-lg font-bold text-red-600 mb-2">Invalid Link</h3>
        <p className="text-sm text-slate-600 mb-6">No reset token provided in the URL.</p>
        <Link href="/forgot-password" className="group relative w-full flex justify-center btn-premium-gradient !py-2.5 !px-4 !rounded-lg text-sm transition-all duration-200">
          Request new link
        </Link>
      </div>
    );
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ message: '', type: '' });
    
    if (newPassword.length < 6) {
      setStatus({ message: 'Password must be at least 6 characters long.', type: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.resetPassword({ token, newPassword });
      setStatus({ message: 'Password successfully reset! You can now log in.', type: 'success' });
      toast.success("Password successfully reset! You can now log in.");
      
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      if(error.response) {
        setStatus({ message: error.response.data || 'Failed to reset password. Link may be expired.', type: 'error' });
      } else {
        setStatus({ message: 'Network error. Please check your connection.', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-7">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              className="block w-full pl-9 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-4 w-4 text-slate-400 hover:text-slate-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                {showPassword ? (
                  <>
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </>
                ) : (
                  <>
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </>
                )}
              </svg>
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">Must be at least 6 characters.</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center btn-premium-gradient !py-2.5 !px-4 !rounded-lg text-sm transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? ( 
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Resetting...
            </>
          ) : "Reset password"}
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
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="antialiased text-slate-800 bg-gradient-to-br from-slate-50 via-white to-indigo-50 min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center h-full pt-[110px] md:pt-[130px] pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Create new password</h2>
            <p className="text-sm text-slate-600">Please enter your new password below</p>
          </div>

          <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 rounded-full border-t-transparent"></div></div>}>
            <ResetPasswordForm />
          </Suspense>

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
