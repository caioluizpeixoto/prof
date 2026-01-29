import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import CTA from '@/components/landing/CTA'

export default function Home() {
    return (
        <main className="min-h-screen">
            <Header />
            <Hero />
            <Features />
            <CTA />
            <Footer />
        </main>
    )
}
