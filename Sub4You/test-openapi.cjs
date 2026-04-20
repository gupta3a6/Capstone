const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://xgglrctjkohnraylqhdp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZ2xyY3Rqa29obnJheWxxaGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDAxNzAsImV4cCI6MjA3ODkxNjE3MH0.tiT4uesOETbi0ukmgrPmm4YO_4RMJh9-KfaiyEZVMxg';

async function testSchema() {
  const res = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`);
  const spec = await res.json();
  const sp = spec.definitions.seeker_preferences;
  console.log("SEEKER PREFS:", sp ? Object.keys(sp.properties) : "not found");
}
testSchema();
