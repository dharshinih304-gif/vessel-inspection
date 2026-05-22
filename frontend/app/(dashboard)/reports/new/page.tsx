'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { vesselsApi, categoriesApi, reportsApi } from '@/services/api';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { 
  Ship, 
  ClipboardCheck, 
  ChevronRight, 
  Camera, 
  MessageSquare, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  Pencil,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function NewReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [vessels, setVessels] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  
  const [selectedVessel, setSelectedVessel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [checklistData, setChecklistData] = useState<any>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image & Camera State
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedRowForImage, setSelectedRowForImage] = useState<string | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const vId = searchParams.get('vesselId');
    const cId = searchParams.get('categoryId');
    if (vId && cId) {
      setSelectedVessel(vId);
      setSelectedCategory(cId);
      startInspection(vId, cId);
    }
  }, [searchParams, categories]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [vData, cData] = await Promise.all([
        vesselsApi.getAll(),
        categoriesApi.getAll()
      ]);
      setVessels(vData || []);
      setCategories(cData || []);
    } catch (error) {
      console.error('Failed to load initial data');
    } finally {
      setIsLoading(false);
    }
  };

  const startInspection = async (vId?: string, cId?: string) => {
    const targetVessel = vId || selectedVessel;
    const targetCategory = cId || selectedCategory;

    if (!targetVessel || !targetCategory) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('report_items')
        .select('*')
        .eq('category_id', targetCategory)
        .order('s_no');
        
      if (error) throw error;
      setItems(data || []);
      
      const initial: any = {};
      data?.forEach((item: any) => {
        initial[item.id] = { ans: '', comments: '', image: '' };
      });
      setChecklistData(initial);
      setStep(2);
    } catch (error) {
      console.error('Inspection loading error:', error);
      alert('Failed to load checklist items');
    } finally {
      setIsLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please ensure you have given permission.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        setTempImageUrl(imageData);
        stopCamera();
      }
    }
  };

  const updateItem = (id: string, field: string, value: string) => {
    setChecklistData((prev: any) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const submitReport = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        vessel_id: selectedVessel,
        company_id: user?.company_id,
        created_by: user?.id,
        report_data: {
          category_id: selectedCategory,
          items: checklistData,
          category_name: categories.find(c => c.id === selectedCategory)?.category_name,
          timestamp: new Date().toISOString()
        },
        status: 'PENDING'
      };
      await reportsApi.create(payload);
      router.push('/reports');
    } catch (error) {
      alert('Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Auto-resize textareas on load
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(ta => {
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
    });
  }, [items, step]);

  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-12">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-accent/10 rounded-[32px] flex items-center justify-center text-accent mx-auto">
            <ClipboardCheck className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Initialize Audit</h1>
          <p className="text-muted-foreground font-bold max-w-md mx-auto">Select the vessel and module category to begin the technical inspection.</p>
        </div>

        <div className="bg-card border border-border rounded-[48px] p-12 shadow-2xl space-y-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Deployment Vessel</label>
              <div className="relative group">
                <select 
                  value={selectedVessel}
                  onChange={(e) => setSelectedVessel(e.target.value)}
                  className="w-full pl-14 pr-8 py-5 bg-secondary border border-transparent focus:border-accent rounded-3xl outline-none font-bold appearance-none transition-all"
                >
                  <option value="">Select Target Vessel</option>
                  {vessels.map(v => <option key={v.id} value={v.id}>{v.vessel_name} (IMO: {v.imo_number})</option>)}
                </select>
                <Ship className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Inspection Module</label>
              <div className="relative group">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-14 pr-8 py-5 bg-secondary border border-transparent focus:border-accent rounded-3xl outline-none font-bold appearance-none transition-all"
                >
                  <option value="">Select Audit Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.category_name}</option>)}
                </select>
                <ClipboardCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
              </div>
            </div>
          </div>

          <button 
            disabled={!selectedVessel || !selectedCategory || isLoading}
            onClick={() => startInspection()}
            className="w-full py-6 bg-accent text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isLoading ? 'Processing...' : <>Enter Inspection Chamber <ChevronRight className="w-5 h-5" /></>}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1700px] mx-auto py-10 space-y-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-card border border-border p-10 rounded-[48px] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <ClipboardCheck className="w-32 h-32" />
        </div>
        
        <div className="space-y-3 relative z-10">
          <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] font-black uppercase text-accent hover:underline mb-2 tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Switch Module
          </button>
          <div className="flex items-center gap-3 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full w-fit">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-black text-accent uppercase tracking-widest">Active Technical Audit</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase italic leading-tight">
            {categories.find(c => c.id === selectedCategory)?.category_name}
          </h1>
          <p className="text-muted-foreground font-bold">Vessel: <span className="text-foreground uppercase">{vessels.find(v => v.id === selectedVessel)?.vessel_name}</span></p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
           <button 
            onClick={submitReport}
            disabled={isSubmitting}
            className="flex items-center gap-3 px-10 py-5 bg-emerald-500 text-white rounded-[24px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-emerald-500/40 border border-white/20"
          >
            <Save className="w-5 h-5" /> {isSubmitting ? 'Finalizing...' : 'Submit Report'}
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[48px] shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-16 text-center">ID</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20">S/NO</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-[350px]">RULE_REF</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">REQUIREMENTS</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-32 text-center">ANS</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-48">COMMENTS</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-20 text-center">IMAGE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-muted-foreground font-black uppercase italic opacity-30">No technical requirements loaded for this module</td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className="group hover:bg-secondary/20 transition-all">
                    <td className="px-6 py-8 text-center font-bold text-xs text-muted-foreground italic">{(index + 1)}</td>
                    <td className="px-6 py-8 font-bold text-xs text-foreground uppercase tracking-tighter">
                      {item.s_no || '-'}
                    </td>
                    <td className="px-6 py-8">
                      <span className="text-[10px] font-black text-accent uppercase tracking-widest">
                        {item.rule_ref || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-8">
                      <div className="relative group/edit">
                        <textarea
                          value={checklistData[item.id]?.requirements !== undefined ? checklistData[item.id].requirements : (item.requirements || '')}
                          onChange={(e) => {
                            updateItem(item.id, 'requirements', e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                          }}
                          placeholder="Edit Technical Requirement..."
                          className="w-full bg-transparent text-xs font-bold text-foreground uppercase leading-relaxed max-w-xl outline-none border-b border-transparent group-hover/edit:border-accent/30 focus:border-accent transition-all pr-6 resize-none h-auto overflow-hidden"
                        />
                        <Pencil className="absolute right-0 top-2 w-2.5 h-2.5 text-muted-foreground opacity-0 group-hover/edit:opacity-50 transition-opacity pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <select
                        value={checklistData[item.id]?.ans || 'EMPTY'}
                        onChange={(e) => updateItem(item.id, 'ans', e.target.value)}
                        className={cn(
                          "w-full bg-transparent text-xs font-black uppercase outline-none cursor-pointer appearance-none text-center",
                          (checklistData[item.id]?.ans || 'EMPTY') === 'EMPTY' ? 'text-muted-foreground' : 'text-accent font-black'
                        )}
                      >
                        <option value="EMPTY">EMPTY</option>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                        <option value="N/A">N/A</option>
                      </select>
                    </td>
                    <td className="px-6 py-8">
                      <div className="relative group/input">
                        <input 
                          type="text" 
                          placeholder="EMPTY"
                          value={checklistData[item.id]?.comments || ''}
                          onChange={(e) => updateItem(item.id, 'comments', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent focus:border-accent/30 outline-none text-xs font-bold transition-all placeholder:opacity-30"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-8 text-center">
                      <button 
                        onClick={() => {
                          setSelectedRowForImage(item.id);
                          setTempImageUrl(checklistData[item.id]?.image || '');
                          setIsImageModalOpen(true);
                        }}
                        className={cn(
                          "p-3 rounded-xl transition-all",
                          checklistData[item.id]?.image ? "text-emerald-500 bg-emerald-500/10" : "text-muted-foreground hover:bg-secondary"
                        )}
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isImageModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-[48px] p-10 w-full max-w-2xl shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground flex items-center gap-3 italic">
                  <Camera className="w-6 h-6 text-accent" />
                  Live Evidence Capture
                </h2>
                <button 
                  onClick={() => {
                    stopCamera();
                    setIsImageModalOpen(false);
                  }}
                  className="p-2 hover:bg-secondary rounded-full"
                >
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="aspect-video bg-secondary rounded-[32px] overflow-hidden relative border-2 border-dashed border-border group">
                  {isCameraActive ? (
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                  ) : tempImageUrl ? (
                    <img src={tempImageUrl} className="w-full h-full object-cover" alt="Captured" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-4">
                      <Camera className="w-16 h-16 opacity-20" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Awaiting visual input</p>
                    </div>
                  )}
                  
                  {isCameraActive && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                      <button 
                        onClick={capturePhoto}
                        className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        Capture Now
                      </button>
                      <button 
                        onClick={stopCamera}
                        className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all"
                      >
                        Exit
                      </button>
                    </div>
                  )}
                </div>

                <canvas ref={canvasRef} className="hidden" />

                {!isCameraActive && (
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={startCamera}
                      className="flex flex-col items-center justify-center p-8 bg-secondary hover:bg-accent/10 hover:text-accent rounded-[32px] transition-all border border-transparent hover:border-accent/20 group"
                    >
                      <Camera className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Start Camera</span>
                    </button>
                    <div className="relative">
                      <button 
                        onClick={() => document.getElementById('image-input-hidden-new')?.click()}
                        className="w-full h-full flex flex-col items-center justify-center p-8 bg-secondary hover:bg-blue-500/10 hover:text-blue-500 rounded-[32px] transition-all border border-transparent hover:border-blue-500/20 group"
                      >
                        <ImageIcon className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Upload Frame</span>
                      </button>
                      <input 
                        id="image-input-hidden-new"
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setTempImageUrl(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => {
                      stopCamera();
                      setIsImageModalOpen(false);
                    }}
                    className="flex-1 py-5 bg-secondary text-muted-foreground rounded-2xl font-black uppercase tracking-widest hover:bg-secondary/80 transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    disabled={!tempImageUrl}
                    onClick={() => {
                      if (selectedRowForImage) {
                        updateItem(selectedRowForImage, 'image', tempImageUrl);
                      }
                      stopCamera();
                      setIsImageModalOpen(false);
                    }}
                    className="flex-1 py-5 bg-accent text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    Keep Evidence
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
