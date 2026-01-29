'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { FileText, Calendar, BookOpen, Trash2, Download, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface ActivityRecord {
    id: string
    tema: string
    disciplina: string
    serie: string
    created_at: string
    atividade_content: string
    gabarito_content: string
    bncc_content: string
    quantidade_questoes: number
    dificuldade: string
    tipo_questao: string
}

export default function HistoricoPage() {
    const [activities, setActivities] = useState<ActivityRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            setLoading(true)

            // Pegar o usuário atual
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setError('Você precisa estar logado para ver o histórico.')
                setLoading(false)
                return
            }

            const { data, error: fetchError } = await supabase
                .from('activities')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10)

            if (fetchError) throw fetchError

            setActivities(data || [])
        } catch (err: any) {
            console.error('Erro ao buscar histórico:', err)
            setError('Não foi possível carregar o histórico.')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja realmente excluir esta atividade?')) return

        try {
            const { error: deleteError } = await supabase
                .from('activities')
                .delete()
                .eq('id', id)

            if (deleteError) throw deleteError

            setActivities(activities.filter(a => a.id !== id))
        } catch (err) {
            alert('Erro ao excluir atividade.')
        }
    }

    const handleView = (activity: ActivityRecord) => {
        // Salvar no sessionStorage para a página de resultado usar
        const generatedActivity = {
            atividade: activity.atividade_content,
            gabarito: activity.gabarito_content,
            bncc: activity.bncc_content,
            formData: {
                serie: activity.serie,
                disciplina: activity.disciplina,
                tema: activity.tema,
                quantidadeQuestoes: activity.quantidade_questoes,
                dificuldade: activity.dificuldade,
                tipoQuestao: activity.tipo_questao
            }
        }
        sessionStorage.setItem('currentActivity', JSON.stringify(generatedActivity))
        window.location.href = '/app/resultado'
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <RefreshCw className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Carregando seu histórico...</p>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-center md:text-left">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">Meus Materiais</h1>
                    <p className="text-gray-600 dark:text-gray-400">Veja e recupere suas últimas 10 atividades geradas</p>
                </div>
                <Link href="/app" className="btn-primary flex items-center justify-center gap-2">
                    + Nova Atividade
                </Link>
            </div>

            {error ? (
                <div className="card border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-center p-12">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ops!</h3>
                    <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
                    {error.includes('logado') ? (
                        <Link href="/login" className="btn-primary">Fazer Login</Link>
                    ) : (
                        <button onClick={fetchHistory} className="btn-secondary">Tentar Novamente</button>
                    )}
                </div>
            ) : activities.length === 0 ? (
                <div className="card text-center p-16">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                        📅
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Nenhuma atividade ainda</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                        Suas atividades aparecerão aqui assim que você começar a criar seu material pedagógico.
                    </p>
                    <Link href="/app" className="btn-primary">Criar minha primeira atividade</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activities.map((activity) => (
                        <div key={activity.id} className="card group hover:border-primary/50 dark:hover:border-primary/50 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center text-2xl">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDelete(activity.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                                {activity.tema}
                            </h3>

                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                                    {activity.disciplina}
                                </span>
                                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                                    {activity.serie}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex items-center text-xs text-gray-500">
                                    <Calendar className="w-3.3 h-3.3 mr-1" />
                                    {new Date(activity.created_at).toLocaleDateString('pt-BR')}
                                </div>
                                <button
                                    onClick={() => handleView(activity)}
                                    className="text-primary hover:text-primary-700 font-bold text-sm flex items-center gap-1"
                                >
                                    Abrir <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
