'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Table, Button, Space, Card, Tag, Input, Row, Col, Progress } from 'antd';
import { 
  FileTextOutlined, 
  PlusOutlined, 
  SearchOutlined, 
  EyeOutlined, 
  CloudDownloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { supabase } from '@/lib/supabase';
import { getTableData } from '@/services/api';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, useParams } from 'next/navigation';

const { Title, Text } = Typography;

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

export default function ReportsPage() {
  const { user, hasRole } = useAuth();
  const router = useRouter();
  const params = useParams();
  const companyId = params?.companyId as string;
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchReports();
  }, [user]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      let query = supabase.from('reports').select('*').eq('category_name', 'OVERALL');
      
      const isSuperAdmin = user?.role?.toUpperCase() === 'SUPERADMIN';
      const activeCompanyId = companyId || user?.company_id;
      
      if (activeCompanyId) {
        query = query.eq('company_id', activeCompanyId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching reports:', error);
      }
      const validReports = data || [];
      
      // Fetch vessels to map their names
      const { data: vesselsData, error: vesselsError } = await supabase.from('vessels').select('id, vessel_name');
      console.log('fetchReports: Supabase vesselsData:', vesselsData, 'error:', vesselsError);
      
      const vesselMap: { [key: string]: string } = {};
      if (vesselsData) {
        vesselsData.forEach((v: any) => {
          vesselMap[v.id] = v.vessel_name || 'Unnamed Vessel';
        });
      }

      const reportsWithCompletion = await Promise.all(validReports.map(async (report: any) => {
          let percent = 0;
          let hasNotSeen = false;
          const vesselName = vesselMap[report.vessel_id] || 'Unknown Vessel';
          let categoriesSubmitted = 0;
          let totalCategories = 51;
          try {
             if (report.category_name === 'OVERALL') {
                 // Query each category to see if there are items for this report_id
                 await Promise.all(CATEGORIES.map(async (cat) => {
                   try {
                      const { data, error } = await supabase
                        .from(cat)
                        .select('ans')
                        .eq('report_id', report.id);
                     if (!error && data && data.length > 0) {
                       const hasEdited = data.some((r: any) => r.ans && r.ans.trim() !== '' && r.ans !== 'EMPTY');
                       if (hasEdited) {
                         categoriesSubmitted += 1;
                       }
                     }
                   } catch (e) {
                   }
                 }));
                 percent = Math.round((categoriesSubmitted / totalCategories) * 100);
             } else {
                 // Individual category report
                 totalCategories = 1;
                 const cat = report.category_name;
                 if (cat) {
                   try {
                      const { data, error } = await supabase
                        .from(cat)
                        .select('ans')
                        .eq('report_id', report.id);
                      if (!error && data && data.length > 0) {
                       const hasEdited = data.some((r: any) => r.ans && r.ans.trim() !== '' && r.ans !== 'EMPTY');
                       if (hasEdited) {
                         categoriesSubmitted = 1;
                       }
                      }
                   } catch (e) {}
                 }
                 percent = categoriesSubmitted > 0 ? 100 : 0;
             }
          } catch (e) {
             console.error('Error calculating percentage for report', report.id, e);
          }
          return { 
            ...report, 
            completion_percentage: percent,
            categories_submitted: categoriesSubmitted,
            total_categories: totalCategories,
            vessel_name: vesselName 
          };
      }));

      setReports(reportsWithCompletion);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (id: string, e: any) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      const { error } = await supabase.from('reports').delete().eq('id', id);
      if (error) throw error;
      setReports(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete report.");
    }
  };

  const columns = [
    { 
      title: 'Report ID', 
      dataIndex: 'id', 
      key: 'id',
      render: (id: string) => <Text code type="secondary">{id.slice(0, 8)}</Text>
    },
    { 
      title: 'Vessel Name', 
      key: 'vessel',
      render: (text: any, record: any) => {
        const row = record || text || {};
        return (
          <Space orientation="vertical" size={0}>
            <Text strong>{row.vessel_name || 'Unknown Vessel'}</Text>
            <Text type="secondary" style={{ fontSize: '10px' }}>ID: {row.vessel_id?.slice(0, 8) || 'N/A'}</Text>
          </Space>
        );
      }
    },

    { title: 'Date', dataIndex: 'created_at', key: 'created_at', render: (date: string) => new Date(date).toLocaleDateString() },
    { 
      title: 'Completion', 
      key: 'completion',
      render: (text: any, record: any) => {
        const row = record || text || {};
        const submitted = row.categories_submitted || 0;
        const total = row.total_categories || 51;
        return <Progress percent={row.completion_percentage || 0} format={() => `${submitted}/${total} submitted`} size="small" strokeColor="#10b981" />;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        hasRole(['ADMIN', 'SUPERADMIN']) ? (
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            style={{ color: '#ef4444' }} 
            onClick={(e) => handleDeleteReport(record.id, e)}
          />
        ) : null
      ),
    },
  ];

  const filteredReports = reports.filter(report => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    const idMatch = report.id?.toLowerCase().includes(searchLower);
    const categoryMatch = report.category_name?.toLowerCase().includes(searchLower);
    const vesselIdMatch = report.vessel_id?.toLowerCase().includes(searchLower);
    const statusMatch = report.status?.toLowerCase().includes(searchLower);
    
    return idMatch || categoryMatch || vesselIdMatch || statusMatch;
  });

  return (
    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Inspection Reports</Title>
          <div className="flex items-center gap-2">
            <Text type="secondary">Access and audit historical inspection data.</Text>
            <Tag color="cyan" style={{ fontSize: '10px' }}>Total: {reports.length}</Tag>
          </div>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchReports}>Refresh</Button>
          <Input 
            prefix={<SearchOutlined />} 
            placeholder="Search reports..." 
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250, borderRadius: 8 }}
          />
        </Space>
      </div>

      <Card variant="borderless">
        <Table 
          columns={columns} 
          dataSource={filteredReports} 
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          rowKey="id"
          onRow={(record) => {
            return {
              onClick: (event: any) => {
                const target = event.target as HTMLElement;
                if (target.closest('button') || target.closest('a')) {
                  return;
                }
                router.push(`/reports/${record.id}`);
              },
              style: { cursor: 'pointer' }
            };
          }}
        />
      </Card>
    </Space>
  );
}
