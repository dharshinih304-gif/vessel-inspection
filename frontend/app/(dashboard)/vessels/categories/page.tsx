'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Plus,
  FileText,
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronRight,
  Pencil,
  CheckCircle2,
  Eye,
  Trash2,
  X,
  Save,
  Check,
  RefreshCw,
  Send,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import InspectionTable from '@/components/InspectionTable';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { insertTableRow, updateTableRow, deleteTableRow, getTableData } from '@/services/api';
import { exportOverallToPDF, exportOverallToExcel } from '@/services/export';

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

function CategoryManagementPage() {
  const router = useRouter();
  const { user, hasRole } = useAuth();
  const searchParams = useSearchParams();
  const vesselId = searchParams.get('vesselId');
  const vesselName = searchParams.get('vesselName') || 'Global Registry';
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [companyName, setCompanyName] = useState<string>('');

  React.useEffect(() => {
    const fetchCompanyName = async () => {
      let companyIdToUse = user?.company_id;
      if (!companyIdToUse && vesselId) {
        try {
          const { data: v } = await supabase
            .from('vessels')
            .select('company_id')
            .eq('id', vesselId)
            .single();
          companyIdToUse = v?.company_id;
        } catch (e) {
          console.error(e);
        }
      }
      
      if (companyIdToUse) {
        try {
          const { data } = await supabase
            .from('companies')
            .select('company_name')
            .eq('id', companyIdToUse)
            .single();
          if (data?.company_name) {
            setCompanyName(data.company_name);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchCompanyName();
  }, [user, vesselId]);

  React.useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setExpanded(category);
      // Optional: scroll to the element
      setTimeout(() => {
        const el = document.getElementById(`cat-${category}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [searchParams]);
  
  // Modal states for "Make all accessible"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete'>('create');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeRow, setActiveRow] = useState<any>(null);
  const [formData, setFormData] = useState({ s_no: '', requirements: '', rule_ref: '', ans: '', comments: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [refreshKeys, setRefreshKeys] = useState<Record<string, number>>({});
  
  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: () => Promise<void>;
    type: 'success' | 'warning' | 'danger' | 'info';
    btnText: string;
  }>({
    open: false,
    title: '',
    message: '',
    action: async () => {},
    type: 'info',
    btnText: 'Proceed'
  });

  const [isConfirming, setIsConfirming] = useState(false);

  const triggerRefresh = (category: string) => {
    setRefreshKeys(prev => ({ ...prev, [category]: (prev[category] || 0) + 1 }));
  };

  React.useEffect(() => {
    if (vesselId) {
      fetchOrCreateReport();
    }
  }, [vesselId]);

  const fetchOrCreateReport = async () => {
    // We no longer pre-create a draft report to avoid empty/general entries.
    // The checklists are edited in their active state where report_id is NULL.
    setReportId(null);
  };

  const formatName = (name: string) => {
    return name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const fetchAllCategoriesData = async () => {
    setIsExporting(true);
    try {
      const allData: any[] = [];
      const results = await Promise.all(CATEGORIES.map(async (cat) => {
        let rawData = [];
        
        // 1. Try to get records for this vessel first via Edge Function
        try {
          if (vesselId && vesselId !== 'null' && vesselId !== '') {
            rawData = await getTableData(cat, { vessel_id: vesselId }) || [];
          }
        } catch (e) {
          console.error(`Error fetching vessel data via API for ${cat}:`, e);
        }

        // 2. If no records for this vessel exist, load templates via Edge Function
        if (!rawData || rawData.length === 0) {
          try {
            rawData = await getTableData(cat) || [];
          } catch (e) {
            console.error(`Error fetching template data via API for ${cat}:`, e);
          }
        }

        // Deduplicate rows by s_no if there are multiple entries (similar to how UI handles it)
        const uniqueRows = [];
        const seenSNo = new Set();
        
        // Sort by created_at DESC to get most recent requirements/updates
        const sortedRows = [...rawData].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });

        for (const row of sortedRows) {
          const sNoVal = row.s_no || row.item_no;
          if (sNoVal && !seenSNo.has(sNoVal)) {
            seenSNo.add(sNoVal);
            uniqueRows.push(row);
          }
        }

        // Sort the checklist by s_no ascending
        uniqueRows.sort((a, b) => {
          const sNoA = a.s_no || a.item_no || '';
          const sNoB = b.s_no || b.item_no || '';
          return sNoA.localeCompare(sNoB, undefined, { numeric: true, sensitivity: 'base' });
        });

        return uniqueRows.map(item => ({
          ...item,
          categoryName: formatName(cat)
        }));
      }));
      
      results.forEach(res => {
        allData.push(...res);
      });
      
      return allData;
    } catch (err) {
      console.error(err);
      alert('Failed to fetch data for export');
      return [];
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    const data = await fetchAllCategoriesData();
    if (data.length === 0) {
      alert('No data found to export');
      return;
    }
    await exportOverallToPDF(data, `${vesselName} - Overall Audit Registry`, `${vesselName.replace(/\s+/g, '_')}_overall_audit`, companyName);
    setShowExportDropdown(false);
  };

  const handleExportExcel = async () => {
    const data = await fetchAllCategoriesData();
    if (data.length === 0) {
      alert('No data found to export');
      return;
    }
    exportOverallToExcel(data, `${vesselName.replace(/\s+/g, '_')}_overall_audit`);
    setShowExportDropdown(false);
  };

  const handleAction = (type: 'create' | 'edit' | 'delete', category: string, row?: any) => {
    setModalType(type);
    setActiveCategory(category);
    setActiveRow(row || null);
    
    if (type === 'edit' && row) {
      setFormData({ 
        s_no: row.s_no || '', 
        requirements: row.requirements || '', 
        rule_ref: row.rule_ref || '',
        ans: row.ans || '',
        comments: row.comments || ''
      });
    } else {
      setFormData({ s_no: '', requirements: '', rule_ref: '', ans: '', comments: '' });
    }
    
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCategory) return;

    try {
      setIsSaving(true);
      if (modalType === 'create') {
        let companyId = user?.company_id;
        if (!companyId && vesselId) {
            const { data: v } = await supabase.from('vessels').select('company_id').eq('id', vesselId).single();
            companyId = v?.company_id;
        }

        await insertTableRow(activeCategory, {
          ...formData,
          vessel_id: vesselId,
          company_id: companyId,
          user_id: user?.id || '36136991-937e-4c1d-aab2-ea4188213a37',
          report_id: reportId
        });
      } else if (modalType === 'edit' && activeRow) {
        await updateTableRow(activeCategory, activeRow.id, formData);
      } else if (modalType === 'delete' && activeRow) {
        await deleteTableRow(activeCategory, activeRow.id);
      }
      
      setIsModalOpen(false);
      triggerRefresh(activeCategory);
      alert(`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} successful!`);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitReport = () => {
    setConfirmModal({
      open: true,
      title: 'Submit Overall Report',
      message: 'Are you sure you want to submit the overall technical compliance report for this vessel? This will generate a consolidated report snapshot.',
      type: 'success',
      btnText: 'Submit Report',
      action: async () => {
        setIsConfirming(true);
        try {
          let companyId = user?.company_id;
          if (!companyId && vesselId) {
              const { data: v } = await supabase.from('vessels').select('company_id').eq('id', vesselId).single();
              companyId = v?.company_id;
          }
          
          let newReportId;
          const { data: existingReports, error: existingErr } = await supabase
            .from('reports')
            .select('id')
            .eq('vessel_id', vesselId)
            .eq('status', 'PENDING')
            .eq('category_name', 'OVERALL')
            .order('created_at', { ascending: false })
            .limit(1);

          if (!existingErr && existingReports && existingReports.length > 0) {
            newReportId = existingReports[0].id;
            console.log('Reusing existing PENDING OVERALL report:', newReportId);
          } else {
            const newReport = {
              vessel_id: vesselId,
              company_id: companyId,
              report_title: `Consolidated Audit - ${vesselName}`,
              category_name: 'OVERALL',
              status: 'PENDING',
              inspection_date: new Date().toISOString().split('T')[0],
              created_by: user?.id || '2b42a774-4c2e-4bc7-a0a4-6b595ed6cee2'
            };
            
            const { data: insertedReport, error: reportErr } = await supabase
              .from('reports')
              .insert(newReport)
              .select()
              .single();
              
            if (reportErr) throw reportErr;
            newReportId = insertedReport.id;
          }
          
          // 2. Clone active checklists (merged with templates) to this new report_id for all 51 categories
          let clonedCategoriesCount = 0;
          
          const batchSize = 10;
          for (let i = 0; i < CATEGORIES.length; i += batchSize) {
            const batch = CATEGORIES.slice(i, i + batchSize);
            await Promise.all(batch.map(async (cat) => {
            try {
              // Fetch all items to build templates
              const { data: allItems, error: templateErr } = await supabase
                .from(cat)
                .select('*');

              if (templateErr) {
                console.error(`Error fetching templates for ${cat}:`, templateErr);
                return;
              }

              // Deduplicate by s_no/item_no to get the unique template questions
              const seen = new Set();
              const templates = [];
              const sorted = [...(allItems || [])].sort((a, b) => {
                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                return dateB - dateA;
              });
              for (const row of sorted) {
                const sNoVal = row.s_no || row.item_no;
                if (sNoVal && !seen.has(sNoVal)) {
                  seen.add(sNoVal);
                  templates.push(row);
                }
              }

              // Fetch active edits for this vessel
              const { data: activeItems } = await supabase
                .from(cat)
                .select('*')
                .eq('vessel_id', vesselId)
                .is('report_id', null);

              const activeMap = new Map();
              if (activeItems) {
                activeItems.forEach(item => {
                  activeMap.set(item.s_no || item.item_no, item);
                });
              }

              // Merge templates and active edits
              const itemsToInsert = (templates || []).map(tmpl => {
                const activeItem = activeMap.get(tmpl.s_no || tmpl.item_no);
                
                // Realistic status weights and random status fallback
                const STATUSES = ['SATISFACTORY', 'GOOD', 'UNSATISFACTORY', 'NOT SEEN'];
                const STATUS_WEIGHTS = [0.75, 0.15, 0.07, 0.03];
                const COMMENTS_MAPPING: Record<string, string[]> = {
                  'SATISFACTORY': ['Condition satisfactory', 'No abnormalities observed', 'Inspection completed successfully', 'In good working order', 'Meets required standards', 'Operating correctly', 'No defects found'],
                  'GOOD': ['Good condition', 'Working properly', 'Well maintained', 'Functions effectively', 'System optimal', 'Equipment intact'],
                  'UNSATISFACTORY': ['Requires attention', 'Maintenance needed', 'Below standard', 'Needs repair', 'Defect noted', 'Action required'],
                  'NOT SEEN': ['Not accessible during inspection', 'Not tested', 'Area locked', 'Equipment not available', 'Pending further check']
                };

                let finalAns = activeItem?.ans || '';
                let finalComments = activeItem?.comments || '';

                const baseItem: any = {
                  rule_ref: tmpl.rule_ref,
                  requirements: tmpl.requirements,
                  ans: finalAns,
                  comments: finalComments,
                  image: activeItem?.image || tmpl.image || '',
                  vessel_id: vesselId,
                  company_id: companyId,
                  report_id: newReportId,
                  user_id: user?.id || '2b42a774-4c2e-4bc7-a0a4-6b595ed6cee2'
                };
                if (tmpl.s_no !== undefined) baseItem.s_no = tmpl.s_no;
                if (tmpl.item_no !== undefined) baseItem.item_no = tmpl.item_no;
                
                return baseItem;
              });

              if (itemsToInsert.length > 0) {
                // Delete existing rows for this report to prevent duplicates when updating
                await supabase
                  .from(cat)
                  .delete()
                  .eq('report_id', newReportId);

                const { error: insertErr } = await supabase
                  .from(cat)
                  .insert(itemsToInsert);
                
                if (!insertErr) {
                  clonedCategoriesCount++;
                  
                  // Keep active edits intact so the vessel template retains its last state
                } else {
                  console.error(`Error inserting cloned items for ${cat}:`, insertErr);
                }
              }
            } catch (err) {
              console.error(`Failed to clone category ${cat}:`, err);
            }
            }));
          }
          
          alert(`Report submitted successfully! Created overall report containing ${clonedCategoriesCount} category checklists.`);
          router.push('/reports');
        } catch (e: any) {
          console.error('Error submitting report:', e);
          alert(`Failed to submit report: ${e.message}`);
        } finally {
          setIsConfirming(false);
        }
      }
    });
  };

  const filteredCategories = CATEGORIES.filter(cat => 
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-full mx-auto py-12 px-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="p-3 hover:bg-secondary rounded-2xl transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">{vesselName}</h1>
            <p className="text-muted-foreground font-medium mt-1 uppercase tracking-[0.05em] text-[0.7rem] opacity-70">Vessel Registry & Technical Compliance Framework</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <input 
              type="text"
              placeholder="Search registry modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-secondary border border-border focus:border-accent rounded-2xl text-sm font-bold outline-none transition-all shadow-sm"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-3 bg-sky-500/10 text-sky-500 border border-sky-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all shadow-lg shadow-sky-500/5 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Export'}
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showExportDropdown && "rotate-180")} />
            </button>
            
            {showExportDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowExportDropdown(false)} 
                />
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden py-2">
                  <button 
                    onClick={handleExportPDF}
                    className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black text-rose-500 hover:bg-rose-500/10 transition-colors uppercase tracking-widest"
                  >
                    <FileText className="w-4 h-4" />
                    Export PDF
                  </button>
                  <button 
                    onClick={handleExportExcel}
                    className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black text-emerald-500 hover:bg-emerald-500/10 transition-colors uppercase tracking-widest"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Export Excel
                  </button>
                </div>
              </>
            )}
          </div>
          <button 
            onClick={handleSubmitReport}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/5"
          >
            <Send className="w-4 h-4" />
            Submit
          </button>
          <button 
            onClick={async () => {
              if (confirm('CRITICAL: Wipe ALL data from ALL 51 technical modules? This cannot be undone.')) {
                try {
                  await Promise.all(CATEGORIES.map(cat => {
                    if (vesselId) {
                      return deleteTableRow(cat, null, { vessel_id: vesselId, company_id: user?.company_id });
                    } else {
                      return deleteTableRow(cat, null, { vessel_id_is_null: 'true', company_id: user?.company_id });
                    }
                  }));
                  alert('Vessel Management data wiped successfully.');
                  window.location.reload();
                } catch (e) {
                  console.error(e);
                  alert('Bulk wipe failed.');
                }
              }
            }}
            className="flex items-center gap-2 px-6 py-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/5"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-2xl">
        <div className="grid grid-cols-2 px-8 py-5 border-b border-border bg-secondary/30">
          <span className="text-[0.625rem] font-black text-muted-foreground uppercase tracking-[0.2em]">Vessels / Categories</span>
          <span className="text-[0.625rem] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Actions</span>
        </div>

        <div className="divide-y divide-border/50">
          {filteredCategories.map((cat) => (
            <div key={cat} id={`cat-${cat}`} className="group">
              <div className="flex items-center justify-between px-8 py-6 hover:bg-secondary/20 transition-colors border-b border-border last:border-0">
                <div 
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => {
                    const isCurrentlyExpanded = expanded === cat;
                    setExpanded(isCurrentlyExpanded ? null : cat);
                    if (isCurrentlyExpanded) {
                      setEditingCategory(null);
                    }
                  }}
                >
                  <div className="text-muted-foreground">
                    {expanded === cat ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                  <span className="text-sm font-black text-foreground uppercase tracking-tight ml-2">{formatName(cat)}</span>
                </div>

                <div className="flex items-center gap-6">

                  {hasRole(['SUPERINTENDENT', 'ADMIN', 'SUPERADMIN']) && (
                    <button 
                      title="Edit Module"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (editingCategory === cat) {
                          setEditingCategory(null);
                        } else {
                          setEditingCategory(cat);
                          setExpanded(cat);
                        }
                      }}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        editingCategory === cat 
                          ? "text-white bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-500/20" 
                          : "text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10"
                      )}
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                  )}
                  {hasRole(['SUPERINTENDENT', 'ADMIN', 'SUPERADMIN']) && (
                    <button 
                      title="Approve All"
                      onClick={() => {
                        const currentCat = cat; // capture current category
                        setConfirmModal({
                          open: true,
                          title: 'Bulk Approval',
                          message: `Are you sure you want to approve all records in ${formatName(currentCat)}? This will mark everything as passed and update the comments.`,
                          type: 'info',
                          btnText: 'Yes, Approve All',
                          action: async () => {
                            console.log(`Starting bulk approval for: ${currentCat}`);
                            let activeCompanyId = user?.company_id;
                            if (!activeCompanyId && vesselId) {
                              try {
                                const { data: vesselData } = await supabase.from('vessels').select('company_id').eq('id', vesselId).single();
                                activeCompanyId = vesselData?.company_id;
                              } catch (e) {
                                console.error(e);
                              }
                            }

                            try {
                              await updateTableRow(currentCat, null, { ans: 'Yes', comments: 'Bulk Approved' }, {
                                vessel_id: vesselId || undefined,
                                company_id: activeCompanyId || undefined,
                                report_id_is_null: 'true'
                              });
                              console.log(`Successfully approved all for ${currentCat}`);
                              triggerRefresh(currentCat);
                            } catch (err: any) {
                              console.error(`Approval failed for ${currentCat}:`, err);
                              alert(`Approval failed: ${err.message || err}`);
                            }
                          }
                        });
                      }}
                      className="p-2 text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-lg transition-all"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
                  {hasRole(['STAFF', 'SUPERINTENDENT', 'ADMIN', 'SUPERADMIN']) && (
                    <button 
                      title="Submit Report"
                      onClick={() => {
                        const currentCat = cat; // capture current category
                        setConfirmModal({
                          open: true,
                          title: 'Finalize Report',
                          message: `SUBMIT FINAL REPORT for ${formatName(currentCat)}? This will archive the current inspection state to the Reports section for permanent storage.`,
                          type: 'success',
                          btnText: 'Submit Now',
                          action: async () => {
                            console.log(`Starting report submission for: ${currentCat}`);
                            let activeCompanyId = user?.company_id;
                            if (!activeCompanyId && vesselId) {
                              try {
                                const { data: vesselData } = await supabase.from('vessels').select('company_id').eq('id', vesselId).single();
                                activeCompanyId = vesselData?.company_id;
                              } catch (e) {
                                console.error(e);
                              }
                            }

                            console.log('Submission Params:', { vesselId, activeCompanyId, currentCat });

                            try {
                              // Find existing PENDING OVERALL report for this vessel
                              const { data: existingReports, error: existingErr } = await supabase
                                .from('reports')
                                .select('id')
                                .eq('vessel_id', vesselId)
                                .eq('status', 'PENDING')
                                .eq('category_name', 'OVERALL')
                                .order('created_at', { ascending: false })
                                .limit(1);

                              let reportIdToUse;
                              if (!existingErr && existingReports && existingReports.length > 0) {
                                reportIdToUse = existingReports[0].id;
                                console.log('Using existing PENDING OVERALL report:', reportIdToUse);
                              } else {
                                const newReport = await insertTableRow('reports', {
                                  vessel_id: vesselId,
                                  company_id: activeCompanyId,
                                  created_by: user?.id || '127bf7b2-aa5e-4c71-81b7-8a413b735f91',
                                  status: 'PENDING',
                                  category_name: 'OVERALL',
                                  report_title: `Overall Inspection Report - ${vesselName || 'Unknown Vessel'}`
                                });
                                reportIdToUse = newReport?.id;
                                console.log('Created new OVERALL report:', reportIdToUse);
                              }

                              // Clone templates (merged with active edits) for currentCat to this report_id
                              if (reportIdToUse) {
                                const cat = currentCat;
                                // Fetch all items to build templates
                                const { data: allItems, error: templateErr } = await supabase
                                  .from(cat)
                                  .select('*');

                                if (templateErr) throw templateErr;

                                // Deduplicate by s_no/item_no to get the unique template questions
                                const seen = new Set();
                                const templates = [];
                                const sorted = [...(allItems || [])].sort((a, b) => {
                                  const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                                  const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                                  return dateB - dateA;
                                });
                                for (const row of sorted) {
                                  const sNoVal = row.s_no || row.item_no;
                                  if (sNoVal && !seen.has(sNoVal)) {
                                    seen.add(sNoVal);
                                    templates.push(row);
                                  }
                                }

                                // Fetch active edits for this vessel
                                const { data: activeItems } = await supabase
                                  .from(cat)
                                  .select('*')
                                  .eq('vessel_id', vesselId)
                                  .is('report_id', null);

                                const activeMap = new Map();
                                if (activeItems) {
                                  activeItems.forEach(item => {
                                    activeMap.set(item.s_no || item.item_no, item);
                                  });
                                }

                                // Merge templates and active edits
                                const itemsToInsert = (templates || []).map(tmpl => {
                                  const activeItem = activeMap.get(tmpl.s_no || tmpl.item_no);
                                  
                                  const STATUSES = ['SATISFACTORY', 'GOOD', 'UNSATISFACTORY', 'NOT SEEN'];
                                  const STATUS_WEIGHTS = [0.75, 0.15, 0.07, 0.03];
                                  const COMMENTS_MAPPING: Record<string, string[]> = {
                                    'SATISFACTORY': ['Condition satisfactory', 'No abnormalities observed', 'Inspection completed successfully', 'In good working order', 'Meets required standards', 'Operating correctly', 'No defects found'],
                                    'GOOD': ['Good condition', 'Working properly', 'Well maintained', 'Functions effectively', 'System optimal', 'Equipment intact'],
                                    'UNSATISFACTORY': ['Requires attention', 'Maintenance needed', 'Below standard', 'Needs repair', 'Defect noted', 'Action required'],
                                    'NOT SEEN': ['Not accessible during inspection', 'Not tested', 'Area locked', 'Equipment not available', 'Pending further check']
                                  };

                                  let finalAns = activeItem?.ans || '';
                                  let finalComments = activeItem?.comments || '';

                                  const entry: any = {
                                    rule_ref: tmpl.rule_ref,
                                    requirements: tmpl.requirements,
                                    ans: finalAns,
                                    comments: finalComments,
                                    image: activeItem?.image || tmpl.image || '',
                                    vessel_id: vesselId,
                                    company_id: activeCompanyId,
                                    report_id: reportIdToUse,
                                    user_id: user?.id || '2b42a774-4c2e-4bc7-a0a4-6b595ed6cee2'
                                  };

                                  if (cat === 'machinery_arrangements' || cat === 'pollution_prevention_for_tankers') {
                                    entry.item_no = tmpl.s_no || tmpl.item_no;
                                  } else {
                                    entry.s_no = tmpl.s_no || tmpl.item_no;
                                  }

                                  return entry;
                                });

                                if (itemsToInsert.length > 0) {
                                  // Delete existing rows for this report to prevent duplicates when updating
                                  await supabase
                                    .from(cat)
                                    .delete()
                                    .eq('report_id', reportIdToUse);

                                  const { error: insertErr } = await supabase
                                    .from(cat)
                                    .insert(itemsToInsert);
                                  
                                  if (insertErr) throw insertErr;

                                  // Clear active edits for this vessel since they are now locked in the report
                                  if (activeItems && activeItems.length > 0) {
                                    const { error: deleteErr } = await supabase
                                      .from(cat)
                                      .delete()
                                      .eq('vessel_id', vesselId)
                                      .is('report_id', null);
                                    if (deleteErr) console.error('Error clearing active edits:', deleteErr);
                                  }
                                  console.log(`Successfully cloned category ${cat} into Report ${reportIdToUse}.`);
                                }
                              }
                              
                              alert('✅ Module merged into consolidated report! Check the Reports section.');
                              await fetchOrCreateReport();
                              triggerRefresh(currentCat);
                            } catch (err: any) {
                              console.error(`Report submission failed for ${currentCat}:`, err);
                              alert(`Submission failed: ${err.message || err}`);
                            }
                          }
                        });
                      }}
                      className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  )}

                  <button 
                    title="Clear Category"
                    onClick={async () => {
                      if(confirm(`Wipe all data in ${cat}?`)) {
                        try {
                          if (vesselId) {
                            await deleteTableRow(cat, null, { vessel_id: vesselId, company_id: user?.company_id });
                          } else {
                            await deleteTableRow(cat, null, { vessel_id_is_null: 'true', company_id: user?.company_id });
                          }
                          alert('Category cleared.');
                          triggerRefresh(cat);
                        } catch (err: any) {
                          console.error("Failed to clear category:", err);
                          alert(`Error clearing category: ${err.message || err}`);
                        }
                      }
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expanded === cat && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-secondary/10 px-8 pb-6"
                  >
                    <div className="border border-border rounded-2xl overflow-hidden shadow-xl">
                      <InspectionTable 
                        tableName={cat} 
                        vesselId={vesselId} 
                        vesselName={vesselName} 
                        reportId={null}
                        refreshKey={refreshKeys[cat] || 0}
                        isEditable={editingCategory === cat}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex items-center gap-10 bg-card border border-border rounded-3xl p-6 shadow-sm w-fit mx-auto">
        <div className="flex items-center gap-3">
          <Plus className="w-5 h-5 text-indigo-500" />
          <span className="text-[0.625rem] font-black uppercase text-muted-foreground">Add Records</span>
        </div>
        <div className="flex items-center gap-3">
          <Pencil className="w-5 h-5 text-sky-500" />
          <span className="text-[0.625rem] font-black uppercase text-muted-foreground">Edit</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-teal-500" />
          <span className="text-[0.625rem] font-black uppercase text-muted-foreground">Approve</span>
        </div>
        <div className="flex items-center gap-3">
          <Trash2 className="w-5 h-5 text-rose-500" />
          <span className="text-[0.625rem] font-black uppercase text-muted-foreground">Delete</span>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-xl p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-[40px] p-12 w-full max-w-xl shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  {modalType === 'create' ? 'Add New Requirement' : 'Edit Requirement'}
                </h2>
                <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[0.625rem] font-black uppercase text-slate-400 ml-2">Serial No</label>
                      <input 
                        type="text" 
                        placeholder="e.g. DEC-37"
                        value={formData.s_no}
                        onChange={(e) => setFormData({...formData, s_no: e.target.value})}
                        className="w-full px-5 py-3 bg-secondary/50 border-2 border-transparent focus:border-accent rounded-2xl outline-none font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[0.625rem] font-black uppercase text-muted-foreground ml-2">Rule Reference</label>
                      <input 
                        type="text"
                        placeholder="Optional"
                        value={formData.rule_ref}
                        onChange={(e) => setFormData({...formData, rule_ref: e.target.value})}
                        className="w-full px-5 py-3 bg-secondary/50 border-2 border-transparent focus:border-accent rounded-2xl outline-none font-bold"
                      />
                    </div>
                  </div>
 
                  <div className="space-y-1">
                    <label className="text-[0.625rem] font-black uppercase text-muted-foreground ml-2">Requirement Description</label>
                    <textarea 
                      required
                      rows={3}
                      value={formData.requirements}
                      onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                      className="w-full px-5 py-3 bg-secondary/50 border-2 border-transparent focus:border-accent rounded-2xl outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-secondary rounded-2xl font-black text-xs uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-4 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
                  >
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {modalType === 'create' ? 'Create Requirement' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOM CONFIRMATION MODAL */}
      <AnimatePresence>
        {confirmModal.open && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center bg-background/80 backdrop-blur-xl p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-border rounded-[40px] p-10 w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
              <div className={cn(
                "absolute top-0 left-0 w-full h-2",
                confirmModal.type === 'success' ? "bg-emerald-500" : 
                confirmModal.type === 'danger' ? "bg-rose-500" : "bg-blue-500"
              )} />
              
              <div className="flex items-center gap-4 mb-6">
                <div className={cn(
                  "p-3 rounded-2xl",
                  confirmModal.type === 'success' ? "bg-emerald-500/10 text-emerald-500" : 
                  confirmModal.type === 'danger' ? "bg-rose-500/10 text-rose-500" : "bg-blue-500/10 text-blue-500"
                )}>
                  {confirmModal.type === 'success' ? <Send className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">{confirmModal.title}</h2>
                  <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-60">Action Required • Inspection Dashboard</p>
                </div>
              </div>

              <p className="text-foreground/80 font-medium mb-8 leading-relaxed">
                {confirmModal.message}
              </p>

              <div className="flex gap-4">
                <button 
                  onClick={() => setConfirmModal({...confirmModal, open: false})}
                  className="flex-1 py-4 bg-secondary text-muted-foreground rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary/80 transition-all"
                >
                  Cancel
                </button>
                <button 
                  disabled={isConfirming}
                  onClick={async () => {
                    try {
                      setIsConfirming(true);
                      await confirmModal.action();
                    } catch (err) {
                      console.error("Modal Action Error:", err);
                    } finally {
                      setIsConfirming(false);
                      setConfirmModal({...confirmModal, open: false});
                    }
                  }}
                  className={cn(
                    "flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2",
                    isConfirming ? "opacity-70 cursor-not-allowed" : "",
                    confirmModal.type === 'success' ? "bg-emerald-500 shadow-emerald-500/20" : 
                    confirmModal.type === 'danger' ? "bg-rose-500 shadow-rose-500/20" : "bg-blue-500 shadow-blue-500/20"
                  )}
                >
                  {isConfirming && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {isConfirming ? 'Processing...' : confirmModal.btnText}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CategoryManagementPage;
