'use client'

import { ArrowRight, FileText, MoreHorizontal, Tag } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Template } from './index'

interface TemplateCardProps {
  template: Template
  index: number
  onViewDetails: (template: Template) => void
}

export function TemplateCard({ template, index, onViewDetails }: TemplateCardProps) {
  const IconComponent = template.icon

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        )
      case 'coming-soon':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Coming Soon
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-50 text-zinc-700 border border-zinc-100">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            Draft
          </span>
        )
    }
  }

  const renderCardContent = () => (
    <div className="group relative h-full bg-white rounded-2xl border border-zinc-200 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-900/5 hover:border-zinc-300 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-900 group-hover:scale-110 transition-transform duration-300">
          <IconComponent className="h-6 w-6" strokeWidth={1.5} />
        </div>

        {getStatusBadge(template.status)}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2 mb-6">
        <h3 className="text-lg font-bold text-zinc-900 tracking-tight group-hover:text-blue-600 transition-colors">
          {template.name}
        </h3>
        <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">{template.description}</p>
      </div>

      {/* Footer Info */}
      <div className="space-y-4 pt-4 border-t border-zinc-100">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5" />
            <span>{template.category}</span>
          </div>
          {template.contentCount !== undefined && (
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              <span>{template.contentCount} items</span>
            </div>
          )}
        </div>

        {/* Action Area */}
        <div className="flex items-center justify-between pt-2">
          {template.status === 'active' && template.route ? (
            <span className="text-sm font-medium text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Manage Content <ArrowRight className="w-4 h-4" />
            </span>
          ) : (
            <span className="text-sm font-medium text-zinc-400 cursor-not-allowed">
              Not Available
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onViewDetails(template)
            }}
            className="h-8 w-8 p-0 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-full" style={{ animationDelay: `${index * 100}ms` }}>
      {template.status === 'active' && template.route ? (
        <Link
          href={template.route}
          className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl"
        >
          {renderCardContent()}
        </Link>
      ) : (
        <div className="block h-full cursor-default">{renderCardContent()}</div>
      )}
    </div>
  )
}
