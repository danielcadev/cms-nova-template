'use client'

import { ArrowLeft, Copy, Eye, Save } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useState } from 'react'
import slugify from 'slugify'
import { Button } from '@/components/ui/button'
import { DynamicFieldRenderer } from '../DynamicFieldRenderer'

interface ContentType {
  id: string
  name: string
  apiIdentifier: string
  description?: string | null
  fields: Field[]
}

interface Field {
  id: string
  label: string
  apiIdentifier: string
  type: string
  isRequired: boolean
}

interface CreateContentEntryPageProps {
  contentType: ContentType
}

export function CreateContentEntryPage({ contentType }: CreateContentEntryPageProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [status, setStatus] = useState('draft')
  const [slug, setSlug] = useState<string>('')
  const [typePath, setTypePath] = useState<string>(contentType.apiIdentifier)
  const [isSaving, setIsSaving] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const router = useRouter()

  // Generate unique IDs for form elements
  const statusId = useId()
  const pathPrefixId = useId()
  const slugId = useId()

  // Function to generate unique field IDs
  const getFieldId = (fieldId: string) => `field-${fieldId}`

  // Detectar campos destacados comunes: título e imagen principal
  const titleField = contentType.fields.find(
    (f) =>
      (f.type === 'TEXT' || f.type === 'RICH_TEXT') &&
      (/(title|titulo|headline|heading)/i.test(f.apiIdentifier) ||
        /(title|t[íi]tulo|titulo|headline|heading)/i.test(f.label)),
  )
  const imageField = contentType.fields.find(
    (f) =>
      f.type === 'MEDIA' &&
      (/(mainimage|image|imagen|cover|thumbnail|featured)/i.test(f.apiIdentifier) ||
        /(imagen|image|cover|thumbnail|principal|destacada)/i.test(f.label)),
  )

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  // Slug is independent from title; use the "Auto" button to generate on demand

  const handleSave = async (saveStatus: string = status) => {
    setIsSaving(true)

    try {
      const response = await fetch(`/api/content-types/${contentType.apiIdentifier}/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: { ...formData, slug, typePath },
          status: saveStatus,
        }),
      })

      if (response.ok) {
        const _result = await response.json()
        // Keep user in editor after save to avoid unintentional navigation
        // router.push(`/admin/dashboard/content-types/${contentType.apiIdentifier}/content`);
      } else {
        throw new Error('Error al guardar la entrada')
      }
    } catch (error) {
      console.error('Error saving entry:', error)
      alert('Error al guardar la entrada')
    } finally {
      setIsSaving(false)
    }
  }

  const validateForm = () => {
    const requiredFields = contentType.fields.filter((field) => field.isRequired)
    return requiredFields.every((field) => {
      const value = formData[field.apiIdentifier]
      return value !== undefined && value !== null && value !== ''
    })
  }

  const isFormValid = validateForm()

  const handlePublishAndView = async () => {
    if (!slug) return
    setIsSaving(true)
    try {
      const response = await fetch(`/api/content-types/${contentType.apiIdentifier}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { ...formData, slug, typePath }, status: 'published' }),
      })
      if (response.ok) {
        const target = `/${typePath || contentType.apiIdentifier}/${slug}`
        router.push(target)
      } else {
        throw new Error('Error al publicar la entrada')
      }
    } catch (error) {
      console.error('Error publishing entry:', error)
      alert('Error al publicar la entrada')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Cover */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-950" />
          <div className="relative p-6 md:p-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <Link href={`/admin/dashboard/content-types/${contentType.apiIdentifier}/content`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="border border-gray-200 dark:border-gray-800"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Volver
                </Button>
              </Link>
              <div className="min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Create entry</p>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  Crear {contentType.name}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-xl">
                  Completa los campos para crear una nueva entrada.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 ml-auto">
              <div className="flex flex-wrap items-center gap-2">
                <label
                  htmlFor={statusId}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Estado:
                </label>
                <select
                  id={statusId}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicada</option>
                  <option value="archived">Archivada</option>
                </select>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <Button variant="outline" onClick={() => handleSave('draft')} disabled={isSaving}>
                  Guardar como borrador
                </Button>
                <Button onClick={() => handleSave('published')} disabled={isSaving || !isFormValid}>
                  <Save className="h-4 w-4 mr-2" /> {isSaving ? 'Guardando...' : 'Publicar'}
                </Button>
                <Button onClick={handlePublishAndView} disabled={isSaving || !isFormValid || !slug}>
                  <Eye className="h-4 w-4 mr-2" /> {isSaving ? 'Publicando...' : 'Publicar y ver'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Header */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 mb-6">
          <div className="p-4 md:p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">SEO & URL</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div className="md:col-span-2 space-y-3">
                <div>
                  <label
                    htmlFor={pathPrefixId}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Path prefix
                  </label>
                  <input
                    id={pathPrefixId}
                    value={typePath}
                    onChange={(e) =>
                      setTypePath(slugify(e.target.value, { lower: true, strict: true }))
                    }
                    placeholder={contentType.apiIdentifier}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100"
                    title="Lowercase, numbers and dashes only"
                    autoComplete="off"
                    spellCheck={false}
                    inputMode="url"
                    pattern="[a-z0-9-]*"
                  />
                </div>
                <label
                  htmlFor={slugId}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Slug (URL friendly)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id={slugId}
                    value={slug}
                    onChange={(e) =>
                      setSlug(slugify(e.target.value, { lower: true, strict: true }))
                    }
                    placeholder="my-entry"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100"
                    title="Lowercase, numbers and dashes only"
                    autoComplete="off"
                    spellCheck={false}
                    inputMode="url"
                    pattern="[a-z0-9-]*"
                  />
                  {titleField && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const titleValue = formData[titleField.apiIdentifier]
                        if (typeof titleValue === 'string') {
                          setSlug(slugify(titleValue, { lower: true, strict: true }))
                        }
                      }}
                    >
                      Auto
                    </Button>
                  )}
                </div>
                {titleField && (
                  <p className="mt-1 text-xs text-gray-500">
                    Only lowercase letters, numbers and dashes. Use Auto to generate from the title.
                  </p>
                )}
              </div>
              <div className="flex md:block items-center justify-between gap-2">
                <div className="text-xs text-gray-500">
                  Public URL
                  <div className="font-mono mt-1 text-gray-700 dark:text-gray-300 break-all">
                    /{typePath || contentType.apiIdentifier}/{slug || 'my-entry'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard?.writeText(
                      `/${typePath || contentType.apiIdentifier}/${slug || 'my-entry'}`,
                    )
                  }
                  className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/70 dark:bg-gray-900/70 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-8">
          {/* Featured fields stacked: image on top, then title */}
          {(titleField || imageField) && (
            <div className="space-y-6">
              {imageField && (
                <div>
                  <label
                    htmlFor={getFieldId(imageField.id)}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {imageField.label}{' '}
                    {imageField.isRequired && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {mounted ? (
                    <DynamicFieldRenderer
                      field={imageField}
                      value={formData[imageField.apiIdentifier]}
                      onChange={(value) => handleFieldChange(imageField.apiIdentifier, value)}
                      variant="default"
                      fieldId={getFieldId(imageField.id)}
                    />
                  ) : (
                    <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded" />
                  )}
                </div>
              )}

              {titleField && (
                <div>
                  <label
                    htmlFor={getFieldId(titleField.id)}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {titleField.label}{' '}
                    {titleField.isRequired && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {mounted ? (
                    <DynamicFieldRenderer
                      field={titleField}
                      value={formData[titleField.apiIdentifier]}
                      onChange={(value) => handleFieldChange(titleField.apiIdentifier, value)}
                      fieldId={getFieldId(titleField.id)}
                    />
                  ) : (
                    <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded" />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Removed secondary SEO block to keep a single slug control in the header */}

          {/* Remaining fields */}
          <div className="space-y-6">
            {contentType.fields
              .filter((f) => f.id !== titleField?.id && f.id !== imageField?.id)
              .map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={getFieldId(field.id)}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {field.label}
                    {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {mounted ? (
                    <DynamicFieldRenderer
                      field={field}
                      value={formData[field.apiIdentifier]}
                      onChange={(value) => handleFieldChange(field.apiIdentifier, value)}
                      fieldId={getFieldId(field.id)}
                    />
                  ) : (
                    <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded" />
                  )}
                  {field.isRequired && !formData[field.apiIdentifier] && (
                    <p className="text-red-500 text-xs mt-1">Este campo es obligatorio</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
