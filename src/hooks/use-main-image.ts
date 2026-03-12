// hooks/use-main-image.ts
import { useCallback, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useImageUpload } from '@/contexts/ImageUploadContext'
import { validateImage } from '@/utils/image-utils'
import type { PlanFormValues } from '@/verticals/tourism'

interface UseMainImageProps {
  form: UseFormReturn<PlanFormValues>
  isConfigured: boolean
  mediaFolder: string
}

export function useMainImage({ form, isConfigured, mediaFolder }: UseMainImageProps) {
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
      if (mediaFolder) {
        formData.append('folder', mediaFolder)
      }

      const res = await fetchWithTimeout('/api/upload', {
        method: 'POST',
        body: formData,
        timeoutMs: 120000,
      })
      const json = (await res.json().catch(() => ({}))) as any
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Failed to upload file')
      }
      const payload = json?.data ?? {}
      return { url: payload.url as string, key: payload.key as string }
    },
    [fetchWithTimeout, mediaFolder],
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
          folder: mediaFolder,
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
          folder: mediaFolder,
        }),
        timeoutMs: 10000,
      }).catch(() => undefined)

      return { url: publicUrl as string, key: key as string }
    },
    [fetchWithTimeout, mediaFolder],
  )

  // Compress image on client to speed up upload (except GIF to preserve animation)
  const maybeCompressImage = useCallback(async (file: File): Promise<File> => {
    try {
      if (typeof window === 'undefined') return file
      // Skip GIF to preserve animation
      if (file.type === 'image/gif') return file

      // Only compress if large (>1.5MB) or very large dimensions
      const shouldTry =
        file.size > 1.5 * 1024 * 1024 || file.type === 'image/jpeg' || file.type === 'image/png'
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

      const maxWidth = 1600 // keep quality but reduce heavy images
      const maxHeight = 1600
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
      const quality = 0.82
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
      if (!isConfigured) {
        setError('S3 storage is not configured. Please configure it before uploading.')
        return
      }
      const uploadId = `main-image-${Date.now()}`
      try {
        setIsUploading(true)
        addUploadingItem(uploadId)
        setError(null)

        // Validate image.
        const validation = validateImage(file)
        if (!validation.isValid) {
          throw new Error(validation.error)
        }

        // Keep the previous image so we only delete it after the new one succeeds.
        const previousImage = form.getValues('mainImage')

        // Try fast path (presigned S3 PUT), fallback to server upload
        let result: { url: string; key: string }
        try {
          const uploadFile = await maybeCompressImage(file)
          result = await presignedUpload(uploadFile)
        } catch (_e) {
          // Fallback to server upload if presigned PUT fails.
          const uploadFile = await maybeCompressImage(file)
          result = await serverUpload(uploadFile)
        }

        // Update form with the new image.
        form.setValue(
          'mainImage',
          {
            url: result.url,
            alt: form.getValues('mainTitle') || 'Main image',
            width: 1200,
            height: 630,
            caption: '',
            key: result.key,
          },
          {
            shouldValidate: true,
            shouldDirty: true,
          },
        )

        // Prefer server-side replacement to avoid orphaned assets.
        try {
          let previousKeyToDelete: string | undefined
          if (typeof previousImage === 'object' && previousImage?.key) {
            previousKeyToDelete = previousImage.key as string
          } else if (typeof previousImage === 'string' && previousImage) {
            const url = new URL(previousImage)
            previousKeyToDelete = url.pathname.substring(1)
          }
          // Prefer replace endpoint for robust server-side deletion of previous asset
          await fetchWithTimeout('/api/media/replace', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              key: result.key,
              url: result.url,
              mimeType: file.type,
              size: file.size,
              folder: mediaFolder,
              previousKey: previousKeyToDelete,
            }),
            timeoutMs: 10000,
          })
        } catch {
          // Fallback: best-effort direct delete of the previous asset.
          try {
            let imageKey: string | undefined
            if (typeof previousImage === 'object' && previousImage?.key) {
              imageKey = previousImage.key as string
            } else if (typeof previousImage === 'string' && previousImage) {
              const url = new URL(previousImage)
              imageKey = url.pathname.substring(1)
            }
            if (imageKey) {
              await fetchWithTimeout('/api/upload', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: imageKey }),
                timeoutMs: 10000,
              }).catch(() => undefined)
            }
          } catch {}
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
      fetchWithTimeout,
      presignedUpload,
      maybeCompressImage,
      serverUpload,
      isConfigured,
      addUploadingItem,
      removeUploadingItem,
      mediaFolder,
    ],
  )

  const handleImageDelete = useCallback(async () => {
    try {
      const currentImage = form.getValues('mainImage')

      // If there is no image, there is nothing to do.
      if (!currentImage) return

      // Derive the S3 key to delete.
      let imageKey: string | undefined

      if (typeof currentImage === 'object' && (currentImage as any).key) {
        imageKey = (currentImage as any).key
      } else if (typeof currentImage === 'string') {
        // If this is a URL, derive the key from the pathname.
        const url = new URL(currentImage)
        imageKey = url.pathname.substring(1)
      }

      // Best-effort delete.
      if (imageKey && isConfigured) {
        try {
          await fetchWithTimeout('/api/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: imageKey }),
            timeoutMs: 10000,
          })
        } catch (_error) {
          // Ignore delete failures.
        }
      }

      // Clear the image field in the form.
      form.setValue('mainImage', null, {
        shouldValidate: true,
        shouldDirty: true,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(errorMessage)
    }
  }, [form, fetchWithTimeout, isConfigured])

  return {
    isUploading,
    error,
    handleImageUpload,
    handleImageDelete,
  }
}
