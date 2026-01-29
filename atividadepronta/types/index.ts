// Tipos principais da aplicação

export interface ActivityFormData {
    serie: string;
    disciplina: string;
    tema: string;
    quantidadeQuestoes: number;
    dificuldade: 'facil' | 'medio' | 'dificil';
    tipoQuestao: 'multipla_escolha' | 'dissertativa' | 'mista';
}

export interface GeneratedActivity {
    id: string;
    atividade: string;
    gabarito: string;
    bncc?: string;
    formData: ActivityFormData;
    createdAt: string;
}

export interface RateLimit {
    remaining: number;
    total: number;
    resetAt: string;
}

export interface User {
    id: string;
    email: string;
    createdAt: string;
}

export interface ActivityHistory {
    id: string;
    userId?: string;
    serie: string;
    disciplina: string;
    tema: string;
    quantidadeQuestoes: number;
    dificuldade: string;
    tipoQuestao: string;
    atividadeContent: string;
    gabaritoContent: string;
    bnccContent?: string;
    createdAt: string;
}

export interface PDFData {
    escola?: string;
    professor?: string;
    turma?: string;
    data?: string;
    atividade: string;
    gabarito: string;
    bncc?: string;
    tema: string;
}

// Opções de seleção para o formulário
export const SERIES_OPTIONS = [
    '1º ano - Fundamental I',
    '2º ano - Fundamental I',
    '3º ano - Fundamental I',
    '4º ano - Fundamental I',
    '5º ano - Fundamental I',
    '6º ano - Fundamental II',
    '7º ano - Fundamental II',
    '8º ano - Fundamental II',
    '9º ano - Fundamental II',
    '1º ano - Ensino Médio',
    '2º ano - Ensino Médio',
    '3º ano - Ensino Médio',
] as const;

export const DISCIPLINAS_OPTIONS = [
    'Português',
    'Matemática',
    'Ciências',
    'História',
    'Geografia',
    'Inglês',
    'Artes',
    'Educação Física',
    'Filosofia',
    'Sociologia',
    'Física',
    'Química',
    'Biologia',
] as const;

export const DIFICULDADE_OPTIONS = [
    { value: 'facil', label: 'Fácil' },
    { value: 'medio', label: 'Médio' },
    { value: 'dificil', label: 'Difícil' },
] as const;

export const TIPO_QUESTAO_OPTIONS = [
    { value: 'multipla_escolha', label: 'Múltipla Escolha' },
    { value: 'dissertativa', label: 'Dissertativa' },
    { value: 'mista', label: 'Mista' },
] as const;
