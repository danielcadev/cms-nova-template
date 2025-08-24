import { ContentTypeDetail } from '@/components/admin/dashboard/ContentTypesPage/ContentTypeDetail'
import { PageLayout } from '@/components/admin/shared/PageLayout'

interface ContentTypeDetailPageProps {
  params: {
    slug: string
  }
}

export default function ContentTypeDetailPage({ params }: ContentTypeDetailPageProps) {
  const { slug } = params

  return (
    <PageLayout
      title={`Content Type: ${slug}`}
      description={`Manage ${slug} content type`}
      backLink="/admin/dashboard/content-types"
    >
      <ContentTypeDetail slug={slug} />
    </PageLayout>
  )
}
