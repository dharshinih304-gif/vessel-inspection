const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dobpdssgdfaiharnmpdf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYnBkc3NnZGZhaWhhcm5tcGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODYzNzksImV4cCI6MjA5NDA2MjM3OX0.UmPs3VLUa18s5FNRWg4IwvHiHeyEA29bV4oC0VVNPL4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const { data, error } = await supabase
    .from('deck')
    .insert([
      { vesselId: 'b4871f10-60cc-4a4a-a49b-bb22b290f206', s_no: 'TEST-01', requirements: 'Test', ans: 'GOOD', comments: 'Test' }
    ]);
    
  if (error) {
    console.error('Error inserting:', error);
  } else {
    console.log('Insert successful:', data);
  }
}

testInsert();
