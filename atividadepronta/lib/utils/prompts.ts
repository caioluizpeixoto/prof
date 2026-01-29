import { ActivityFormData } from '@/types'

export function buildActivityPrompt(formData: ActivityFormData): { systemPrompt: string, userPrompt: string } {
    const { serie, disciplina, tema, quantidadeQuestoes, dificuldade, tipoQuestao } = formData

    // Mapear dificuldade para português
    const dificuldadeMap = {
        facil: 'fácil',
        medio: 'médio',
        dificil: 'difícil',
    }

    // Mapear tipo de questão para português
    const tipoMap = {
        multipla_escolha: 'múltipla escolha',
        dissertativa: 'dissertativa',
        mista: 'mista (múltipla escolha e dissertativa)',
    }

    const systemPrompt = `Você é um pedagogo especialista em criar atividades escolares no padrão brasileiro.
Gere uma atividade para a série ${serie}, disciplina ${disciplina}, tema ${tema}, com ${quantidadeQuestoes} questões, nível ${dificuldadeMap[dificuldade]} e tipo ${tipoMap[tipoQuestao]}.
Entregue sempre em dois blocos:

ATIVIDADE (questões numeradas)

GABARITO

Inclua linguagem adequada à série, evite ambiguidades e, se possível, cite 1 habilidade da BNCC relacionada.`

    const userPrompt = `Por favor, gere a atividade sobre "${tema}" para o ${serie} de ${disciplina}.`

    return { systemPrompt, userPrompt }
}

export function parseActivityResponse(response: string): {
    atividade: string
    gabarito: string
    bncc: string
} {
    // Extrair seções usando os novos marcadores ou palavras-chave
    const sections = response.split(/ATIVIDADE|GABARITO/i);

    // Tenta encontrar BNCC dentro do texto se existir
    const bnccMatch = response.match(/(?:BNCC|Habilidade|Código):\s*([\s\S]*?)(?:\n\n|$)/i);
    const bncc = bnccMatch ? bnccMatch[1].trim() : 'Não especificada';

    let atividade = "";
    let gabarito = "";

    // Lógica mais robusta para split
    if (sections.length >= 3) {
        atividade = sections[1].trim();
        gabarito = sections[2].trim();
    } else {
        // Fallback caso o split falhe por formatação inesperada
        const activityPart = response.match(/ATIVIDADE:?\s*([\s\S]*?)(?=GABARITO|$)/i);
        const answerPart = response.match(/GABARITO:?\s*([\s\S]*?)$/i);

        atividade = activityPart ? activityPart[1].trim() : sections[0] || "";
        gabarito = answerPart ? answerPart[1].trim() : "";
    }

    // Validação básica
    if (!atividade) {
        throw new Error('Não foi possível extrair o conteúdo da atividade da resposta da IA.')
    }

    return {
        atividade,
        gabarito,
        bncc,
    }
}
