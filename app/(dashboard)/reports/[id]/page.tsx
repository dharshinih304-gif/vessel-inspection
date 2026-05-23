'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FileText, 
  ChevronLeft, 
  Calendar, 
  User, 
  Ship, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Eye, 
  Clock, 
  Info,
  FileSpreadsheet,
  Award,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { exportToExcel, exportToPDF, exportOverallToPDF, exportOverallToExcel } from '@/services/export';
import InspectionTable from '@/components/InspectionTable';
import { useAuth } from '@/hooks/use-auth';

const CATEGORIES = [
  'ballast_tanks', 'bulk', 'cargo_lifting_gear', 'cargo_tanks', 'certificate',
  'communication', 'constructive_fire_protection', 'container_specifies',
  'crew_accommodation', 'crew_evaluation', 'crew_health', 'crew_safety',
  'deck', 'deck_machinary', 'document_control', 'electrical_items',
  'engine_room', 'fire_fighting_equipment', 'firefighting_fixed_system',
  'hatch_coamings', 'hatch_covers', 'holds', 'hull_inboard', 'hull_outboard',
  'hull_structure', 'life_saving_apparatus', 'machinery_arrangements',
  'maintenance_equipment', 'materials', 'mooring_arrangements',
  'navigational_equipment', 'oil_pollution_equipment', 'pctc_specifics',
  'pilot_boarding_arrangements', 'pollution_prevention', 'pollution_prevention_for_tankers',
  'protection_against_flooding', 'publication_documents', 'pumps_performance',
  'radio_equipments', 'radio_navigation', 'reporting_systems',
  'safety_equipment', 'safety_of_navigation', 'sea_trial_if_available', 'ships_pyrotechnics',
  'supply_connections', 'tankage', 'tanker_equipment', 'tanker_specifics', 'towing'
];

export default function ReportDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [submittedCategories, setSubmittedCategories] = useState<string[]>([]);
  const [categoryRecords, setCategoryRecords] = useState<Record<string, any[]>>({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { hasRole } = useAuth();

  useEffect(() => {
    fetchReport();
  }, [params.id]);

  useEffect(() => {
    if (report) {
      if (report.category_name === 'OVERALL') {
        fetchOverallReportRecords(report.id);
      } else if (report.category_name) {
        fetchReportRecords(report.category_name, report.id);
      }
    }
  }, [report]);

  const fetchOverallReportRecords = async (reportId: string) => {
    try {
      setIsLoadingRecords(true);
      const activeCats: string[] = [];
      const recordsMap: Record<string, any[]> = {};
      
      await Promise.all(CATEGORIES.map(async (cat) => {
        try {
          const sortCol = (cat === 'machinery_arrangements' || cat === 'pollution_prevention_for_tankers') ? 'item_no' : 's_no';
          const { data, error } = await supabase
            .from(cat)
            .select('*')
            .eq('report_id', reportId)
            .order(sortCol, { ascending: true });
            
          if (!error && data && data.length > 0) {
            const hasEdited = data.some((r: any) => r.ans && r.ans.trim() !== '' && r.ans !== 'EMPTY');
            if (hasEdited) {
              activeCats.push(cat);
              recordsMap[cat] = data;
            }
          }
        } catch (e) {
          console.error(`Error querying category ${cat}:`, e);
        }
      }));
      
      activeCats.sort((a, b) => CATEGORIES.indexOf(a) - CATEGORIES.indexOf(b));
      
      setSubmittedCategories(activeCats);
      setCategoryRecords(recordsMap);
    } catch (error) {
      console.error('Failed to fetch overall report records:', error);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      if (report.category_name === 'OVERALL') {
        const allData: any[] = [];
        for (const cat of submittedCategories) {
          const recs = categoryRecords[cat] || [];
          allData.push(...recs.map(item => ({ ...item, categoryName: formatCategoryName(cat) })));
        }
        await exportOverallToPDF(allData, `${report.title || 'Overall Audit'}`, `Report_${report.id.slice(0, 8)}`, report.company_name);
      } else {
        await exportToPDF(records, `${report.title || 'Inspection Report'} - ${formatCategoryName(report.category_name)}`, `Report_${report.id.slice(0, 8)}`, report.company_name);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      if (report.category_name === 'OVERALL') {
        const allData: any[] = [];
        for (const cat of submittedCategories) {
          const recs = categoryRecords[cat] || [];
          allData.push(...recs.map(item => ({ ...item, categoryName: formatCategoryName(cat) })));
        }
        await exportOverallToExcel(allData, `Report_${report.id.slice(0, 8)}`);
      } else {
        await exportToExcel(records, `Report_${report.id.slice(0, 8)}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      
      // 1. Fetch the report
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (reportError) throw reportError;
      
      let fullReport = { ...reportData };
      
      // 2. Fetch the vessel separately (no FK constraint in DB so join fails)
      if (reportData.vessel_id) {
        const { data: vesselData } = await supabase
          .from('vessels')
          .select('*')
          .eq('id', reportData.vessel_id)
          .single();
          
        if (vesselData) {
          fullReport.vessel = vesselData;
        }
      }

      // 3. Fetch company name
      const companyId = reportData.company_id || fullReport.vessel?.company_id;
      if (companyId) {
        const { data: companyData } = await supabase
          .from('companies')
          .select('company_name')
          .eq('id', companyId)
          .single();
        if (companyData) {
          fullReport.company_name = companyData.company_name;
        }
      }

      // 4. Fetch inspector name if created_by is a UUID
      if (reportData.created_by) {
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('name')
            .eq('id', reportData.created_by)
            .single();
          if (userData) {
            fullReport.inspector_name = userData.name;
          }
        } catch (e) {
          console.error('Failed to fetch inspector name:', e);
        }
      }
      
      setReport(fullReport);
    } catch (error) {
      console.error('Failed to fetch report:', error);
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReportRecords = async (categoryName: string, reportId: string) => {
    try {
      setIsLoadingRecords(true);
      const { data, error } = await supabase
        .from(categoryName)
        .select('*')
        .eq('report_id', reportId)
        .order('s_no', { ascending: true });
      
      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error(`Failed to fetch records for category ${categoryName}:`, error);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const formatCategoryName = (name: string) => {
    if (!name) return 'GENERAL';
    return name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const handleFinalize = async () => {
    if (!confirm('Are you sure you want to finalize this report? This action cannot be undone.')) return;
    
    try {
      setIsFinalizing(true);
      const { error } = await supabase
        .from('reports')
        .update({ status: 'FINALIZED' })
        .eq('id', report.id);
        
      if (error) throw error;
      
      alert('Report finalized successfully!');
      setReport({ ...report, status: 'FINALIZED' });
    } catch (error: any) {
      console.error('Failed to finalize report:', error);
      alert(`Error finalizing report: ${error.message}`);
    } finally {
      setIsFinalizing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-muted-foreground">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-xs uppercase tracking-widest">Retrieving Compliance Audit...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-card border border-border rounded-3xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold uppercase tracking-tight">Audit Report Not Found</h2>
        <p className="text-muted-foreground text-sm font-medium">The requested report does not exist or you do not have permission to view it.</p>
        <button 
          onClick={() => router.push('/reports')}
          className="px-6 py-3 bg-secondary rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-secondary/80 transition-all"
        >
          Back to Reports
        </button>
      </div>
    );
  }


  const hasData = report?.category_name === 'OVERALL' ? submittedCategories.length > 0 : records.length > 0;

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-accent font-black text-xs uppercase tracking-widest transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Reports
        </button>

        <div className="flex items-center gap-3">
          {report.status !== 'FINALIZED' && hasRole(['ADMIN', 'SUPERINTENDENT', 'SUPERADMIN']) && (
            <button 
              onClick={handleFinalize}
              disabled={isFinalizing}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isFinalizing ? 'Finalizing...' : 'Finalize Report'}
            </button>
          )}
          
          {hasData && (
            <>
              <button 
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                {isExporting ? 'Exporting...' : 'Export PDF'}
              </button>
              <button 
                onClick={handleExportExcel}
                disabled={isExporting}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                {isExporting ? 'Exporting...' : 'Export Excel'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* STUNNING MAIN CARD INFO */}
      <div className="bg-card border border-border rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-accent/15 text-accent border border-accent/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                {formatCategoryName(report.category_name)}
              </span>
              <span className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                report.status === 'FINALIZED' || report.status === 'APPROVED'
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-500 border-amber-500/20"
              )}>
                {report.status}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground">{report.title || 'Technical Compliance Audit'}</h1>
            <p className="text-muted-foreground text-xs font-mono select-all">Report UUID: {report.id}</p>
          </div>

          <div className="bg-secondary/40 border border-border/60 rounded-[32px] p-6 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Audit Entity Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                  <Ship className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Vessel Name</p>
                  <p className="font-bold text-sm text-foreground uppercase">{report.vessel?.vessel_name || report.vessel?.vesselname || report.vesselName || 'Unnamed Vessel'}</p>
                  {report.vessel?.imo_number && (
                    <p className="text-[10px] font-medium text-muted-foreground">IMO: {report.vessel.imo_number}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Audit Date</p>
                  <p className="font-bold text-sm text-foreground">
                    {new Date(report.created_at || report.inspection_date || report.inspectionDate || report.date).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Inspector Reference</p>
                  <p className="font-bold text-sm text-foreground truncate max-w-[200px]">{report.inspector_name || report.created_by || 'Technical Inspector'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* COMPLIANCE RECORD SECTION */}
      <div className="mt-8 space-y-6">
        {report.category_name === 'OVERALL' ? (
          <div className="space-y-4">
            <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Submitted Categories</h2>
            {submittedCategories.length === 0 ? (
              <div className="bg-card border border-border p-8 rounded-3xl text-center text-muted-foreground text-sm font-medium">
                No submitted categories found for this overall report.
              </div>
            ) : (
              submittedCategories.map((cat) => {
                const isExpanded = expandedCategory === cat;
                const recs = categoryRecords[cat] || [];
                const filled = recs.filter(r => r.ans && r.ans.trim() !== '' && r.ans !== 'EMPTY').length;
                const total = recs.length;
                
                return (
                  <div key={cat} className="bg-card border border-border rounded-3xl overflow-hidden shadow-md">
                    <div 
                      onClick={() => setExpandedCategory(isExpanded ? null : cat)}
                      className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-secondary/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                        <span className="font-black text-sm uppercase tracking-tight text-foreground">{formatCategoryName(cat)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full">
                          {filled}/{total} Completed
                        </span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="p-6 border-t border-border bg-secondary/10">
                        <InspectionTable 
                          tableName={cat} 
                          vesselId={report.vessel_id} 
                          vesselName={report.vessel?.vessel_name || report.vessel?.vesselname || report.vesselName} 
                          reportId={report.id}
                          refreshKey={`${report.id}-${cat}`}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
            
            {/* PENDING CATEGORIES SECTION */}
            {CATEGORIES.filter(c => !submittedCategories.includes(c)).length > 0 && (
              <div className="pt-6 space-y-4">
                <h2 className="text-xl font-black uppercase tracking-tight text-muted-foreground opacity-60">Pending Categories</h2>
                {CATEGORIES.filter(c => !submittedCategories.includes(c)).map(cat => (
                  <div key={cat} className="bg-secondary/10 border border-border/40 rounded-3xl overflow-hidden shadow-sm opacity-60">
                    <div className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm uppercase tracking-tight text-muted-foreground">{formatCategoryName(cat)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase px-3 py-1 bg-secondary/50 text-muted-foreground rounded-full">
                          Not Submitted
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <InspectionTable 
            tableName={report.category_name} 
            vesselId={report.vessel_id} 
            vesselName={report.vessel?.vessel_name || report.vessel?.vesselname || report.vesselName} 
            reportId={report.id}
            refreshKey={report.id}
          />
        )}
      </div>
    </div>
  );
}
