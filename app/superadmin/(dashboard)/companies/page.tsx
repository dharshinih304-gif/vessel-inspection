'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { Search, Plus, Building, Edit, Trash2 } from 'lucide-react';
import { message, Modal, Form, Input, Spin, Popconfirm } from 'antd';

interface CompanyDetail {
  id: string;
  company_name: string;
  description?: string;
  created_at?: string;
}

export default function CompaniesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [companies, setCompanies] = useState<CompanyDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // New Company Modal State
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [form] = Form.useForm();

  // Edit Company Modal State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyDetail | null>(null);
  const [editForm] = Form.useForm();

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('id, company_name, created_at')
        .order('company_name');
      
      if (error) throw error;
      setCompanies(data || []);
    } catch (error: any) {
      console.error('Error fetching companies:', error.message);
      messageApi.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role?.toUpperCase() === 'SUPERADMIN') {
      fetchCompanies();
    }
  }, [user]);

  const handleViewDetails = (companyId: string) => {
    router.push(`/superadmin/companies/${companyId}`);
  };

  const handleCreateCompany = async (values: any) => {
    try {
      setIsCreating(true);
      const payload = {
        company_name: values.company_name
      };

      const { data, error } = await supabase
        .from('companies')
        .insert([payload])
        .select()
        .single();
        
      if (error) throw error;
      
      messageApi.success('Company created successfully');
      setIsAddModalVisible(false);
      form.resetFields();
      
      // Refresh list
      setCompanies(prev => [data, ...prev].sort((a, b) => a.company_name.localeCompare(b.company_name)));
    } catch (error: any) {
      console.error('Error creating company:', error.message);
      messageApi.error(error.message || 'Failed to create company');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditCompany = async (values: any) => {
    if (!editingCompany) return;
    try {
      setIsEditing(true);
      const { data, error } = await supabase
        .from('companies')
        .update({
          company_name: values.company_name
        })
        .eq('id', editingCompany.id)
        .select()
        .single();

      if (error) throw error;

      messageApi.success('Company updated successfully');
      setIsEditModalVisible(false);
      editForm.resetFields();
      setEditingCompany(null);

      // Update state
      setCompanies(prev => prev.map(c => c.id === editingCompany.id ? data : c));
    } catch (error: any) {
      console.error('Error updating company:', error.message);
      messageApi.error(error.message || 'Failed to update company');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    try {
      // 1. Delete users first to prevent foreign key violations
      const { error: usersError } = await supabase
        .from('users')
        .delete()
        .eq('company_id', companyId);

      if (usersError) throw usersError;

      // 2. Delete reports
      const { error: reportsError } = await supabase
        .from('reports')
        .delete()
        .eq('company_id', companyId);

      if (reportsError) throw reportsError;

      // 3. Delete vessels
      const { error: vesselsError } = await supabase
        .from('vessels')
        .delete()
        .eq('company_id', companyId);

      if (vesselsError) throw vesselsError;

      // 4. Delete the company
      const { error: companyError } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (companyError) throw companyError;

      messageApi.success('Company deleted successfully');
      setCompanies(prev => prev.filter(c => c.id !== companyId));
    } catch (error: any) {
      console.error('Error deleting company:', error.message);
      messageApi.error(error.message || 'Failed to delete company');
    }
  };

  const filteredCompanies = companies.filter(company => 
    company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto w-full pt-12">
      {contextHolder}
      {/* Header section */}
      <div className="mb-10">

        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-white">Companies</h1>
          <button 
            onClick={() => setIsAddModalVisible(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-lg shadow-blue-900/20 transition-all border border-blue-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Company
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative w-72">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-slate-500" />
        </div>
        <input 
          type="text" 
          placeholder="Search by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#111C35] border-none text-sm text-slate-300 placeholder-slate-600 rounded-lg py-2.5 pl-10 pr-4 focus:ring-1 focus:ring-blue-500/50 outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-[#111C35] rounded-xl border border-slate-800/60 overflow-hidden shadow-2xl">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-6 py-4 border-b border-slate-800/60 bg-[#0E172A]">
          <div className="col-span-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">COMPANY NAME</div>
          <div className="col-span-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right pr-4">ACTIONS</div>
        </div>
        
        {/* Table Body */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex justify-center items-center gap-3">
            <Spin size="small" />
            <span>Loading environments...</span>
          </div>
        ) : filteredCompanies.length > 0 ? (
          <div className="divide-y divide-slate-800/60">
            {filteredCompanies.map((company) => (
              <div key={company.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-800/20 transition-colors">
                <div className="col-span-6 text-sm font-semibold text-slate-200 uppercase tracking-wide">
                  {company.company_name}
                </div>
                <div className="col-span-6 flex justify-end gap-2">
                  <button 
                    onClick={() => handleViewDetails(company.id)}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-slate-700 hover:border-slate-600"
                  >
                    <Building className="w-3.5 h-3.5" />
                    Details
                  </button>
                  
                  <button 
                    onClick={() => {
                      setEditingCompany(company);
                      editForm.setFieldsValue({
                        company_name: company.company_name,
                        description: company.description || ''
                      });
                      setIsEditModalVisible(true);
                    }}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-slate-700 hover:border-slate-600"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  
                  <Popconfirm
                    title={<span className="text-white">Delete company?</span>}
                    description={<span className="text-slate-300">This will delete the company and its authorized users, reports, and vessels!</span>}
                    onConfirm={() => handleDeleteCompany(company.id)}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                    placement="topRight"
                    styles={{ root: { backgroundColor: '#1e293b', border: '1px solid #334155', maxWidth: '300px' } }}
                  >
                    <button className="flex items-center gap-1.5 bg-red-950/40 hover:bg-red-900/40 text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-red-900/50 hover:border-red-800/60">
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </Popconfirm>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-sm">
            No companies found matching "{searchTerm}".
          </div>
        )}
      </div>

      {/* Footer Text */}
      <div className="mt-12 text-center">
        <p className="text-xs font-medium text-slate-500">
          Don't see your company? <a href="#" className="text-blue-500 hover:text-blue-400 transition-colors">Contact Platform Support</a>
        </p>
      </div>

      {/* Add Company Modal */}
      <Modal
        title={<span className="text-white">Create New Company</span>}
        open={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnHidden
        styles={{
          mask: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(2, 6, 23, 0.8)' },
          body: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' },
          header: { backgroundColor: 'transparent', borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '16px' }
        }}
        closeIcon={<span className="text-slate-400 hover:text-white text-xl">×</span>}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateCompany} className="mt-4">
          <Form.Item 
            name="company_name" 
            label={<span className="text-slate-300">Company Name</span>} 
            rules={[{ required: true, message: 'Please enter company name' }]}
          >
            <Input placeholder="Acme Corporation" size="large" className="bg-[#1e293b] border-[#334155] text-white hover:border-blue-500 focus:border-blue-500 placeholder:text-slate-500" />
          </Form.Item>
          

          
          <div className="flex justify-end gap-3 mt-8">
            <button 
              type="button"
              onClick={() => {
                setIsAddModalVisible(false);
                form.resetFields();
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isCreating}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20"
            >
              {isCreating ? <Spin size="small" /> : 'Create Company'}
            </button>
          </div>
        </Form>
      </Modal>

      {/* Edit Company Modal */}
      <Modal
        title={<span className="text-white">Edit Company: {editingCompany?.company_name}</span>}
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          editForm.resetFields();
          setEditingCompany(null);
        }}
        footer={null}
        destroyOnHidden
        styles={{
          mask: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(2, 6, 23, 0.8)' },
          body: { backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' },
          header: { backgroundColor: 'transparent', borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '16px' }
        }}
        closeIcon={<span className="text-slate-400 hover:text-white text-xl">×</span>}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditCompany} className="mt-4">
          <Form.Item 
            name="company_name" 
            label={<span className="text-slate-300">Company Name</span>} 
            rules={[{ required: true, message: 'Please enter company name' }]}
          >
            <Input placeholder="Acme Corporation" size="large" className="bg-[#1e293b] border-[#334155] text-white hover:border-blue-500 focus:border-blue-500 placeholder:text-slate-500" />
          </Form.Item>
          

          
          <div className="flex justify-end gap-3 mt-8">
            <button 
              type="button"
              onClick={() => {
                setIsEditModalVisible(false);
                editForm.resetFields();
                setEditingCompany(null);
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isEditing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20"
            >
              {isEditing ? <Spin size="small" /> : 'Save Changes'}
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
