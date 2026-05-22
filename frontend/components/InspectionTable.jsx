'use client';

import { useEffect, useState, useRef } from 'react'
import { getTableData, updateTableRow, insertTableRow, deleteTableRow } from '../services/api'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    FileText, 
    FileSpreadsheet,
    Loader2, 
    AlertCircle, 
    Check, 
    Save, 
    Search, 
    Lock, 
    Plus, 
    ChevronLeft, 
    ChevronRight, 
    Trash2, 
    X, 
    Camera, 
    Image as ImageIcon,
    Download,
    MessageSquare,
    Pencil
} from 'lucide-react'
import { exportToExcel, exportToPDF } from '@/services/export'
import { useAuth } from '../hooks/use-auth'
import { useAccessibility } from '@/components/AccessibilityProvider'
import { cn } from '@/lib/utils'

const getSuggestionsForStatus = (status) => {
    switch(status) {
        case 'SATISFACTORY':
            return ['Condition satisfactory', 'No abnormalities observed', 'Inspection completed successfully'];
        case 'GOOD':
            return ['Good condition', 'Working properly', 'Well maintained'];
        case 'UNSATISFACTORY':
            return ['Corrosion observed', 'Repair required', 'Further inspection needed'];
        case 'NOT SEEN':
            return ['Unable to access', 'Area restricted', 'Not inspected at this time'];
        default:
            return [];
    }
}

function InspectionTable({ tableName, vesselId, vesselName, reportId, refreshKey, isEditable: isEditableProp = false }) {
    const { user } = useAuth()
    const { tableTextSize = 12, tableRowSpacing = 16 } = useAccessibility() || {}
    const [rows, setRows] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [savingRowId, setSavingRowId] = useState(null)
    const [error, setError] = useState(null)
    const [editData, setEditData] = useState({})
    const [isAdding, setIsAdding] = useState(false)
    const [newRow, setNewRow] = useState({ s_no: '', requirements: '', rule_ref: '', ans: '', comments: '', image: '' })
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)
    const [selectedRowForImage, setSelectedRowForImage] = useState(null)
    const [tempImageUrl, setTempImageUrl] = useState('')
    const [isSavingNew, setIsSavingNew] = useState(false)
    const [isSavingAll, setIsSavingAll] = useState(false)
    const [resolvedCompanyId, setResolvedCompanyId] = useState(user?.company_id || null)

    // Camera state
    const [isCameraActive, setIsCameraActive] = useState(false)
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const [stream, setStream] = useState(null)

    const isEditable = isEditableProp !== undefined ? isEditableProp : !!user; // Allow editing for all logged-in users viewing the table

    useEffect(() => {
        if (user?.company_id) {
            setResolvedCompanyId(user.company_id);
            return;
        }
        
        async function fetchCompanyId() {
            if (vesselId && vesselId !== 'null' && vesselId !== '') {
                try {
                    const { data } = await supabase.from('vessels').select('company_id').eq('id', vesselId).single();
                    if (data?.company_id) {
                        setResolvedCompanyId(data.company_id);
                        return;
                    }
                } catch (e) {
                    console.error('Error fetching vessel company_id:', e);
                }
            }
            if (reportId && reportId !== 'null' && reportId !== '') {
                try {
                    const { data } = await supabase.from('reports').select('company_id').eq('id', reportId).single();
                    if (data?.company_id) {
                        setResolvedCompanyId(data.company_id);
                        return;
                    }
                } catch (e) {
                    console.error('Error fetching report company_id:', e);
                }
            }
        }
        fetchCompanyId();
    }, [user?.company_id, vesselId, reportId]);

    useEffect(() => {
        async function loadData() {
            if (!tableName) return;
            
            try {
                setIsLoading(true);
                setError(null);
                
                console.log(`Loading data for table: ${tableName}, vessel: ${vesselId}, report: ${reportId}`);
                
                // Helper to fill defaults when loading records
                const STATUSES = ['SATISFACTORY', 'GOOD', 'UNSATISFACTORY', 'NOT SEEN'];
                const STATUS_WEIGHTS = [0.75, 0.15, 0.07, 0.03];
                const COMMENTS_MAPPING = {
                  'SATISFACTORY': ['Condition satisfactory', 'No abnormalities observed', 'Inspection completed successfully', 'In good working order', 'Meets required standards', 'Operating correctly', 'No defects found'],
                  'GOOD': ['Good condition', 'Working properly', 'Well maintained', 'Functions effectively', 'System optimal', 'Equipment intact'],
                  'UNSATISFACTORY': ['Requires attention', 'Maintenance needed', 'Below standard', 'Needs repair', 'Defect noted', 'Action required'],
                  'NOT SEEN': ['Not accessible during inspection', 'Not tested', 'Area locked', 'Equipment not available', 'Pending further check']
                };

                const getRandomStatus = () => {
                  const r = Math.random();
                  let cumulative = 0;
                  for (let i = 0; i < STATUSES.length; i++) {
                    cumulative += STATUS_WEIGHTS[i];
                    if (r <= cumulative) return STATUSES[i];
                  }
                  return STATUSES[0];
                };

                const fillDefaults = (row, isTemplate = false) => {
                    const filledRow = { ...row };
                    if (!filledRow.ans || filledRow.ans === 'EMPTY') {
                        filledRow.ans = '';
                    }
                    if (!filledRow.comments || filledRow.comments === 'EMPTY') {
                        filledRow.comments = '';
                    }
                    if (isTemplate) {
                        filledRow.id = `temp-${Math.random().toString(36).substr(2, 9)}`;
                        filledRow.report_id = reportId || null; 
                        filledRow.ans = '';
                        filledRow.comments = '';
                        filledRow.image = '';
                        filledRow._isTemplate = true;
                    }
                    return filledRow;
                };

                let data = [];
                let rawData = [];

                try {
                    // Fetch data using the secure service-role-backed Edge Function to bypass RLS policies
                    if (vesselId && vesselId !== 'null' && vesselId !== '') {
                        rawData = await getTableData(tableName, { vessel_id: vesselId });
                    } else {
                        rawData = await getTableData(tableName);
                    }
                } catch (apiErr) {
                    console.error('Fetch via API Edge Function failed, falling back to direct client query:', apiErr);
                    try {
                        let query = supabase.from(tableName).select('*');
                        if (vesselId && vesselId !== 'null' && vesselId !== '') {
                            query = query.eq('vessel_id', vesselId);
                        }
                        const res = await query;
                        rawData = res.data || [];
                    } catch (directErr) {
                        console.error('Direct fallback query failed:', directErr);
                    }
                }

                // Filter by report_id if specified, or report_id = null for active checklist
                let filteredData = [];
                if (rawData && rawData.length > 0) {
                    if (reportId) {
                        filteredData = rawData.filter(r => r.report_id === reportId);
                    } else {
                        filteredData = rawData.filter(r => !r.report_id);
                    }
                }

                if (filteredData && filteredData.length > 0) {
                    // Existing records found: fill any empty fields with realistic defaults
                    data = filteredData.map(r => fillDefaults(r, false));
                } else {
                    // No records found: fetch template/fallback data
                    console.log(`No direct records found for report ${reportId || 'active'}. Loading template data...`);
                    let templates = [];
                    try {
                        templates = await getTableData(tableName);
                    } catch (templateErr) {
                        console.error('Template fetch via API failed:', templateErr);
                        try {
                            const res = await supabase.from(tableName).select('*');
                            templates = res.data || [];
                        } catch (directTemplateErr) {
                            console.error('Direct template fetch failed:', directTemplateErr);
                        }
                    }

                    if (templates && templates.length > 0) {
                        const uniqueTemplates = [];
                        const seenSNo = new Set();
                        
                        // Sort by created_at DESC to get most recent requirements
                        const sortedTemplates = [...templates].sort((a, b) => {
                            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                            return dateB - dateA;
                        });

                        for (const row of sortedTemplates) {
                            const sNoVal = row.s_no || row.item_no;
                            if (sNoVal && !seenSNo.has(sNoVal)) {
                                seenSNo.add(sNoVal);
                                uniqueTemplates.push(fillDefaults(row, true));
                            }
                        }
                        data = uniqueTemplates;
                    }
                }

                // Sort the checklist by s_no ascending for beautiful display
                data.sort((a, b) => {
                    const sNoA = a.s_no || a.item_no || '';
                    const sNoB = b.s_no || b.item_no || '';
                    return sNoA.localeCompare(sNoB, undefined, { numeric: true, sensitivity: 'base' });
                });

                setRows(data);
            } catch (err) {
                console.error(`Error loading table ${tableName}:`, err);
                setError(`Connection Error: ${err.message || 'Failed to load checklist'}.`);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [tableName, vesselId, reportId, refreshKey]);

    useEffect(() => {
        if (isCameraActive && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [isCameraActive, stream]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            setStream(mediaStream);
            setIsCameraActive(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please ensure you have given permission and are using a secure connection (HTTPS or localhost).");
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
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL('image/jpeg');
            setTempImageUrl(imageData);
            stopCamera();
        }
    };

    const handleEditChange = (id, field, value) => {
        setEditData(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }))
    }

    const handleSaveAll = async () => {
        const manuallyEditedIds = Object.keys(editData);
        const templateIds = rows.filter(r => r._isTemplate && !manuallyEditedIds.includes(r.id)).map(r => r.id);
        const allIdsToSave = [...manuallyEditedIds, ...templateIds];

        if (allIdsToSave.length === 0) return;

        try {
            setIsSavingAll(true)
            let updatedRows = [...rows];
            await Promise.all(allIdsToSave.map(async (id) => {
                const row = rows.find(r => r.id === id);
                if (!row) return;

                if (row._isTemplate) {
                    // It's a template, insert a new row
                    const { _isTemplate, _autoFilled, ...rowToInsert } = row;
                    const payload = {
                        ...rowToInsert,
                        ...editData[id],
                        vessel_id: vesselId,
                        company_id: resolvedCompanyId || user?.company_id || rowToInsert.company_id,
                        user_id: user?.id || rowToInsert.user_id || '36136991-937e-4c1d-aab2-ea4188213a37',
                        report_id: reportId || rowToInsert.report_id
                    };
                    delete payload.id;
                    delete payload.created_at;

                    const insertedData = await insertTableRow(tableName, payload);
                    const finalRow = Array.isArray(insertedData) ? insertedData[0] : insertedData;
                    updatedRows = updatedRows.map(r => r.id === id ? { ...finalRow, _autoFilled: false } : r);
                } else {
                    const manualEdits = editData[id] || {};
                    const payload = { ...manualEdits };

                    const updatedData = await updateTableRow(tableName, id, payload);
                    const finalRow = Array.isArray(updatedData) ? updatedData[0] : updatedData;
                    updatedRows = updatedRows.map(r => r.id === id ? { ...r, ...payload, ...finalRow, _autoFilled: false } : r);
                }
            }))
            
            setRows(updatedRows);
            
            setEditData({})
            alert('All changes saved successfully!')
        } catch (err) {
            console.error('Failed to save all changes:', err)
            alert(`Failed to save changes: ${err.response?.data?.error || err.message}`)
        } finally {
            setIsSavingAll(false)
        }
    }

    const handleSave = async (id) => {
        const updates = editData[id]
        if (!updates) return

        try {
            setSavingRowId(id)
            const row = rows.find(r => r.id === id);
            
            if (row && row._isTemplate) {
                // Template - insert new
                const { _isTemplate, _autoFilled, ...rowToInsert } = row;
                const payload = {
                    ...rowToInsert,
                    ...updates,
                    vessel_id: vesselId,
                    company_id: resolvedCompanyId || user?.company_id || rowToInsert.company_id,
                    user_id: user?.id || rowToInsert.user_id || '36136991-937e-4c1d-aab2-ea4188213a37',
                    report_id: reportId || rowToInsert.report_id
                };
                delete payload.id;
                delete payload.created_at;

                const insertedData = await insertTableRow(tableName, payload);
                const finalRow = Array.isArray(insertedData) ? insertedData[0] : insertedData;
                setRows(prev => prev.map(r => r.id === id ? finalRow : r));
            } else {
                const updatedData = await updateTableRow(tableName, id, updates);
                const finalRow = Array.isArray(updatedData) ? updatedData[0] : updatedData;
                setRows(prev => prev.map(r => r.id === id ? { ...r, ...updates, ...finalRow } : r));
            }
            
            const newEditData = { ...editData }
            delete newEditData[id]
            setEditData(newEditData)
            
            alert('Record updated successfully!')
        } catch (err) {
            console.error('Failed to update record:', err)
            alert(`Failed to save changes: ${err.response?.data?.error || err.message}`)
        } finally {
            setSavingRowId(null)
        }
    }

    const handleAddRow = async (e) => {
        e.preventDefault()
        try {
            setIsSavingNew(true)
            const payload = { 
                ...newRow, 
                vessel_id: vesselId,
                company_id: resolvedCompanyId || user?.company_id || (rows.length > 0 ? rows[0].company_id : null),
                user_id: user?.id || (rows.length > 0 ? rows[0].user_id : '36136991-937e-4c1d-aab2-ea4188213a37'),
                report_id: reportId || (rows.length > 0 ? rows[0].report_id : null)
            };
            const insertedData = await insertTableRow(tableName, payload);
            const finalRow = Array.isArray(insertedData) ? insertedData[0] : insertedData;
            
            setRows(prev => [...prev, finalRow])
            setIsAdding(false)
            setNewRow({ s_no: '', requirements: '', rule_ref: '', ans: '', comments: '' })
            alert('New record added successfully!')
        } catch (err) {
            console.error('Failed to add record:', err)
            alert(`Error: ${err.message}`)
        } finally {
            setIsSavingNew(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                <p className="text-xs font-bold uppercase tracking-widest">Loading Technical Registry...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-12 text-center bg-red-500/5 rounded-xl border border-red-500/10">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-card rounded-xl overflow-hidden shadow-2xl border border-border relative">
            {/* PERMANENT ACTION BAR */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-secondary/50">
                <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    <span className="text-[0.625rem] font-black uppercase tracking-[0.2em] text-muted-foreground dark:text-white/50">
                        Technical Registry: <span className="text-foreground dark:text-white">{tableName.split('_').join(' ')}</span>
                    </span>
                </div>
                {isEditable && (
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleSaveAll}
                            disabled={isSavingAll || Object.keys(editData).length === 0}
                            className={cn(
                                "px-6 py-2 rounded-full text-[0.625rem] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3",
                                Object.keys(editData).length > 0 
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600" 
                                    : "bg-secondary text-muted-foreground cursor-not-allowed border border-border"
                            )}
                        >
                            {isSavingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse table-auto min-w-[1400px]">
                    <thead>
                        <tr className="bg-secondary/50 border-b border-border">
                            <th style={{ padding: `${tableRowSpacing}px 16px` }} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-16 text-center">ID</th>
                            <th style={{ padding: `${tableRowSpacing}px 16px` }} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-24">S/NO</th>
                            <th style={{ padding: `${tableRowSpacing}px 16px` }} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-64">RULE_REF</th>
                            <th style={{ padding: `${tableRowSpacing}px 16px` }} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground min-w-[400px]">REQUIREMENTS</th>
                            <th style={{ padding: `${tableRowSpacing}px 16px` }} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-40 text-center">ANS</th>
                            <th style={{ padding: `${tableRowSpacing}px 16px` }} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground min-w-[300px]">COMMENTS</th>
                            <th style={{ padding: `${tableRowSpacing}px 16px` }} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-24 text-center">IMAGE</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-8 py-20 text-center text-muted-foreground font-black uppercase italic opacity-30">
                                    No records found in this module.
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, index) => (
                                <tr key={row.id} className="group hover:bg-secondary/20 transition-all">
                                    <td style={{ padding: `${tableRowSpacing}px 16px`, fontSize: `${tableTextSize}px` }} className="text-center font-bold text-muted-foreground">
                                        {index + 1}
                                    </td>
                                    <td style={{ padding: `${tableRowSpacing}px 16px`, fontSize: `${tableTextSize}px` }} className="font-bold text-foreground uppercase">{row.s_no || row.item_no || '-'}</td>
                                    <td style={{ padding: `${tableRowSpacing}px 16px` }}>
                                        <span style={{ fontSize: `${tableTextSize}px` }} className="font-bold text-muted-foreground">{row.rule_ref || '-'}</span>
                                    </td>
                                    <td style={{ padding: `${tableRowSpacing}px 16px` }}>
                                        {isEditable ? (
                                            <div className="relative group/edit">
                                                <textarea
                                                    value={editData[row.id]?.requirements !== undefined ? editData[row.id].requirements : (row.requirements || '')}
                                                    onChange={(e) => {
                                                        handleEditChange(row.id, 'requirements', e.target.value);
                                                        e.target.style.height = 'auto';
                                                        e.target.style.height = e.target.scrollHeight + 'px';
                                                    }}
                                                    style={{ fontSize: `${tableTextSize}px` }}
                                                    className="w-full bg-transparent font-bold text-foreground uppercase tracking-tight outline-none resize-none h-auto overflow-hidden border-b border-transparent group-hover/edit:border-accent/30 focus:border-accent transition-all pr-6"
                                                    placeholder="Edit Requirement..."
                                                />
                                                <Pencil className="absolute right-0 top-2 w-2.5 h-2.5 text-muted-foreground opacity-0 group-hover/edit:opacity-50 transition-opacity pointer-events-none" />
                                            </div>
                                        ) : (
                                            <p style={{ fontSize: `${tableTextSize}px` }} className="font-bold text-foreground uppercase leading-relaxed">
                                                {row.requirements}
                                            </p>
                                        )}
                                    </td>
                                    <td style={{ padding: `${tableRowSpacing}px 16px` }}>
                                        {isEditable ? (
                                            <select
                                                value={editData[row.id]?.ans !== undefined ? editData[row.id].ans : (row.ans || '')}
                                                onChange={(e) => handleEditChange(row.id, 'ans', e.target.value)}
                                                style={{ fontSize: `${tableTextSize}px` }}
                                                className={cn(
                                                    "w-full bg-secondary/50 border border-transparent focus:border-accent/30 rounded-lg px-2 py-1 font-black uppercase outline-none cursor-pointer appearance-none transition-all",
                                                    !(editData[row.id]?.ans !== undefined ? editData[row.id].ans : (row.ans || '')) ? 'text-muted-foreground' : 
                                                    (editData[row.id]?.ans || row.ans) === 'UNSATISFACTORY' ? 'text-rose-500' :
                                                    (editData[row.id]?.ans || row.ans) === 'NOT SEEN' ? 'text-amber-500' :
                                                    'text-emerald-500'
                                                )}
                                            >
                                                <option value="" disabled className="bg-slate-900 text-slate-500 font-bold">SELECT STATUS</option>
                                                <option value="SATISFACTORY" className="bg-slate-900 text-emerald-500 font-bold">SATISFACTORY</option>
                                                <option value="UNSATISFACTORY" className="bg-slate-900 text-rose-500 font-bold">UNSATISFACTORY</option>
                                                <option value="GOOD" className="bg-slate-900 text-emerald-500 font-bold">GOOD</option>
                                                <option value="NOT SEEN" className="bg-slate-900 text-amber-500 font-bold">NOT SEEN</option>
                                            </select>
                                        ) : (
                                            <span 
                                                style={{ fontSize: `${tableTextSize}px` }} 
                                                className={cn("font-black uppercase", 
                                                    row.ans === 'UNSATISFACTORY' ? 'text-rose-500' :
                                                    row.ans === 'NOT SEEN' ? 'text-amber-500' :
                                                    row.ans ? 'text-emerald-500' : 'text-muted-foreground'
                                                )}
                                            >
                                                {row.ans || '-'}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: `${tableRowSpacing}px 16px` }}>
                                        {isEditable ? (
                                            <div className="relative group/comment">
                                                {(() => {
                                                    const currentAns = editData[row.id]?.ans || row.ans;
                                                    const suggestions = getSuggestionsForStatus(currentAns);
                                                    return (
                                                        <>
                                                            <input 
                                                                type="text"
                                                                list={`suggestions-${row.id}`}
                                                                value={editData[row.id]?.comments !== undefined ? editData[row.id].comments : (row.comments || '')}
                                                                onChange={(e) => handleEditChange(row.id, 'comments', e.target.value)}
                                                                placeholder="Add comment..."
                                                                style={{ fontSize: `${tableTextSize}px` }}
                                                                className="w-full bg-secondary/50 border border-transparent focus:border-accent/30 rounded-lg px-3 py-1.5 font-bold text-foreground outline-none placeholder:opacity-30 transition-all"
                                                            />
                                                            {suggestions.length > 0 && (
                                                                <datalist id={`suggestions-${row.id}`}>
                                                                    {suggestions.map((sug, idx) => <option key={idx} value={sug} />)}
                                                                </datalist>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                                <Pencil className="absolute right-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-muted-foreground opacity-0 group-hover/comment:opacity-50 transition-opacity pointer-events-none" />
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: `${tableTextSize}px` }} className="font-bold text-muted-foreground italic">{row.comments || '-'}</span>
                                        )}
                                    </td>
                                    <td style={{ padding: `${tableRowSpacing}px 16px` }} className="text-center">
                                        <button 
                                            onClick={() => {
                                                if (!isEditable && !row.image) return;
                                                setSelectedRowForImage(row.id);
                                                setTempImageUrl(row.image || '');
                                                setIsImageModalOpen(true);
                                            }}
                                            disabled={!isEditable && !row.image}
                                            className={cn(
                                                "p-2 rounded-lg transition-all",
                                                row.image ? "text-emerald-500 bg-emerald-500/10" : "text-muted-foreground",
                                                (isEditable || row.image) ? "hover:bg-secondary cursor-pointer" : "opacity-30 cursor-not-allowed"
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

            {/* SUPABASE STYLE FOOTER */}
            <div className="h-10 border-t border-border flex items-center justify-between px-4 bg-secondary/30 text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-accent transition-colors" />
                        <span className="text-foreground">Page 1 of 1</span>
                        <ChevronRight className="w-4 h-4 cursor-pointer hover:text-accent transition-colors" />
                    </div>
                    <div className="flex items-center gap-2 border-l border-border pl-6">
                        <span className="text-foreground">{rows.length} records</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Save moved to top right for better visibility */}
                </div>
            </div>

            {/* INSERT MODAL - LIKE SUPABASE */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-xl p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-card border border-border rounded-[40px] p-10 w-full max-w-xl shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Insert into {tableName}</h2>
                                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-secondary rounded-full"><X className="w-5 h-5 text-muted-foreground" /></button>
                            </div>

                            <form onSubmit={handleAddRow} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[0.625rem] font-black uppercase text-muted-foreground ml-2">Serial No</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={newRow.s_no}
                                            onChange={(e) => setNewRow({...newRow, s_no: e.target.value})}
                                            className="w-full px-5 py-3 bg-secondary/50 border border-transparent focus:border-emerald-500 rounded-2xl outline-none font-bold text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[0.625rem] font-black uppercase text-muted-foreground ml-2">Rule Reference</label>
                                        <input 
                                            type="text"
                                            value={newRow.rule_ref}
                                            onChange={(e) => setNewRow({...newRow, rule_ref: e.target.value})}
                                            className="w-full px-5 py-3 bg-secondary/50 border border-transparent focus:border-emerald-500 rounded-2xl outline-none font-bold text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[0.625rem] font-black uppercase text-muted-foreground ml-2">Requirement</label>
                                    <textarea 
                                        required
                                        rows={2}
                                        value={newRow.requirements}
                                        onChange={(e) => setNewRow({...newRow, requirements: e.target.value})}
                                        className="w-full px-5 py-3 bg-secondary/50 border border-transparent focus:border-emerald-500 rounded-2xl outline-none font-bold text-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[0.625rem] font-black uppercase text-muted-foreground ml-2">Reference Image URL</label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input 
                                            type="text"
                                            placeholder="https://example.com/image.jpg"
                                            value={newRow.image}
                                            onChange={(e) => setNewRow({...newRow, image: e.target.value})}
                                            className="w-full pl-12 pr-5 py-3 bg-secondary/50 border border-transparent focus:border-emerald-500 rounded-2xl outline-none font-bold text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 py-4 bg-secondary rounded-2xl font-black text-xs uppercase tracking-widest text-muted-foreground"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={isSavingNew}
                                        className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                                    >
                                        {isSavingNew ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Insert Row
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* IMAGE UPDATE MODAL */}
            <AnimatePresence>
                {isImageModalOpen && (
                    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-background/90 backdrop-blur-md p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-[40px] p-10 w-full max-w-lg shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black uppercase tracking-tight text-foreground flex items-center gap-3">
                                    <Camera className="w-6 h-6 text-emerald-500" />
                                    Technical Evidence Capture
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
                                <div className="aspect-video bg-secondary/50 rounded-[32px] overflow-hidden relative border-2 border-dashed border-border group">
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
                                            <ImageIcon className="w-16 h-16 opacity-20" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">No visual evidence selected</p>
                                        </div>
                                    )}
                                    
                                    {isCameraActive && (
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                                            <button 
                                                onClick={capturePhoto}
                                                className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                                            >
                                                Capture Photo
                                            </button>
                                            <button 
                                                onClick={stopCamera}
                                                className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <canvas ref={canvasRef} className="hidden" />

                                {!isCameraActive && isEditable && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <button 
                                                onClick={startCamera}
                                                className="flex flex-col items-center justify-center p-8 bg-secondary/50 hover:bg-emerald-500/10 hover:text-emerald-500 rounded-[32px] transition-all border border-transparent hover:border-emerald-500/20 group"
                                            >
                                                <Camera className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Live Camera</span>
                                            </button>
                                            <div className="relative">
                                                <button 
                                                    onClick={() => document.getElementById('image-input-hidden')?.click()}
                                                    className="w-full h-full flex flex-col items-center justify-center p-8 bg-secondary/50 hover:bg-blue-500/10 hover:text-blue-500 rounded-[32px] transition-all border border-transparent hover:border-blue-500/20 group"
                                                >
                                                    <ImageIcon className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Upload File</span>
                                                </button>
                                                <input 
                                                    id="image-input-hidden"
                                                    type="file" 
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => setTempImageUrl(reader.result);
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        
                                        {tempImageUrl && (
                                            <div className="flex justify-center">
                                                <button 
                                                    onClick={() => setTempImageUrl('')}
                                                    className="flex items-center gap-2 px-6 py-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Remove Current Photo
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        onClick={() => {
                                            stopCamera();
                                            setIsImageModalOpen(false);
                                        }}
                                        className={cn(
                                            "py-5 bg-secondary text-muted-foreground rounded-2xl font-black uppercase tracking-widest hover:bg-secondary/80 transition-all",
                                            isEditable ? "flex-1" : "w-full"
                                        )}
                                    >
                                        Close
                                    </button>
                                    {isEditable && (
                                        <button 
                                            onClick={async () => {
                                                try {
                                                    const finalImageUrl = tempImageUrl || null;
                                                    if (selectedRowForImage) {
                                                        await updateTableRow(tableName, selectedRowForImage, { image: finalImageUrl })
                                                        setRows(prev => prev.map(r => r.id === selectedRowForImage ? { ...r, image: finalImageUrl } : r))
                                                    }
                                                    stopCamera();
                                                    setIsImageModalOpen(false);
                                                    alert(finalImageUrl ? 'Image updated!' : 'Image removed!');
                                                } catch (err) {
                                                    alert('Failed to update image')
                                                }
                                            }}
                                            className="flex-1 py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                        >
                                            {tempImageUrl ? 'Apply Evidence' : 'Remove Photo'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default InspectionTable
