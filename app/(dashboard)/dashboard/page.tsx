'use client';

import { useAuth } from '@/hooks/use-auth';
import DashboardView from '@/components/dashboard/DashboardView';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return null;
  }

  // We render the standard DashboardView for all users including Super Admins 
  // so they don't get kicked out to the System Overview when clicking 'Dashboard' in the sidebar.
  return <DashboardView />;
}
