'use client'

import { useState } from 'react'
import { Sparkles, X, Wand2, Check, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useTranslations, useLocale } from 'next-intl'

interface AIPromptModalProps {
    isOpen: boolean
    onClose: () => void
    onApply: (text: string) => void
    fieldLabel: string
    initialPrompt?: string
}

export function AIPromptModal({
    isOpen,
    onClose,
    onApply,
    fieldLabel,
    initialPrompt = '',
}: AIPromptModalProps) {
    const t = useTranslations('plugins.config.gemini.assistant')
    const locale = useLocale()
    const [prompt, setPrompt] = useState(initialPrompt)
    const [result, setResult] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!isOpen) return null

    const handleGenerate = async () => {
        if (!prompt.trim()) return

        setIsGenerating(true)
        setError(null)

        try {
            // Append language instruction
            const systemLang = locale === 'es' ? 'español' : 'English'
            const finalPrompt = `${prompt.trim()}\n\nIMPORTANT: Respond ONLY in ${systemLang}.`

            const response = await fetch('/api/admin/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: finalPrompt }),
            })

            const data = await response.json()

            if (data.success && data.text) {
                setResult(data.text)
            } else {
                setError(data.error || 'Failed to generate content')
            }
        } catch (err) {
            console.error('AI Generation Error:', err)
            setError('An unexpected error occurred')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleApply = () => {
        onApply(result)
        onClose()
        // Reset state for next time
        setResult('')
        setPrompt('')
    }

    const templates = [
        { label: t('templates.blog'), prompt: t('prompts.blog') },
        { label: t('templates.story'), prompt: t('prompts.story') },
        { label: t('templates.product'), prompt: t('prompts.product') },
        { label: t('templates.summary'), prompt: t('prompts.summary') },
        { label: t('templates.seo'), prompt: t('prompts.seo') },
    ]

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-zinc-200 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900">{t('title')}</h3>
                            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                                {t('generatingFor')}: {fieldLabel}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400 hover:text-zinc-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Prompt Input */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-zinc-700 uppercase tracking-tight flex items-center gap-2">
                                <Sparkles className="w-3 h-3" />
                                {t('quickTemplates')}
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {templates.map((template) => (
                                    <button
                                        key={template.label}
                                        onClick={() => setPrompt(template.prompt)}
                                        className="px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors border border-zinc-200/50"
                                    >
                                        {template.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-zinc-700 uppercase tracking-tight">
                                {t('yourPrompt')}
                            </Label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={t('placeholder')}
                                className="w-full h-32 p-4 rounded-2xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all resize-none text-sm leading-relaxed"
                                autoFocus
                            />
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !prompt.trim()}
                                    className="rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 h-9 px-4 shadow-sm"
                                >
                                    {isGenerating ? (
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Wand2 className="w-4 h-4 mr-2" />
                                    )}
                                    {isGenerating ? t('generating') : t('generate')}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Result Area */}
                    {(result || error) && (
                        <div className={`space-y-2 animate-in slide-in-from-top-2 duration-300 pb-4`}>
                            <Label className="text-xs font-bold text-zinc-700 uppercase tracking-tight">
                                {t('response')}
                            </Label>
                            {error ? (
                                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm">
                                    {error}
                                </div>
                            ) : (
                                <div className="group relative">
                                    <div className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-sm text-sm leading-relaxed text-zinc-800 whitespace-pre-wrap max-h-[450px] overflow-y-auto custom-scrollbar-thin">
                                        {result}
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600 uppercase">
                                            {t('ready')}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-end gap-3 bg-zinc-50/50">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="rounded-xl text-zinc-500 hover:text-zinc-900"
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        onClick={handleApply}
                        disabled={!result || isGenerating}
                        className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 h-11 px-8 shadow-lg shadow-zinc-900/20"
                    >
                        <Check className="w-4 h-4 mr-2" />
                        {t('apply')}
                    </Button>
                </div>
            </div>
        </div>
    )
}
