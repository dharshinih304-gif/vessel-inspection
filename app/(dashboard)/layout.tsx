'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Badge, Space, Typography, ConfigProvider, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  CompassOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  GlobalOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase, resolveCompany } from '@/lib/supabase';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  
  const companyId = params?.companyId as string;
  const [activeCompany, setActiveCompany] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchCompanyAndVerify = async () => {
      let resolvedId = companyId;
      if (companyId) {
        const resolved = await resolveCompany(companyId);
        if (resolved) {
          resolvedId = resolved.id;
          setActiveCompany(resolved);
        }
      } else if (user?.company_id) {
        const resolved = await resolveCompany(user.company_id);
        if (resolved) {
          setActiveCompany(resolved);
        }
      }

      if (!isLoading) {
        if (!user) {
          router.push('/login');
          return;
        }

        // Enforce strict multi-tenant isolation:
        const isSuperAdmin = user.role?.toUpperCase() === 'SUPERADMIN';
        if (isSuperAdmin && !companyId && !user.company_id) {
          window.location.href = '/superadmin/companies';
          return;
        }
        if (!isSuperAdmin && companyId && resolvedId && user.company_id !== resolvedId) {
          if (user.company_id) {
            // Try to redirect to user's company using name/slug
            const { data: userComp } = await supabase
              .from('companies')
              .select('company_name')
              .eq('id', user.company_id)
              .single();
            const dest = userComp?.company_name ? userComp.company_name.toLowerCase() : user.company_id;
            router.push(`/company/${dest}/dashboard`);
          } else {
            router.push('/login');
          }
          return;
        }
      }
    };

    const fetchNotifications = async () => {
      if (user) {
        let query = supabase
          .from('reports')
          .select('id, title, created_at')
          .eq('status', 'PENDING')
          .order('created_at', { ascending: false })
          .limit(5);
        if (user.company_id) query = query.eq('company_id', user.company_id);
        const { data } = await query;
        if (data) {
          const validNotifs = data.filter(n => n.title && n.title !== '');
          setNotifications(validNotifs);
        }
      }
    };

    fetchCompanyAndVerify();
    fetchNotifications();
  }, [user, isLoading, router, companyId]);

  if (isLoading || !user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#020617' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loader" />
          <Text style={{ color: 'rgba(255, 255, 255, 0.45)', marginTop: 16, display: 'block' }}>Initializing Portal...</Text>
        </div>
      </div>
    );
  }

  const companySlug = activeCompany?.company_name 
    ? activeCompany.company_name.toLowerCase().replace(/\s+/g, '-') 
    : (companyId || user?.company_id);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: (
        <Link href={companySlug ? `/company/${companySlug}/dashboard` : '/dashboard'}>
          Dashboard
        </Link>
      ),
    },
    {
      key: 'vessels',
      icon: <CompassOutlined />,
      label: <Link href="/vessels">Vessels</Link>,
    },
    {
      key: 'reports',
      icon: <FileTextOutlined />,
      label: <Link href="/reports">Reports</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link href="/settings">Settings</Link>,
    },
  ];

  const handleUserMenuClick = (e: any) => {
    if (e.key === 'profile') {
      router.push('/users');
    } else if (e.key === 'settings') {
      router.push('/settings');
    } else if (e.key === 'logout') {
      logout();
    }
  };

  const userMenuItems = [
    { key: 'profile', label: 'My Profile', icon: <UserOutlined /> },
    { key: 'settings', label: 'Settings', icon: <SettingOutlined /> },
    { type: 'divider' as const },
    { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, danger: true },
  ];

  const handleNotificationClick = (e: any) => {
    if (e.key === 'all') {
      router.push('/reports');
    } else if (e.key !== 'empty') {
      router.push(`/reports/${e.key}`);
    }
  };

  const notificationItems = notifications.length > 0 ? [
    ...notifications.map(notif => ({
      key: notif.id,
      label: (
        <div style={{ padding: '4px 0', maxWidth: '250px' }}>
          <Text strong style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {notif.title || 'Technical Audit Report'}
          </Text>
          <Text type="secondary" style={{ fontSize: '10px' }}>
            Awaiting Review • {new Date(notif.created_at).toLocaleDateString()}
          </Text>
        </div>
      )
    })),
    { type: 'divider' as const },
    { key: 'all', label: <div style={{ textAlign: 'center', width: '100%' }}><Text type="secondary">View All Reports</Text></div> }
  ] : [
    { key: 'empty', label: 'No new notifications', disabled: true }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        width={260}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          boxShadow: '4px 0 24px rgba(0,0,0,0.5)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          background: '#020617'
        }}
      >
        <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', marginBottom: 16 }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            background: '#3b82f6', 
            borderRadius: 8, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginRight: collapsed ? 0 : 12 
          }}>
            <CompassOutlined style={{ color: '#fff', fontSize: 18 }} />
          </div>
          {!collapsed && (
            <Title level={4} style={{ color: '#fff', margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>
              {activeCompany?.company_name || 'Inspection System'}
            </Title>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname.split('/')[1] || 'dashboard']}
          items={menuItems}
          style={{ background: 'transparent', border: 'none' }}
        />

        <div style={{ padding: '24px 16px', marginTop: 'auto' }}>
          <Button 
            block 
            icon={<LogoutOutlined style={{ color: '#ef4444' }} />}
            onClick={logout}
            style={{ 
              background: 'transparent', 
              border: '1px solid #ef4444', 
              color: '#ef4444', 
              height: 40, 
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'center',
              padding: collapsed ? 0 : '4px 15px'
            }}
          >
            {!collapsed && 'Logout'}
          </Button>
        </div>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: 'all 0.2s', background: 'transparent' }}>
        <Header style={{ 
          padding: '0 24px', 
          background: 'rgba(2, 6, 23, 0.8)', 
          backdropFilter: 'blur(10px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 40, height: 40, color: '#fff' }}
            />
            <div>

              <Text strong style={{ color: '#fff', fontSize: 14 }}>
                {pathname.split('/').pop()?.toUpperCase() || 'DASHBOARD'}
              </Text>
            </div>
          </div>

          <Space size={24}>
            <Dropdown menu={{ items: notificationItems, onClick: handleNotificationClick }} placement="bottomRight" trigger={['click']} arrow>
              <Badge count={notifications.length} size="small" offset={[-2, 2]} style={{ cursor: 'pointer' }}>
                <Button type="text" icon={<BellOutlined />} style={{ color: '#fff', fontSize: 20 }} />
              </Badge>
            </Dropdown>

            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight" trigger={['click']} arrow>
              <Space style={{ cursor: 'pointer' }}>
                <div style={{ textAlign: 'right', display: 'block' }}>
                  <Text strong style={{ color: '#fff', display: 'block', lineHeight: 1 }}>{user.name}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{user.role}</Text>
                </div>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#3b82f6' }} />
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ padding: '24px', minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
      
      <style jsx global>{`
        .loader {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(59, 130, 246, 0.2);
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
}
