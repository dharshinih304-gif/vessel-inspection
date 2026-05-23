'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { vesselsApi } from '@/services/api';
import { useAuth } from '@/hooks/use-auth';
import { 
  Plus, Search, Ship, Pencil, Trash2, X, ShieldCheck, ArrowUpRight, Eye 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function VesselManagementPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [vessels, setVessels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVessel, setEditingVessel] = useState<any>(null);
  const [formData, setFormData] = useState({ vessel_name: '', vessel_type: '', imo_number: '' });

  useEffect(() => {
    fetchVessels();
  }, []);

  const fetchVessels = async () => {
    setIsLoading(true);
    try {
      const data = await vesselsApi.getAll();
      setVessels(data || []);
    } catch (error) {
      console.error('Failed to fetch vessels');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, company_id: user?.company_id };
      if (editingVessel) {
        await vesselsApi.update(editingVessel.id, payload);
      } else {
        await vesselsApi.create(payload);
      }
      setIsModalOpen(false);
      setEditingVessel(null);
      fetchVessels();
    } catch (error) {
      alert('Error saving vessel');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to decommission this asset?')) return;
    try {
      await vesselsApi.delete(id); // Fixed: Use vesselsApi instead of usersApi
      fetchVessels();
    } catch (error) {
      alert('Decommission Failed: Possible active reports attached.');
    }
  };

  const openEdit = (v: any) => {
    setEditingVessel(v);
    setFormData({ 
      vessel_name: v.vessel_name, 
      vessel_type: v.vessel_type, 
      imo_number: v.imo_number 
    });
    setIsModalOpen(true);
  };

  const filtered = vessels.filter(v => 
    v.vessel_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.imo_number?.includes(searchTerm)
  );

  return (
    <div className="max-w-[1600px] mx-auto py-10 space-y-8 pb-32">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-card border border-border p-10 rounded-[48px] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Ship className="w-32 h-32" />
        </div>
        
        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-3 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full w-fit">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-black text-accent uppercase tracking-widest">Global Asset Registry</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase italic leading-tight">Vessel Management</h1>
          <p className="text-muted-foreground font-bold max-w-md">Manage and view all your vessels</p>
        </div>

        <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
           <div className="relative flex-1 md:w-80 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Search fleet..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-secondary border border-transparent focus:border-accent rounded-[24px] text-xs font-black uppercase tracking-widest outline-none transition-all shadow-inner"
              />
           </div>
           <button 
            onClick={() => { setEditingVessel(null); setFormData({ vessel_name: '', vessel_type: '', imo_number: '' }); setIsModalOpen(true); }}
            className="flex items-center gap-3 px-10 py-5 bg-accent text-white rounded-[24px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-accent/40 border border-white/20 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> Add Vessel
          </button>
        </div>
      </div>

      {/* REGISTRY TABLE */}
      <div className="bg-card border border-border rounded-[48px] shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="px-8 py-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">S.No</th>
                <th className="px-8 py-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">IMO Number</th>
                <th className="px-8 py-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Vessel Name</th>
                <th className="px-8 py-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Vessel Type</th>
                <th className="px-8 py-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                [1,2,3,4,5].map(n => (
                  <tr key={n} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-8"><div className="h-8 bg-secondary rounded-xl w-full" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground font-black uppercase italic opacity-30">No assets found in registry</td>
                </tr>
              ) : (
                filtered.map((v, i) => (
                  <tr key={v.id} className="group hover:bg-secondary/20 transition-all">
                    <td className="px-8 py-6 text-sm font-black text-muted-foreground/50">{(i + 1).toString().padStart(2, '0')}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/5 flex items-center justify-center border border-accent/10">
                          <ShieldCheck className="w-4 h-4 text-accent" />
                        </div>
                        <span className="text-sm font-black text-foreground tracking-tight">{v.imo_number}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-foreground uppercase italic tracking-tight">{v.vessel_name}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 bg-secondary text-[10px] font-black uppercase tracking-widest text-muted-foreground rounded-full border border-border">
                        {v.vessel_type}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => router.push(`/vessels?vesselId=${v.id}`)}
                          className="p-3 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all group/btn border border-blue-500/20"
                          title="View Categories (Eye)"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEdit(v)}
                          className="p-3 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-xl transition-all group/btn border border-amber-500/20"
                          title="Edit Vessel"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => router.push(`/vessels?vesselId=${v.id}`)}
                          className="p-3 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all group/btn border border-emerald-500/20"
                          title="Add Report/Categories"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(v.id)}
                          className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all group/btn border border-rose-500/20"
                          title="Delete Vessel"
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
      </div>

      {/* ADD/EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-3xl p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-card border border-border rounded-[48px] p-12 w-full max-w-2xl shadow-2xl relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-4 hover:bg-secondary rounded-2xl transition-all">
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-10">
                <div className="space-y-4">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter text-foreground">
                    {editingVessel ? 'Update' : 'Commission'} Asset
                  </h2>
                  <p className="text-muted-foreground font-bold">Register technical specifications for the maritime digital twin.</p>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Vessel Identity</label>
                    <input type="text" required value={formData.vessel_name} onChange={(e) => setFormData({...formData, vessel_name: e.target.value})} placeholder="MV OCEAN COMMANDER" className="w-full px-8 py-5 bg-secondary border border-transparent focus:border-accent rounded-[24px] outline-none font-black text-sm uppercase italic" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">Classification</label>
                      <input type="text" required value={formData.vessel_type} onChange={(e) => setFormData({...formData, vessel_type: e.target.value})} placeholder="OIL TANKER" className="w-full px-8 py-5 bg-secondary border border-transparent focus:border-accent rounded-[24px] outline-none font-black text-sm uppercase" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">IMO Number</label>
                      <input type="text" required value={formData.imo_number} onChange={(e) => setFormData({...formData, imo_number: e.target.value})} placeholder="9123456" className="w-full px-8 py-5 bg-secondary border border-transparent focus:border-accent rounded-[24px] outline-none font-black text-sm" />
                    </div>
                  </div>

                  <button type="submit" className="w-full py-6 bg-accent text-white rounded-[24px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-accent/40 hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/20">
                    Commit to Registry
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
