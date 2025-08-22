'use client'

import { ArrowLeft, Copy, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useId, useState } from 'react'
import slugify from 'slugify'
import { ThemedButton } from '@/components/ui/ThemedButton'
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

interface ContentEntry {
  id: string
  data: any
  status: string
  createdAt: string
  updatedAt: string
  contentType: ContentType
}

interface EditContentEntryPageProps {
  entry: ContentEntry
}

export function EditContentEntryPage({ entry }: EditContentEntryPageProps) {
  const [formData, setFormData] = useState<Record<string, any>>(entry.data || {})
  const [status, setStatus] = useState(entry.status)
  const [slug, setSlug] = useState<string>(() => String(entry.data?.slug || ''))
  const [typePath, setTypePath] = useState<string>(() =>
    String(entry.data?.typePath || entry.contentType.apiIdentifier),
  )
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  // Generate unique IDs for form elements
  const statusId = useId()
  const pathPrefixId = useId()
  const slugId = useId()

  // Function to generate unique field IDs
  const getFieldId = (fieldId: string) => `field-${fieldId}`

  // Translate common Spanish labels to English for display only
  const normalizeLabel = (label: string): string => {
    const l = (label || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    const rules: { re: RegExp; out: string }[] = [
      { re: /(titulo del post|titulo de la entrada|post title)/, out: 'Post title' },
      { re: /(titulo|headline|heading)/, out: 'Title' },
      { re: /(imagen principal|main image|cover image)/, out: 'Main image' },
      { re: /(imagen destacada|featured image|thumbnail)/, out: 'Featured image' },
      { re: /(imagen|image|foto|photo)/, out: 'Image' },
      { re: /(descripcion|description)/, out: 'Description' },
      { re: /(contenido|content)/, out: 'Content' },
      { re: /(fecha|date)/, out: 'Date' },
      { re: /(autor|author)/, out: 'Author' },
      { re: /(categoria|categor[ií]a|category)/, out: 'Category' },
      { re: /(etiquetas|tags|tag)/, out: 'Tags' },
    ]
    for (const r of rules) if (r.re.test(l)) return r.out
    return label
  }

  // Campos destacados
  const titleField = entry.contentType.fields.find(
    (f) =>
      (f.type === 'TEXT' || f.type === 'RICH_TEXT') &&
      (/(title|titulo|headline|heading)/i.test(f.apiIdentifier) ||
        /(title|t[íi]tulo|titulo|headline|heading)/i.test(f.label)),
  )
  const imageField = entry.contentType.fields.find(
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
      const response = await fetch(
        `/api/content-types/${entry.contentType.apiIdentifier}/entries/${entry.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: { ...formData, slug, typePath },
            status: saveStatus,
          }),
        },
      )

      if (response.ok) {
        // Stay on editor after save
        // router.push(`/admin/dashboard/content-types/${entry.contentType.apiIdentifier}/content`);
      } else {
        throw new Error('Error updating entry')
      }
    } catch (error) {
      console.error('Error updating entry:', error)
      alert('Error updating entry')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this entry? This action cannot be undone.',
      )
    ) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(
        `/api/content-types/${entry.contentType.apiIdentifier}/entries/${entry.id}`,
        {
          method: 'DELETE',
        },
      )

      if (response.ok) {
        router.push(`/admin/dashboard/content-types/${entry.contentType.apiIdentifier}/content`)
      } else {
        throw new Error('Error deleting entry')
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
      alert('Error deleting entry')
    } finally {
      setIsDeleting(false)
    }
  }

  const validateForm = () => {
    const requiredFields = entry.contentType.fields.filter((field) => field.isRequired)
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
      const response = await fetch(
        `/api/content-types/${entry.contentType.apiIdentifier}/entries/${entry.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { ...formData, slug, typePath }, status: 'published' }),
        },
      )
      if (response.ok) {
        const target = `/${typePath || entry.contentType.apiIdentifier}/${slug}`
        router.push(target)
      } else {
        throw new Error('Error publishing entry')
      }
    } catch (error) {
      console.error('Error publishing entry:', error)
      alert('Error publishing entry')
    } finally {
      setIsSaving(false)
    }
  }

  return (
      <div className="space-y-6">
        {/* Cover */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 mb-6">
          <div className="relative p-6 md:p-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <Link
                href={`/admin/dashboard/content-types/${entry.contentType.apiIdentifier}/content`}
              >
                <ThemedButton variantTone="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </ThemedButton>
              </Link>
              <div className="min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Edit entry</p>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  Edit {entry.contentType.name}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-xl">
                  Update the fields of this entry.
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Created: {new Date(entry.createdAt).toLocaleString()} • Updated:{' '}
                  {new Date(entry.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 ml-auto">
              <div className="flex flex-wrap items-center gap-2">
                <label
                  htmlFor={statusId}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Status:
                </label>
                <select
                  id={statusId}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              {/* Slug UI moved to SEO header below */}
              <div className="flex items-center gap-2 justify-end">
                <ThemedButton
                  variantTone="outline"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> {isDeleting ? 'Deleting...' : 'Delete'}
                </ThemedButton>
                <ThemedButton
                  variantTone="outline"
                  onClick={() => handleSave('draft')}
                  disabled={isSaving}
                >
                  Save as draft
                </ThemedButton>
                <ThemedButton
                  onClick={() => handleSave(status)}
                  disabled={isSaving || !isFormValid}
                >
                  <Save className="h-4 w-4 mr-2" /> {isSaving ? 'Saving...' : 'Save changes'}
                </ThemedButton>
                <ThemedButton
                  onClick={handlePublishAndView}
                  disabled={isSaving || !isFormValid || !slug}
                >
                  <Copy className="h-3.5 w-3.5 mr-2" />{' '}
                  {isSaving ? 'Publishing...' : 'Publish & view'}
                </ThemedButton>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Header */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 mb-6">
          <div className="p-4 md:p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">SEO & URL</h3>
              {status === 'published' && slug && (
                <a
                  href={`/${typePath || entry.contentType.apiIdentifier}/${slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View
                </a>
              )}
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
                    placeholder={entry.contentType.apiIdentifier}
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
                    <ThemedButton
                      type="button"
                      variantTone="outline"
                      size="sm"
                      onClick={() => {
                        const titleValue = formData[titleField.apiIdentifier]
                        if (typeof titleValue === 'string') {
                          setSlug(slugify(titleValue, { lower: true, strict: true }))
                        }
                      }}
                    >
                      Auto
                    </ThemedButton>
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
                    /{typePath || entry.contentType.apiIdentifier}/{slug || 'my-entry'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard?.writeText(
                      `/${typePath || entry.contentType.apiIdentifier}/${slug || 'my-entry'}`,
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

        {/* Main Content Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Content Section */}
            {(titleField || imageField) && (
              <div className="rounded-xl border shadow-sm overflow-hidden" style={{
                backgroundColor: 'var(--theme-card)',
                borderColor: 'var(--theme-border)'
              }}>
                <div className="px-6 py-4 border-b" style={{
                  backgroundColor: 'var(--theme-bg-secondary)',
                  borderBottomColor: 'var(--theme-border)'
                }}>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
                    Main Content
                  </h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--theme-text-secondary)' }}>
                    Primary content fields for your {entry.contentType.name.toLowerCase()}
                  </p>
                </div>
                <div className="p-6 space-y-6">
                  {titleField && (
                    <div>
                      <label
                        htmlFor={getFieldId(titleField.id)}
                        className="block text-sm font-semibold mb-3"
                        style={{ color: 'var(--theme-text-primary)' }}
                      >
                        {normalizeLabel(titleField.label)}{' '}
                        {titleField.isRequired && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <DynamicFieldRenderer
                        field={titleField}
                        value={formData[titleField.apiIdentifier]}
                        onChange={(value) => handleFieldChange(titleField.apiIdentifier, value)}
                        fieldId={getFieldId(titleField.id)}
                      />
                    </div>
                  )}

                  {imageField && (
                    <div>
                      <label
                        htmlFor={getFieldId(imageField.id)}
                        className="block text-sm font-semibold mb-3"
                        style={{ color: 'var(--theme-text-primary)' }}
                      >
                        {normalizeLabel(imageField.label)}{' '}
                        {imageField.isRequired && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <DynamicFieldRenderer
                        field={imageField}
                        value={formData[imageField.apiIdentifier]}
                        onChange={(value) => handleFieldChange(imageField.apiIdentifier, value)}
                        variant="default"
                        fieldId={getFieldId(imageField.id)}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Fields */}
            {entry.contentType.fields.filter((f) => f.id !== titleField?.id && f.id !== imageField?.id).length > 0 && (
              <div className="rounded-xl border shadow-sm overflow-hidden" style={{
                backgroundColor: 'var(--theme-card)',
                borderColor: 'var(--theme-border)'
              }}>
                <div className="px-6 py-4 border-b" style={{
                  backgroundColor: 'var(--theme-bg-secondary)',
                  borderBottomColor: 'var(--theme-border)'
                }}>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
                    Additional Fields
                  </h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--theme-text-secondary)' }}>
                    Extra content and metadata fields
                  </p>
                </div>
                <div className="p-6 space-y-6">
                  {entry.contentType.fields
                    .filter((f) => f.id !== titleField?.id && f.id !== imageField?.id)
                    .map((field) => (
                      <div key={field.id}>
                        <label
                          htmlFor={getFieldId(field.id)}
                          className="block text-sm font-semibold mb-3"
                          style={{ color: 'var(--theme-text-primary)' }}
                        >
                          {normalizeLabel(field.label)}
                          {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                        </label>

                        <DynamicFieldRenderer
                          field={field}
                          value={formData[field.apiIdentifier]}
                          onChange={(value) => handleFieldChange(field.apiIdentifier, value)}
                          fieldId={getFieldId(field.id)}
                        />

                        {field.isRequired && !formData[field.apiIdentifier] && (
                          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                            This field is required
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Content Info */}
            <div className="rounded-xl border shadow-sm overflow-hidden" style={{
              backgroundColor: 'var(--theme-card)',
              borderColor: 'var(--theme-border)'
            }}>
              <div className="px-6 py-4 border-b" style={{
                backgroundColor: 'var(--theme-bg-secondary)',
                borderBottomColor: 'var(--theme-border)'
              }}>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
                  Content Info
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--theme-text-primary)' }}>
                    Content Type
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--theme-text-secondary)' }}>
                    {entry.contentType.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--theme-text-primary)' }}>
                    Status
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--theme-text-secondary)' }}>
                    {status === 'draft' && '📝 Draft'}
                    {status === 'published' && '✅ Published'}
                    {status === 'archived' && '📦 Archived'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--theme-text-primary)' }}>
                    Created
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--theme-text-secondary)' }}>
                    {new Date(entry.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--theme-text-primary)' }}>
                    Last Updated
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--theme-text-secondary)' }}>
                    {new Date(entry.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {slug && (
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--theme-text-primary)' }}>
                      URL Slug
                    </p>
                    <p className="text-sm mt-1 font-mono text-xs px-2 py-1 rounded" style={{ 
                      color: 'var(--theme-text-secondary)',
                      backgroundColor: 'var(--theme-bg-secondary)'
                    }}>
                      /{slug}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t" style={{ borderTopColor: 'var(--theme-border)' }}>
                  <ThemedButton
                    variantTone="outline"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete Entry'}
                  </ThemedButton>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="rounded-xl border shadow-sm overflow-hidden" style={{
              backgroundColor: 'var(--theme-card)',
              borderColor: 'var(--theme-border)'
            }}>
              <div className="px-6 py-4 border-b" style={{
                backgroundColor: 'var(--theme-bg-secondary)',
                borderBottomColor: 'var(--theme-border)'
              }}>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
                  💡 Quick Tips
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <div className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                  <p className="mb-2">• Use the toolbar above to save and publish</p>
                  <p className="mb-2">• Rich text editor supports headings, lists, and formatting</p>
                  <p className="mb-2">• Required fields are marked with a red asterisk (*)</p>
                  <p>• Changes are auto-saved as drafts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
