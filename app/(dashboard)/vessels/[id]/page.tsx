'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Ship, Anchor, Globe, ChevronLeft, Calendar, ClipboardList, ShieldCheck, Activity, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getTableData } from '@/services/api';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function VesselDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [vessel, setVessel] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchVesselData();
    }
  }, [params.id]);

  const fetchVesselData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch Vessel
      const { data: vesselData, error: vError } = await supabase
        .from('vessels')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (vError) throw vError;
      setVessel(vesselData);

      // Fetch Recent Reports for this vessel
      const { data: reportData, error: rError } = await supabase
        .from('reports')
        .select('*')
        .eq('vessel_id', params.id)
        .order('created_at', { ascending: false });
      
      if (!rError) {
        const validReports = (reportData || []).filter((r: any) => r.category_name && r.category_name !== '');
        
        // Resolve completion status dynamically
        const reportsWithStatus = await Promise.all(validReports.map(async (report: any) => {
           let percent = 0;
           let hasNotSeen = false;
           try {
              if (report.category_name) {
                  const catData = await getTableData(report.category_name, { report_id: report.id });
                  
                  if (catData && catData.length > 0) {
                      const total = catData.length;
                      const answered = catData.filter((d: any) => 
                          d.ans && 
                          d.ans !== 'EMPTY' && 
                          d.ans !== '' &&
                          d.ans.toUpperCase() !== 'NOT SEEN' &&
                          d.comments &&
                          d.comments.trim() !== ''
                      ).length;
                      percent = Math.round((answered / total) * 100);
                      hasNotSeen = catData.some((d: any) => d.ans && d.ans.toUpperCase() === 'NOT SEEN');
                  }
              }
           } catch (e) {
              console.error('Error calculating percentage for report', report.id, e);
           }
           const dynamicStatus = (percent === 100 && !hasNotSeen) ? 'Completed' : 'Pending';
           return { ...report, dynamicStatus };
        }));
        
        setReports(reportsWithStatus.slice(0, 10));
      }

    } catch (error) {
      console.error('Failed to fetch vessel data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return (
    <div className="p-20 text-center space-y-4">
      <Ship className="w-12 h-12 animate-pulse text-accent mx-auto" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Synchronizing with Registry...</p>
    </div>
  );

  if (!vessel) return (
    <div className="p-20 text-center space-y-6 bg-card border border-border rounded-[48px]">
      <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto text-rose-500">
        <Ship className="w-10 h-10" />
      </div>
      <div>
        <h2 className="text-2xl font-black uppercase italic">Vessel Not Found</h2>
        <p className="text-muted-foreground font-bold mt-2">The requested asset could not be located in the technical registry.</p>
      </div>
      <button onClick={() => router.push('/vessels')} className="px-8 py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest text-xs">Return to Fleet</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <button 
        onClick={() => router.push('/vessels')}
        className="group flex items-center gap-3 text-slate-500 hover:text-accent transition-all font-black uppercase tracking-widest text-[10px]"
      >
        <div className="p-2 bg-secondary rounded-xl group-hover:bg-accent group-hover:text-white transition-all">
          <ChevronLeft className="w-4 h-4" />
        </div>
        Back to Fleet Command
      </button>

      {/* Profile Header */}
      <div className="bg-card border border-border rounded-[48px] overflow-hidden shadow-2xl relative">
        <div className="h-48 bg-gradient-to-r from-accent/20 to-transparent relative">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>
        
        <div className="px-12 pb-12 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8">
            <div className="flex items-end gap-8">
              <div className="w-32 h-32 bg-card border-[8px] border-background rounded-[40px] flex items-center justify-center shadow-2xl">
                <Ship className="w-14 h-14 text-accent" />
              </div>
              <div className="pb-4">
                <h1 className="text-5xl font-black tracking-tighter uppercase italic text-foreground">{vessel.vessel_name}</h1>
                <div className="flex items-center gap-6 mt-3">
                  <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                    <Anchor className="w-4 h-4" /> IMO: {vessel.imo_number}
                  </span>
                  <span className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase">
                    <ShieldCheck className="w-4 h-4" /> Active Registry
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => router.push(`/reports/new?vesselId=${vessel.id}`)}
              className="px-8 py-5 bg-accent text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-accent/20 hover:scale-105 transition-all mb-4"
            >
              Initiate New Audit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-t border-border">
           {[
             { label: 'Classification', value: vessel.vessel_type, icon: Activity },
             { label: 'Total Audits', value: reports.length, icon: ClipboardList },
             { label: 'Last Position', value: 'N/A (Sat-Link Offline)', icon: MapPin }
           ].map((stat, i) => (
             <div key={i} className="p-10 flex items-center gap-6 bg-secondary/20">
                <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-accent">
                   <stat.icon className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                   <p className="text-lg font-black text-foreground">{stat.value}</p>
                </div>
             </div>
           ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Technical Timeline */}
        <div className="space-y-6">
          <h2 className="text-xl font-black uppercase italic tracking-tight">Audit Timeline</h2>
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="p-12 text-center bg-secondary/30 rounded-[32px] border border-dashed border-border opacity-50">
                <p className="text-xs font-bold uppercase tracking-widest">No audit history found for this asset.</p>
              </div>
            ) : (
              reports.map((report, i) => (
                <div key={report.id} className="p-6 bg-card border border-border rounded-3xl flex items-center justify-between group hover:border-accent transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase">{report.category_name ? report.category_name.replace(/_/g, ' ').toUpperCase() : 'Technical Audit'}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(report.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                    report.dynamicStatus === 'Completed' 
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  )}>
                    {report.dynamicStatus}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Technical Specs Card */}
        <div className="bg-card border border-border rounded-[48px] p-12 space-y-8 h-fit">
           <h2 className="text-xl font-black uppercase italic tracking-tight">Registry Specifications</h2>
           <div className="grid grid-cols-2 gap-8">
              {[
                { label: 'Technical Name', value: vessel.vessel_name },
                { label: 'IMO Ref', value: vessel.imo_number },
                { label: 'Vessel Type', value: vessel.vessel_type },
                { label: 'Creation Date', value: new Date(vessel.created_at).toLocaleDateString() }
              ].map((spec, i) => (
                <div key={i} className="space-y-1">
                   <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{spec.label}</p>
                   <p className="font-bold text-foreground">{spec.value}</p>
                </div>
              ))}
           </div>
           <div className="pt-8 border-t border-border">
              <button className="w-full py-5 bg-secondary hover:bg-secondary/80 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
                Export Technical Datasheet
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
