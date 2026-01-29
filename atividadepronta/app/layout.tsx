import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const poppins = Poppins({
    weight: ['600', '700', '800'],
    subsets: ['latin'],
    variable: '--font-poppins',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'AtividadePronta - Crie atividades escolares com gabarito em minutos',
    description: 'Gerador de atividades escolares para professores brasileiros. Material pronto para imprimir, alinhado ao padrão brasileiro e à BNCC.',
    keywords: 'atividades escolares, gerador de atividades, professores, BNCC, educação, material didático',
    authors: [{ name: 'AtividadePronta' }],
    openGraph: {
        title: 'AtividadePronta - Crie atividades escolares com gabarito em minutos',
        description: 'Material pronto para imprimir, alinhado ao padrão brasileiro',
        type: 'website',
    },
}

import { ThemeProvider } from '@/components/shared/ThemeProvider'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
            <body className="min-h-screen">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
