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
    <div className="relative p-8 md:p-10">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/admin/dashboard/content-types"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Content Types
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-3">
        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {isEditing ? initialData?.name || 'Edit content type' : 'Create content type'}
          </h1>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400">
        {isEditing
          ? 'Modify the structure and fields of your content type. Update validations, data types and organization.'
          : 'Define the structure and custom fields for your new content type. Configure validations, data types and organization.'}
      </p>
    </div>
  )
}
