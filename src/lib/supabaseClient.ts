// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log warnings for missing environment variables
if (!supabaseUrl) {
  console.warn('⚠️ VITE_SUPABASE_URL is not defined. Check your environment variables.');
}
if (!supabaseAnonKey) {
  console.warn('⚠️ VITE_SUPABASE_ANON_KEY is not defined. Check your environment variables.');
}

// Fallback to placeholder values so the app won't crash
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'public-anon-key-placeholder';

export const supabase = createClient<Database>(
  supabaseUrl || fallbackUrl,
  supabaseAnonKey || fallbackKey
);


