import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Export configuration status
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey

// Create the Supabase client
// If config is missing, we still need to export a valid client object to prevent
// imports from failing in other files, but it won't work for actual requests.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables missing. App will run in limited mode.')
}

