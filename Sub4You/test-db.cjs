const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://xgglrctjkohnraylqhdp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZ2xyY3Rqa29obnJheWxxaGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDAxNzAsImV4cCI6MjA3ODkxNjE3MH0.tiT4uesOETbi0ukmgrPmm4YO_4RMJh9-KfaiyEZVMxg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  // Try pushing to profiles
  const profileId = '11111111-1111-1111-1111-111111111111'; // Needs valid UUID but probably fails if not auth user?
  // Let's just create an anonymous user or use an existing one
  
  // First, find ANY valid user ID to test updating:
  const { data: users, error: uErr } = await supabase.from('profiles').select('id').limit(1);
  if (uErr || !users || users.length === 0) {
    console.log("No profs to test on:", uErr);
    return;
  }
  const testId = users[0].id;
  
  console.log("Testing on ID:", testId);
  const { error: pErr } = await supabase.from('profiles').update({
    age: 22,
    gender: 'Male',
    university: 'Test Uni',
    setup_complete: true
  }).eq('id', testId);
  
  console.log('Update Profiles Error:', pErr);
  
  const { error: sErr } = await supabase.from('seeker_preferences').upsert({
      profile_id: testId,
      budget_min: 500,
      budget_max: 2000,
      target_city: 'City',
      target_state: 'ST',
      move_in_date: '2026-08-01',
      move_out_date: '2026-12-15',
      lifestyle_preferences: []
    }, { onConflict: 'profile_id' });
    
  console.log('Upsert Seeker Prefs Error:', sErr);
}

testInsert();
