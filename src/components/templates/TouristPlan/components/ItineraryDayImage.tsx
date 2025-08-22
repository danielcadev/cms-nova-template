'use client'

import {
  AlertTriangle,
  ExternalLink,
  Image as ImageIcon,
  Settings,
  Trash2,
  Upload,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { MediaPicker } from '@/components/admin/media/MediaPicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { PlanFormValues } from '@/schemas/plan'

interface ItineraryDayImageProps {
  fieldIndex: number
}

export function ItineraryDayImage({ fieldIndex }: ItineraryDayImageProps) {
  const { control, setValue } = useFormContext<PlanFormValues>()
  const fieldName = `itinerary.${fieldIndex}.image` as const

  const { field } = useController({ name: fieldName, control })
  const [imageUrl, setImageUrl] = useState(field.value || '')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [s3Config, setS3Config] = useState<any>(null)
  const [isLoadingConfig, setIsLoadingConfig] = useState(true)
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    const fetchS3Config = async () => {
      try {
        const response = await fetch('/api/plugins/s3')
        const data = await response.json()
        if (data.success && data.config) {
          setS3Config(data.config)
        }
      } catch (error) {
        // Do not show an error, the component will simply not activate
        console.error('Failed to load S3 configuration', error)
      } finally {
        setIsLoadingConfig(false)
      }
    }
    fetchS3Config()
  }, [])

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    setError(null)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'itinerary')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error uploading image')
      }

      const newImageUrl = result.url
      setValue(fieldName, newImageUrl, { shouldDirty: true })
      setImageUrl(newImageUrl)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = () => {
    setValue(fieldName, '', { shouldDirty: true })
    setImageUrl('')
    setError(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  if (isLoadingConfig) {
    return <Skeleton className="h-48 w-full" />
  }

  if (!s3Config) {
    return (
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4 text-center text-amber-800 space-y-3">
          <Settings className="h-8 w-8 mx-auto" />
          <h4 className="font-semibold">S3 Plugin not configured</h4>
          <p className="text-sm">
            To upload images, you must first configure your S3 credentials.
          </p>
          <Link href="/admin/dashboard/plugins">
            <Button variant="link" className="text-amber-800 h-auto p-0">
              Go to configure <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {imageUrl ? (
          <div className="relative group w-full aspect-video rounded-md overflow-hidden">
            <Image
              src={imageUrl}
              alt={`Image for day ${fieldIndex + 1}`}
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute top-3 right-3 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPickerOpen(true)}
                className="rounded-full h-8 px-3 shadow-lg"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={handleDelete}>
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
              <Upload className="w-8 h-8 mb-4" />
              <p className="mb-2 text-sm font-semibold">Upload an image</p>
              <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
            </div>
            <div className="flex gap-2 pb-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById(`itinerary-file-${fieldIndex}`)?.click()}
              >
                Choose file
              </Button>
              <Button type="button" variant="secondary" onClick={() => setPickerOpen(true)}>
                Choose from Media
              </Button>
            </div>
            <input
              id={`itinerary-file-${fieldIndex}`}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        )}
        {isUploading && (
          <div className="text-sm text-blue-600 flex items-center">
            <ImageIcon className="h-4 w-4 mr-2 animate-pulse" /> Uploading...
          </div>
        )}
        {error && (
          <div className="text-sm text-red-600 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" /> {error}
          </div>
        )}
        <MediaPicker
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={(item) => {
            setValue(fieldName, item.url, { shouldDirty: true })
            setImageUrl(item.url)
            setPickerOpen(false)
          }}
        />
      </CardContent>
    </Card>
  )
}
