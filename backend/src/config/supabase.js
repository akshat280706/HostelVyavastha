const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Make sure dotenv is loaded

// Load environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Debug: Check if variables are loaded
console.log('Checking environment variables:');
console.log('SUPABASE_URL exists:', !!supabaseUrl);
console.log('SUPABASE_SERVICE_KEY exists:', !!supabaseServiceKey);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env');
  console.error('Current SUPABASE_URL:', supabaseUrl);
  console.error('Current SUPABASE_SERVICE_KEY:', supabaseServiceKey ? '***present***' : 'missing');
  process.exit(1);
}

// Create Supabase client with service role (admin privileges)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('✅ Supabase client initialized successfully');
console.log(`📡 Connected to: ${supabaseUrl}`);

module.exports = supabase;
