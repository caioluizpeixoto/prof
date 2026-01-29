'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import ActivityForm from '@/components/app/ActivityForm'
import LimitCounter from '@/components/app/LimitCounter'

export default function AppPage() {
    const [rateLimit, setRateLimit] = useState<any>(null)

    useEffect(() => {
        // Carregar informações de rate limit do sessionStorage
        const savedRateLimit = sessionStorage.getItem('rateLimit')
        if (savedRateLimit) {
            setRateLimit(JSON.parse(savedRateLimit))
        }
    }, [])

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 gradient-bg py-12">
                <div className="container-main">
                    {/* Título */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
                            Gerador de Atividades
                        </h1>
                        <p className="text-xl text-gray-600">
                            Preencha os campos abaixo e crie sua atividade em segundos
                        </p>
                    </div>

                    {/* Rate Limit Counter */}
                    {rateLimit && (
                        <div className="max-w-md mx-auto mb-8">
                            <LimitCounter
                                remaining={rateLimit.remaining}
                                total={rateLimit.total}
                                resetAt={rateLimit.resetAt}
                            />
                        </div>
                    )}

                    {/* Formulário */}
                    <ActivityForm />
                </div>
            </main>

            <Footer />
        </div>
    )
}
