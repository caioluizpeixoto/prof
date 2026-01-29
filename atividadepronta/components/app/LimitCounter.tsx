'use client'

import { useEffect, useState } from 'react'

interface LimitCounterProps {
    remaining: number
    total: number
    resetAt: string
}

export default function LimitCounter({ remaining, total, resetAt }: LimitCounterProps) {
    const [timeUntilReset, setTimeUntilReset] = useState('')

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date()
            const reset = new Date(resetAt)
            const diff = reset.getTime() - now.getTime()

            if (diff <= 0) {
                setTimeUntilReset('Em breve')
                return
            }

            const hours = Math.floor(diff / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

            setTimeUntilReset(`${hours}h ${minutes}min`)
        }

        updateTimer()
        const interval = setInterval(updateTimer, 60000) // Atualizar a cada minuto

        return () => clearInterval(interval)
    }, [resetAt])

    const percentage = (remaining / total) * 100
    const isLow = remaining <= 2

    return (
        <div className={`card ${isLow ? 'border-2 border-accent-300' : ''}`}>
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-bold text-gray-900">
                    Gerações Disponíveis
                </h3>
                <span className={`text-2xl font-bold ${isLow ? 'text-accent-600' : 'text-primary'}`}>
                    {remaining}/{total}
                </span>
            </div>

            {/* Barra de progresso */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-300 ${isLow ? 'bg-accent-500' : 'bg-primary'
                        }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Reset em: {timeUntilReset}</span>
                {remaining === 0 && (
                    <span className="text-accent-600 font-semibold">
                        ⚠️ Limite atingido
                    </span>
                )}
            </div>

            {isLow && remaining > 0 && (
                <p className="mt-3 text-sm text-accent-700 bg-accent-50 px-3 py-2 rounded-lg">
                    💡 Dica: Faça login para ter mais gerações por dia!
                </p>
            )}
        </div>
    )
}
