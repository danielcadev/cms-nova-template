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
        const data = await response.json()

        // Consider S3 configured if backend reports a usable config
        if (
          data?.success &&
          data?.config &&
          data.config.bucket &&
          data.config.accessKeyId &&
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
    (url: string) => {
      form.setValue(`itinerary.${fieldIndex}.image`, url, {
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
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
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
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-amber-800 mb-1">S3 Configuration Required</h4>
              <p className="text-sm text-amber-700 mb-3">
                To upload images for itinerary days, S3 storage must be configured.
              </p>
              <Link href="/admin/dashboard/plugins">
                <Button variant="outline" size="sm" className="text-amber-700 border-amber-300">
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
      <CardContent className="p-4 space-y-4">
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
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setPickerOpen(true)}
                className="rounded-full h-8 px-3 shadow-lg bg-white/90 hover:bg-white"
                disabled={isUploading}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleImageDelete}
                className="rounded-full h-8 px-3 shadow-lg"
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="flex items-center gap-2 text-white text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
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
              'flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-colors cursor-pointer',
              isUploading
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50',
            )}
            disabled={isUploading}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-sm text-blue-600 font-medium">Uploading image...</p>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 font-medium mb-1">Upload day image</p>
                <p className="text-xs text-gray-500 text-center">
                  Drag and drop or click to select
                </p>
                <div className="flex gap-2 mt-3">
                  <label htmlFor={`day-image-${fieldIndex}`}>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
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
                  >
                    <ImageIcon className="h-4 w-4 mr-1" />
                    Gallery
                  </Button>
                </div>
              </>
            )}
          </button>
        )}

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-800 font-medium">Upload Error</p>
              <p className="text-sm text-red-700">{error}</p>
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
