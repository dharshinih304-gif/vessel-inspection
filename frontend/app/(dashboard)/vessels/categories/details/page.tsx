'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';
import InspectionTable from '@/components/InspectionTable';

export default function CategoryDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const vesselId = searchParams.get('vesselId');
  const vesselName = searchParams.get('vesselName');
  const category = searchParams.get('category');

  if (!category || !vesselId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-muted-foreground font-black uppercase tracking-widest">Incomplete parameters</p>
        <button 
          onClick={() => router.back()}
          className="px-8 py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest"
        >
          Go Back
        </button>
      </div>
    );
  }

  const formatName = (name: string) => {
    return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="p-4 hover:bg-secondary rounded-2xl transition-all shadow-lg border border-border"
            title="Go Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase text-accent">
              {formatName(category)}
            </h1>
            <p className="text-muted-foreground font-bold flex items-center gap-2">
              <span className="text-foreground">{vesselName}</span>
              <span className="opacity-20">/</span>
              <span>Full Technical Registry</span>
            </p>
          </div>
        </div>

        <button 
          onClick={() => router.push('/vessels')}
          className="flex items-center gap-2 px-6 py-4 bg-secondary text-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-accent hover:text-white transition-all border border-border"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </button>
      </div>

      {/* FULL SCREEN TABLE CONTAINER */}
      <div className="flex-1 bg-card border border-border rounded-[40px] overflow-hidden shadow-2xl flex flex-col">
        <div className="px-10 py-6 border-b border-border bg-secondary/30 flex items-center justify-between">
            <span className="text-[0.625rem] font-black text-muted-foreground uppercase tracking-[0.3em]">
                Detailed Registry View • Technical Compliance Framework • Enterprise Core
            </span>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Sync Active</span>
            </div>
        </div>
        
        <div className="flex-1 overflow-hidden p-8">
            <InspectionTable 
                tableName={category} 
                vesselId={vesselId} 
                vesselName={vesselName || 'Vessel'} 
                reportId={null}
                refreshKey={0}
            />
        </div>
      </div>
    </div>
  );
}
