import { ArrowLeft, Settings } from 'lucide-react'
import Link from 'next/link'

interface CreateContentTypeHeaderProps {
  isEditing?: boolean
  initialData?: any
}

export function CreateContentTypeHeader({
  isEditing = false,
  initialData,
}: CreateContentTypeHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/admin/dashboard/content-types"
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Content Types
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center border border-zinc-200">
            <Settings className="h-5 w-5 text-zinc-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            {isEditing ? initialData?.name || 'Edit Content Type' : 'Create Content Type'}
          </h1>
        </div>
        <p className="text-lg text-zinc-500 max-w-3xl ml-[52px]">
          {isEditing
            ? 'Modify the structure and fields of your content type. Update validations, data types and organization.'
            : 'Define the structure and custom fields for your new content type. Configure validations, data types and organization.'}
        </p>
      </div>
    </div>
  )
}
