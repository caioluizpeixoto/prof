import Link from 'next/link'

export default function Hero() {
    return (
        <section className="gradient-bg min-h-screen flex items-center justify-center px-4 py-20 transition-colors">
            <div className="container-main">
                <div className="max-w-4xl mx-auto text-center animate-fadeIn">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-slideInRight">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Ferramenta #1 para professores brasileiros
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        Crie atividades escolares com{' '}
                        <span className="text-primary dark:text-primary-400">gabarito</span> em{' '}
                        <span className="text-secondary dark:text-secondary-400">minutos</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Material pronto para imprimir, alinhado ao padrão brasileiro e à BNCC.
                        Economize horas de trabalho e foque no que realmente importa: ensinar.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <Link href="/app" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
                            🚀 Começar grátis
                        </Link>
                        <Link href="#features" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
                            Ver como funciona
                        </Link>
                    </div>

                    {/* Social Proof */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-primary-400 border-2 border-white dark:border-gray-900"></div>
                                <div className="w-8 h-8 rounded-full bg-secondary-400 border-2 border-white dark:border-gray-900"></div>
                                <div className="w-8 h-8 rounded-full bg-accent-400 border-2 border-white dark:border-gray-900"></div>
                            </div>
                            <span className="text-sm font-medium">+500 professores usando</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-medium">4.9/5 de avaliação</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
