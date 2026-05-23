'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CompanyLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm font-medium">Redirecting to Central Login...</p>
      </div>
    </div>
  );
}
