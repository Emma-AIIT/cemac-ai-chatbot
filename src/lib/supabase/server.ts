import { createClient } from '@supabase/supabase-js';
import { env } from '~/env';

// Service role client (full access)
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Anon client (public access)
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY
);
