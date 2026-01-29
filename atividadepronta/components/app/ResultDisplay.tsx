'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import type { GeneratedActivity } from '@/types'
import { FileText, CheckCircle, Target, RefreshCw, Download, School, User as UserIcon, Calendar, BookOpen } from 'lucide-react'

interface ResultDisplayProps {
    activity: GeneratedActivity
}

export default function ResultDisplay({ activity }: ResultDisplayProps) {
    const router = useRouter()
    const [isDownloading, setIsDownloading] = useState(false)
    const [headerInfo, setHeaderInfo] = useState({
        escola: '',
        professor: '',
        turma: '',
        data: new Date().toLocaleDateString('pt-BR')
    })

    const handleDownloadPDF = async () => {
        setIsDownloading(true)
        try {
            const element = document.getElementById('pdf-content')
            if (!element) throw new Error('Elemento não encontrado')

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 800 // Fix width for consistent PDF layout
            })

            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4')
            const pageWidth = pdf.internal.pageSize.getWidth()
            const imgWidth = pageWidth - 20
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
            pdf.save(`Atividade_${activity.formData.tema.replace(/\s+/g, '_')}.pdf`)
        } catch (error) {
            console.error('Erro ao gerar PDF:', error)
            alert('Erro ao gerar PDF. Tente novamente.')
        } finally {
            setIsDownloading(false)
        }
    }

    const handleNewActivity = () => {
        router.push('/app')
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header com ações - NO PRINT */}
            <div className="card no-print">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-1">
                            Atividade Gerada! 🎉
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {activity.formData.disciplina} • {activity.formData.serie}
                        </p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isDownloading}
                            className="btn-success flex items-center justify-center gap-2 flex-1 sm:flex-none py-2 px-4"
                        >
                            {isDownloading ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4" />
                            )}
                            <span>Baixar PDF</span>
                        </button>
                        <button
                            onClick={handleNewActivity}
                            className="btn-secondary flex items-center justify-center gap-2 flex-1 sm:flex-none py-2 px-4"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Nova</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Configurações do Cabeçalho - NO PRINT */}
            <div className="card no-print bg-primary-50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-800">
                <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <School className="w-5 h-5 text-primary" />
                    Personalizar Cabeçalho
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Escola</label>
                        <input
                            type="text"
                            className="input-field py-2 text-sm"
                            placeholder="Nome da escola"
                            value={headerInfo.escola}
                            onChange={(e) => setHeaderInfo({ ...headerInfo, escola: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Professor(a)</label>
                        <input
                            type="text"
                            className="input-field py-2 text-sm"
                            placeholder="Seu nome"
                            value={headerInfo.professor}
                            onChange={(e) => setHeaderInfo({ ...headerInfo, professor: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Turma</label>
                        <input
                            type="text"
                            className="input-field py-2 text-sm"
                            placeholder="Ex: 5º ano A"
                            value={headerInfo.turma}
                            onChange={(e) => setHeaderInfo({ ...headerInfo, turma: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase">Data</label>
                        <input
                            type="text"
                            className="input-field py-2 text-sm"
                            value={headerInfo.data}
                            onChange={(e) => setHeaderInfo({ ...headerInfo, data: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* ÁREA DO PDF (VISÍVEL NA TELA TAMBÉM) */}
            <div id="pdf-content" className="bg-white text-black p-8 shadow-2xl mx-auto rounded-none w-full max-w-[210mm] min-h-[297mm] font-sans">
                {/* Cabeçalho Escolar */}
                <div className="border-2 border-black p-4 mb-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border-b border-black pb-1">
                            <span className="text-xs font-bold uppercase tracking-wider block">Escola:</span>
                            <span className="text-sm min-h-[1.25rem] block">{headerInfo.escola}</span>
                        </div>
                        <div className="border-b border-black pb-1">
                            <span className="text-xs font-bold uppercase tracking-wider block">Data:</span>
                            <span className="text-sm min-h-[1.25rem] block">{headerInfo.data}</span>
                        </div>
                        <div className="border-b border-black pb-1">
                            <span className="text-xs font-bold uppercase tracking-wider block">Professor(a):</span>
                            <span className="text-sm min-h-[1.25rem] block">{headerInfo.professor}</span>
                        </div>
                        <div className="border-b border-black pb-1">
                            <span className="text-xs font-bold uppercase tracking-wider block">Aluno(a):</span>
                            <div className="w-full h-4"></div>
                        </div>
                    </div>
                    <div className="mt-2 text-center border-t border-black pt-2">
                        <h1 className="text-xl font-bold uppercase tracking-widest">{activity.formData.disciplina} - {activity.formData.serie}</h1>
                        <p className="text-sm font-medium mt-1 italic">{activity.formData.tema}</p>
                    </div>
                </div>

                {/* Conteúdo da Atividade */}
                <div className="prose prose-sm max-w-none text-black">
                    <div className="whitespace-pre-wrap leading-relaxed text-base font-sans">
                        {activity.atividade}
                    </div>
                </div>

                {/* Footer BNCC no PDF */}
                {activity.bncc && activity.bncc !== 'Não especificada' && (
                    <div className="mt-12 pt-4 border-t border-dotted border-gray-400">
                        <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest mb-1">Habilidade BNCC:</p>
                        <p className="text-[11px] text-gray-800 leading-tight">{activity.bncc}</p>
                    </div>
                )}
            </div>

            {/* Gabarito (Separado do PDF Principal se desejar, ou pode incluir) */}
            <div className="card no-print border-2 border-secondary-200 dark:border-secondary-900/30">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-white text-xl">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                        GABARITO
                    </h3>
                </div>
                <div className="bg-secondary-50 dark:bg-secondary-900/10 p-6 rounded-lg whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200 leading-relaxed border border-secondary-100 dark:border-secondary-900/20">
                    {activity.gabarito}
                </div>
            </div>

            <div className="no-print text-center pt-8">
                <p className="text-gray-500 text-sm mb-4">Dica: O arquivo PDF gerado terá o tamanho A4 perfeito para impressão.</p>
                <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="btn-primary flex items-center gap-2 mx-auto"
                >
                    {isDownloading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                    Baixar Atividade em PDF
                </button>
            </div>
        </div>
    )
}
