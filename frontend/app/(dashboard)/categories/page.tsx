'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { Typography, Row, Col, Card, Space, Tag, Button, message } from 'antd';
import { DeploymentUnitOutlined, BankOutlined, CompassOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const categoriesData = [
  { key: 'deck', name: 'Deck Department', code: 'DECK', icon: <DeploymentUnitOutlined /> },
  { key: 'bulk', name: 'Bulk Carrier Specifics', code: 'BULK', icon: <BankOutlined /> },
  { key: 'engine', name: 'Engine Room', code: 'ENG', icon: <CompassOutlined /> },
];

const columns = [
  { title: 'Category Name', dataIndex: 'name', key: 'name', render: (text: string) => <Text strong style={{ color: '#fff' }}>{text}</Text> },
  { title: 'Code', dataIndex: 'code', key: 'code' },
  { title: 'Checklist Items', dataIndex: 'items', key: 'items' },
  { 
    title: 'Status', 
    dataIndex: 'status', 
    key: 'status',
    render: (status: string) => <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>{status}</Tag>
  },
  {
    title: 'Actions',
    key: 'actions',
    render: () => (
      <Space size="middle">
        <Button type="text" icon={<EditOutlined />} style={{ color: '#3b82f6' }} />
        <Button type="text" icon={<DeleteOutlined />} danger />
      </Space>
    ),
  },
];

export default function CategoriesPage() {
  const { user } = useAuth();
  const params = useParams();
  const companyId = params?.companyId as string;
  
  const activeCompanyId = companyId || user?.company_id;

  return (
    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ color: '#fff', margin: 0 }}>Inspection Matrix</Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.45)' }}>
            System-wide categories filtered for tenant: <Text code>{activeCompanyId || 'GLOBAL'}</Text>
          </Text>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {categoriesData.map((cat) => (
          <Col xs={24} md={12} lg={8} key={cat.key}>
            <Card 
              hoverable 
              style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 16 }}
              styles={{ body: { padding: 32 } }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ padding: 12, background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: 12, fontSize: 24 }}>
                  {cat.icon}
                </div>
                <div>
                  <Title level={4} style={{ color: '#fff', margin: 0 }}>{cat.name}</Title>
                  <Tag color="blue">{cat.code}</Tag>
                </div>
              </div>
              
              <Space orientation="vertical" style={{ width: '100%', borderTop: '1px solid #1f2937', paddingTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#64748b' }}>Silo ID:</Text>
                  <Text style={{ color: '#94a3b8' }}>{activeCompanyId?.slice(0, 8)}...</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#64748b' }}>Assigned Inspector:</Text>
                  <Text style={{ color: '#94a3b8' }}>{user?.name}</Text>
                </div>
              </Space>

              <Button 
                type="primary" 
                block 
                style={{ marginTop: 24, height: 44, borderRadius: 8 }}
                onClick={() => message.info(`Opening ${cat.name} form for ${activeCompanyId}`)}
              >
                Configure Checklist
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </Space>
  );
}
