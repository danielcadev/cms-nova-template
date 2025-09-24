'use client'

import { AlertTriangle, Image as ImageIcon, Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { MediaPicker } from '@/components/admin/media/MediaPicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useItineraryImage } from '@/hooks/use-itinerary-image'
import { cn } from '@/lib/utils'
import type { PlanFormValues } from '@/schemas/plan'

interface ItineraryDayImageProps {
  fieldIndex: number
}

export function ItineraryDayImage({ fieldIndex }: ItineraryDayImageProps) {
  const form = useFormContext<PlanFormValues>()
  const { isUploading, error, handleImageUpload, handleImageDelete } = useItineraryImage({
    form,
    dayIndex: fieldIndex,
  })

  // Watch the specific image field
  const currentImage = form.watch(`itinerary.${fieldIndex}.image`)
  const imageUrl = currentImage || ''

  const [isS3Configured, setIsS3Configured] = useState(false)
  const [isLoadingConfig, setIsLoadingConfig] = useState(true)
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    const fetchS3Config = async () => {
      try {
        const response = await fetch('/api/plugins/s3', { cache: 'no-store' })

        if (!response.ok) {
          console.error('S3 config API response not ok:', response.status)
          setIsS3Configured(false)
          return
        }

        const data = await response.json()
        console.debug('[ItineraryDayImage] S3 config response:', {
          success: data?.success,
          hasConfig: !!data?.config,
          config: data?.config
            ? {
                bucket: !!data.config.bucket,
                accessKeyId: !!data.config.accessKeyId,
                region: !!data.config.region,
              }
            : null,
        })

        // Consider S3 configured if backend reports success and config exists with required fields
        const isConfigured = !!(
          data?.success &&
          data?.config &&
          data.config.bucket &&
          data.config.accessKeyId &&
          data.config.region
        )

        console.debug('[ItineraryDayImage] S3 configured:', isConfigured)
        setIsS3Configured(isConfigured)
      } catch (error) {
        console.error('Failed to load S3 configuration:', error)
        setIsS3Configured(false)
      } finally {
        setIsLoadingConfig(false)
      }
    }
    fetchS3Config()
  }, [])

  // Handle file selection from input
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        handleImageUpload(file)
      }
      // Reset input value to allow re-uploading the same file
      event.target.value = ''
    },
    [handleImageUpload],
  )

  // Handle drag and drop
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const file = event.dataTransfer.files[0]
      if (file?.type.startsWith('image/')) {
        handleImageUpload(file)
      }
    },
    [handleImageUpload],
  )

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  // Media picker selection
  const handleMediaSelect = useCallback(
    (item: any) => {
      form.setValue(`itinerary.${fieldIndex}.image`, item.url, {
        shouldValidate: true,
        shouldDirty: true,
      })
      setPickerOpen(false)
    },
    [form, fieldIndex],
  )

  // Loading config state
  if (isLoadingConfig) {
    return (
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-center h-24 sm:h-32">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
              Loading image configuration...
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // S3 not configured state
  if (!isS3Configured) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-amber-800 mb-1 text-sm sm:text-base">
                S3 Configuration Required
              </h4>
              <p className="text-xs sm:text-sm text-amber-700 mb-2 sm:mb-3">
                To upload images for itinerary days, S3 storage must be configured.
              </p>
              <Link href="/admin/dashboard/plugins">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-amber-700 border-amber-300 text-xs sm:text-sm"
                >
                  Configure S3
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {imageUrl ? (
          <div className="relative group w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={`Image for day ${fieldIndex + 1}`}
              fill
              className="object-cover transition-opacity group-hover:opacity-90"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex gap-1 sm:gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="rounded-full h-7 w-7 sm:h-8 sm:w-8 bg-white dark:bg-gray-100 text-gray-800 dark:text-gray-900 border border-gray-300 dark:border-gray-200 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-300 flex items-center justify-center"
                disabled={isUploading}
              >
                <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              <button
                type="button"
                onClick={handleImageDelete}
                className="rounded-full h-7 w-7 sm:h-8 sm:w-8 bg-red-500 text-white border border-red-600 shadow-lg hover:bg-red-600 flex items-center justify-center"
                disabled={isUploading}
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="flex items-center gap-2 text-white text-xs sm:text-sm">
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  Uploading...
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById(`day-image-${fieldIndex}`)?.click()}
            className={cn(
              'flex flex-col items-center justify-center w-full h-36 sm:h-48 border-2 border-dashed rounded-lg transition-colors cursor-pointer',
              isUploading
                ? 'border-blue-300 bg-blue-50 cursor-not-allowed'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50',
            )}
            disabled={isUploading}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 animate-spin" />
                <p className="text-xs sm:text-sm text-blue-600 font-medium">Uploading image...</p>
              </div>
            ) : (
              <>
                <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mb-2" />
                <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
                  Upload day image
                </p>
                <p className="text-xs text-gray-500 text-center px-2">
                  Drag and drop or click to select
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-3 w-full sm:w-auto px-4 sm:px-0">
                  <label htmlFor={`day-image-${fieldIndex}`} className="w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer w-full sm:w-auto text-xs sm:text-sm"
                      disabled={isUploading}
                    >
                      Choose File
                    </Button>
                    <input
                      id={`day-image-${fieldIndex}`}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                      disabled={isUploading}
                    />
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPickerOpen(true)}
                    disabled={isUploading}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Gallery
                  </Button>
                </div>
              </>
            )}
          </button>
        )}

        {error && (
          <div className="flex items-start gap-2 p-2 sm:p-3 rounded-lg bg-red-50 border border-red-200">
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-red-800 font-medium">Upload Error</p>
              <p className="text-xs sm:text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Media Picker */}
        <MediaPicker
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={handleMediaSelect}
          folder="itinerary"
        />
      </CardContent>
    </Card>
  )
}
