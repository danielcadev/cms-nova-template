import { CreateContentTypeForm } from './CreateContentTypeForm'
import { CreateContentTypeHeader } from './CreateContentTypeHeader'

interface CreateContentTypePageProps {
  initialData?: any
  contentTypeId?: string
}

export function CreateContentTypePage({ initialData, contentTypeId }: CreateContentTypePageProps) {
  const isEditing = !!initialData && !!contentTypeId

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="mx-auto max-w-6xl px-8 py-10">
        {/* Header */}
        <div className="mb-10">
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
