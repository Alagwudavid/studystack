import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug logging for environment variables (only in development)
if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Supabase Config Debug:', {
        url: supabaseUrl ? 'configured' : 'missing',
        key: supabaseAnonKey ? 'configured' : 'missing',
        urlLength: supabaseUrl?.length,
        keyLength: supabaseAnonKey?.length
    })
}

// Validate environment variables
if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set')
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false, // Disable session persistence for better performance
        autoRefreshToken: false
    }
})

// Export the config for debugging
export const supabaseConfig = {
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey
}

// Database types for type safety
export interface WaitlistEntry {
    id: string
    email: string
    created_at: string
    status: 'pending' | 'confirmed' | 'unsubscribed'
    ip_address?: string
    user_agent?: string
}