import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dobpdssgdfaiharnmpdf.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(
    supabaseUrl,
    supabaseKey,
    {
        auth: {
            persistSession: true,
            storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
            autoRefreshToken: true,
        }
    }
)

export const isUUID = (str) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
};

export const resolveCompany = async (param) => {
  if (!param) return null;
  
  const trimmed = param.trim();
  
  // 1. Try UUID match first
  if (isUUID(trimmed)) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', trimmed)
        .single();
      if (!error && data) return data;
    } catch (e) {
      console.error("Error fetching company by UUID:", e);
    }
  }

  // 2. Try friendly name lookup
  const cleanParam = trimmed.toLowerCase();
  
  try {
    const { data: allCompanies, error } = await supabase
      .from('companies')
      .select('*');
      
    if (!error && allCompanies) {
      // Find best match
      const match = allCompanies.find(c => {
        if (!c.company_name) return false;
        const dbName = c.company_name.toLowerCase();
        // exact match: sellamsoft === sellamsoft
        if (dbName === cleanParam) return true;
        // dash/space matching: marine time vs marine-time / marinetime
        if (dbName.replace(/\s+/g, '-') === cleanParam) return true;
        if (dbName.replace(/\s+/g, '') === cleanParam.replace(/-+/g, '')) return true;
        // prefix/substring match: sellamship in sellamships
        if (dbName.startsWith(cleanParam) || cleanParam.startsWith(dbName)) return true;
        return false;
      });
      
      if (match) return match;
    }
  } catch (e) {
    console.error("Error fetching all companies for lookup:", e);
  }
  
  return null;
};

