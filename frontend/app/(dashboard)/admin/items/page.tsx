'use client';

import React, { useState, useEffect } from 'react';
import { reportItemsApi, categoriesApi } from '@/services/api';
import { Plus, Pencil, Trash2, Search, ClipboardList, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ReportItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ 
    category_id: '', 
    s_no: '', 
    rule_ref: '', 
    requirements: '',
    ans: '',
    comments: '',
    image: ''
  });

  useEffect(() => {
    Promise.all([fetchItems(), fetchCategories()]);
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const data = await reportItemsApi.getAll();
      setItems(data || []);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await reportItemsApi.update(editingItem.id, formData);
      } else {
        await reportItemsApi.create(formData);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchItems();
    } catch (error) {
      alert('Error saving item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await reportItemsApi.delete(id);
      fetchItems();
    } catch (error) {
      alert('Error deleting item');
    }
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      category_id: item.category_id,
      s_no: item.s_no || '',
      rule_ref: item.rule_ref || '',
      requirements: item.requirements || '',
      ans: item.ans || '',
      comments: item.comments || '',
      image: item.image || ''
    });
    setIsModalOpen(true);
  };

  const filtered = items.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category_id === selectedCategory;
    const matchesSearch = item.requirements?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.rule_ref?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase italic">Technical Checklists</h1>
          <p className="text-muted-foreground font-bold mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Manage dynamic inspection rules and requirements
          </p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setFormData({ category_id: selectedCategory === 'all' ? '' : selectedCategory, s_no: '', rule_ref: '', requirements: '', ans: '', comments: '', image: '' }); setIsModalOpen(true); }}
          className="flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20"
        >
          <Plus className="w-5 h-5" /> Add Requirement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-[32px] p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Filter Categories</span>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  "w-full text-left px-5 py-3 rounded-xl text-xs font-bold transition-all",
                  selectedCategory === 'all' ? "bg-accent text-white" : "hover:bg-secondary"
                )}
              >
                All Modules
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "w-full text-left px-5 py-3 rounded-xl text-xs font-bold transition-all truncate",
                    selectedCategory === cat.id ? "bg-accent text-white shadow-lg" : "hover:bg-secondary"
                  )}
                >
                  {cat.category_name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="md:col-span-3 space-y-6">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search requirements..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-8 py-5 bg-card border border-border rounded-3xl font-bold outline-none focus:border-accent transition-all"
            />
          </div>

          <div className="space-y-4">
            {isLoading ? (
              [1,2,3].map(n => <div key={n} className="h-24 bg-card animate-pulse rounded-2xl" />)
            ) : filtered.length === 0 ? (
              <div className="p-20 text-center bg-card border border-border border-dashed rounded-[40px]">
                <ClipboardList className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="font-bold text-muted-foreground">No requirements found for this criteria.</p>
              </div>
            ) : (
              filtered.map(item => (
                <div 
                  key={item.id}
                  className="bg-card border border-border rounded-3xl p-6 hover:border-accent/50 transition-all flex items-start justify-between gap-6 group"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black bg-accent/10 text-accent px-3 py-1 rounded-lg uppercase tracking-widest">
                        {categories.find(c => c.id === item.category_id)?.category_name || 'General'}
                      </span>
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">REF: {item.rule_ref || 'N/A'}</span>
                    </div>
                    <p className="text-sm font-bold text-foreground leading-relaxed">{item.requirements}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(item)} className="p-3 hover:bg-accent/10 rounded-xl text-muted-foreground hover:text-accent transition-all"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-3 hover:bg-rose-500/10 rounded-xl text-muted-foreground hover:text-rose-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-[48px] p-12 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-secondary rounded-2xl transition-all">
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8">
                {editingItem ? 'Edit' : 'Add'} Technical Requirement
              </h2>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Module Category</label>
                    <select 
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                      className="w-full px-6 py-4 bg-secondary border border-transparent focus:border-accent rounded-2xl outline-none font-bold appearance-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.category_name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Rule Reference</label>
                    <input 
                      type="text"
                      value={formData.rule_ref}
                      onChange={(e) => setFormData({...formData, rule_ref: e.target.value})}
                      placeholder="e.g. SOLAS Ch. II-2"
                      className="w-full px-6 py-4 bg-secondary border border-transparent focus:border-accent rounded-2xl outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Requirement Description</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.requirements}
                    onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                    placeholder="Describe the technical requirement or question..."
                    className="w-full px-6 py-4 bg-secondary border border-transparent focus:border-accent rounded-2xl outline-none font-bold resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Item S/No</label>
                    <input 
                      type="text"
                      value={formData.s_no}
                      onChange={(e) => setFormData({...formData, s_no: e.target.value})}
                      placeholder="e.g. 1.1"
                      className="w-full px-6 py-4 bg-secondary border border-transparent focus:border-accent rounded-2xl outline-none font-bold"
                    />
                  </div>
                  {/* Default Ans/Comments can be set here if needed, but usually they are for the report instance */}
                </div>

                <button type="submit" className="w-full py-5 bg-accent text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Commit Requirement
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
