/**
 * Utilidades para la optimización de imágenes
 */

/**
 * Interfaz para la API de NetworkInformation
 */
interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

/**
 * Detecta si el usuario está en una conexión lenta o modo de ahorro de datos
 */
export const isLowBandwidth = () => {
  if (typeof navigator === 'undefined') return false;
  
  // Usar una conversión de tipo específica para connection
  const connection = (navigator as unknown as { connection?: NetworkInformation }).connection;
  return connection && 
    (connection.saveData || 
    (connection.effectiveType || '').includes('2g'));
};

/**
 * Genera una URL de imagen optimizada según el proveedor
 * @param url URL original de la imagen
 * @param options Opciones de optimización
 * @returns URL optimizada
 */
export const getOptimizedImageUrl = (
  url: string, 
  options: { 
    width?: number; 
    quality?: number; 
    format?: 'auto' | 'webp' | 'avif' 
  } = {}
) => {
  const { width = 1000, quality = 80, format = 'auto' } = options;
  
  // Si ya es una URL con parámetros de optimización, la devolvemos como está
  if (url.includes('?format=') || url.includes('&w=')) return url;
  
  // Cloudinary
  if (url.includes('cloudinary.com')) {
    return url.replace(
      '/upload/', 
      `/upload/f_${format},q_${quality},w_${width},c_limit/`
    );
  }
  
  // Imgix
  if (url.includes('imgix.net')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&q=${quality}&auto=${format}`;
  }
  
  // Cloudflare Images
  if (url.includes('imagedelivery.net')) {
    // Suponiendo que la URL tiene un formato como:
    // https://imagedelivery.net/abc123/image-id/variant
    // Reemplazamos 'variant' con una variante optimizada
    const parts = url.split('/');
    parts[parts.length - 1] = `optimized-${width}`;
    return parts.join('/');
  }
  
  // AWS S3 - Agregar parámetros de cache y optimización
  if (url.includes('.s3.') && url.includes('.amazonaws.com')) {
    // Agregar parámetros para mejorar el cache y la carga
    const separator = url.includes('?') ? '&' : '?';
    const timestamp = Math.floor(Date.now() / (1000 * 60 * 60)); // Cache por 1 hora
    return `${url}${separator}t=${timestamp}&w=${width}&q=${quality}`;
  }
  
  // Para imágenes locales o no reconocidas
  return url;
};

/**
 * Genera un placeholder data URL para lazy loading
 * @returns Data URL de un pequeño placeholder
 */
export const getPlaceholderDataUrl = () => {
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
};

/**
 * Precarga una imagen y devuelve una promesa que se resuelve cuando la imagen está cargada
 * @param src URL de la imagen a precargar
 * @returns Promise que se resuelve cuando la imagen está cargada
 */
export const preloadImage = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!src) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.src = src;
    
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
}; 
