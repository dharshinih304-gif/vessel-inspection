'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';

export default function DashboardRoot() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      const userRole = user.role?.toUpperCase();
      if (userRole === 'SUPERADMIN') {
        window.location.href = '/superadmin/companies';
      } else if (user.company_id) {
        const fetchAndRedirect = async () => {
          try {
            const { data: companyData } = await supabase
              .from('companies')
              .select('company_name')
              .eq('id', user.company_id)
              .single();
            const dest = companyData?.company_name ? companyData.company_name.toLowerCase() : user.company_id;
            router.replace(`/company/${dest}/dashboard`);
          } catch (e) {
            router.replace(`/company/${user.company_id}/dashboard`);
          }
        };
        fetchAndRedirect();
      } else {
        window.location.href = '/superadmin/companies';
      }
    }
  }, [user, isLoading, router]);

  return null;
}
