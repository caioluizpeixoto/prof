'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    SERIES_OPTIONS,
    DISCIPLINAS_OPTIONS,
    DIFICULDADE_OPTIONS,
    TIPO_QUESTAO_OPTIONS,
    type ActivityFormData
} from '@/types'

interface ActivityFormProps {
    onSuccess?: (data: any) => void
}

export default function ActivityForm({ onSuccess }: ActivityFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<ActivityFormData>({
        serie: '',
        disciplina: '',
        tema: '',
        quantidadeQuestoes: 5,
        dificuldade: 'medio',
        tipoQuestao: 'multipla_escolha',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            const response = await fetch('/api/generate-activity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Erro ao gerar atividade')
            }

            // Salvar no sessionStorage para exibir na página de resultado
            sessionStorage.setItem('currentActivity', JSON.stringify(data.data))
            sessionStorage.setItem('rateLimit', JSON.stringify(data.rateLimit))

            // Redirecionar para página de resultado
            router.push('/app/resultado')

            if (onSuccess) {
                onSuccess(data.data)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="card max-w-3xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6">
                Gerar Nova Atividade
            </h2>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
                    <p className="font-semibold">❌ {error}</p>
                </div>
            )}

            <div className="space-y-6">
                {/* Série */}
                <div>
                    <label htmlFor="serie" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Série/Ano Escolar *
                    </label>
                    <select
                        id="serie"
                        required
                        className="select-field"
                        value={formData.serie}
                        onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
                    >
                        <option value="">Selecione a série</option>
                        {SERIES_OPTIONS.map((serie) => (
                            <option key={serie} value={serie}>
                                {serie}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Disciplina */}
                <div>
                    <label htmlFor="disciplina" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Disciplina *
                    </label>
                    <select
                        id="disciplina"
                        required
                        className="select-field"
                        value={formData.disciplina}
                        onChange={(e) => setFormData({ ...formData, disciplina: e.target.value })}
                    >
                        <option value="">Selecione a disciplina</option>
                        {DISCIPLINAS_OPTIONS.map((disciplina) => (
                            <option key={disciplina} value={disciplina}>
                                {disciplina}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tema */}
                <div>
                    <label htmlFor="tema" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Tema da Atividade *
                    </label>
                    <input
                        type="text"
                        id="tema"
                        required
                        placeholder="Ex: Verbos no presente do indicativo"
                        className="input-field"
                        value={formData.tema}
                        onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                        maxLength={200}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formData.tema.length}/200 caracteres
                    </p>
                </div>

                {/* Quantidade de Questões */}
                <div>
                    <label htmlFor="quantidade" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Quantidade de Questões *
                    </label>
                    <input
                        type="number"
                        id="quantidade"
                        required
                        min={1}
                        max={20}
                        className="input-field"
                        value={formData.quantidadeQuestoes}
                        onChange={(e) => setFormData({ ...formData, quantidadeQuestoes: parseInt(e.target.value) })}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Mínimo: 1 | Máximo: 20
                    </p>
                </div>

                {/* Dificuldade */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Nível de Dificuldade *
                    </label>
                    <div className="flex gap-4">
                        {DIFICULDADE_OPTIONS.map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name="dificuldade"
                                    value={option.value}
                                    checked={formData.dificuldade === option.value}
                                    onChange={(e) => setFormData({ ...formData, dificuldade: e.target.value as any })}
                                    className="w-4 h-4 text-primary focus:ring-primary dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Tipo de Questão */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Tipo de Questões *
                    </label>
                    <div className="space-y-2">
                        {TIPO_QUESTAO_OPTIONS.map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name="tipoQuestao"
                                    value={option.value}
                                    checked={formData.tipoQuestao === option.value}
                                    onChange={(e) => setFormData({ ...formData, tipoQuestao: e.target.value as any })}
                                    className="w-4 h-4 text-primary focus:ring-primary dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Botão Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="spinner w-5 h-5"></div>
                            <span>Gerando atividade...</span>
                        </>
                    ) : (
                        <>
                            <span>✨</span>
                            <span>Gerar Atividade</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}
