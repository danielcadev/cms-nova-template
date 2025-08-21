// components/cms/TemplateSystem/TouristPlan/components/MainImage.tsx
'use client'

import { Image as ImageIcon, Loader2, Plug, Upload, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { MediaPicker } from '@/components/admin/media/MediaPicker'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useMainImage } from '@/hooks/use-main-image'
import { cn } from '@/lib/utils'
import type { PlanFormValues } from '@/schemas/plan'

interface MainImageProps {
  form: UseFormReturn<PlanFormValues>
}

export function MainImage({ form }: MainImageProps) {
  const { isUploading, error, handleImageUpload, handleImageDelete } = useMainImage({ form })
  const mainImage = form.watch('mainImage')
  const [isS3Configured, setIsS3Configured] = useState(false)
  const [isLoadingConfig, setIsLoadingConfig] = useState(true)

  useEffect(() => {
    const fetchS3Config = async () => {
      try {
        const response = await fetch('/api/plugins/s3')
        const data = await response.json()

        // Verificar que la configuración existe y tiene las propiedades necesarias
        if (
          data.success &&
          data.config &&
          data.config.bucket &&
          data.config.accessKeyId &&
          data.config.secretAccessKey &&
          data.config.region
        ) {
          setIsS3Configured(true)
        } else {
          setIsS3Configured(false)
        }
      } catch (error) {
        console.error('Failed to load S3 configuration', error)
        setIsS3Configured(false)
      } finally {
        setIsLoadingConfig(false)
      }
    }
    fetchS3Config()
  }, [])

  // Normalize mainImage structure when it is a string (edit mode)
  useEffect(() => {
    const currentMainImage = form.getValues('mainImage')

    // If mainImage is a string, convert it to an object
    if (typeof currentMainImage === 'string' && currentMainImage) {
      form.setValue(
        'mainImage',
        {
          url: currentMainImage,
          alt: form.getValues('mainTitle') || 'Main plan image',
          width: 1200,
          height: 630,
          caption: '',
        },
        { shouldValidate: false },
      )
    }
  }, [form])

  // Función para obtener la URL de la imagen
  const getImageUrl = () => {
    if (!mainImage) return null

    if (typeof mainImage === 'string') {
      return mainImage
    }

    return mainImage.url
  }

  const imageUrl = getImageUrl()
  const [pickerOpen, setPickerOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  if (isLoadingConfig) {
    return <div>Loading image configuration...</div>
  }

  return (
    <>
      <MediaPicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(item) => {
          form.setValue(
            'mainImage',
            {
              url: item.url,
              key: item.key,
              alt: form.getValues('mainTitle') || 'Main plan image',
              width: 1200,
              height: 630,
              caption: '',
            },
            { shouldValidate: true, shouldDirty: true },
          )
        }}
        folder="main-images"
      />
      <FormField
        control={form.control}
        name="mainImage"
        render={() => (
          <FormItem className="space-y-6">
            <div className="flex items-center justify-between">
              <FormLabel className="text-lg font-semibold text-gray-900">Main Image</FormLabel>
              {mainImage &&
                typeof mainImage === 'object' &&
                mainImage.width &&
                mainImage.height && (
                  <p className="text-sm text-gray-500">
                    {mainImage.width}x{mainImage.height}px
                  </p>
                )}
            </div>

            {!isS3Configured ? (
              <div className="rounded-xl border-2 border-dashed border-amber-400 bg-amber-50 p-6 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                    <Plug className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-amber-900">S3 plugin not configured</h3>
                  <p className="text-sm text-amber-700 max-w-sm">
                    To upload and manage images, please configure your Amazon S3 credentials first.
                  </p>
                  <Link href="/admin/dashboard/plugins">
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2 bg-white hover:bg-amber-100/50 border-amber-300 text-amber-800"
                    >
                      Configure S3 Plugin
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <FormControl>
                <div className="space-y-6">
                  {/* Upload area */}
                  <div
                    className={cn(
                      'relative rounded-xl border-2 border-dashed transition-all duration-200',
                      'bg-gray-50/50 hover:bg-gray-50',
                      isUploading && 'opacity-75',
                    )}
                  >
                    {!imageUrl ? (
                      <div className="flex flex-col items-center justify-center p-8 space-y-4">
                        <div className="relative">
                          <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            disabled={isUploading}
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(file)
                            }}
                            className="hidden"
                          />
                          <div className="flex flex-col items-center gap-4">
                            <div className="p-4 rounded-full bg-gray-100">
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                disabled={isUploading}
                                onClick={() => fileInputRef.current?.click()}
                              >
                                {isUploading ? (
                                  <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Uploading image...</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    <span>Select image</span>
                                  </div>
                                )}
                              </Button>
                              <Button
                                type="button"
                                variant="secondary"
                                disabled={isUploading}
                                onClick={() => setPickerOpen(true)}
                              >
                                <div className="flex items-center gap-2">
                                  <ImageIcon className="w-4 h-4" />
                                  <span>Open Media</span>
                                </div>
                              </Button>
                            </div>
                            <p className="text-sm text-gray-500 text-center">
                              Drag & drop, click to select, or choose from Media
                              <span className="block mt-1 text-xs">
                                Recommended size: 1200x630px • Max 5MB • JPG, PNG, or WebP
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="relative aspect-[1200/630] rounded-lg overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={
                              (typeof mainImage === 'object' && mainImage?.alt) || 'Main plan image'
                            }
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 1200px) 100vw, 1200px"
                          />
                          <div className="absolute inset-0 bg-black/5 transition-colors hover:bg-black/10" />
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setPickerOpen(true)}
                            className="rounded-full h-8 px-3 shadow-lg"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleImageDelete}
                            className="rounded-full h-8 w-8 p-0 shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Campos SEO */}
                  {imageUrl && typeof mainImage === 'object' && mainImage && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Texto Alternativo (Alt)
                        </FormLabel>
                        <Input
                          placeholder="Describe la imagen para SEO y accesibilidad"
                          value={mainImage.alt || ''}
                          onChange={(e) => {
                            if (mainImage && typeof mainImage === 'object' && mainImage.url) {
                              form.setValue('mainImage', {
                                ...mainImage,
                                alt: e.target.value,
                              })
                            }
                          }}
                          className="rounded-lg border-gray-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Pie de Foto (Opcional)
                        </FormLabel>
                        <Textarea
                          placeholder="Añade un pie de foto descriptivo"
                          value={mainImage.caption || ''}
                          onChange={(e) => {
                            if (mainImage && typeof mainImage === 'object' && mainImage.url) {
                              form.setValue('mainImage', {
                                ...mainImage,
                                caption: e.target.value,
                              })
                            }
                          }}
                          className="rounded-lg border-gray-200 resize-none min-h-[100px]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </FormControl>
            )}

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                <div className="w-1 h-1 bg-red-600 rounded-full" />
                {error}
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
