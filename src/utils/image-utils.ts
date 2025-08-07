// utils/image-utils.ts
import { 
    ACCEPTED_IMAGE_TYPES, 
    type AcceptedImageType, 
    type ImageDimensions, 
    type ImageFile,
    type ImageMetadata,
    type ImageFileMetadata,
    type OptimizedImage
  } from '@/types/image';

import { Prisma } from '@prisma/client';

  
  export const IMAGE_CONFIG = {
    maxSize: 5 * 1024 * 1024, // 5MB en bytes
    acceptedTypes: Object.values(ACCEPTED_IMAGE_TYPES) as AcceptedImageType[],
    dimensions: {
      width: 1200,
      height: 630
    },
    quality: 80,
    folders: {
      plans: 'plans',
      mainImages: 'main-images',
      thumbnails: 'thumbnails'
    }
  } as const;
  
  export function isAcceptedImageType(mimeType: string): mimeType is AcceptedImageType {
    return IMAGE_CONFIG.acceptedTypes.includes(mimeType as AcceptedImageType);
  }
  
  export function validateImage(file: File): { isValid: boolean; error?: string } {
    if (!isAcceptedImageType(file.type)) {
      return {
        isValid: false,
        error: `El archivo debe ser una imagen en formato ${IMAGE_CONFIG.acceptedTypes
          .map(type => type.split('/')[1].toUpperCase())
          .join(', ')}`
      };
    }
  
    if (file.size > IMAGE_CONFIG.maxSize) {
      return {
        isValid: false,
        error: `La imagen no debe superar los ${IMAGE_CONFIG.maxSize / (1024 * 1024)}MB`
      };
    }
  
    return { isValid: true };
  }
  
// utils/image-utils.ts
export function generateOptimizedImageName(title: string, extension: string): string {
  const timestamp = new Date().getTime();
  const normalizedTitle = title
    .toLowerCase()
    // Reemplazar caracteres especiales
    .replace(/[áäâàã]/g, 'a')
    .replace(/[éëêè]/g, 'e')
    .replace(/[íïîì]/g, 'i')
    .replace(/[óöôòõ]/g, 'o')
    .replace(/[úüûù]/g, 'u')
    .replace(/ñ/g, 'n')
    // Limpiar otros caracteres especiales
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    // Convertir espacios a guiones
    .replace(/\s+/g, '-')
    // Eliminar guiones múltiples
    .replace(/-+/g, '-')
    // Limitar longitud pero mantener palabras completas
    .split('-')
    .slice(0, 5) // Tomar solo las primeras 5 palabras
    .join('-');

  // Agregar el timestamp al final de manera más limpia
  const shortTimestamp = timestamp.toString().slice(-6); // Últimos 6 dígitos
  
  return `${normalizedTitle}-${shortTimestamp}.${extension.toLowerCase()}`;
}

  export function generateImageAltText(title: string, destination: string): string {
    return `${title} en ${destination} - Tour turístico`;
  }
  
  export function generateImageCaption(title: string, destination: string): string {
    return `Descubre ${title} en ${destination}`;
  }
  
  export function extractImageNameFromUrl(url: string): string {
    return url.split('/').pop() || '';
  }
  
  export function getImageExtension(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension && isAcceptedImageType(`image/${extension}`) 
      ? extension 
      : 'jpg';
  }
  
  export function generateS3Key(fileName: string, folder: string = IMAGE_CONFIG.folders.plans): string {
    return `${folder}/${fileName}`;
  }
  
  export function buildS3Url(key: string, bucket: string, region: string): string {
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  }
  
  export function createImageMetadata(
    file: File,
    dimensions: ImageDimensions
  ): ImageFileMetadata | null {
    if (!isAcceptedImageType(file.type)) return null;
  
    return {
      width: dimensions.width,
      height: dimensions.height,
      size: file.size,
      type: file.type as AcceptedImageType
    };
  }
  
  export function createOptimizedImage(
    url: string,
    key: string,
    title: string,
    destination: string
  ): OptimizedImage {
    return {
      src: url,
      url,
      key,
      alt: generateImageAltText(title, destination),
      width: IMAGE_CONFIG.dimensions.width,
      height: IMAGE_CONFIG.dimensions.height,
      caption: generateImageCaption(title, destination)
    };
  }
  

  export function parseMainImage(json: Prisma.JsonValue | null): OptimizedImage | null {
    if (!json) return null;
    
    try {
      const parsed = typeof json === 'string' ? JSON.parse(json) : json;
      return {
        src: String(parsed.url || ''),
        url: String(parsed.url || ''),
        alt: String(parsed.alt || ''),
        width: Number(parsed.width || IMAGE_CONFIG.dimensions.width),
        height: Number(parsed.height || IMAGE_CONFIG.dimensions.height),
        caption: parsed.caption ? String(parsed.caption) : undefined,
        key: String(parsed.key || '')
      };
    } catch {
      return null;
    }
  }
