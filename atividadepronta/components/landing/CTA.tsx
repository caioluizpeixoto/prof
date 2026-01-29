import Link from 'next/link'

export default function CTA() {
    return (
        <section className="py-20 bg-gradient-to-r from-primary to-primary-600 dark:from-primary-900 dark:to-primary-700 transition-colors">
            <div className="container-main">
                <div className="max-w-4xl mx-auto text-center text-white">
                    {/* Headline */}
                    <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                        Pronto para economizar horas de trabalho?
                    </h2>

                    {/* Subheadline */}
                    <p className="text-xl md:text-2xl mb-8 opacity-90">
                        Comece grátis agora mesmo. Sem cartão de crédito, sem compromisso.
                    </p>

                    {/* Benefits */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10 text-lg">
                        <div className="flex items-center gap-2">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>3 gerações grátis por dia</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Sem instalação</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Suporte em português</span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                        href="/app"
                        className="inline-block bg-white text-primary font-bold text-xl px-10 py-5 rounded-lg shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-200"
                    >
                        🎓 Criar minha primeira atividade
                    </Link>

                    {/* Small text */}
                    <p className="mt-6 text-sm opacity-75">
                        Junte-se a centenas de professores que já economizam tempo com AtividadePronta
                    </p>
                </div>
            </div>
        </section>
    )
}
