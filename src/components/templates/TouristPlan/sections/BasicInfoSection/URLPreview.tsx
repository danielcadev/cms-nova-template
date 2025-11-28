import { memo } from 'react'

interface URLPreviewProps {
  section: string
  categoryAlias: string
  articleAlias: string
}

export const URLPreview = memo(function URLPreview({
  section,
  categoryAlias,
  articleAlias,
}: URLPreviewProps) {
  return (
    <div className="text-sm font-mono text-zinc-600 bg-zinc-50 p-4 rounded-lg border border-zinc-200 break-all">
      <span className="text-zinc-400">yourdomain.com</span>
      <span className="text-zinc-300 mx-1">/</span>
      <span className="text-zinc-900 font-medium">{section || 'plans'}</span>
      <span className="text-zinc-300 mx-1">/</span>
      <span className="text-zinc-900 font-medium">{categoryAlias || 'destination'}</span>
      <span className="text-zinc-300 mx-1">/</span>
      <span className="text-blue-600 font-medium">{articleAlias || 'my-plan'}</span>
    </div>
  )
})
