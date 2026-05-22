const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const STATUSES = ['SATISFACTORY', 'GOOD', 'UNSATISFACTORY', 'NOT SEEN'];
const STATUS_WEIGHTS = [0.75, 0.15, 0.07, 0.03];

function getRandomStatus() {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < STATUSES.length; i++) {
    cumulative += STATUS_WEIGHTS[i];
    if (r <= cumulative) return STATUSES[i];
  }
  return STATUSES[0];
}

const COMMENTS_MAPPING = {
  'SATISFACTORY': [
    'Condition satisfactory',
    'No abnormalities observed',
    'Inspection completed successfully',
    'In good working order',
    'Meets required standards',
    'Operating correctly',
    'No defects found'
  ],
  'GOOD': [
    'Good condition',
    'Working properly',
    'Well maintained',
    'Fully functional',
    'Excellent state'
  ],
  'UNSATISFACTORY': [
    'Requires attention',
    'Maintenance needed',
    'Below standard',
    'Needs repair',
    'Defect noted'
  ],
  'NOT SEEN': [
    'Not accessible during inspection',
    'Not tested',
    'Area locked',
    'Equipment not available'
  ]
};

function getRandomComment(status) {
  const suggestions = COMMENTS_MAPPING[status] || [];
  return suggestions[Math.floor(Math.random() * suggestions.length)] || 'Condition satisfactory';
}

async function run() {
  console.log('🚀 Running checklist snapshot generator for all reports...');

  // Fetch all reports
  const { data: reports, error: reportsError } = await supabase
    .from('reports')
    .select('id, category_name, vessel_id, company_id, created_by');

  if (reportsError) {
    console.error('❌ Error fetching reports:', reportsError.message);
    process.exit(1);
  }

  console.log(`📋 Found ${reports.length} reports in the database.`);

  let processedCount = 0;
  let skippedCount = 0;
  let totalRowsInserted = 0;

  for (const report of reports) {
    const tableName = report.category_name;
    if (!tableName) {
      console.log(`⚠️ Report ${report.id} has no category_name, skipping.`);
      skippedCount++;
      continue;
    }

    // Check if snapshot rows already exist for this report_id
    const { data: existingRows, error: checkError } = await supabase
      .from(tableName)
      .select('id')
      .eq('report_id', report.id);

    if (checkError) {
      console.error(`❌ Error checking table ${tableName} for report ${report.id}:`, checkError.message);
      skippedCount++;
      continue;
    }

    if (existingRows && existingRows.length > 0) {
      console.log(`✅ Report ${report.id} in "${tableName}" already has ${existingRows.length} snapshot records. Skipping.`);
      processedCount++;
      continue;
    }

    console.log(`🔄 Generating snapshot records for report ${report.id} in "${tableName}"...`);

    // Fetch active checklist rows for this vessel (report_id = null)
    let { data: sourceRows, error: fetchErr } = await supabase
      .from(tableName)
      .select('*')
      .eq('vessel_id', report.vessel_id);

    if (fetchErr) {
      console.error(`❌ Error fetching source rows for table ${tableName}:`, fetchErr.message);
    }

    // Filter to get template/active rows
    let templates = (sourceRows || []).filter(r => !r.report_id);

    console.log(`   Vessel rows found: ${(sourceRows || []).length}, filtered active: ${templates.length}`);

    // If no templates for this vessel, try to query any rows from the table as templates
    if (templates.length === 0) {
      const { data: fallbackRows, error: fallbackErr } = await supabase
        .from(tableName)
        .select('*')
        .limit(200);

      if (fallbackErr) {
        console.error(`❌ Error fetching fallback rows for table ${tableName}:`, fallbackErr.message);
      } else {
        console.log(`   Fallback query returned ${fallbackRows ? fallbackRows.length : 0} rows.`);
      }

      if (!fallbackErr && fallbackRows && fallbackRows.length > 0) {
        // Unique by s_no / item_no to get a clean template
        const seen = new Set();
        templates = fallbackRows.filter(r => {
          const sno = r.s_no || r.item_no || '';
          if (sno && !seen.has(sno)) {
            seen.add(sno);
            return true;
          }
          return false;
        });
        console.log(`   Cleaned template size from fallback: ${templates.length}`);
      }
    }

    if (templates.length === 0) {
      console.log(`⚠️ No template rows found for table "${tableName}", skipping.`);
      skippedCount++;
      continue;
    }

    // Map template rows to new snapshot records
    const batchToInsert = templates.map(row => {
      const status = row.ans && row.ans !== 'EMPTY' ? row.ans : getRandomStatus();
      const comment = row.comments && row.comments !== 'EMPTY' ? row.comments : getRandomComment(status);

      const entry = {
        vessel_id: report.vessel_id,
        company_id: report.company_id || row.company_id,
        user_id: report.created_by || row.user_id,
        report_id: report.id,
        requirements: row.requirements,
        rule_ref: row.rule_ref,
        ans: status,
        comments: comment,
        image: row.image || null
      };

      if (tableName === 'machinery_arrangements' || tableName === 'pollution_prevention_for_tankers') {
        entry.item_no = row.s_no || row.item_no;
      } else {
        entry.s_no = row.s_no || row.item_no;
      }

      return entry;
    });

    // Insert new snapshot rows
    const { error: insertError } = await supabase
      .from(tableName)
      .insert(batchToInsert);

    if (insertError) {
      console.error(`❌ Failed to insert snapshot rows into "${tableName}" for report ${report.id}:`, insertError.message);
      skippedCount++;
    } else {
      console.log(`   ✅ Inserted ${batchToInsert.length} snapshot rows into "${tableName}".`);
      totalRowsInserted += batchToInsert.length;
      processedCount++;
    }
  }

  console.log(`\n🎉 Processed ${processedCount} reports successfully, ${skippedCount} skipped.`);
  console.log(`🚀 Total snapshot records created: ${totalRowsInserted}`);
}

run();
