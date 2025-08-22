'use client'

import { AlertCircle, Image as ImageIcon, Settings, Upload, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { NumberField } from '@/components/admin/content/fields/NumberField'
import RichTextField from '@/components/admin/content/fields/RichTextField'
import { TextField } from '@/components/admin/content/fields/TextField'
import { Switch } from '@/components/ui/switch'
import { ThemedButton } from '@/components/ui/ThemedButton'

interface Field {
  id: string
  label: string
  apiIdentifier: string
  type: string
  isRequired: boolean
}

interface DynamicFieldRendererProps {
  field: Field
  value: any
  onChange: (value: any) => void
  variant?: 'default' | 'compact'
  fieldId?: string
}

interface ImageDropZoneProps {
  fieldId: string
  isUploading: boolean
  onFileSelect: (file: File) => void
  variant?: 'default' | 'compact'
}

function ImageDropZone({
  fieldId,
  isUploading,
  onFileSelect,
  variant = 'default',
}: ImageDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find((file) => file.type.startsWith('image/'))

    if (imageFile) {
      onFileSelect(imageFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const outerClasses = variant === 'compact' ? 'p-4 rounded-xl' : 'p-6 rounded-2xl min-h-[200px]'

  const handleClick = () => {
    if (!isUploading) {
      document.getElementById(`file-${fieldId}`)?.click()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <button
      type="button"
      className={`relative border-2 border-dashed ${outerClasses} transition-all duration-200 ${
        isDragOver
          ? 'border-gray-400 bg-gray-50/70 dark:bg-gray-800/40 scale-[1.01]'
          : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
      } ${isUploading ? 'pointer-events-none opacity-75' : 'cursor-pointer bg-white/60 dark:bg-gray-900/60 hover:bg-white/80 dark:hover:bg-gray-900/80'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Loading overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 rounded-xl flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600 mx-auto mb-3"></div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Uploading image...
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This may take a few seconds
            </p>
          </div>
        </div>
      )}

      <div className="text-center">
        {/* Icon with animation */}
        <div
          className={`mx-auto mb-4 transition-transform duration-200 ${isDragOver ? 'scale-105' : ''}`}
        >
          <div
            className={`${variant === 'compact' ? 'w-12 h-12' : 'w-16 h-16'} mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/40 dark:to-gray-700/40 rounded-2xl flex items-center justify-center`}
          >
            <ImageIcon
              className={`${variant === 'compact' ? 'h-6 w-6' : 'h-8 w-8'} transition-colors duration-200 ${
                isDragOver ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'
              }`}
            />
          </div>
        </div>

        {/* Main text */}
        <div className="mb-4">
          <h3
            className={`text-lg font-semibold mb-2 transition-colors duration-200 text-gray-900 dark:text-gray-100`}
          >
            {isDragOver ? 'Drop the image here!' : 'Upload image'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isDragOver ? 'Drop the file to upload' : 'Drag and drop an image or click to select'}
          </p>
        </div>

        {/* Action button */}
        <div className="mb-4">
          <div
            className={`inline-flex items-center ${variant === 'compact' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} rounded-lg font-medium transition-all duration-200 ${
              isDragOver
                ? 'bg-gray-900 text-white shadow'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isDragOver ? 'Soltar archivo' : 'Seleccionar archivo'}
          </div>
        </div>

        {/* File info */}
        <div className="space-y-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Supported formats: PNG, JPG, GIF, WebP
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Max size: 10MB</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              Stored in AWS S3
            </p>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        id={`file-${fieldId}`}
        type="file"
        className="sr-only"
        accept="image/*"
        disabled={isUploading}
        onChange={handleFileChange}
      />
    </button>
  )
}

export function DynamicFieldRenderer({
  field,
  value,
  onChange,
  variant = 'default',
  fieldId,
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
      const isSlug = /slug|alias|url/i.test(field.apiIdentifier)
      return (
        <TextField
          value={value}
          onChange={onChange}
          placeholder={`Enter ${normalizeLabel(field.label).toLowerCase()}`}
          isSlug={isSlug}
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
          id={fieldId}
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
                  variantTone="destructive"
                  size="sm"
                  onClick={() => onChange(null)}
                  className="absolute top-3 right-3 rounded-full h-8 w-8 p-0 shadow-lg"
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onChange(null)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
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
