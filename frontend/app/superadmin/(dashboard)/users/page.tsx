'use client';

import React, { useEffect, useState } from 'react';
import { Typography, Table, Button, Space, Card, Tag, Avatar, Modal, Form, Input, Select, message } from 'antd';
import { UserAddOutlined, EditOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

const { Title, Text } = Typography;

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
      if ((currentUser.role as string) === 'SUPERADMIN') {
        fetchCompanies();
      }
    }
  }, [currentUser]);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase.from('companies').select('id, company_name');
      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let query = supabase.from('users').select('*');
      
      // Tenant-aware isolation: scope users to logged-in user's company
      // only bypass if they are SUPERADMIN
      if (currentUser && (currentUser.role as string) !== 'SUPERADMIN' && currentUser.company_id) {
        query = query.eq('company_id', currentUser.company_id);
      }
      
      const { data, error } = await query.order('name', { ascending: true });
        
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode: 'create' | 'edit', user: any = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    if (mode === 'edit' && user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role,
        password: user.password,
        company_id: user.company_id
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setSelectedUser(null);
  };

  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      if (modalMode === 'create') {
        const payload: any = {
          name: values.name,
          email: values.email,
          role: values.role,
          password: values.password, // Ideally hashed by backend, but storing raw for testing prototype
          company_id: values.company_id || null
        };

        // Add company isolation on user creation if current logged in user has one
        if (currentUser?.company_id) {
          payload.company_id = currentUser.company_id;
        }

        const { error } = await supabase.from('users').insert([payload]);
        if (error) throw error;
        message.success('User created successfully');
      } else {
        const updatePayload: any = {
          name: values.name,
          email: values.email,
          role: values.role,
          password: values.password
        };
        if (currentUser?.role === 'SUPERADMIN') {
          updatePayload.company_id = values.company_id || null;
        }
        const { error } = await supabase.from('users').update(updatePayload).eq('id', selectedUser.id);
        if (error) throw error;
        message.success('User updated successfully');
      }
      handleCloseModal();
      fetchUsers();
    } catch (error: any) {
      console.error('Error submitting user:', error);
      if (error.code === '23505' || error.message?.includes('duplicate key value')) {
        message.error('A user with this email address already exists. Please use a different email.');
      } else {
        message.error(`Action failed: ${error.message || 'Unknown error occurred'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentUser?.id) {
      message.error('Cannot delete your own account');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      message.error(`Delete failed: ${error.message}`);
    }
  };

  const columns = [
    { 
      title: 'User', 
      dataIndex: 'name', 
      key: 'name', 
      render: (text: string) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: 'var(--secondary)' }} />
          <Text strong>{text || 'Unknown User'}</Text>
        </Space>
      ) 
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { 
      title: 'Company', 
      dataIndex: 'company_id', 
      key: 'company',
      render: (companyId: string) => {
        const comp = companies.find(c => c.id === companyId);
        return <Text>{comp ? comp.company_name : 'Platform (Superadmin)'}</Text>;
      }
    },
    { 
      title: 'Role', 
      dataIndex: 'role', 
      key: 'role',
      render: (role: string) => {
        const colors: any = { SUPERADMIN: 'purple', ADMIN: 'blue', SUPERINTENDENT: 'cyan', STAFF: 'default' };
        return <Tag color={colors[role?.toUpperCase()] || 'default'}>{role?.toUpperCase() || 'USER'}</Tag>;
      }
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const currentStatus = status?.toUpperCase() || 'ACTIVE';
        return <Tag color={currentStatus === 'ACTIVE' ? 'green' : 'red'}>{currentStatus}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenModal('edit', record)} style={{ color: '#3b82f6' }} title="Edit User" />
          <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} style={{ color: '#ef4444' }} title="Delete User" />
        </Space>
      ),
    },
  ];

  return (
    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>User Management</Title>
          <Text type="secondary">Administer platform users and access controls.</Text>
        </div>
        <Button type="primary" icon={<UserAddOutlined />} size="large" onClick={() => handleOpenModal('create')}>
          Create User
        </Button>
      </div>

      <Card variant="borderless">
        <Table 
          columns={columns} 
          dataSource={users} 
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }} 
          rowKey="id"
        />
      </Card>

      <Modal
        title={modalMode === 'create' ? "Create New User" : "Edit User"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnHidden
        styles={{
          mask: { backdropFilter: 'blur(8px)', background: 'var(--background-alpha)' }
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Please enter name' }]}>
            <Input placeholder="John Doe" size="large" style={{ background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 8 }} />
          </Form.Item>
          <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
            <Input placeholder="user@company.com" size="large" style={{ background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 8 }} />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: modalMode === 'create', message: 'Please enter a password' }]}>
            <Input.Password placeholder="Secure password" size="large" style={{ background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: 8 }} />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please select a role' }]}>
            <Select size="large" popupMatchSelectWidth={false}>
              <Select.Option value="SUPERADMIN">Super Admin</Select.Option>
              <Select.Option value="ADMIN">Admin</Select.Option>
              <Select.Option value="SUPERINTENDENT">Superintendent</Select.Option>
              <Select.Option value="STAFF">Staff</Select.Option>
            </Select>
          </Form.Item>
          {currentUser?.role === 'SUPERADMIN' && (
            <Form.Item name="company_id" label="Company">
              <Select placeholder="Select Company (Optional for Superadmin)" size="large" allowClear popupMatchSelectWidth={false}>
                {companies.map(c => (
                  <Select.Option key={c.id} value={c.id}>{c.company_name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <div className="flex justify-end gap-2 mt-8">
            <Button onClick={handleCloseModal} size="large" style={{ borderRadius: 8 }}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting} size="large" style={{ borderRadius: 8 }}>
              {modalMode === 'create' ? 'Create User' : 'Save Changes'}
            </Button>
          </div>
        </Form>
      </Modal>
    </Space>
  );
}
