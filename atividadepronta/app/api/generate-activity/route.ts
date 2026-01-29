import { NextRequest, NextResponse } from 'next/server'
import { activityFormSchema } from '@/lib/utils/validators'
import { groq, GROQ_MODELS } from '@/lib/ai/groq-client'
import { buildActivityPrompt, parseActivityResponse } from '@/lib/utils/prompts'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit/limiter'
import { supabaseAdmin, getUser } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        // Verificar se as variáveis de ambiente estão configuradas
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json(
                { error: 'Configuração Incompleta', message: 'Variáveis de ambiente do Supabase não encontradas no servidor.' },
                { status: 500 }
            )
        }

        if (!process.env.LLM_API_KEY) {
            return NextResponse.json(
                { error: 'Configuração Incompleta', message: 'LLM_API_KEY não configurada no servidor.' },
                { status: 500 }
            )
        }

        // Parse do body
        const body = await request.json()

        // Validação dos dados
        const validationResult = activityFormSchema.safeParse(body)
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Dados inválidos', details: validationResult.error.errors },
                { status: 400 }
            )
        }

        const formData = validationResult.data

        // Verificar autenticação (opcional)
        const authHeader = request.headers.get('authorization')
        const token = authHeader?.replace('Bearer ', '')
        const user = token ? await getUser(token) : null

        // Rate limiting
        let rateLimitResult
        if (user) {
            // Usuário autenticado: 10 gerações/dia
            rateLimitResult = await checkRateLimit(user.id, 'user')
        } else {
            // Usuário anônimo: 3 gerações/dia por IP
            const clientIP = getClientIP(request)
            rateLimitResult = await checkRateLimit(clientIP, 'ip')
        }

        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                {
                    error: 'Limite de gerações atingido',
                    message: `Você atingiu o limite de ${rateLimitResult.total} gerações por dia. ${user ? 'Tente novamente amanhã.' : 'Faça login para ter mais gerações!'
                        }`,
                    resetAt: rateLimitResult.resetAt,
                },
                { status: 429 }
            )
        }

        // Gerar atividade com Groq
        const { systemPrompt, userPrompt } = buildActivityPrompt(formData)

        let content = '';
        try {
            const completion = await groq.chat.completions.create({
                model: GROQ_MODELS.VERSATILE,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 4096,
            })

            content = completion.choices[0]?.message?.content || ''
            if (!content) {
                return NextResponse.json(
                    { error: 'Erro na IA', message: 'A API do Groq não retornou conteúdo.' },
                    { status: 500 }
                )
            }
        } catch (groqError: any) {
            console.error('Erro na API Groq:', groqError)
            const status = groqError.status || 500
            let message = 'Erro desconhecido na API do Groq'

            if (status === 401) message = 'Chave da API do Groq inválida ou expirada.'
            if (status === 400) message = 'Requisição inválida para a API do Groq.'
            if (status === 429) message = 'Limite de taxa da API do Groq atingido.'
            if (status >= 500) message = 'Erro interno no servidor do Groq.'

            return NextResponse.json(
                { error: 'Erro na API de IA', message },
                { status }
            )
        }

        const { atividade, gabarito, bncc } = parseActivityResponse(content)

        // Salvar no banco de dados
        const { data: savedActivity, error: saveError } = await supabaseAdmin
            .from('activities')
            .insert({
                user_id: user?.id || null,
                ip_address: user ? null : getClientIP(request),
                serie: formData.serie,
                disciplina: formData.disciplina,
                tema: formData.tema,
                quantidade_questoes: formData.quantidadeQuestoes,
                dificuldade: formData.dificuldade,
                tipo_questao: formData.tipoQuestao,
                atividade_content: atividade,
                gabarito_content: gabarito,
                bncc_content: bncc,
            })
            .select()
            .single()

        if (saveError) {
            console.error('Erro ao salvar atividade:', saveError)
            // Não falhar a requisição se não conseguir salvar
        }

        // Retornar resultado
        return NextResponse.json({
            success: true,
            data: {
                id: savedActivity?.id || crypto.randomUUID(),
                atividade,
                gabarito,
                bncc,
                formData,
                createdAt: new Date().toISOString(),
            },
            rateLimit: {
                remaining: rateLimitResult.remaining,
                total: rateLimitResult.total,
                resetAt: rateLimitResult.resetAt,
            },
        })
    } catch (error) {
        console.error('Erro ao gerar atividade:', error)

        return NextResponse.json(
            {
                error: 'Erro ao gerar atividade',
                message: error instanceof Error ? error.message : 'Erro desconhecido',
            },
            { status: 500 }
        )
    }
}
