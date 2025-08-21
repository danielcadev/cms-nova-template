import { CreateContentTypeForm } from './CreateContentTypeForm'
import { CreateContentTypeHeader } from './CreateContentTypeHeader'

interface CreateContentTypePageProps {
  initialData?: any
  contentTypeId?: string
}

export function CreateContentTypePage({ initialData, contentTypeId }: CreateContentTypePageProps) {
  const isEditing = !!initialData && !!contentTypeId

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Cover */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 mb-6">
          <CreateContentTypeHeader isEditing={isEditing} initialData={initialData} />
        </div>

        {/* Form */}
        <div className="mt-4">
          <CreateContentTypeForm initialData={initialData} contentTypeId={contentTypeId} />
        </div>
      </div>
    </div>
  )
}

export { CreateContentTypeForm } from './CreateContentTypeForm'
// Exportamos también los componentes individuales
export { CreateContentTypeHeader } from './CreateContentTypeHeader'
