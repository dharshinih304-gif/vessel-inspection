'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  ShieldAlert, 
  Settings, 
  UserPlus, 
  Lock, 
  Trash2, 
  CheckCircle,
  FileX,
  Mail,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPage = () => {
  const { user, hasRole } = useAuth();
  const router = useRouter();
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogsLoading, setIsLogsLoading] = useState(false);

  useEffect(() => {
    if (!hasRole(['ADMIN'])) {
      router.push(user?.company_id ? `/company/${user.company_id}/dashboard` : '/dashboard');
    } else {
      fetchUsers();
      fetchLogs();
    }
  }, [hasRole, user, router]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      let query = supabase.from('users').select('*');
      
      // Multi-tenant isolation for company admins
      if (user?.company_id) {
        query = query.eq('company_id', user.company_id);
      }

      const { data, error } = await query.order('name', { ascending: true });
      
      if (error) throw error;
      setSystemUsers(data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setIsLogsLoading(true);
      let query = supabase.from('audit_logs').select('*');
      
      if (user?.company_id) {
        query = query.eq('company_id', user.company_id);
      }

      const { data, error } = await query.order('created_at', { ascending: false }).limit(10);
      
      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsLogsLoading(false);
    }
  };

  const logEvent = async (action: string, resource: string, details: any = {}) => {
    try {
      await supabase.from('audit_logs').insert([{
        company_id: user?.company_id,
        user_id: user?.id,
        action,
        resource,
        details
      }]);
      fetchLogs();
    } catch (error) {
      console.error('Logging failed:', error);
    }
  };

  const deleteUser = async (id: string) => {
    if (id === user?.id) {
      alert("You cannot delete your own admin account.");
      return;
    }
    if (!confirm('Are you sure you want to remove this user from the system?')) return;
    
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
      fetchUsers();
    } catch (error) {
      alert('Error deleting user: ' + (error as any).message);
    }
  };

  const [policies, setPolicies] = useState([
    { id: '2fa', label: 'Two-Factor Authentication', status: true, desc: 'Enforce MFA for all accounts' },
    { id: 'ip', label: 'IP Access Restriction', status: false, desc: 'Restrict access to trusted networks' },
    { id: 'archive', label: 'Auto Archiving', status: true, desc: 'Archive reports after 12 months' },
    { id: 'role', label: 'Role Validation', status: true, desc: 'Verify inspector credentials' }
  ]);

  const togglePolicy = (id: string) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, status: !p.status } : p));
  };

  const stats = [
    { label: 'Active Users', value: systemUsers.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Security Level', value: 'High', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'System Health', value: '99.9%', icon: CheckCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  if (!hasRole(['ADMIN'])) return null;

  return (
    <div className="space-y-10 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase italic">Command Center</h1>
          <p className="text-muted-foreground mt-2 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Centralized Administrative Oversight
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-2.5 bg-secondary border border-border rounded-2xl text-[10px] font-black tracking-widest flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
            ENCRYPTED LINK ACTIVE
          </div>
        </div>
      </div>

      {/* Visual Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-3xl p-6 shadow-sm group hover:border-accent/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Live Metric</span>
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-black text-foreground mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Management Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card border border-border rounded-[40px] overflow-hidden shadow-xl">
            <div className="p-8 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-secondary/30">
              <div>
                <h3 className="font-black text-xl uppercase tracking-tighter text-foreground">Personnel Directory</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">{systemUsers.length} VERIFIED OPERATORS</p>
              </div>
              <button 
                onClick={() => router.push('/admin/users')}
                className="px-6 py-3 bg-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20"
              >
                <UserPlus className="w-4 h-4" />
                Manage Directory
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-secondary/10">
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Operator Identity</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Security Tier</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    <tr>
                      <td colSpan={3} className="py-20 text-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Querying Database...</span>
                      </td>
                    </tr>
                  ) : (
                    systemUsers.slice(0, 5).map((u) => (
                      <tr key={u.id} className="group hover:bg-secondary/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-sm font-black text-accent uppercase border border-accent/20">
                              {u.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-black text-foreground uppercase tracking-tight">{u.name}</p>
                              <p className="text-[10px] font-bold text-muted-foreground lowercase">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={cn(
                            "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border",
                            u.role === 'ADMIN' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                            u.role === 'SUPERINTENDENT' ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" :
                            "bg-sky-500/10 text-sky-500 border-sky-500/20"
                          )}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2.5 bg-secondary hover:bg-accent/10 rounded-xl border border-border transition-all text-muted-foreground hover:text-accent shadow-sm">
                              <Settings className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteUser(u.id)}
                              className="p-2.5 bg-secondary hover:bg-rose-500/10 rounded-xl border border-border transition-all text-muted-foreground hover:text-rose-500 shadow-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {systemUsers.length > 5 && (
              <div className="p-6 text-center border-t border-border">
                <button 
                  onClick={() => router.push('/admin/users')}
                  className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline"
                >
                  View all {systemUsers.length} accounts
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Settings Section */}
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-[40px] p-10 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-accent/5 -mr-4 -mt-4 group-hover:scale-110 transition-transform duration-700">
              <ShieldAlert className="w-32 h-32" />
            </div>
            <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8 relative z-10">System Policies</h3>
            <div className="space-y-8 relative z-10">
              {policies.map((policy) => (
                <div key={policy.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-foreground uppercase tracking-tight">{policy.label}</span>
                    <div 
                      onClick={() => togglePolicy(policy.id)}
                      className={cn(
                        "w-12 h-6 rounded-full relative cursor-pointer transition-all border-2",
                        policy.status ? "bg-accent border-accent" : "bg-slate-200 border-slate-200 dark:bg-slate-800 dark:border-slate-800"
                      )}
                    >
                      <div className={cn(
                        "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                        policy.status ? "right-0.5" : "left-0.5"
                      )} />
                    </div>
                  </div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed">{policy.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-6 -right-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Lock className="w-32 h-32" />
            </div>
            <h3 className="font-black text-xl uppercase tracking-tighter relative z-10">Audit Trail</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-[0.2em] relative z-10">Real-time security ledger.</p>
            
            <div className="mt-8 space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
              {isLogsLoading ? (
                <div className="flex justify-center py-10">
                  <RefreshCw className="w-6 h-6 animate-spin text-accent/50" />
                </div>
              ) : logs.length === 0 ? (
                <p className="text-[10px] font-bold text-slate-500 uppercase text-center py-10">No records found.</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black text-accent uppercase tracking-widest">{log.action}</span>
                      <span className="text-[9px] font-bold text-slate-500">{new Date(log.created_at).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[10px] font-medium text-slate-300">Target: {log.resource}</p>
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={() => fetchLogs()}
              className="mt-10 w-full py-4 bg-white/5 hover:bg-accent rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-white/10 relative z-10 active:scale-95 shadow-lg"
            >
              Verify Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
