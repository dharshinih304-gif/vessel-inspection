require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testInsert() {
  const item = {
    rule_ref: "Test rule",
    requirements: "Test requirements",
    ans: "SATISFACTORY",
    comments: "Test comments",
    image: "",
    vessel_id: "b4871f10-60cc-4a4a-a49b-bb22b290f206",
    company_id: "467955f6-f651-4305-8e71-09b6b377ca69", 
    report_id: "70b3b953-5b40-4c6f-bd1b-aefeaa852f82",
    user_id: "2b42a774-4c2e-4bc7-a0a4-6b595ed6cee2",
    s_no: "BAL-01"
  };

  const { data, error } = await supabase.from('ballast_tanks').insert([item]).select();
  if (error) {
    console.error("INSERT ERROR:", error);
  } else {
    console.log("INSERT SUCCESS:", data);
  }
}

testInsert();
