// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('✅ Supabase URL:', supabaseUrl); // Should log correctly in the browser console

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Missing Supabase environment variables! Check Netlify settings.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);


