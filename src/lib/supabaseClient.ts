// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// ✅ Load environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🪵 Debug log for devs
console.log('🔗 Supabase URL:', supabaseUrl);

// 🚨 Hard fail if any environment variable is missing
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Supabase URL or ANON KEY is missing. Please check your Netlify environment variables.');
}

// ✅ Create typed Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);


