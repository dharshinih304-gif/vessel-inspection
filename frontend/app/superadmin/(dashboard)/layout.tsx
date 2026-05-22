'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useAccessibility } from '@/components/AccessibilityProvider';
import { 
  Compass, 
  Building2, 
  LogOut, 
  Sun, 
  Moon, 
  User
} from 'lucide-react';

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { darkMode, toggleDarkMode } = useAccessibility();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/superadmin/login');
      } else if (user.role?.toUpperCase() !== 'SUPERADMIN') {
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role?.toUpperCase() !== 'SUPERADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#060B19]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Verifying Superadmin Access...</p>
        </div>
      </div>
    );
  }

  const isCompanies = pathname?.includes('/superadmin/companies');

  return (
    <div className="min-h-screen flex bg-[#060B19] text-white font-sans selection:bg-blue-500/30">
      
      {/* Sidebar */}
      <div className="w-[260px] h-screen fixed left-0 top-0 bg-[#0A101F] border-r border-slate-800/60 flex flex-col z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 text-white font-semibold text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            Portal
          </div>
        </div>

        <div className="px-4 mt-2 flex flex-col gap-2">
          <button 
            onClick={() => router.push('/superadmin/companies')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isCompanies 
                ? 'bg-[#111C35] text-blue-400 border border-blue-900/50' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Company
          </button>
        </div>

        <div className="mt-auto p-4">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 border border-rose-900/50 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="h-20 bg-[#0A101F]/80 backdrop-blur-md border-b border-slate-800/60 flex items-center justify-end px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">ACTIVE IDENTITY</p>
                <p className="text-sm font-semibold text-slate-200">{user.name || 'Super Admin'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-x-hidden">
          {children}
        </main>
        
      </div>
    </div>
  );
}
