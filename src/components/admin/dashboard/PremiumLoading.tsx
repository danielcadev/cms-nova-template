'use client'

import { LayoutTemplate, LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface PremiumLoadingProps {
    title: string
    subtitle?: string
    icon?: LucideIcon
    footer?: ReactNode
}

export function PremiumLoading({
    title,
    subtitle,
    icon: Icon = LayoutTemplate,
    footer
}: PremiumLoadingProps) {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 border-4 border-zinc-100 rounded-[2rem] animate-pulse"></div>
                    <div className="absolute inset-0 border-4 border-zinc-900 border-t-transparent rounded-[2rem] animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="w-8 h-8 text-zinc-900" />
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-zinc-900 mb-3 tracking-tight">{title}</h3>
                    {subtitle && <p className="text-zinc-500 leading-relaxed font-medium">{subtitle}</p>}
                </div>

                {footer || (
                    <div className="flex items-center justify-center gap-1.5 overflow-hidden font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 bg-zinc-200 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-zinc-200 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-zinc-200 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                )}
            </div>
        </div>
    )
}
