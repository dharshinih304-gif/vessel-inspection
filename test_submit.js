import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dobpdssgdfaiharnmpdf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYnBkc3NnZGZhaWhhcm5tcGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODYzNzksImV4cCI6MjA5NDA2MjM3OX0.UmPs3VLUa18s5FNRWg4IwvHiHeyEA29bV4oC0VVNPL4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
    const vesselId = 'd03e93e6-41c1-4ed6-b3a6-458349866071';
    const newReportId = '4bdfc77d-fbbf-487b-8a50-de4803366590';
    const cat = 'ballast_tanks';

    const { data: allItems } = await supabase
        .from(cat)
        .select('*');
        
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
    
    const { data: activeItems } = await supabase
        .from(cat)
        .select('*')
        .eq('vessel_id', vesselId)
        .is('report_id', null);

    const activeMap = new Map();
    if (activeItems) {
        activeItems.forEach(item => {
            activeMap.set(item.s_no || item.item_no, item);
        });
    }

    const itemsToInsert = (templates || []).map(tmpl => {
        const activeItem = activeMap.get(tmpl.s_no || tmpl.item_no);
        
        let finalAns = activeItem?.ans || '';
        let finalComments = activeItem?.comments || '';

        const baseItem = {
            rule_ref: tmpl.rule_ref,
            requirements: tmpl.requirements,
            ans: finalAns,
            comments: finalComments,
            image: activeItem?.image || tmpl.image || '',
            vessel_id: vesselId,
            company_id: '9e87e758-09e0-4162-8b84-9723fd7f223f',
            report_id: newReportId,
            user_id: '2b42a774-4c2e-4bc7-a0a4-6b595ed6cee2'
        };
        if (tmpl.s_no !== undefined) baseItem.s_no = tmpl.s_no;
        if (tmpl.item_no !== undefined) baseItem.item_no = tmpl.item_no;
        
        return baseItem;
    });
    
    console.log('itemsToInsert length:', itemsToInsert.length);

    if (itemsToInsert.length > 0) {
        const { data, error: insertErr } = await supabase
            .from(cat)
            .insert(itemsToInsert)
            .select();

        console.log('Inserted data length:', data?.length);
        if (insertErr) console.log('insertErr:', insertErr);
    }
}

run();
