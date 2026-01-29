'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'

export default function Header() {
    const pathname = usePathname()
    const isLandingPage = pathname === '/'

    return (
        <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors">
            <nav className="container-main py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform shadow-md">
                            A
                        </div>
                        <span className="text-xl font-heading font-bold text-gray-900 dark:text-gray-100">
                            AtividadePronta
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <ThemeToggle />

                        {!isLandingPage && (
                            <div className="hidden md:flex items-center gap-2">
                                <Link
                                    href="/app"
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${pathname === '/app'
                                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400'
                                        }`}
                                >
                                    Gerar Atividade
                                </Link>
                                <Link
                                    href="/app/historico"
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${pathname === '/app/historico'
                                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400'
                                        }`}
                                >
                                    Histórico
                                </Link>
                            </div>
                        )}

                        {isLandingPage ? (
                            <Link href="/app" className="btn-primary text-sm sm:text-base">
                                Começar grátis
                            </Link>
                        ) : (
                            <Link href="/login" className="btn-secondary text-sm px-4 py-2 whitespace-nowrap">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    )
}
