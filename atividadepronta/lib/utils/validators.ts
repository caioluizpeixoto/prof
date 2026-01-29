import { z } from 'zod'

// Schema de validação para o formulário de atividade
export const activityFormSchema = z.object({
    serie: z.string().min(1, 'Selecione uma série'),
    disciplina: z.string().min(1, 'Selecione uma disciplina'),
    tema: z.string()
        .min(3, 'O tema deve ter pelo menos 3 caracteres')
        .max(200, 'O tema deve ter no máximo 200 caracteres'),
    quantidadeQuestoes: z.number()
        .int('Quantidade deve ser um número inteiro')
        .min(1, 'Mínimo de 1 questão')
        .max(20, 'Máximo de 20 questões'),
    dificuldade: z.enum(['facil', 'medio', 'dificil'], {
        errorMap: () => ({ message: 'Selecione uma dificuldade válida' }),
    }),
    tipoQuestao: z.enum(['multipla_escolha', 'dissertativa', 'mista'], {
        errorMap: () => ({ message: 'Selecione um tipo de questão válido' }),
    }),
})

export type ActivityFormInput = z.infer<typeof activityFormSchema>

// Schema de validação para login
export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

export type LoginInput = z.infer<typeof loginSchema>

// Schema de validação para registro
export const registerSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string()
        .min(6, 'A senha deve ter pelo menos 6 caracteres')
        .max(100, 'A senha deve ter no máximo 100 caracteres'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
})

export type RegisterInput = z.infer<typeof registerSchema>

// Schema para dados do PDF
export const pdfDataSchema = z.object({
    escola: z.string().optional(),
    professor: z.string().optional(),
    turma: z.string().optional(),
    data: z.string().optional(),
    atividade: z.string().min(1),
    gabarito: z.string().min(1),
    bncc: z.string().optional(),
    tema: z.string().min(1),
})

export type PDFDataInput = z.infer<typeof pdfDataSchema>
