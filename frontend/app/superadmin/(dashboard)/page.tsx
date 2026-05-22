'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperadminDashboardIndex() {
  const router = useRouter();

  useEffect(() => {
    window.location.href = '/superadmin/companies';
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
    </div>
  );
}
