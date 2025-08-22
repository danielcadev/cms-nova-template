import { ArrowLeft, Calendar } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface PageHeaderProps {
  title?: string
  description?: string
  backLink?: string | {
    href: string
    label: string
  }
  showDate?: boolean
  children?: ReactNode
  backgroundVariant?: 'blue' | 'green' | 'purple' | 'orange'
}

export function PageLayout({ title, description, backLink, showDate = false, children }: PageHeaderProps) {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Handle backLink as string or object
  const backLinkHref = typeof backLink === 'string' ? backLink : backLink?.href
  const backLinkLabel = typeof backLink === 'string' ? 'Back' : backLink?.label || 'Back'

  return (
    <div className="min-h-screen bg-white relative">
      <div className="relative">
        {/* Header estilo iOS - más compacto y pegado al top */}
        <div className="bg-white border-b border-gray-200 shadow-sm -mt-6 -mx-6 mb-4">
          <div className="container mx-auto px-8 py-3">
            <div className="flex items-center justify-between mb-2">
              {backLink && backLinkHref && (
                <Link href={backLinkHref}>
                  <Button
                    variant="outline"
                    className="group rounded-2xl px-6 py-2 border-gray-200 hover:bg-gray-50 hover:shadow-lg transition-all duration-300"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    {backLinkLabel}
                  </Button>
                </Link>
              )}

              {showDate && (
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                  <Calendar className="h-3.5 w-3.5 text-gray-600" />
                  <span className="text-xs font-medium text-gray-700">{currentDate}</span>
                </div>
              )}
            </div>

            {/* Title and description */}
            {(title || description) && (
              <div className="mb-4">
                {title && (
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-gray-600">
                    {description}
                  </p>
                )}
              </div>
            )}

            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
