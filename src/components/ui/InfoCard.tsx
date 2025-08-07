"use client"

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface InfoCardProps {
  title: string
  description: string
  icon: LucideIcon
  className?: string
  index?: number
}

export function InfoCard({ title, description, icon: Icon, className }: InfoCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm",
        "border border-emerald-100/50 shadow-lg shadow-emerald-900/5",
        "transition-all duration-500 hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1",
        className
      )}
    >
      {/* Efecto de gradiente en hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      {/* Contenido */}
      <div className="relative p-8">
        {/* Icono con animación */}
        <div className="mb-8">
          <div className="inline-flex rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 shadow-lg shadow-emerald-900/5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Icon className="h-8 w-8 text-emerald-600" />
          </div>
        </div>

        {/* Título con animación de línea */}
        <div className="relative mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500 group-hover:w-12" />
        </div>

        {/* Descripción */}
        <p className="text-gray-600 leading-relaxed text-lg">
          {description}
        </p>

        {/* Línea decorativa inferior */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent" />
      </div>

      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]" />
    </div>
  )
} 
