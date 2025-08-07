"use client"

import { cn } from "@/lib/utils"

interface ContentSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  decorative?: boolean;
}

export function ContentSection({ 
  title, 
  children, 
  className, 
  fullWidth = false,
  decorative = true
}: ContentSectionProps) {
  return (
    <section className={cn("py-16 md:py-24 relative", className)}>
      {decorative && (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-20 top-1/4 w-40 h-40 border border-emerald-500/20 rounded-full" />
          <div className="absolute -right-20 bottom-1/4 w-60 h-60 border border-emerald-500/20 rounded-full" />
        </div>
      )}
      
      <div className={cn("container mx-auto px-4", { "max-w-none": fullWidth })}>
        {title && (
          <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 tracking-tight">
            {title}
            <div className="block h-1 w-16 bg-emerald-500 mt-4 origin-left" />
          </div>
        )}
        
        <div>
          {children}
        </div>
      </div>
    </section>
  )
} 
