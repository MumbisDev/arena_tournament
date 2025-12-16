import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string)?.trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string)?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = `Missing Supabase environment variables!
VITE_SUPABASE_URL: ${supabaseUrl ? 'set' : 'missing'}
VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'set' : 'missing'}

Make sure your .env file is in the project root and restart the dev server.
Current env keys: ${Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')).join(', ')}`;
  console.error(errorMessage);
  throw new Error(errorMessage);
}

// Ensure we have valid values (not just whitespace)
if (!supabaseUrl || supabaseUrl.length === 0 || !supabaseAnonKey || supabaseAnonKey.length === 0) {
  throw new Error('Supabase URL and API key must be non-empty strings');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

