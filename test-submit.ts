import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dobpdssgdfaiharnmpdf.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '...'; // I will get it from .env.local

async function main() {
  const fs = require('fs');
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
  const keyMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
  const supabase = createClient(urlMatch[1], keyMatch[1]);

  const cat = 'ballast_tanks';
  const vesselId = 'e4329642-2f1c-4f6e-91f6-a176bfe60c9c';
  const newReportId = '42727c28-d8b0-4c8e-be98-e052ef8ec80b';
  const companyId = '37d92d0d-1f11-4a31-b1a7-69cf3a80c7e7';
  const userId = '2b42a774-4c2e-4bc7-a0a4-6b595ed6cee2';

  const { data: allItems, error: templateErr } = await supabase.from(cat).select('*');
  console.log('allItems:', allItems?.length, templateErr);

  const seen = new Set();
  const templates = [];
  const sorted = [...(allItems || [])].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });
  for (const row of sorted) {
    const sNoVal = row.s_no || row.item_no;
    if (sNoVal && !seen.has(sNoVal)) {
      seen.add(sNoVal);
      templates.push(row);
    }
  }

  const { data: activeItems } = await supabase.from(cat).select('*').eq('vessel_id', vesselId).is('report_id', null);
  console.log('activeItems:', activeItems?.length);

  const activeMap = new Map();
  if (activeItems) {
    activeItems.forEach(item => {
      activeMap.set(item.s_no || item.item_no, item);
    });
  }

  const itemsToInsert = (templates || []).map(tmpl => {
    const activeItem = activeMap.get(tmpl.s_no || tmpl.item_no);
    let finalAns = activeItem?.ans || tmpl.ans || '';
    let finalComments = activeItem?.comments || tmpl.comments || '';

    const baseItem: any = {
      rule_ref: tmpl.rule_ref,
      requirements: tmpl.requirements,
      ans: finalAns,
      comments: finalComments,
      image: activeItem?.image || tmpl.image || '',
      vessel_id: vesselId,
      company_id: companyId,
      report_id: newReportId,
      user_id: userId
    };
    if (tmpl.s_no !== undefined) baseItem.s_no = tmpl.s_no;
    if (tmpl.item_no !== undefined) baseItem.item_no = tmpl.item_no;
    
    return baseItem;
  });

  console.log('itemsToInsert length:', itemsToInsert.length);
  console.log('First item:', itemsToInsert[0]);

  if (itemsToInsert.length > 0) {
    const { error: insertErr, data } = await supabase.from(cat).insert(itemsToInsert).select();
    console.log('insert result:', data?.length, insertErr);
  }
}

main().catch(console.error);
