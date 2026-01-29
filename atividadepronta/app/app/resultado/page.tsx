'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import ResultDisplay from '@/components/app/ResultDisplay'
import type { GeneratedActivity } from '@/types'

export default function ResultadoPage() {
    const router = useRouter()
    const [activity, setActivity] = useState<GeneratedActivity | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Carregar atividade do sessionStorage
        const savedActivity = sessionStorage.getItem('currentActivity')

        if (!savedActivity) {
            // Se não há atividade, redirecionar para o formulário
            router.push('/app')
            return
        }

        try {
            const parsedActivity = JSON.parse(savedActivity)
            setActivity(parsedActivity)
        } catch (error) {
            console.error('Erro ao carregar atividade:', error)
            router.push('/app')
        } finally {
            setIsLoading(false)
        }
    }, [router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center gradient-bg">
                <div className="text-center">
                    <div className="spinner w-16 h-16 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Carregando resultado...</p>
                </div>
            </div>
        )
    }

    if (!activity) {
        return null
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 gradient-bg py-12">
                <div className="container-main">
                    <ResultDisplay activity={activity} />
                </div>
            </main>

            <Footer />
        </div>
    )
}
