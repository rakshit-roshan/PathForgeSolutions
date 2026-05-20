"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI, securityAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

function LoginForm() {
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });
  
  // 2FA login challenge states
  const [showOtpChallenge, setShowOtpChallenge] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (searchParams.get("expired")) {
      toast.error("Your session has expired. Please log in again.");
    }
  }, [searchParams]);

  if (isAuthenticated) {
    return null;
  }
  
  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ message: '', type: '' });

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      if (response.data && response.data.message === "2FA_REQUIRED") {
        setShowOtpChallenge(true);
        setStatus({ message: "A 2-Factor OTP has been sent to your email. Please verify.", type: "success" });
        return;
      }
      
      if(response.data && (typeof response.data === 'string' ? response.data === 'Login successful' : (response.data as any).token)) {
        setStatus({ message: 'Login successful! Redirecting...', type: 'success' });
        
        if (typeof response.data === 'string') {
          // Fallback mock token for old backend response
          login({
            token: "mock-jwt",
            user: { id: 1, email: formData.email, name: "User", role: "CANDIDATE" } as any,
            message: "Success"
          }, formData.rememberMe);
        } else {
          login(response.data as any, formData.rememberMe);
        }

        router.push('/dashboard');

      } else {
        setStatus({ message: 'Invalid credentials', type: 'error' });
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      if(error.response) {
        setStatus({ message: error.response.data || 'Login failed', type: 'error' });
      } else {
        setStatus({ message: 'Network error. Please check your connection.', type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: any) => {
    e.preventDefault();
    if (otpValue.trim().length !== 6) {
      toast.error("Please enter a valid 6-digit OTP code.");
      return;
    }
    setIsLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const response = await securityAPI.login2faVerify(formData.email, otpValue);
      setStatus({ message: "OTP verified successfully! Redirecting...", type: "success" });
      login({ ...response.data, message: "Success" }, formData.rememberMe);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("2FA Verification Login error:", err);
      setStatus({ message: err.response?.data || "Invalid OTP code provided.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.error("Google Authentication requires Client ID configuration in backend.");
    // In a real scenario, this would redirect to backend OAuth endpoint:
    // window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="antialiased text-slate-800 bg-gradient-to-br from-slate-50 via-white to-indigo-50 min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center h-full pt-[110px] md:pt-[130px] pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          {/* Logo and Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
            <p className="text-sm text-slate-600">Sign in to your account to continue</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-7">
            {!showOtpChallenge ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
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
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full pl-9 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                      placeholder="Enter your password"
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
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-700">
                      Remember me
                    </label>
                  </div>
                  <Link href="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <svg className="h-4 w-4 text-indigo-300 group-hover:text-indigo-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      Sign in
                    </>
                  )}
                </button>

                {/* Status Message */}
                {status.message && (
                  <div className={`text-xs font-semibold p-3 rounded-xl ${
                    status.type === 'success' 
                      ? 'text-green-800 bg-green-50 border border-green-200' 
                      : 'text-red-800 bg-red-50 border border-red-200'
                  }`}>
                    {status.message}
                  </div>
                )}
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <label htmlFor="otpValue" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Security Verification OTP
                  </label>
                  <input
                    id="otpValue"
                    name="otpValue"
                    type="text"
                    required
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                    className="block w-full text-center tracking-widest font-bold text-lg px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="e.g. 839401"
                  />
                  <p className="text-[10px] text-slate-400 font-semibold mt-2">
                    Enter the 6-digit one-time code sent to your email to verify your identity.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
                >
                  {isLoading ? "Verifying..." : "Verify & Complete Log In"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowOtpChallenge(false)}
                  className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-700 transition-all mt-2"
                >
                  Back to Sign In
                </button>

                {status.message && (
                  <div className={`text-xs font-semibold p-3 rounded-xl ${
                    status.type === 'success' 
                      ? 'text-green-800 bg-green-50 border border-green-200' 
                      : 'text-red-800 bg-red-50 border border-red-200'
                  }`}>
                    {status.message}
                  </div>
                )}
              </form>
            )}

            {/* Divider */}
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-slate-500">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="mt-4 grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full inline-flex justify-center items-center py-1.5 px-3 border border-slate-300 rounded-lg shadow-sm bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>
            </div>

            <div className="mt-4 text-center text-xs text-slate-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Sign up
              </Link>
            </div>
          </div>

          {/* Back to Home */}
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 rounded-full border-t-transparent"></div></div>}>
      <LoginForm />
    </Suspense>
  );
}
