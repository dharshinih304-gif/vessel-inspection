'use client';

import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Statistic, Space, Spin, List, Tag, Progress } from 'antd';
import { 
  CompassOutlined, 
  SafetyCertificateOutlined, 
  AlertOutlined, 
  FileDoneOutlined 
} from '@ant-design/icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { supabase, resolveCompany } from '@/lib/supabase';
import { getTableData } from '@/services/api';
import { useAuth } from '@/hooks/use-auth';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const { Title: AntTitle, Text } = Typography;

export default function DashboardView({ companyId }: { companyId?: string }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVessels: 0,
    totalReports: 0,
    pendingReports: 0,
    finalizedReports: 0
  });
  
  const [statusData, setStatusData] = useState<{labels: string[], data: number[]}>({ labels: [], data: [] });
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [pendingModules, setPendingModules] = useState<string[]>([]);
  const [finalizedModules, setFinalizedModules] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let resolvedId = companyId || user?.company_id;
        if (companyId) {
          const resolved = await resolveCompany(companyId);
          if (resolved) {
            resolvedId = resolved.id;
          }
        }

        // Fetch Reports
        let reportsQuery = supabase.from('reports').select('*');
        if (resolvedId) {
          reportsQuery = reportsQuery.eq('company_id', resolvedId);
        }
        const { data: reports } = await reportsQuery;

        // Fetch Vessels count
        let vesselsQuery = supabase.from('vessels').select('id', { count: 'exact' });
        if (resolvedId) {
          vesselsQuery = vesselsQuery.eq('company_id', resolvedId);
        }
        const { count: vesselsCount } = await vesselsQuery;

        const allReports = reports || [];
        
        // Use DB status to determine if finalized instead of making N database queries to avoid slow response times
        const reportsWithStatus = allReports.map((report) => {
            const dbStatus = report.status?.toUpperCase();
            const isFinalized = dbStatus === 'FINALIZED' || dbStatus === 'APPROVED';
            return { ...report, dynamicStatus: isFinalized ? 'FINALIZED' : 'PENDING', completionRate: isFinalized ? 100 : 0 };
        });
        
        // Calculate Stats
        let finalPending = reportsWithStatus.filter(r => r.dynamicStatus === 'PENDING');
        let finalFinalized = reportsWithStatus.filter(r => r.dynamicStatus === 'FINALIZED');

        setStats({
          totalVessels: vesselsCount || 0,
          totalReports: finalPending.length + finalFinalized.length,
          pendingReports: finalPending.length,
          finalizedReports: finalFinalized.length
        });
        
        setRecentReports(
          [...reportsWithStatus].sort((a, b) => {
            const dateA = new Date(a.created_at || a.date).getTime() || 0;
            const dateB = new Date(b.created_at || b.date).getTime() || 0;
            return dateB - dateA;
          }).slice(0, 5)
        );

        // Store module names
        setPendingModules(Array.from(new Set(finalPending.map(r => r.category_name || 'UNKNOWN'))));
        setFinalizedModules(Array.from(new Set(finalFinalized.map(r => r.category_name || 'UNKNOWN'))));

        // Prepare Status Chart Data
        setStatusData({
          labels: ['Pending', 'Finalized'],
          data: [finalPending.length, finalFinalized.length]
        });


      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId, user]);

  const statusChartData = {
    labels: statusData.labels,
    datasets: [
      {
        data: statusData.data,
        backgroundColor: [
          'rgba(245, 158, 11, 0.8)', // Pending - Orange
          'rgba(16, 185, 129, 0.8)'  // Finalized - Green
        ],
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    ],
  };


  const commonChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8' }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      }
    }
  };

  const barChartOptions = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#64748b', stepSize: 1 },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' }
      }
    }
  };

  const cards = [
    { 
      title: 'Total Vessels', 
      value: stats.totalVessels, 
      icon: <CompassOutlined />, 
      color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      shadow: 'rgba(59, 130, 246, 0.3)'
    },
    { 
      title: 'Total Reports', 
      value: stats.totalReports, 
      icon: <FileDoneOutlined />, 
      color: 'linear-gradient(135deg, #a855f7, #7e22ce)',
      shadow: 'rgba(168, 85, 247, 0.3)'
    },
    { 
      title: 'Finalized', 
      value: stats.finalizedReports, 
      icon: <SafetyCertificateOutlined />, 
      color: 'linear-gradient(135deg, #10b981, #059669)',
      shadow: 'rgba(16, 185, 129, 0.3)'
    },
    { 
      title: 'Pending Action', 
      value: stats.pendingReports, 
      icon: <AlertOutlined />, 
      color: 'linear-gradient(135deg, #f59e0b, #d97706)',
      shadow: 'rgba(245, 158, 11, 0.3)'
    }
  ];


  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard-content" style={{ padding: '32px 0', height: '100%' }}>
      <Space orientation="vertical" size={32} style={{ width: '100%' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <AntTitle level={2} style={{ margin: 0, fontWeight: 700 }}>
              {companyId ? 'Company Dashboard' : 'Global Operations'}
            </AntTitle>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Real-time visualization of fleet inspection reports and status.
            </Text>
          </div>
        </div>

        {/* 4 Colorful Cards */}
        <Row gutter={[24, 24]}>
          {cards.map((card, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  variant="borderless" 
                  style={{ 
                    background: card.color,
                    borderRadius: 20,
                    boxShadow: `0 10px 25px ${card.shadow}`,
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.2, transform: 'scale(2.5)' }}>
                    {card.icon}
                  </div>
                  <Statistic 
                    title={<Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{card.title}</Text>}
                    value={card.value}
                    styles={{ content: { color: '#fff', fontSize: 36, fontWeight: 800, marginTop: 8 } }}
                  />
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Charts */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card 
                title={<span style={{ fontWeight: 600 }}>Report Status Breakdown</span>}
                variant="borderless" 
                style={{ 
                  borderRadius: 24, 
                  background: 'var(--card)', 
                  border: '1px solid var(--border)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ height: 200, width: '100%' }}>
                  {stats.totalReports > 0 ? (
                    <Doughnut data={statusChartData} options={commonChartOptions} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <Text type="secondary">No reports data available.</Text>
                    </div>
                  )}
                </div>
                {stats.totalReports > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Text strong style={{ color: 'rgba(245, 158, 11, 0.8)', display: 'block', borderBottom: '1px solid var(--border)', paddingBottom: 4, marginBottom: 8 }}>Pending Modules</Text>
                        <div style={{ fontSize: 12, color: 'var(--muted-foreground)', maxHeight: 80, overflowY: 'auto' }}>
                          {pendingModules.length > 0 ? pendingModules.map((m, i) => <div key={i} style={{ marginBottom: 4 }}>• {m}</div>) : 'None'}
                        </div>
                      </Col>
                      <Col span={12}>
                        <Text strong style={{ color: 'rgba(16, 185, 129, 0.8)', display: 'block', borderBottom: '1px solid var(--border)', paddingBottom: 4, marginBottom: 8 }}>Finalized Modules</Text>
                        <div style={{ fontSize: 12, color: 'var(--muted-foreground)', maxHeight: 80, overflowY: 'auto' }}>
                          {finalizedModules.length > 0 ? finalizedModules.map((m, i) => <div key={i} style={{ marginBottom: 4 }}>• {m}</div>) : 'None'}
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}
              </Card>
            </motion.div>
          </Col>
        </Row>

      </Space>
    </div>
  );
}
