'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Bell, Menu, User as UserIcon, Sun, Moon, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAccessibility } from '@/components/AccessibilityProvider';

export function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useAccessibility();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    toggleDarkMode();
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        let query = supabase
          .from('reports')
          .select('id, title, created_at')
          .eq('status', 'PENDING')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (user?.company_id) {
          query = query.eq('company_id', user.company_id);
        }

        const { data } = await query;
        setNotifications(data || []);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 border-b border-border/40 bg-background/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-[40]">
      <div className="flex items-center gap-6">
        <button 
          onClick={toggleSidebar}
          className="p-3 hover:bg-accent/10 rounded-2xl transition-all text-foreground group"
        >
          <Menu className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-3 hover:bg-accent/10 rounded-2xl transition-all text-foreground"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-400" />}
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-3 hover:bg-accent/10 rounded-2xl transition-all relative text-foreground"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-background">
                  {notifications.length}
                </span>
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border bg-secondary/50 flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-foreground">Notifications</span>
                  <span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full font-bold">{notifications.length} Pending</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground text-xs font-medium">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className="p-4 border-b border-border hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => { window.location.href = `/reports/${notif.id}`; setIsDropdownOpen(false); }}>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-foreground line-clamp-2">{notif.title || 'Technical Audit Report'}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">Awaiting Review • {new Date(notif.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 border-t border-border bg-secondary/20">
                  <button 
                    onClick={() => { window.location.href = '/reports'; setIsDropdownOpen(false); }}
                    className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-accent hover:bg-accent/10 rounded-xl transition-colors"
                  >
                    View All Reports
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-10 w-[1px] bg-border/60 mx-2" />

        <div className="flex items-center gap-4 pl-2">
          <div className="text-right hidden xl:block">
            <p className="text-sm font-black tracking-tight text-foreground uppercase italic leading-none">{user?.name || 'Authorized Personnel'}</p>
            <p className="text-[10px] text-accent mt-1.5 font-black uppercase tracking-[0.2em] leading-none">{user?.role || 'Operator'}</p>
          </div>
          
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white font-black text-xl border border-white/10 shadow-2xl relative group overflow-hidden">
            <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-20 transition-opacity" />
            {user?.name?.charAt(0) || <UserIcon className="w-6 h-6" />}
          </div>

          <button 
            onClick={logout}
            className="flex items-center justify-center w-12 h-12 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all group border border-rose-500/20"
            title="Secure Sign Out"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>
        </div>
      </div>
    </header>
  );
}
