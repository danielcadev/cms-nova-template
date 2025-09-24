// hooks/use-itinerary-image.ts
import { useCallback, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useImageUpload } from '@/contexts/ImageUploadContext'
import type { PlanFormValues } from '@/schemas/plan'
import { validateImage } from '@/utils/image-utils'

interface UseItineraryImageProps {
  form: UseFormReturn<PlanFormValues>
  dayIndex: number
}

export function useItineraryImage({ form, dayIndex }: UseItineraryImageProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addUploadingItem, removeUploadingItem } = useImageUpload()

  // Helper to avoid long hangs - memoized to avoid recreating on every render
  const fetchWithTimeout = useCallback(
    async (input: RequestInfo, init: RequestInit & { timeoutMs?: number } = {}) => {
      const controller = new AbortController()
      const id = setTimeout(() => controller.abort(), init.timeoutMs ?? 10000) // default 10s
      try {
        const res = await fetch(input, { ...init, signal: controller.signal })
        return res
      } finally {
        clearTimeout(id)
      }
    },
    [],
  )

  const serverUpload = useCallback(
    async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'itinerary')

      const res = await fetchWithTimeout('/api/upload', {
        method: 'POST',
        body: formData,
        timeoutMs: 120000,
      })
      const json = (await res.json().catch(() => ({}))) as any
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Error uploading file')
      }
      const payload = json?.data ?? {}
      return { url: payload.url as string, key: payload.key as string }
    },
    [fetchWithTimeout],
  )

  const presignedUpload = useCallback(
    async (file: File) => {
      // 1) Ask backend for presigned URL
      const presignRes = await fetchWithTimeout('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          folder: 'itinerary',
        }),
        timeoutMs: 10000,
      })
      if (!presignRes.ok) throw new Error('Presign request failed')
      const presignJson = await presignRes.json()
      if (!presignJson?.success) throw new Error(presignJson?.error || 'Presign error')
      const { url, key, headers, publicUrl } = presignJson.data

      // 2) PUT file to S3
      const putRes = await fetchWithTimeout(url, {
        method: 'PUT',
        headers,
        body: file,
        timeoutMs: 120000, // larger files need more time
      })
      if (!putRes.ok) throw new Error('S3 upload failed')

      // 3) Register asset in DB (best-effort)
      await fetchWithTimeout('/api/media/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          url: publicUrl,
          mimeType: file.type,
          size: file.size,
          folder: 'itinerary',
        }),
        timeoutMs: 10000,
      }).catch(() => undefined)

      return { url: publicUrl as string, key: key as string }
    },
    [fetchWithTimeout],
  )

  // Compress image on client to speed up upload (except GIF to preserve animation)
  const maybeCompressImage = useCallback(async (file: File): Promise<File> => {
    try {
      if (typeof window === 'undefined') return file
      // Skip GIF to preserve animation
      if (file.type === 'image/gif') return file

      // Only compress if large (>1MB) or very large dimensions
      const shouldTry =
        file.size > 1 * 1024 * 1024 || file.type === 'image/jpeg' || file.type === 'image/png'
      if (!shouldTry) return file

      const objectUrl = URL.createObjectURL(file)
      const img = document.createElement('img')
      const loaded = await new Promise<boolean>((resolve) => {
        img.onload = () => resolve(true)
        img.onerror = () => resolve(false)
        img.src = objectUrl
      })
      if (!loaded) {
        URL.revokeObjectURL(objectUrl)
        return file
      }

      const maxWidth = 1200 // smaller than main image, good for itinerary
      const maxHeight = 800
      let { width, height } = img
      const ratio = Math.min(maxWidth / width, maxHeight / height, 1)
      width = Math.round(width * ratio)
      height = Math.round(height * ratio)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(objectUrl)
        return file
      }
      ctx.drawImage(img, 0, 0, width, height)

      const targetType = 'image/webp'
      const quality = 0.8
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), targetType, quality),
      )

      URL.revokeObjectURL(objectUrl)
      if (!blob) return file

      // If compression yields larger file (rare), keep original
      if (blob.size >= file.size) return file

      const newName = `${file.name.replace(/\.[^.]+$/, '')}.webp`
      return new File([blob], newName, { type: targetType })
    } catch {
      return file
    }
  }, [])

  const handleImageUpload = useCallback(
    async (file: File) => {
      const uploadId = `itinerary-${dayIndex}-${Date.now()}`
      try {
        console.debug('[ItineraryImage] handleImageUpload:start', {
          dayIndex,
          name: file.name,
          type: file.type,
          size: file.size,
        })
        setIsUploading(true)
        addUploadingItem(uploadId)
        setError(null)

        // Validate image
        const validation = validateImage(file)
        console.debug('[ItineraryImage] validation', validation)
        if (!validation.isValid) {
          throw new Error(validation.error)
        }

        // Get current itinerary data
        const currentItinerary = form.getValues('itinerary') || []
        const currentDay = currentItinerary[dayIndex]
        const previousImage = currentDay?.image

        console.debug('[ItineraryImage] previousImage', previousImage)

        // Try fast path (presigned S3 PUT), fallback to server upload
        let result: { url: string; key: string }
        try {
          const uploadFile = await maybeCompressImage(file)
          console.debug('[ItineraryImage] presignedUpload:attempt', {
            originalSize: file.size,
            uploadSize: uploadFile.size,
            type: uploadFile.type,
          })
          result = await presignedUpload(uploadFile)
          console.debug('[ItineraryImage] presignedUpload:success', result)
        } catch (e) {
          console.warn('[ItineraryImage] presignedUpload:failed, falling back to serverUpload', e)
          const uploadFile = await maybeCompressImage(file)
          result = await serverUpload(uploadFile)
          console.debug('[ItineraryImage] serverUpload:success', result)
        }

        // Update form with new image
        console.debug('[ItineraryImage] form.setValue')
        form.setValue(`itinerary.${dayIndex}.image`, result.url, {
          shouldValidate: true,
          shouldDirty: true,
        })
        console.debug('[ItineraryImage] form.setValue done')

        // Delete previous image if exists (best-effort)
        if (previousImage && typeof previousImage === 'string') {
          try {
            let imageKey: string | undefined
            if (previousImage.startsWith('http')) {
              const url = new URL(previousImage)
              imageKey = url.pathname.substring(1)
            } else {
              imageKey = previousImage
            }

            if (imageKey) {
              await fetchWithTimeout('/api/upload', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: imageKey }),
                timeoutMs: 10000,
              }).catch(() => undefined)
            }
          } catch {
            // Ignore deletion errors
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        setError(errorMessage)
      } finally {
        setIsUploading(false)
        removeUploadingItem(uploadId)
      }
    },
    [
      form,
      dayIndex,
      fetchWithTimeout,
      presignedUpload,
      maybeCompressImage,
      serverUpload,
      addUploadingItem,
      removeUploadingItem,
    ],
  )

  const handleImageDelete = useCallback(async () => {
    try {
      const currentItinerary = form.getValues('itinerary') || []
      const currentDay = currentItinerary[dayIndex]
      const currentImage = currentDay?.image

      console.debug('[ItineraryImage] handleImageDelete:currentImage', currentImage)

      // If no image, do nothing
      if (!currentImage) return

      // Determine the key of the image to delete from S3
      let imageKey: string | undefined

      if (typeof currentImage === 'string') {
        if (currentImage.startsWith('http')) {
          const url = new URL(currentImage)
          imageKey = url.pathname.substring(1) // Remove the first "/"
        } else {
          imageKey = currentImage
        }
      }

      // If there's a key, try to delete the image from S3
      if (imageKey) {
        try {
          console.debug('[ItineraryImage] delete:attempt', imageKey)
          const res = await fetchWithTimeout('/api/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: imageKey }),
            timeoutMs: 10000,
          })
          console.debug('[ItineraryImage] delete:status', res.status)
        } catch (_error) {
          console.warn('[ItineraryImage] delete:failed')
        }
      }

      // Clear the image field in the form
      console.debug('[ItineraryImage] clearing form itinerary image')
      form.setValue(`itinerary.${dayIndex}.image`, '', {
        shouldValidate: true,
        shouldDirty: true,
      })
      console.debug('[ItineraryImage] cleared')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(errorMessage)
    }
  }, [form, dayIndex, fetchWithTimeout])

  return {
    isUploading,
    error,
    handleImageUpload,
    handleImageDelete,
  }
}
