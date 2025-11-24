import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Check if Supabase is properly configured with valid URLs
const isValidUrl = (url: string) => {
  try {
    return url && url.startsWith('http') && new URL(url);
  } catch {
    return false;
  }
};

const isSupabaseConfigured = isValidUrl(supabaseUrl) && supabaseServiceKey;

// Create clients only if properly configured
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  : null;

// Regular client with anon key for client-side operations
export const supabaseAnon = isSupabaseConfigured && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export default supabase;
