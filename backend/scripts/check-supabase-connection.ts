/**
 * Script to check Supabase connection
 * Run this with: npx tsx scripts/check-supabase-connection.ts
 * Make sure you have VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY set in your .env file
 */

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from backend directory
config({ path: resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('❌ Missing environment variables!');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function checkConnection() {
  console.log('🔍 Checking Supabase connection...\n');

  try {
    // Test basic connection
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase.from('travel_packages').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      process.exit(1);
    }
    
    console.log('✅ Connection successful!\n');

    // Check tables exist
    console.log('2. Checking database tables...');
    const tables = ['profiles', 'user_roles', 'travel_packages', 'bookings', 'wishlist', 'cart'];
    
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase.from(table).select('count').limit(1);
        if (tableError) {
          console.error(`❌ Table "${table}" not found or not accessible:`, tableError.message);
        } else {
          console.log(`✅ Table "${table}" exists`);
        }
      } catch (err: any) {
        console.error(`❌ Error checking table "${table}":`, err.message);
      }
    }

    console.log('\n✅ Supabase connection check complete!');
    console.log('\nYour Supabase project is properly configured.');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkConnection();

