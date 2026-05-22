'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Table, Button, Space, Card, Tag, Input, Row, Col, Statistic, Badge } from 'antd';
import { 
  CompassOutlined, 
  PlusOutlined, 
  SearchOutlined, 
  EyeOutlined, 
  SyncOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function VesselsPage() {
  const { user, hasRole } = useAuth();
  const params = useParams();
  const router = useRouter();
  const companyId = params?.companyId as string;
  const [vessels, setVessels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newVessel, setNewVessel] = useState({ vessel_name: '', imo_number: '', vessel_type: 'Cargo Vessel' });

  useEffect(() => {
    fetchVessels();
  }, [user]);

  const fetchVessels = async () => {
    try {
      setLoading(true);
      
      const isSuperAdmin = user?.role?.toUpperCase() === 'SUPERADMIN';
      const activeCompanyId = companyId || user?.company_id;
      
      let query = supabase.from('vessels').select('*');
      if (activeCompanyId) {
        query = query.eq('company_id', activeCompanyId);
      }

      let reportsQuery = supabase.from('reports').select('vessel_id, status');
      if (activeCompanyId) {
        reportsQuery = reportsQuery.eq('company_id', activeCompanyId);
      }

      const [{ data: vesselsData, error: vesselsError }, { data: reportsData, error: reportsError }] = await Promise.all([
        query,
        reportsQuery
      ]);

      if (vesselsError) throw vesselsError;
      if (reportsError) console.error('Error fetching reports:', reportsError);

      const finalizedVesselIds = new Set(
        reportsData
          ?.filter(r => r.status === 'FINALIZED' || r.status === 'CERTIFIED')
          .map(r => r.vessel_id)
      );

      const vesselsWithStatus = (vesselsData || []).map(v => ({
        ...v,
        isCertified: finalizedVesselIds.has(v.id)
      }));

      console.log('Vessels data fetched:', vesselsWithStatus);
      setVessels(vesselsWithStatus);
    } catch (error: any) {
      console.error('Error in fetchVessels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVessel = async (id: string, e: any) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this vessel? All associated reports may also be deleted.")) return;
    try {
      const { error } = await supabase.from('vessels').delete().eq('id', id);
      if (error) throw error;
      setVessels(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete vessel. It might have existing reports.");
    }
  };

  const columns = [
    { 
      title: 'Vessel Name', 
      key: 'vessel_name',
      render: (record: any) => {
        const name = record.vessel_name || record.vesselname || 'Unnamed Vessel';
        return (
          <Space>
            <CompassOutlined style={{ color: 'var(--accent)' }} />
            <Text strong>{name}</Text>
          </Space>
        );
      }
    },
    { 
      title: 'IMO Number', 
      key: 'imo_number',
      render: (record: any) => record.imo_number || record.imonumber || '-'
    },
    { 
      title: 'Type', 
      key: 'vessel_type',
      render: (record: any) => record.vessel_type || record.vesseltype || '-'
    },

    { 
      title: 'Status', 
      key: 'status',
      render: (record: any) => {
        if (record.isCertified) {
          return <Tag color="success">CERTIFIED</Tag>;
        }
        const status = record.status || 'Active';
        let color = 'green';
        if (status === 'Under Maintenance') color = 'orange';
        if (status === 'Inactive') color = 'red';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => {
        const name = record.vessel_name || record.vesselname || '';
        return (
          <Space size="middle">
            <Link href={`/vessels/categories?vesselId=${record.id}&vesselName=${name}`}>
              <Button type="text" icon={<EyeOutlined />} style={{ color: '#3b82f6' }} />
            </Link>
            {hasRole(['ADMIN', 'SUPERADMIN']) && (
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                style={{ color: '#ef4444' }} 
                onClick={(e) => handleDeleteVessel(record.id, e)}
              />
            )}
          </Space>
        );
      },
    },
  ];

  const filteredVessels = vessels.filter(v => {
    const name = (v.vessel_name || v.vesselname || '').toLowerCase();
    const imo = (v.imo_number || v.imonumber || '');
    return name.includes(searchText.toLowerCase()) || imo.includes(searchText);
  });

  const certifiedCount = vessels.filter(v => v.isCertified).length;
  const pendingCount = vessels.length - certifiedCount;

  return (
    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Vessel Registry</Title>
          <div className="flex items-center gap-3 mt-1">
            <Text type="secondary">Manage and monitor your fleet assets.</Text>
            <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full border border-border">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Access:</span>
              <span className={`text-[9px] font-black uppercase tracking-widest ${user?.role === 'ADMIN' ? 'text-blue-500' : 'text-amber-500'}`}>
                {user?.role || 'No Role'}
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">ID:</span>
              <span className="text-[9px] font-mono text-muted-foreground opacity-50">
                {user?.company_id?.slice(0, 8) || 'No Company'}...
              </span>
            </div>
          </div>
        </div>
        <Space>
          <Input 
            prefix={<SearchOutlined />} 
            placeholder="Search vessels..." 
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250, borderRadius: 8 }}
          />
          <Button 
            icon={<SyncOutlined spin={loading} />} 
            onClick={fetchVessels}
            size="large"
          >
            Refresh
          </Button>
          {hasRole(['STAFF', 'SUPERINTENDENT', 'ADMIN', 'SUPERADMIN']) && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              size="large"
              onClick={() => setIsModalOpen(true)}
              style={{ borderRadius: 8, height: 48, background: 'var(--accent)', borderColor: 'var(--accent)' }}
            >
              Add New Vessel
            </Button>
          )}
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <Card variant="borderless" className="bg-accent/5 border border-accent/10">
            <Statistic 
              title={<Text type="secondary">Active Fleet</Text>} 
              value={vessels.length} 
              prefix={<CompassOutlined />} 
              styles={{ content: { color: 'var(--accent)' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless" className="bg-emerald-500/5 border border-emerald-500/10">
            <Statistic 
              title={<Text type="secondary">Certified</Text>} 
              value={certifiedCount} 
              prefix={<SafetyCertificateOutlined />} 
              styles={{ content: { color: '#10b981' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless" className="bg-amber-500/5 border border-amber-500/10">
            <Statistic 
              title={<Text type="secondary">Pending Inspection</Text>} 
              value={pendingCount} 
              prefix={<Badge status="warning" />} 
              styles={{ content: { color: '#f59e0b' } }}
            />
          </Card>
        </Col>
      </Row>

      <Card variant="borderless">
        <Table 
          columns={columns} 
          dataSource={filteredVessels} 
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          rowKey="id"
          onRow={(record) => {
            return {
              onClick: (event) => {
                const target = event.target as HTMLElement;
                if (target.closest('button') || target.closest('a')) {
                  return;
                }
                const name = record.vessel_name || record.vesselname || '';
                router.push(`/vessels/categories?vesselId=${record.id}&vesselName=${encodeURIComponent(name)}`);
              },
              style: { cursor: 'pointer' }
            };
          }}
        />
      </Card>

      {/* ADD VESSEL MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center bg-background/80 backdrop-blur-xl p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-border rounded-[40px] p-10 w-full max-w-xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">Register Vessel</h2>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1 opacity-60">Add new asset to your fleet registry</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-3 hover:bg-secondary rounded-2xl transition-all"
                >
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[0.625rem] font-black uppercase text-muted-foreground ml-2 tracking-widest">Vessel Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. OCEAN STAR"
                    value={newVessel.vessel_name}
                    onChange={(e) => setNewVessel({...newVessel, vessel_name: e.target.value.toUpperCase()})}
                    className="w-full px-6 py-4 bg-secondary/50 border border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-sm transition-all placeholder:opacity-20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[0.625rem] font-black uppercase text-muted-foreground ml-2 tracking-widest">IMO Number</label>
                    <input 
                      type="text" 
                      placeholder="7-digit code"
                      value={newVessel.imo_number}
                      onChange={(e) => setNewVessel({...newVessel, imo_number: e.target.value})}
                      className="w-full px-6 py-4 bg-secondary/50 border border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-sm transition-all placeholder:opacity-20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.625rem] font-black uppercase text-muted-foreground ml-2 tracking-widest">Vessel Type</label>
                    <select 
                      value={newVessel.vessel_type}
                      onChange={(e) => setNewVessel({...newVessel, vessel_type: e.target.value})}
                      className="w-full px-6 py-4 bg-secondary/50 border border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-sm transition-all appearance-none cursor-pointer"
                    >
                      <option value="Cargo Vessel">Cargo Vessel</option>
                      <option value="Tanker">Tanker</option>
                      <option value="Bulk Carrier">Bulk Carrier</option>
                      <option value="Container Ship">Container Ship</option>
                      <option value="Tug Boat">Tug Boat</option>
                      <option value="Supply Vessel">Supply Vessel</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-secondary text-muted-foreground rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary/80 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={isSaving || !newVessel.vessel_name || !newVessel.imo_number}
                    onClick={async () => {
                      let activeCompanyId = companyId || user?.company_id;
                      
                      if (activeCompanyId) {
                        const { data: verifyCo } = await supabase.from('companies').select('id').eq('id', activeCompanyId).single();
                        if (!verifyCo) activeCompanyId = null;
                      }
                      
                      if (!activeCompanyId) {
                        // Attempt to fetch first available company to unblock user
                        const { data: cos } = await supabase.from('companies').select('id').limit(1);
                        if (cos && cos.length > 0) {
                          activeCompanyId = cos[0].id;
                        } else {
                          activeCompanyId = null;
                        }
                      }

                      setIsSaving(true);
                      console.log('Attempting to register vessel:', newVessel);
                      console.log('Active Company ID for insert:', activeCompanyId);

                      try {
                        const { data, error: insertError } = await supabase.from('vessels').insert([{
                          vessel_name: newVessel.vessel_name,
                          imo_number: newVessel.imo_number,
                          vessel_type: newVessel.vessel_type,
                          company_id: activeCompanyId
                        }]).select();

                        if (insertError) {
                          console.error('Supabase Insert Error:', insertError);
                          alert(`Database Error (${insertError.code}): ${insertError.message}\n\nHint: ${insertError.hint || 'Check if you have RLS permissions.'}`);
                          return;
                        }

                        console.log('Insert successful:', data);
                        setIsModalOpen(false);
                        setNewVessel({ vessel_name: '', imo_number: '', vessel_type: 'Cargo Vessel' });
                        await fetchVessels();
                        alert('✅ Vessel registered successfully!');
                      } catch (err: any) {
                        console.error('Unexpected Registration Exception:', err);
                        alert('Unexpected Error: ' + err.message);
                      } finally {
                        setIsSaving(false);
                      }
                    }}
                    className="flex-1 py-4 bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isSaving ? 'Registering...' : 'Register Vessel'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Space>
  );
}
