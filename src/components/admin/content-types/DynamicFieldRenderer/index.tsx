'use client'

import { AlertCircle, Image as ImageIcon, Settings, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { NumberField } from '@/components/admin/content-types/fields/NumberField'
import RichTextField from '@/components/admin/content-types/fields/RichTextField'
import { TextField } from '@/components/admin/content-types/fields/TextField'
import { SlugField } from '@/components/admin/content-types/fields/SlugField'
import { Switch } from '@/components/ui/switch'
import { ThemedButton } from '@/components/ui/ThemedButton'
import { ImageDropZone } from './ImageDropZone'
import type { DynamicFieldRendererProps } from './data'

export function DynamicFieldRenderer({
  field,
  value,
  onChange,
  variant = 'default',
  fieldId,
  onAutoGenerate,
}: DynamicFieldRendererProps) {
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
  const [isUploading, setIsUploading] = useState(false)
  const [s3Configured, setS3Configured] = useState<boolean | null>(null)
  const [isCheckingS3, setIsCheckingS3] = useState(true)

  // Verificar si S3 está configurado cuando el componente se monta
  useEffect(() => {
    const checkS3Configuration = async () => {
      try {
        const response = await fetch('/api/plugins/s3', { cache: 'no-store' })
        const contentType = response.headers.get('content-type') || ''
        if (!response.ok || !contentType.includes('application/json')) {
          setS3Configured(false)
        } else {
          const data = await response.json()
          setS3Configured(data.success && data.config !== null)
        }
      } catch (error) {
        console.error('Error checking S3 configuration:', error)
        setS3Configured(false)
      } finally {
        setIsCheckingS3(false)
      }
    }

    // Solo verificar S3 si el campo es de tipo MEDIA
    if (field.type === 'MEDIA') {
      checkS3Configuration()
    } else {
      setIsCheckingS3(false)
    }
  }, [field.type])

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'content')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        onChange({
          url: result.url,
          fileName: result.fileName,
          size: result.size,
          type: result.type,
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al subir el archivo')
      }
    } catch (error) {
      console.error('Error uploading file:', error)

      // Mostrar error más específico
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido al subir el archivo'

      // Si el error es de S3 no configurado, actualizar el estado
      if (errorMessage.includes('S3 no está configurado')) {
        setS3Configured(false)
      }

      alert(`Error: ${errorMessage}`)
    } finally {
      setIsUploading(false)
    }
  }

  switch (field.type) {
    case 'TEXT': {
      // Legacy check for slug in text fields, can keep for backward compatibility
      const isSlug = /slug|alias|url/i.test(field.apiIdentifier)
      return (
        <TextField
          value={value}
          onChange={onChange}
          placeholder={`Enter ${normalizeLabel(field.label).toLowerCase()}`}
          isSlug={isSlug}
          id={fieldId}
          onAutoGenerate={onAutoGenerate}
        />
      )
    }

    case 'SLUG': {
      return (
        <SlugField
          value={value}
          onChange={onChange}
          onAutoGenerate={onAutoGenerate}
          placeholder={field.label || 'url-slug'}
          id={fieldId}
        />
      )
    }

    case 'RICH_TEXT': {
      return (
        <RichTextField
          value={value}
          onChange={onChange}
          placeholder={`Enter ${normalizeLabel(field.label).toLowerCase()}`}
          onAutoGenerate={onAutoGenerate}
        />
      )
    }

    case 'NUMBER': {
      return (
        <NumberField
          value={value}
          onChange={onChange}
          placeholder={`Enter ${normalizeLabel(field.label).toLowerCase()}`}
          id={fieldId}
        />
      )
    }

    case 'BOOLEAN':
      return (
        <div className="flex items-center gap-3">
          <Switch id={fieldId} checked={!!value} onCheckedChange={onChange} />
        </div>
      )

    case 'DATE':
      return (
        <input
          id={fieldId}
          type="date"
          value={value ? new Date(value).toISOString().split('T')[0] : ''}
          onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-transparent"
        />
      )

    case 'MEDIA':
      // Mostrar loading mientras verifica S3
      if (isCheckingS3) {
        return (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900 dark:border-gray-700 dark:border-t-gray-100 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Checking configuration...</p>
            </div>
          </div>
        )
      }

      // Mostrar mensaje si S3 no está configurado
      if (s3Configured === false) {
        return (
          <div
            className={`border-2 border-dashed border-amber-300 dark:border-amber-600 rounded-lg ${variant === 'compact' ? 'p-4' : 'p-5'} bg-amber-50 dark:bg-amber-900/20`}
          >
            <div className="text-center">
              <AlertCircle
                className={`mx-auto ${variant === 'compact' ? 'h-8 w-8' : 'h-10 w-10'} text-amber-500`}
              />
              <div className="mt-4">
                <h3
                  className={`${variant === 'compact' ? 'text-xs' : 'text-sm'} font-medium text-amber-800 dark:text-amber-200 mb-1`}
                >
                  S3 not configured
                </h3>
                <p
                  className={`${variant === 'compact' ? 'text-[11px]' : 'text-xs'} text-amber-700 dark:text-amber-300 mb-3`}
                >
                  To upload images you need to configure AWS S3 first
                </p>
                <Link href="/admin/dashboard/plugins">
                  <ThemedButton size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure S3
                  </ThemedButton>
                </Link>
              </div>
            </div>
          </div>
        )
      }

      // Renderizar según variante
      if (variant === 'default') {
        return (
          <div className="space-y-4">
            {value?.url ? (
              <div className="relative">
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <Image
                    src={value.url}
                    alt={value.fileName || 'Image'}
                    fill
                    className="object-cover"
                  />
                </div>
                <ThemedButton
                  variantTone="outline"
                  size="sm"
                  onClick={() => onChange(null)}
                  className="absolute top-3 right-3 rounded-full h-8 w-8 p-0 shadow-lg bg-red-500 hover:bg-red-600 text-white border-red-500"
                >
                  <X className="h-4 w-4" />
                </ThemedButton>
                {value.fileName && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {value.fileName}
                    {value.size ? ` • ${Math.round(value.size / 1024)} KB` : ''}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <ImageDropZone
                  fieldId={field.id}
                  isUploading={isUploading}
                  onFileSelect={handleFileUpload}
                  variant="default"
                />
              </div>
            )}
          </div>
        )
      }

      // Variante compacta (preview pequeño tipo tarjeta)
      return (
        <div className="space-y-4">
          {value?.url ? (
            <div className="relative max-w-[260px]">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 relative">
                    <Image
                      src={value.url}
                      alt={value.fileName || 'Imagen'}
                      width={120}
                      height={68}
                      className="object-cover rounded-md shadow-sm"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                      {value.fileName || 'Imagen'}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {value.size ? `${Math.round(value.size / 1024)} KB` : ''}
                    </p>
                  </div>
                  <ThemedButton
                    variantTone="outline"
                    size="sm"
                    onClick={() => onChange(null)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </ThemedButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-[260px]">
              <ImageDropZone
                fieldId={field.id}
                isUploading={isUploading}
                onFileSelect={handleFileUpload}
                variant={variant}
              />
            </div>
          )}
        </div>
      )

    default:
      return (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Tipo de campo no soportado: {field.type}
          </p>
        </div>
      )
  }
}
