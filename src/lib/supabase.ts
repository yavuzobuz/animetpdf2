import { createClientComponentClient, createRouteHandlerClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client Component (Browser) - cookies import yok
export const createBrowserClient = () => {
  return createClientComponentClient();
  }

// Server Component için
export const createServerClient = () => {
  const { cookies } = require('next/headers');
  return createServerComponentClient({ cookies });
}

// Route Handler (API Routes) - auth callback için
export const createRouteClient = () => {
  // Bu fonksiyon sadece API route'larında çağrılacak
  const { cookies } = require('next/headers');
  return createRouteHandlerClient({ cookies });
}

// Server-side admin client (database operations)
export const createAdminClient = () => {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  )
}

// Backward compatibility
export const supabase = createBrowserClient()