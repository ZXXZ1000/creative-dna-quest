import { createClient } from '@supabase/supabase-js'

// Client is initialized with public anon key and URL via Vite envs
// Set these in your deployment environment.
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined

const hasEnv = Boolean(supabaseUrl && supabaseAnonKey)

// Fallback no-op client if envs are missing (dev-friendly)
export const supabase: any = hasEnv
  ? createClient(supabaseUrl!, supabaseAnonKey!, { auth: { persistSession: false } })
  : {
      from() {
        return {
          insert: async () => ({ data: null, error: null }),
          select: async () => ({ data: null, error: null }),
        }
      },
    }
