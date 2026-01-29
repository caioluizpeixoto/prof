export default function Features() {
    const features = [
        {
            icon: '⚡',
            title: 'Geração em segundos',
            description: 'Crie atividades completas com gabarito em menos de 1 minuto. Inteligência artificial otimizada para educação brasileira.',
        },
        {
            icon: '📚',
            title: 'Alinhado à BNCC',
            description: 'Todas as atividades incluem sugestão de habilidades da Base Nacional Comum Curricular.',
        },
        {
            icon: '🎯',
            title: 'Personalizável',
            description: 'Escolha série, disciplina, tema, quantidade de questões, dificuldade e tipo. Você tem controle total.',
        },
        {
            icon: '📄',
            title: 'PDF pronto para imprimir',
            description: 'Baixe em formato A4 profissional com cabeçalho para escola, professor, turma e data.',
        },
        {
            icon: '💾',
            title: 'Histórico completo',
            description: 'Acesse suas últimas 10 atividades geradas a qualquer momento. Nunca perca seu trabalho.',
        },
        {
            icon: '🔒',
            title: '100% seguro',
            description: 'Seus dados são protegidos e suas atividades ficam salvas apenas para você.',
        },
    ]

    return (
        <section id="features" className="py-20 bg-white dark:bg-gray-950 transition-colors">
            <div className="container-main">
                {/* Header */}
                <div className="text-center mb-16 animate-fadeIn">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                        Tudo que você precisa em um só lugar
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Economize tempo e crie atividades de qualidade profissional com apenas alguns cliques
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="card group hover:scale-105 transition-transform duration-200"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Icon */}
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200">
                                {feature.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Como funciona */}
                <div className="mt-20">
                    <h3 className="text-3xl font-heading font-bold text-center text-gray-900 dark:text-white mb-12">
                        Como funciona?
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: '1', title: 'Preencha o formulário', desc: 'Informe série, disciplina, tema e preferências' },
                            { step: '2', title: 'Clique em gerar', desc: 'Nossa IA cria a atividade em segundos' },
                            { step: '3', title: 'Revise o resultado', desc: 'Veja a atividade, gabarito e habilidade BNCC' },
                            { step: '4', title: 'Baixe em PDF', desc: 'Imprima e use em sala de aula' },
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                                    {item.step}
                                </div>
                                <h4 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-2">
                                    {item.title}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
