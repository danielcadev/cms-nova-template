"use client"

import { cn } from "@/lib/utils"

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-white relative overflow-hidden",
        className
      )}
    >
      {/* Elementos decorativos de fondo */}
      <div className="fixed inset-0 -z-10">
        {/* Gradientes sutiles */}
        <div className="absolute inset-x-0 -top-40 h-[500px] bg-gradient-to-b from-emerald-50/50 to-transparent" />
        <div className="absolute inset-x-0 -bottom-40 h-[500px] bg-gradient-to-t from-emerald-50/50 to-transparent" />
        
        {/* Círculos decorativos */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400 rounded-full blur-3xl opacity-10" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full blur-3xl opacity-10" />
        
        {/* Líneas decorativas */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent" />
          <div className="absolute top-3/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent" />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-24">
        {children}
      </div>
    </div>
  )
} 
