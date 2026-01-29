import Link from 'next/link'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="container-main">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white text-xl font-bold">
                                A
                            </div>
                            <span className="text-xl font-heading font-bold text-white">
                                AtividadePronta
                            </span>
                        </div>
                        <p className="text-gray-400 max-w-md">
                            Ferramenta inteligente para professores brasileiros criarem atividades escolares
                            com gabarito em minutos. Alinhado à BNCC e pronto para imprimir.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-heading font-bold mb-4">Produto</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/app" className="hover:text-primary transition-colors">
                                    Gerar Atividade
                                </Link>
                            </li>
                            <li>
                                <Link href="/app/historico" className="hover:text-primary transition-colors">
                                    Histórico
                                </Link>
                            </li>
                            <li>
                                <Link href="/#features" className="hover:text-primary transition-colors">
                                    Funcionalidades
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-heading font-bold mb-4">Suporte</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="mailto:contato@atividadepronta.com" className="hover:text-primary transition-colors">
                                    Contato
                                </a>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-primary transition-colors">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/registro" className="hover:text-primary transition-colors">
                                    Criar conta
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        © {currentYear} AtividadePronta. Todos os direitos reservados.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link href="/privacidade" className="hover:text-primary transition-colors">
                            Privacidade
                        </Link>
                        <Link href="/termos" className="hover:text-primary transition-colors">
                            Termos de Uso
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
