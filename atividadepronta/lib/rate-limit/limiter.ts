import { supabaseAdmin } from '../supabase/server'

export interface RateLimitResult {
    allowed: boolean
    remaining: number
    total: number
    resetAt: Date
}

const LIMITS = {
    anonymous: 3, // 3 gerações por dia sem login
    authenticated: 10, // 10 gerações por dia com login
}

export async function checkRateLimit(
    identifier: string,
    type: 'ip' | 'user'
): Promise<RateLimitResult> {
    const limit = type === 'user' ? LIMITS.authenticated : LIMITS.anonymous

    // Calcular horário de reset (meia-noite do próximo dia em horário de Brasília)
    const now = new Date()
    const resetAt = new Date(now)
    resetAt.setHours(24, 0, 0, 0) // Próxima meia-noite

    try {
        // Buscar registro de rate limit
        const { data: existingLimit, error: fetchError } = await supabaseAdmin
            .from('rate_limits')
            .select('*')
            .eq('identifier', identifier)
            .eq('type', type)
            .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
            // PGRST116 = not found, outros erros são problemas
            console.error('Erro ao buscar rate limit:', fetchError)
            // Em caso de erro, permitir a requisição (fail open)
            return {
                allowed: true,
                remaining: limit - 1,
                total: limit,
                resetAt,
            }
        }

        // Se não existe registro, criar um novo
        if (!existingLimit) {
            const { error: insertError } = await supabaseAdmin
                .from('rate_limits')
                .insert({
                    identifier,
                    type,
                    count: 1,
                    reset_at: resetAt.toISOString(),
                })

            if (insertError) {
                console.error('Erro ao criar rate limit:', insertError)
                return {
                    allowed: true,
                    remaining: limit - 1,
                    total: limit,
                    resetAt,
                }
            }

            return {
                allowed: true,
                remaining: limit - 1,
                total: limit,
                resetAt,
            }
        }

        // Verificar se precisa resetar
        const existingResetAt = new Date(existingLimit.reset_at)
        if (now >= existingResetAt) {
            // Reset do contador
            const { error: updateError } = await supabaseAdmin
                .from('rate_limits')
                .update({
                    count: 1,
                    reset_at: resetAt.toISOString(),
                })
                .eq('identifier', identifier)
                .eq('type', type)

            if (updateError) {
                console.error('Erro ao resetar rate limit:', updateError)
            }

            return {
                allowed: true,
                remaining: limit - 1,
                total: limit,
                resetAt,
            }
        }

        // Verificar se atingiu o limite
        if (existingLimit.count >= limit) {
            return {
                allowed: false,
                remaining: 0,
                total: limit,
                resetAt: existingResetAt,
            }
        }

        // Incrementar contador
        const newCount = existingLimit.count + 1
        const { error: updateError } = await supabaseAdmin
            .from('rate_limits')
            .update({ count: newCount })
            .eq('identifier', identifier)
            .eq('type', type)

        if (updateError) {
            console.error('Erro ao atualizar rate limit:', updateError)
        }

        return {
            allowed: true,
            remaining: limit - newCount,
            total: limit,
            resetAt: existingResetAt,
        }
    } catch (error) {
        console.error('Erro no rate limiting:', error)
        // Em caso de erro, permitir a requisição (fail open)
        return {
            allowed: true,
            remaining: limit - 1,
            total: limit,
            resetAt,
        }
    }
}

export function getClientIP(request: Request): string {
    // Tentar obter IP de headers comuns
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')

    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }

    if (realIP) {
        return realIP
    }

    // Fallback
    return 'unknown'
}
