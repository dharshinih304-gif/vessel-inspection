'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import DashboardView from '@/components/dashboard/DashboardView';

export default function CompanyDashboardPage() {
  const params = useParams();
  const companyId = params?.companyId as string;

  return <DashboardView companyId={companyId} />;
}
