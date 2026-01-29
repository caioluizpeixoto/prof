import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase server environment variables')
}

// Cliente com privilégios de admin para uso no servidor
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})

// Helper para verificar autenticação
export async function getUser(token?: string) {
    if (!token) return null

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) return null

    return user
}
