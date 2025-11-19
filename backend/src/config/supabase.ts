import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseServiceKey;

// Supabase warnings disabled for cleaner logs
// if (!isSupabaseConfigured) {
//   console.warn('⚠️  Supabase environment variables not configured. Running without database.');
//   console.warn('   The app will work with frontend-only features (AI tools, local storage).');
//   console.warn('   To enable backend features, add Supabase credentials to backend/.env');
// }

// Create clients only if configured, otherwise export null
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
