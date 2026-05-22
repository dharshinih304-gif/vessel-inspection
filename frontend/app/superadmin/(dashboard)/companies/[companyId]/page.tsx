'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { Users, Building, Mail, ShieldAlert, ArrowLeft, Plus, Trash2, Edit, MapPin, Map, Globe, Calendar } from 'lucide-react';
import { message, Spin, Modal, Form, Input, Select, Popconfirm } from 'antd';

interface CompanyDetail {
  id: string;
  company_name: string;
  description?: string;
  created_at?: string;
  address?: string;
  location?: string;
  region?: string;
}

interface UserDetail {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function CompanyDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [form] = Form.useForm();
  
  const companyId = params?.companyId as string;
  
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [companyUsers, setCompanyUsers] = useState<UserDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

  // Add User Modal State
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);

  // Edit User Modal State
  const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDetail | null>(null);
  const [editForm] = Form.useForm();

  // Edit Company Details Modal State
  const [isEditCompanyModalVisible, setIsEditCompanyModalVisible] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [editCompanyForm] = Form.useForm();



  const fetchCompanyData = async () => {
    if (!companyId) return;
    
    try {
      setLoading(true);
      // Fetch company details
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id, company_name, created_at, address, location, region')
        .eq('id', companyId)
        .single();
        
      if (companyError) throw companyError;
      setCompany(companyData);

      // Fetch company users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name, email, role')
        .eq('company_id', companyId)
        .order('name');
        
      if (usersError) throw usersError;
      setCompanyUsers(usersData || []);
      
    } catch (error: any) {
      console.error('Error fetching company data:', error.message);
      message.error('Failed to load company details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role?.toUpperCase() === 'SUPERADMIN') {
      fetchCompanyData();
    }
  }, [user, companyId]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setUpdatingRoleId(userId);
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) throw error;
      
      message.success('Role updated successfully');
      
      // Update local state to reflect change without full reload
      setCompanyUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } catch (error: any) {
      console.error('Error updating role:', error.message);
      message.error('Failed to update role');
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
        
      if (error) throw error;
      
      message.success('User removed successfully');
      setCompanyUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error: any) {
      console.error('Error removing user:', error.message);
      message.error('Failed to remove user');
    }
  };

  const handleAddUser = async (values: any) => {
    try {
      setIsAddingUser(true);
      const payload = {
        name: values.name,
        email: values.email.toLowerCase(),
        role: values.role,
        password: values.password, // Prototype raw storage
        company_id: companyId
      };

      const { error } = await supabase.from('users').insert([payload]);
      
      if (error) {
        if (error.code === '23505' || error.message?.includes('duplicate key value')) {
          throw new Error('A user with this email address already exists.');
        }
        throw error;
      }
      
      message.success('User added successfully');
      setIsAddUserModalVisible(false);
      form.resetFields();
      
      // Refresh the data silently to get the new user with their new DB ID
      const { data: usersData } = await supabase
        .from('users')
        .select('id, name, email, role')
        .eq('company_id', companyId)
        .order('name');
        
      if (usersData) {
        setCompanyUsers(usersData);
      }
      
    } catch (error: any) {
      console.error('Error adding user:', error.message);
      message.error(error.message || 'Failed to add user');
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleEditUser = async (values: any) => {
    if (!editingUser) return;
    try {
      setIsEditingUser(true);
      const payload: any = {
        name: values.name,
        email: values.email.toLowerCase(),
        role: values.role
      };
      
      if (values.password) {
        payload.password = values.password;
      }

      const { error } = await supabase
        .from('users')
        .update(payload)
        .eq('id', editingUser.id);
        
      if (error) {
        if (error.code === '23505' || error.message?.includes('duplicate key value')) {
          throw new Error('A user with this email address already exists.');
        }
        throw error;
      }
      
      message.success('User updated successfully');
      setIsEditUserModalVisible(false);
      editForm.resetFields();
      setEditingUser(null);
      
      // Update local state to reflect change without full reload
      setCompanyUsers(prev => prev.map(u => 
        u.id === editingUser.id 
          ? { ...u, name: values.name, email: values.email, role: values.role } 
          : u
      ));
    } catch (error: any) {
      console.error('Error editing user:', error.message);
      message.error(error.message || 'Failed to update user');
    } finally {
      setIsEditingUser(false);
    }
  };

  const showEditCompanyModal = () => {
    if (!company) return;
    editCompanyForm.setFieldsValue({
      company_name: company.company_name,
      address: company.address || '',
      location: company.location || '',
      region: company.region || '',
    });
    setIsEditCompanyModalVisible(true);
  };

  const handleEditCompany = async () => {
    try {
      const values = await editCompanyForm.validateFields();
      setIsEditingCompany(true);

      const { error } = await supabase
        .from('companies')
        .update({
          company_name: values.company_name,
          address: values.address || '',
          location: values.location || '',
          region: values.region || '',
        })
        .eq('id', companyId);

      if (error) throw error;

      message.success('Company details updated successfully');
      setIsEditCompanyModalVisible(false);
      
      // Update local state to reflect change without full reload
      setCompany(prev => prev ? {
        ...prev,
        company_name: values.company_name,
        address: values.address || '',
        location: values.location || '',
        region: values.region || '',
      } : null);
      
    } catch (error: any) {
      console.error('Error updating company:', error.message);
      message.error(error.message || 'Failed to update company');
    } finally {
      setIsEditingCompany(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-xl font-bold text-slate-300 mb-4">Company Not Found</h2>
        <button 
          onClick={() => router.push('/superadmin/companies')}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Companies
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full pt-8 pb-12">
      {/* Back button */}
      <button 
        onClick={() => router.push('/superadmin/companies')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Companies
      </button>

      {/* Main Content Card */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#0f172a] p-8 border-b border-slate-800">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                <Building className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">{company.company_name}</h2>
                <p className="text-slate-400 text-base mt-1">
                  {company.description || 'No description provided.'}
                </p>
              </div>
            </div>

            <button
              onClick={showEditCompanyModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-600/20 hover:text-blue-300 hover:border-blue-500/50 transition-all font-semibold text-sm shadow-sm"
            >
              <Edit className="w-4 h-4" />
              Edit Details
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-[#1e293b]/40 backdrop-blur-sm px-5 py-4 rounded-xl border border-slate-800/80 flex flex-col justify-between hover:border-blue-500/30 transition-all hover:bg-[#1e293b]/60">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Company ID</p>
                <p className="text-slate-300 text-sm font-mono truncate selection:bg-blue-500/30" title={company.id}>
                  {company.id}
                </p>
              </div>
            </div>

            <div className="bg-[#1e293b]/40 backdrop-blur-sm px-5 py-4 rounded-xl border border-slate-800/80 flex items-center gap-4 hover:border-blue-500/30 transition-all hover:bg-[#1e293b]/60">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Created At</p>
                <p className="text-slate-200 text-sm font-semibold">
                  {company.created_at ? new Date(company.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown'}
                </p>
              </div>
            </div>

            {company.location && (
              <div className="bg-[#1e293b]/40 backdrop-blur-sm px-5 py-4 rounded-xl border border-slate-800/80 flex items-center gap-4 hover:border-blue-500/30 transition-all hover:bg-[#1e293b]/60">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Location</p>
                  <p className="text-slate-200 text-sm font-semibold">{company.location}</p>
                </div>
              </div>
            )}

            {company.region && (
              <div className="bg-[#1e293b]/40 backdrop-blur-sm px-5 py-4 rounded-xl border border-slate-800/80 flex items-center gap-4 hover:border-blue-500/30 transition-all hover:bg-[#1e293b]/60">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Region</p>
                  <p className="text-slate-200 text-sm font-semibold">{company.region}</p>
                </div>
              </div>
            )}

            {company.address && (
              <div className="bg-[#1e293b]/40 backdrop-blur-sm px-5 py-4 rounded-xl border border-slate-800/80 flex items-start gap-4 md:col-span-2 hover:border-blue-500/30 transition-all hover:bg-[#1e293b]/60">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Office Address</p>
                  <p className="text-slate-200 text-sm leading-relaxed font-semibold">{company.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Users List */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-slate-400" />
              <h3 className="text-xl font-semibold text-white">Authorized Users</h3>
            </div>
            <button 
              onClick={() => setIsAddUserModalVisible(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add User
            </button>
          </div>
          
          <div className="bg-[#0f172a] rounded-xl border border-slate-800 overflow-hidden">
            <div className="grid grid-cols-12 px-6 py-4 border-b border-slate-800 bg-[#1e293b]/30">
              <div className="col-span-4 text-xs font-bold text-slate-500 uppercase tracking-widest">NAME</div>
              <div className="col-span-4 text-xs font-bold text-slate-500 uppercase tracking-widest">EMAIL</div>
              <div className="col-span-3 text-xs font-bold text-slate-500 uppercase tracking-widest">ROLE</div>
              <div className="col-span-1 text-xs font-bold text-slate-500 uppercase tracking-widest text-right pr-2">ACTION</div>
            </div>

            {companyUsers.length > 0 ? (
              <div className="divide-y divide-slate-800">
                {companyUsers.map(u => (
                  <div key={u.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-800/30 transition-colors">
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm text-white font-bold">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-200 truncate">{u.name}</span>
                    </div>
                    <div className="col-span-4 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span className="text-sm text-slate-400 truncate pr-2">{u.email}</span>
                    </div>
                    <div className="col-span-3 flex items-center">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={updatingRoleId === u.id}
                        className={`bg-[#1e293b] border ${
                          u.role === 'ADMIN' ? 'border-purple-500/30 text-purple-400' : 
                          u.role === 'SUPERINTENDENT' ? 'border-amber-500/30 text-amber-400' :
                          'border-blue-500/30 text-blue-400'
                        } rounded-md px-3 py-1.5 text-xs font-medium outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer disabled:opacity-50 transition-colors w-[140px]`}
                      >
                        <option value="STAFF">STAFF</option>
                        <option value="SUPERINTENDENT">SUPERINTENDENT</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      {updatingRoleId === u.id && (
                        <Spin size="small" className="ml-3" />
                      )}
                    </div>
                    <div className="col-span-1 flex items-center justify-end gap-2 pr-2">
                      <button 
                        onClick={() => {
                          setEditingUser(u);
                          editForm.setFieldsValue({
                            name: u.name,
                            email: u.email,
                            role: u.role,
                            password: ''
                          });
                          setIsEditUserModalVisible(true);
                        }}
                        className="text-slate-500 hover:text-blue-400 p-1.5 rounded-lg hover:bg-blue-500/10 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <Popconfirm
                        title={<span className="text-white">Remove user?</span>}
                        description={<span className="text-slate-300">Are you sure you want to completely remove this user from the company?</span>}
                        onConfirm={() => handleRemoveUser(u.id)}
                        okText="Remove"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                        placement="topRight"
                        styles={{ root: { backgroundColor: '#1e293b', border: '1px solid #334155' } }}
                      >
                        <button className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Popconfirm>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                <Users className="w-10 h-10 text-slate-600 mb-3 opacity-50" />
                No users have been assigned to this company yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        title={<span className="text-white">Add User to {company.company_name}</span>}
        open={isAddUserModalVisible}
        onCancel={() => {
          setIsAddUserModalVisible(false);
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
        <Form form={form} layout="vertical" onFinish={handleAddUser} className="mt-4">
          <Form.Item name="name" label={<span className="text-slate-300">Full Name</span>} rules={[{ required: true, message: 'Please enter name' }]}>
            <Input placeholder="John Doe" size="large" className="bg-[#1e293b] border-[#334155] text-white hover:border-blue-500 focus:border-blue-500 placeholder:text-slate-500" />
          </Form.Item>
          
          <Form.Item name="email" label={<span className="text-slate-300">Email Address</span>} rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
            <Input placeholder="user@company.com" size="large" className="bg-[#1e293b] border-[#334155] text-white hover:border-blue-500 focus:border-blue-500 placeholder:text-slate-500" />
          </Form.Item>
          
          <Form.Item name="password" label={<span className="text-slate-300">Password</span>} rules={[{ required: true, message: 'Please enter a password' }]}>
            <Input.Password placeholder="Secure password" size="large" className="bg-[#1e293b] border-[#334155] text-white hover:border-blue-500 focus:border-blue-500 placeholder:text-slate-500" />
          </Form.Item>
          
          <Form.Item name="role" label={<span className="text-slate-300">Role</span>} rules={[{ required: true, message: 'Please select a role' }]}>
            <Select 
              size="large" 
              placeholder="Select a role"
              className="custom-dark-select"
              popupMatchSelectWidth={false}
            >
              <Select.Option value="STAFF">STAFF</Select.Option>
              <Select.Option value="SUPERINTENDENT">SUPERINTENDENT</Select.Option>
              <Select.Option value="ADMIN">ADMIN</Select.Option>
            </Select>
          </Form.Item>
          
          <div className="flex justify-end gap-3 mt-8">
            <button 
              type="button"
              onClick={() => {
                setIsAddUserModalVisible(false);
                form.resetFields();
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isAddingUser}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20"
            >
              {isAddingUser ? <Spin size="small" /> : 'Create User'}
            </button>
          </div>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title={<span className="text-white">Edit User: {editingUser?.name}</span>}
        open={isEditUserModalVisible}
        onCancel={() => {
          setIsEditUserModalVisible(false);
          editForm.resetFields();
          setEditingUser(null);
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
        <Form form={editForm} layout="vertical" onFinish={handleEditUser} className="mt-4">
          <Form.Item name="name" label={<span className="text-slate-300">Full Name</span>} rules={[{ required: true, message: 'Please enter name' }]}>
            <Input placeholder="John Doe" size="large" className="bg-[#1e293b] border-[#334155] text-white hover:border-blue-500 focus:border-blue-500 placeholder:text-slate-500" />
          </Form.Item>
          
          <Form.Item name="email" label={<span className="text-slate-300">Email Address</span>} rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
            <Input placeholder="user@company.com" size="large" className="bg-[#1e293b] border-[#334155] text-white hover:border-blue-500 focus:border-blue-500 placeholder:text-slate-500" />
          </Form.Item>
          
          <Form.Item name="password" label={<span className="text-slate-300">Password (leave blank to keep unchanged)</span>}>
            <Input.Password placeholder="Enter new password (optional)" size="large" className="bg-[#1e293b] border-[#334155] text-white hover:border-blue-500 focus:border-blue-500 placeholder:text-slate-500" />
          </Form.Item>
          
          <Form.Item name="role" label={<span className="text-slate-300">Role</span>} rules={[{ required: true, message: 'Please select a role' }]}>
            <Select 
              size="large" 
              placeholder="Select a role"
              className="custom-dark-select"
              popupMatchSelectWidth={false}
            >
              <Select.Option value="STAFF">STAFF</Select.Option>
              <Select.Option value="SUPERINTENDENT">SUPERINTENDENT</Select.Option>
              <Select.Option value="ADMIN">ADMIN</Select.Option>
            </Select>
          </Form.Item>
          
          <div className="flex justify-end gap-3 mt-8">
            <button 
              type="button"
              onClick={() => {
                setIsEditUserModalVisible(false);
                editForm.resetFields();
                setEditingUser(null);
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isEditingUser}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20"
            >
              {isEditingUser ? <Spin size="small" /> : 'Save Changes'}
            </button>
          </div>
        </Form>
      </Modal>

      {/* Edit Company Details Modal */}
      <Modal
        title={<span className="text-white">Edit Company Details</span>}
        open={isEditCompanyModalVisible}
        onCancel={() => {
          setIsEditCompanyModalVisible(false);
          editCompanyForm.resetFields();
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
        <Form form={editCompanyForm} layout="vertical" onFinish={handleEditCompany} className="mt-4">
          <Form.Item 
            name="company_name" 
            label={<span className="text-slate-300">Company Name</span>} 
            rules={[{ required: true, message: 'Please enter company name' }]}
          >
            <Input placeholder="Company Name" size="large" className="bg-[#1e293b] border-[#334155] text-white hover:border-blue-500 focus:border-blue-500 placeholder:text-slate-500" />
          </Form.Item>
          

          
          <Form.Item 
            name="location" 
            label={<span className="text-slate-300">Location</span>}
          >
            <Input placeholder="e.g. Chennai" size="large" className="bg-[#1e293b] border-[#334155] text-white hover:border-blue-500 focus:border-blue-500 placeholder:text-slate-500" />
          </Form.Item>
          
          <Form.Item 
            name="region" 
            label={<span className="text-slate-300">Region</span>}
          >
            <Input placeholder="e.g. South India" size="large" className="bg-[#1e293b] border-[#334155] text-white hover:border-blue-500 focus:border-blue-500 placeholder:text-slate-500" />
          </Form.Item>
          
          <Form.Item 
            name="address" 
            label={<span className="text-slate-300">Office Address</span>}
          >
            <Input.TextArea placeholder="e.g. Chennai Port Road" rows={2} size="large" className="bg-[#1e293b] border-[#334155] text-white hover:border-blue-500 focus:border-blue-500 placeholder:text-slate-500" />
          </Form.Item>
          
          <div className="flex justify-end gap-3 mt-8">
            <button 
              type="button"
              onClick={() => {
                setIsEditCompanyModalVisible(false);
                editCompanyForm.resetFields();
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isEditingCompany}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20"
            >
              {isEditingCompany ? <Spin size="small" /> : 'Save Changes'}
            </button>
          </div>
        </Form>
      </Modal>

      <style jsx global>{`
        .custom-dark-select .ant-select-selector {
          background-color: #1e293b !important;
          border-color: #334155 !important;
          color: white !important;
        }
        .custom-dark-select:hover .ant-select-selector {
          border-color: #3b82f6 !important;
        }
        .custom-dark-select .ant-select-arrow {
          color: #94a3b8 !important;
        }
        .custom-dark-select .ant-select-selection-placeholder {
          color: #64748b !important;
        }
        .ant-select-dropdown .ant-select-item-option {
          color: #cbd5e1;
        }
        .ant-select-dropdown .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
          background-color: #334155 !important;
          color: white;
        }
        .ant-select-dropdown .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
          background-color: #2563eb !important;
          color: white;
        }
      `}</style>
    </div>
  );
}
