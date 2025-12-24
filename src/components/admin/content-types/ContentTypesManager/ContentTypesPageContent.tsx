'use client'

import { Database, FileCode, Plus, Settings, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { AdminLoading } from '@/components/admin/dashboard/AdminLoading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

interface ContentType {
  id: string
  name: string
  apiIdentifier: string
  description?: string | null
  fields: any[]
  createdAt: string
  updatedAt: string
}

interface ContentTypesPageContentProps {
  contentTypes: ContentType[]
  loading: boolean
  error: string | null
  searchTerm: string
  onSearchChange: (term: string) => void
  filteredContentTypes: ContentType[]
  onRefresh?: () => void
}

export function ContentTypesPageContent({
  loading,
  error,
  filteredContentTypes,
  searchTerm,
  onSearchChange,
}: ContentTypesPageContentProps) {
  const t = useTranslations('contentTypes')
  const router = useRouter()
  const { toast } = useToast()
  const [searchValue, setSearchValue] = useState(searchTerm)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const _handleSearchChange = (value: string) => {
    setSearchValue(value)
    onSearchChange(value)
  }

  const handleDelete = async (contentType: ContentType, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (deletingId) return

    const confirmed = confirm(
      `¿Estás seguro de que quieres eliminar "${contentType.name}"?\n\nEsta acción no se puede deshacer y eliminará todas las entradas asociadas.`
    )

    if (!confirmed) return

    try {
      setDeletingId(contentType.id)

      const response = await fetch(`/api/admin/content-types/${contentType.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Tipo de contenido eliminado',
          description: `"${contentType.name}" ha sido eliminado exitosamente.`,
        })
        router.refresh()
      } else {
        toast({
          title: 'Error',
          description: result.message || 'No se pudo eliminar el tipo de contenido.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error deleting content type:', error)
      toast({
        title: 'Error',
        description: 'Ocurrió un error al eliminar el tipo de contenido.',
        variant: 'destructive',
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="px-6 pt-6 relative">
        <AdminLoading
          title={t('title')}
          message={t('loading')}
          variant="content"
          fullScreen
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Database className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-medium text-zinc-900 mb-2">{t('error.title')}</h3>
          <p className="text-zinc-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">{t('title')}</h1>
            <p className="text-zinc-500 mt-1">{t('subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              asChild
              className="rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            >
              <Link href="/admin/dashboard/view-content">
                <Database className="h-4 w-4 mr-2" />
                {t('header.viewContent')}
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/20"
            >
              <Link href="/admin/dashboard/content-types/create">
                <Plus className="h-4 w-4 mr-2" />
                {t('header.newType')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileCode className="w-32 h-32 text-zinc-900" />
          </div>
          <div className="relative z-10">
            <h3 className="font-semibold text-zinc-900 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-zinc-500" />
              {t('info.title')}
            </h3>
            <p className="text-sm text-zinc-600 mt-2 max-w-2xl leading-relaxed">
              {t.rich('info.description', {
                listRoute: () => (
                  <code className="px-1.5 py-0.5 rounded bg-white border border-zinc-200 text-xs font-mono text-zinc-800">
                    /[typePath]
                  </code>
                ),
                detailRoute: () => (
                  <code className="px-1.5 py-0.5 rounded bg-white border border-zinc-200 text-xs font-mono text-zinc-800">
                    /[typePath]/[slug]
                  </code>
                ),
              })}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchValue}
            onChange={(e) => _handleSearchChange(e.target.value)}
            className="rounded-xl border-zinc-200 bg-white pl-4 h-11 focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
          />
        </div>

        {/* Grid */}
        {filteredContentTypes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContentTypes.map((contentType) => (
              <div
                key={contentType.id}
                className="group relative flex flex-col bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-zinc-900/5 hover:border-zinc-300 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-900 group-hover:scale-110 group-hover:bg-zinc-100 transition-all duration-300">
                    <Database className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 relative z-10"
                    >
                      <Link
                        href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/edit`}
                      >
                        <Settings className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDelete(contentType, e)}
                      disabled={deletingId === contentType.id}
                      className="h-8 w-8 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-600 relative z-10 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-zinc-900 mb-1 group-hover:text-zinc-700 transition-colors">
                    {contentType.name}
                  </h3>
                  <p className="text-sm text-zinc-500 line-clamp-2 h-10">
                    {contentType.description || t('card.noDescription')}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-zinc-500 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
                    <span className="font-mono text-xs font-medium">
                      {contentType.apiIdentifier}
                    </span>
                  </div>
                  <div className="text-zinc-400 text-xs">
                    {t('card.fields', { count: contentType.fields?.length || 0 })}
                  </div>
                </div>

                <Link
                  href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/content`}
                  className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                >
                  <span className="sr-only">{t('card.viewEntries', { name: contentType.name })}</span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
            <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-zinc-100">
              <Database className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 mb-2">{t('empty.title')}</h3>
            <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">
              {searchValue
                ? t('empty.noMatch', { query: searchValue })
                : t('empty.createFirst')}
            </p>
            {!searchValue && (
              <Button asChild className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800">
                <Link href="/admin/dashboard/content-types/create">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('empty.button')}
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
