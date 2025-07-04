// src/lib/supabaseClient.ts
console.log('ENV:', import.meta.env);
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// ✅ Load environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🪵 Debug logs for troubleshooting
console.log('🔗 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Anon Key (first 20 chars):', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET');
console.log('🌍 Current environment:', import.meta.env.MODE);
console.log('📡 Current URL:', window.location.href);

// 🚨 Hard fail if any environment variable is missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Environment variables missing:');
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
  console.error('   VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'MISSING');
  throw new Error('❌ Supabase URL or ANON KEY is missing. Please check your Netlify environment variables.');
}

// ✅ Create typed Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);


console.log('🔌 Supabase client created, testing connection...');


