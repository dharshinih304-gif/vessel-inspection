'use client';

import React, { useState, useEffect } from 'react';
import { categoriesApi } from '@/services/api';
import { Plus, Pencil, Trash2, Search, FolderTree, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ category_name: '', category_code: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoriesApi.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, formData);
      } else {
        await categoriesApi.create(formData);
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ category_name: '', category_code: '' });
      fetchCategories();
    } catch (error) {
      alert('Error saving category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will affect all associated report items.')) return;
    try {
      await categoriesApi.delete(id);
      fetchCategories();
    } catch (error) {
      alert('Error deleting category');
    }
  };

  const openEdit = (cat: any) => {
    setEditingCategory(cat);
    setFormData({ category_name: cat.category_name, category_code: cat.category_code || '' });
    setIsModalOpen(true);
  };

  const filtered = categories.filter(c => 
    c.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.category_code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase italic">Category Architecture</h1>
          <p className="text-muted-foreground font-bold mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Manage global inspection modules
          </p>
        </div>
        <button 
          onClick={() => { setEditingCategory(null); setFormData({ category_name: '', category_code: '' }); setIsModalOpen(true); }}
          className="flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20"
        >
          <Plus className="w-5 h-5" /> New Category
        </button>
      </div>

      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-accent transition-colors" />
        <input 
          type="text" 
          placeholder="Filter modules..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-16 pr-8 py-6 bg-card border border-border rounded-[32px] text-lg font-bold outline-none focus:border-accent transition-all shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1,2,3].map(n => <div key={n} className="h-48 bg-card animate-pulse rounded-[40px]" />)
        ) : (
          filtered.map(cat => (
            <motion.div 
              key={cat.id}
              whileHover={{ y: -5 }}
              className="p-8 bg-card border border-border rounded-[40px] hover:border-accent transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <FolderTree className="w-24 h-24" />
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                  <FolderTree className="w-6 h-6" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(cat)} className="p-2 hover:bg-accent/10 rounded-lg text-muted-foreground hover:text-accent transition-all"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-rose-500/10 rounded-lg text-muted-foreground hover:text-rose-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <h3 className="text-xl font-black text-foreground uppercase tracking-tight">{cat.category_name}</h3>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-2">
                CODE: <span className="text-accent">{cat.category_code || 'N/A'}</span>
              </p>
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
              className="bg-card border border-border rounded-[48px] p-12 w-full max-w-lg shadow-2xl relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-secondary rounded-2xl transition-all">
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8">
                {editingCategory ? 'Update' : 'Create'} Category
              </h2>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Display Name</label>
                  <input 
                    type="text" required 
                    value={formData.category_name}
                    onChange={(e) => setFormData({...formData, category_name: e.target.value})}
                    placeholder="e.g. Engine Room"
                    className="w-full px-6 py-4 bg-secondary border border-transparent focus:border-accent rounded-2xl outline-none font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Category Code</label>
                  <input 
                    type="text" 
                    value={formData.category_code}
                    onChange={(e) => setFormData({...formData, category_code: e.target.value})}
                    placeholder="e.g. ENG-01"
                    className="w-full px-6 py-4 bg-secondary border border-transparent focus:border-accent rounded-2xl outline-none font-bold"
                  />
                </div>
                <button type="submit" className="w-full py-5 bg-accent text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Commit Module
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
