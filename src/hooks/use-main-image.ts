// hooks/use-main-image.ts
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { validateImage, generateOptimizedImageName } from '@/utils/image-utils';
import type { PlanFormValues } from '@/schemas/plan';

interface UseMainImageProps {
  form: UseFormReturn<PlanFormValues>;
}

export function useMainImage({ form }: UseMainImageProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);

      // Validar imagen
      const validation = validateImage(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Eliminar imagen anterior si existe
      const currentImage = form.getValues('mainImage');
      if (currentImage) {
        await handleImageDelete();
      }

      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'main-images');

      // Subir imagen usando nuestra API
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData, // No establecer Content-Type, el navegador lo hace automáticamente
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Error al subir el archivo');
      }

      const { url, key } = await uploadResponse.json();

      console.log('Imagen subida exitosamente:', { url, key });

      // Actualizar formulario
      form.setValue('mainImage', {
        url: url,
        alt: form.getValues('mainTitle') || 'Imagen principal del plan turístico',
        width: 1200,
        height: 630,
        caption: '',
        key
      }, { 
        shouldValidate: true,
        shouldDirty: true 
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error en useMainImage:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageDelete = async () => {
    try {
      const currentImage = form.getValues('mainImage');
      
      // Si no hay imagen, no hacer nada
      if (!currentImage) return;
      
      // Determinar la key de la imagen para eliminar de S3
      let imageKey: string | undefined;
      
      if (typeof currentImage === 'object' && currentImage.key) {
        imageKey = currentImage.key;
      } else if (typeof currentImage === 'string') {
        // Si es una URL, extraer la key del final
        const url = new URL(currentImage);
        imageKey = url.pathname.substring(1); // Quitar el primer "/"
      }
      
      // Si hay una key, intentar eliminar la imagen de S3
      if (imageKey) {
        try {
          const response = await fetch('/api/upload', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key: imageKey }),
          });

          if (!response.ok) {
            console.warn('No se pudo eliminar la imagen de S3, pero continuando...');
          }
        } catch (error) {
          console.warn('Error al eliminar imagen de S3:', error);
          // No lanzar error, solo advertir
        }
      }

      // Limpiar el campo de imagen en el formulario
      form.setValue('mainImage', null, { 
        shouldValidate: true,
        shouldDirty: true 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error al eliminar imagen:', error);
    }
  };

  return {
    isUploading,
    error,
    handleImageUpload,
    handleImageDelete
  };
}
