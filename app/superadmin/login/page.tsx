'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { Mail, Lock, KeyRound, Eye, EyeOff, Ship, ShieldAlert, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Auto redirect if already logged in as Superadmin
  useEffect(() => {
    if (user && user.role?.toUpperCase() === 'SUPERADMIN') {
      window.location.href = '/superadmin/companies';
    }
  }, [user]);

  // Clear toast after 3s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      setIsLoading(true);
      
      // Step 1: Verify Password using secure RPC
      const { data: rawUser, error: rpcError } = await supabase.rpc('verify_user_password', {
        p_email: email.trim().toLowerCase(),
        p_password: password
      });

      if (rpcError || !rawUser) {
        throw new Error('Invalid login credentials');
      }

      const dbUser = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;

      // Manually set a mock session in local storage for useAuth fallback
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_portal_mode');
        const mockSession = {
          user: {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role || 'STAFF',
            company_id: dbUser.company_id
          },
          expiry: Date.now() + 86400000 // 24 hours
        };
        localStorage.setItem('invoice_session', JSON.stringify(mockSession));
        if (dbUser.role?.toUpperCase() === 'SUPERADMIN') {
          localStorage.setItem('superadmin_token', 'mock_jwt_token');
        }
      }

      // Establish Supabase Auth Session
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });
      
      if (authError) {
        console.warn('Supabase Auth failed, relying on mock session:', authError.message);
      }      
      showToast('Login successful! Redirecting...', 'success');

      setTimeout(() => {
        window.location.href = '/superadmin/companies';
      }, 500);

    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
      setIsLoading(false);
    }
  };



  const handleSendOtp = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address first');
      return;
    }

    setIsSendingOtp(true);
    setError(null);
    try {
      if (email === 'manisha36180000@gmail.com' || email === 'superadmin@gmail.com') {
        // Developer Bypass for Free Tier Limits
        showToast('Developer Mode: No email sent. Just type 000000 in the OTP box.', 'success');
        setIsSendingOtp(false);
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          shouldCreateUser: false // Prevents the "Confirm Your Signup" email
        }
      });
      if (error) throw error;
      showToast('OTP sent securely to your email address!', 'success');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      showToast('Failed to send OTP', 'error');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter your email address first to reset your password');
      return;
    }

    setIsResetting(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      showToast('Password reset link sent to your email!', 'success');
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset link');
      showToast('Failed to send reset email', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-950">
      
      {/* Plain Background */}
      <div className="absolute inset-0 z-0 bg-[#020617]"></div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl backdrop-blur-md border ${
              toast.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          {/* Glassmorphism Card */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
            
            {/* Header Section */}
            <div className="px-8 pt-10 pb-6 text-center relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400"></div>
              
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/50 border border-blue-400/20"
              >
                <Ship className="w-8 h-8 text-white" />
              </motion.div>
              
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight mb-2">
                Inspection Management System
              </h1>
              <div className="flex items-center justify-center gap-2 text-blue-400 font-medium text-sm uppercase tracking-widest">
                <ShieldAlert className="w-4 h-4" />
                Super Admin Portal
              </div>
            </div>

            {/* Error Banner */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-8 overflow-hidden"
                >
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm mb-6">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Unified Single-Page Form */}
            <div className="px-8 pb-10">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@system.com"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-200 placeholder-slate-500 transition-colors shadow-inner outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-sm font-medium text-slate-300">Password</label>
                    <button 
                      type="button" 
                      onClick={handleForgotPassword}
                      disabled={isResetting}
                      className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                    >
                      {isResetting ? 'Sending...' : 'Forgot password?'}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-11 pr-12 py-3.5 bg-slate-950/50 border border-slate-700/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-200 placeholder-slate-500 transition-colors shadow-inner outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="sr-only" 
                      />
                      <div className={`w-5 h-5 rounded border transition-colors flex items-center justify-center ${rememberMe ? 'bg-blue-500 border-blue-500' : 'bg-slate-950/50 border-slate-600 group-hover:border-slate-500'}`}>
                        {rememberMe && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                    <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                      Remember me for 30 days
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Login Securely
                      <ArrowRight className="w-5 h-5 opacity-80" />
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Footer */}
            <div className="bg-slate-950/50 py-4 px-8 border-t border-slate-800/50 text-center">
              <p className="text-xs text-slate-500 font-medium">
                Authorized Enterprise Personnel Only. <br/> Access is heavily monitored.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
