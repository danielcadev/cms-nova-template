import { CreateContentTypeForm } from './CreateContentTypeForm'

interface CreateContentTypePageProps {
  initialData?: any
  contentTypeId?: string
}

export function CreateContentTypePage({ initialData, contentTypeId }: CreateContentTypePageProps) {
  return <CreateContentTypeForm initialData={initialData} contentTypeId={contentTypeId} />
}

export { CreateContentTypeForm } from './CreateContentTypeForm'
// Also export individual components.
export { CreateContentTypeHeader } from './CreateContentTypeHeader'
