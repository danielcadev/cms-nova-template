import { CreateContentTypeForm } from './CreateContentTypeForm'
import { CreateContentTypeHeader } from './CreateContentTypeHeader'

interface CreateContentTypePageProps {
  initialData?: any
  contentTypeId?: string
}

export function CreateContentTypePage({ initialData, contentTypeId }: CreateContentTypePageProps) {
  return <CreateContentTypeForm initialData={initialData} contentTypeId={contentTypeId} />
}

export { CreateContentTypeForm } from './CreateContentTypeForm'
// Exportamos también los componentes individuales
export { CreateContentTypeHeader } from './CreateContentTypeHeader'
