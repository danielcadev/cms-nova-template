"use client"

import { cn } from "@/lib/utils"

interface PageHeroProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHero({ title, subtitle, className }: PageHeroProps) {
  return (
    <div className={cn("relative overflow-hidden py-24 md:py-32", className)}>
      {/* Elementos decorativos */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-100/30 blur-3xl" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute top-[30%] left-[30%] w-[20%] h-[20%] rounded-full bg-emerald-300/20 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          
          <div className="h-1 w-24 bg-emerald-500 mx-auto mt-10" />
        </div>
      </div>
    </div>
  )
} 
