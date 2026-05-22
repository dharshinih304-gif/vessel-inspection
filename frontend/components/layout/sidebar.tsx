'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Ship, 
  ClipboardList, 
  Settings, 
  Users, 
  ShieldCheck, 
  LogOut,
  ChevronLeft,
  Menu,
  FileText,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', roles: ['ADMIN', 'SUPERINTENDENT', 'USER', 'STAFF'] },
  { icon: Ship, label: 'Vessel', href: '/vessels/management', roles: ['ADMIN', 'SUPERINTENDENT', 'STAFF'] },
  { icon: FileText, label: 'Reports', href: '/reports', roles: ['ADMIN', 'USER', 'SUPERINTENDENT', 'STAFF'] },
  { icon: Users, label: 'User Management', href: '/admin/users', roles: ['ADMIN', 'STAFF'] },
  { icon: Settings, label: 'Settings', href: '/settings', roles: ['ADMIN', 'USER', 'SUPERINTENDENT', 'STAFF'] },
];

export const Sidebar = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const filteredMenu = menuItems.map(item => {
    if (item.href === '/dashboard' && user?.company_id) {
      return { ...item, href: `/company/${user.company_id}/dashboard` };
    }
    return item;
  }).filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-[60] bg-slate-950 border-r border-white/5 transition-all duration-300 lg:sticky lg:top-0 h-screen",
      isOpen ? "w-72 translate-x-0" : "w-24 -translate-x-full lg:translate-x-0"
    )}>
      <div className="flex flex-col h-full">
        {/* Brand Header */}
        <div className="h-24 flex items-center justify-between px-8 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn("flex items-center gap-4", !isOpen && "lg:hidden")}
          >
            <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/40 border border-white/20">
              <Ship className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter leading-none uppercase italic" style={{ color: '#ffffff', opacity: 1 }}>SELLAMSOFT</span>
              <span className="text-[10px] font-black text-accent tracking-[0.3em] uppercase mt-1">Portal</span>
            </div>
          </motion.div>
          <button onClick={toggle} className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-colors">
            <ChevronLeft className="w-6 h-6 text-white/50" />
          </button>
          {!isOpen && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/40 border border-white/20 mx-auto hidden lg:flex"
            >
              <Ship className="w-7 h-7 text-white" />
            </motion.div>
          )}
        </div>



        {/* Navigation */}
        <nav className="flex-1 pt-10 pb-4 space-y-1 px-4 overflow-y-auto custom-scrollbar">
          {filteredMenu.map((item, i) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative",
                    isActive 
                      ? "bg-accent text-white shadow-xl shadow-accent/30 border border-white/20" 
                      : "text-slate-500 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-300 group-hover:scale-110", 
                  isActive ? "text-white" : "text-slate-500 group-hover:text-accent"
                )} />
                <span className={cn(
                  "text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-500 whitespace-nowrap",
                  !isOpen && "lg:hidden opacity-0 -translate-x-4"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-sm"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-6 mt-auto">
          <button 
            onClick={logout}
            className={cn(
              "flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-slate-500 hover:bg-rose-500 hover:text-white transition-all group border border-transparent hover:border-white/10 hover:shadow-xl hover:shadow-rose-500/20 shadow-sm"
            )}
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className={cn(
              "text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-500 whitespace-nowrap",
              !isOpen && "lg:hidden opacity-0 -translate-x-4"
            )}>
              Secure Logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};
