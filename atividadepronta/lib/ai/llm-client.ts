// Cliente LLM configurável via variáveis de ambiente

interface LLMConfig {
    apiKey: string
    apiUrl: string
    model: string
}

interface LLMResponse {
    content: string
    usage?: {
        promptTokens: number
        completionTokens: number
        totalTokens: number
    }
}

export class LLMClient {
    private config: LLMConfig

    constructor() {
        this.config = {
            apiKey: process.env.LLM_API_KEY || '',
            apiUrl: process.env.LLM_API_URL || 'https://api.openai.com/v1/chat/completions',
            model: process.env.LLM_MODEL || 'gpt-4o-mini',
        }

        if (!this.config.apiKey) {
            throw new Error('LLM_API_KEY não configurada')
        }
    }

    async generateCompletion(prompt: string): Promise<LLMResponse> {
        try {
            const response = await fetch(this.config.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.config.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'Você é um assistente especializado em criar atividades escolares para professores brasileiros. Sempre responda em português do Brasil e siga exatamente o formato solicitado.',
                        },
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 2000,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(
                    `Erro na API LLM: ${response.status} - ${errorData.error?.message || response.statusText}`
                )
            }

            const data = await response.json()

            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Resposta da API LLM em formato inválido')
            }

            return {
                content: data.choices[0].message.content,
                usage: data.usage ? {
                    promptTokens: data.usage.prompt_tokens,
                    completionTokens: data.usage.completion_tokens,
                    totalTokens: data.usage.total_tokens,
                } : undefined,
            }
        } catch (error) {
            console.error('Erro ao gerar completion:', error)
            throw error
        }
    }
}

// Instância singleton
let llmClient: LLMClient | null = null

export function getLLMClient(): LLMClient {
    if (!llmClient) {
        llmClient = new LLMClient()
    }
    return llmClient
}
