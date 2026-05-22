'use client';

import React, { useState, useEffect } from 'react';
import { usersApi } from '@/services/api';
import { useAuth } from '@/hooks/use-auth';
import { 
  Users, UserPlus, Pencil, Trash2, Search, X, ShieldCheck, Mail, Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function UserManagementPage() {
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'USER' 
  });

  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchUsers();
    }
  }, [authLoading, currentUser]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await usersApi.getAll();
      setUsers(data || []);
    } catch (error) {
      console.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Show loading during save
    try {
      const payload: any = { 
        name: formData.name,
        email: formData.email,
        role: formData.role,
        company_id: currentUser?.company_id 
      };
      
      // Only include password if provided (important for updates)
      if (formData.password) {
        payload.password = formData.password;
      }

      if (editingUser) {
        await usersApi.update(editingUser.id, payload);
      } else {
        await usersApi.create(payload);
      }
      setIsModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Error saving user';
      alert(`Save Failed: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentUser?.id) return alert("Cannot delete your own account.");
    if (!confirm('Are you sure?')) return;
    try {
      await usersApi.delete(id);
      fetchUsers();
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Error deleting user';
      alert(`Delete Failed: ${msg}`);
    }
  };

  const openEdit = (u: any) => {
    setEditingUser(u);
    setFormData({ 
      name: u.name, 
      email: u.email, 
      password: '', // Don't show password
      role: u.role 
    });
    setIsModalOpen(true);
  };

  const filtered = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-16 space-y-12 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase italic leading-none">User Management</h1>
          <p className="text-muted-foreground font-bold flex items-center gap-3">
             <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
             Control system access and authorized personnel roles
          </p>
        </div>
        <button 
          onClick={() => { setEditingUser(null); setFormData({ name: '', email: '', password: '', role: 'USER' }); setIsModalOpen(true); }}
          className="flex items-center gap-4 px-10 py-5 bg-accent text-white rounded-[24px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-accent/40 border border-white/20 text-sm group"
        >
          <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" /> 
          Add User
        </button>
      </div>

      <div className="relative group max-w-2xl">
        <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-accent transition-colors" />
        <input 
          type="text" 
          placeholder="Filter personnel by name, email, or role..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-20 pr-10 py-7 bg-card/50 backdrop-blur-md border-2 border-border/50 rounded-[32px] text-lg font-black outline-none focus:border-accent focus:bg-card transition-all shadow-xl relative z-10 placeholder:text-muted-foreground/30"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {isLoading ? (
          [1,2,3,4].map(n => <div key={n} className="h-72 bg-card/50 animate-pulse rounded-[48px] border border-border" />)
        ) : (
          filtered.map(u => (
            <motion.div 
              key={u.id}
              whileHover={{ y: -8, scale: 1.02 }}
              className="p-8 bg-card border-2 border-border/50 rounded-[48px] hover:border-accent hover:shadow-2xl hover:shadow-accent/10 transition-all group relative overflow-hidden flex flex-col justify-between h-72"
            >
              <div className="absolute -right-6 -bottom-6 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Users className="w-32 h-32" />
              </div>
              
              <div className="flex items-start justify-between relative z-10">
                <div className={cn(
                  "w-16 h-16 rounded-[24px] flex items-center justify-center font-black text-white text-2xl border-2 border-white/10 shadow-2xl transition-transform group-hover:rotate-3",
                  u.role === 'ADMIN' ? "bg-rose-500" : 
                  u.role === 'SUPERINTENDENT' ? "bg-amber-500" : 
                  u.role === 'STAFF' ? "bg-blue-500" :
                  "bg-emerald-500"
                )}>
                  {u.name?.charAt(0)}
                </div>
                <div className="flex flex-col gap-2 relative z-20">
                  <button 
                    onClick={(e) => { e.stopPropagation(); openEdit(u); }} 
                    className="p-3 bg-secondary/80 hover:bg-accent text-foreground hover:text-white rounded-xl transition-all shadow-lg border border-border/50 hover:border-accent group/btn"
                    title="Edit User"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(u.id); }} 
                    className="p-3 bg-secondary/80 hover:bg-rose-500 text-foreground hover:text-white rounded-xl transition-all shadow-lg border border-border/50 hover:border-rose-500 group/btn"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div>
                  <h3 className="text-xl font-black text-foreground tracking-tighter truncate uppercase italic leading-none">{u.name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <Mail className="w-3.5 h-3.5 text-accent" />
                    <span className="text-[11px] font-black lowercase tracking-tight truncate opacity-70">{u.email}</span>
                  </div>
                </div>
                <div className={cn(
                  "inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border-2",
                  u.role === 'ADMIN' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : 
                  u.role === 'SUPERINTENDENT' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                  u.role === 'STAFF' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                )}>
                  {u.role}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-[48px] p-12 w-full max-w-2xl shadow-2xl relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 p-4 hover:bg-secondary rounded-[24px] transition-all group">
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              </button>

              <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-10 text-foreground">
                {editingUser ? 'Update' : 'Add'} User
              </h2>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Full Personnel Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Capt. James Smith" className="w-full px-8 py-5 bg-secondary/50 border-2 border-transparent focus:border-accent rounded-[24px] outline-none font-black text-sm transition-all" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Email Address</label>
                    <div className="relative group">
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@company.com" className="w-full pl-14 pr-8 py-5 bg-secondary/50 border-2 border-transparent focus:border-accent rounded-[24px] outline-none font-black text-sm transition-all" />
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Role Access</label>
                    <div className="relative">
                      <select 
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full px-6 py-5 bg-secondary border-2 border-transparent focus:border-accent rounded-[24px] outline-none font-black text-xs appearance-none cursor-pointer hover:bg-secondary/80 transition-all uppercase tracking-widest"
                      >
                        <option value="USER">USER ACCESS</option>
                        <option value="STAFF">STAFF ACCESS</option>
                        <option value="SUPERINTENDENT">SUPERINTENDENT</option>
                        <option value="ADMIN">ADMINISTRATOR</option>
                      </select>
                      <ShieldCheck className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-accent pointer-events-none" />
                    </div>
                  </div>
                </div>

                {!editingUser && (
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Secure Credential</label>
                    <div className="relative group">
                      <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••••••" className="w-full pl-14 pr-8 py-5 bg-secondary/50 border-2 border-transparent focus:border-accent rounded-[24px] outline-none font-black text-sm transition-all" />
                      <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    </div>
                  </div>
                )}

                <button type="submit" disabled={isLoading} className="w-full py-6 bg-accent text-white rounded-[24px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-accent/40 hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/20 mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? 'Processing Roster...' : 'Commit User to Roster'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
