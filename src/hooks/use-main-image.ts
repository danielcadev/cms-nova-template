// hooks/use-main-image.ts
import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { PlanFormValues } from '@/schemas/plan'
import { validateImage } from '@/utils/image-utils'

interface UseMainImageProps {
  form: UseFormReturn<PlanFormValues>
}

export function useMainImage({ form }: UseMainImageProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper to avoid long hangs
  const fetchWithTimeout = async (
    input: RequestInfo,
    init: RequestInit & { timeoutMs?: number } = {},
  ) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), init.timeoutMs ?? 10000) // default 10s
    try {
      const res = await fetch(input, { ...init, signal: controller.signal })
      return res
    } finally {
      clearTimeout(id)
    }
  }

  const serverUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'main-images')

    const res = await fetchWithTimeout('/api/upload', {
      method: 'POST',
      body: formData,
      timeoutMs: 120000,
    })
    const json = (await res.json().catch(() => ({}))) as any
    if (!res.ok || !json?.success) {
      throw new Error(json?.error || 'Error al subir el archivo')
    }
    const payload = json?.data ?? {}
    return { url: payload.url as string, key: payload.key as string }
  }

  const presignedUpload = async (file: File) => {
    // 1) Ask backend for presigned URL
    const presignRes = await fetchWithTimeout('/api/upload/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        size: file.size,
        folder: 'main-images',
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
      timeoutMs: 45000, // faster fail to fallback
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
        folder: 'main-images',
      }),
      timeoutMs: 10000,
    }).catch(() => undefined)

    return { url: publicUrl as string, key: key as string }
  }

  const handleImageUpload = async (file: File) => {
    try {
      console.debug('[MainImage] handleImageUpload:start', {
        name: file.name,
        type: file.type,
        size: file.size,
      })
      setIsUploading(true)
      setError(null)

      // Validar imagen
      const validation = validateImage(file)
      console.debug('[MainImage] validation', validation)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }

      // Eliminar imagen anterior si existe
      const currentImage = form.getValues('mainImage')
      console.debug('[MainImage] currentImage(before)', currentImage)
      if (currentImage) {
        console.debug('[MainImage] deleting previous image')
        await handleImageDelete()
        console.debug('[MainImage] previous image deleted')
      }

      // Try fast path (presigned S3 PUT), fallback to server upload
      let result: { url: string; key: string }
      try {
        console.debug('[MainImage] presignedUpload:attempt')
        result = await presignedUpload(file)
        console.debug('[MainImage] presignedUpload:success', result)
      } catch (e) {
        console.warn('[MainImage] presignedUpload:failed, falling back to serverUpload', e)
        result = await serverUpload(file)
        console.debug('[MainImage] serverUpload:success', result)
      }

      // Actualizar formulario
      console.debug('[MainImage] form.setValue(mainImage)')
      form.setValue(
        'mainImage',
        {
          url: result.url,
          alt: form.getValues('mainTitle') || 'Imagen principal del plan turístico',
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
      console.debug('[MainImage] form.setValue done')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageDelete = async () => {
    try {
      const currentImage = form.getValues('mainImage')
      console.debug('[MainImage] handleImageDelete:currentImage', currentImage)

      // Si no hay imagen, no hacer nada
      if (!currentImage) return

      // Determinar la key de la imagen para eliminar de S3
      let imageKey: string | undefined

      if (typeof currentImage === 'object' && (currentImage as any).key) {
        imageKey = (currentImage as any).key
      } else if (typeof currentImage === 'string') {
        // Si es una URL, extraer la key del final
        const url = new URL(currentImage)
        imageKey = url.pathname.substring(1) // Quitar el primer "/"
      }

      // Si hay una key, intentar eliminar la imagen de S3
      if (imageKey) {
        try {
          console.debug('[MainImage] delete:attempt', imageKey)
          const res = await fetchWithTimeout('/api/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: imageKey }),
            timeoutMs: 10000,
          })
          console.debug('[MainImage] delete:status', res.status)
        } catch (_error) {
          console.warn('[MainImage] delete:failed')
        }
      }

      // Limpiar el campo de imagen en el formulario
      console.debug('[MainImage] clearing form mainImage')
      form.setValue('mainImage', null, {
        shouldValidate: true,
        shouldDirty: true,
      })
      console.debug('[MainImage] cleared')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
    }
  }

  return {
    isUploading,
    error,
    handleImageUpload,
    handleImageDelete,
  }
}
