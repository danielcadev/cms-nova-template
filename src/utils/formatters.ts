import slugify from 'slugify';

/**
 * NOVA CMS - UTILITY FORMATTERS
 * =============================
 * Comprehensive formatting utilities for text, currency, dates, and more
 */

/**
 * Formatea un nombre de destino para usarlo en rutas de imágenes
 * Simplifica el nombre del destino para usar como slug de imagen
 */
export function formatDestinationForImage(destination: string): string {
  // Lista de imágenes disponibles en placeshero
  const availableImages = ['amazonas', 'boyaca', 'capurgana', 'eje-cafetero', 'cartagena', 'bogota', 'medellin', 'cali'];
  
  // Aplicar transformación estándar
  const formattedName = destination.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/[^\w-]/g, ''); // Eliminar caracteres especiales
  
  // Verificar si existe la imagen para este nombre formateado
  if (availableImages.includes(formattedName)) {
    return formattedName;
  }
  
  // Si no existe, devolver una imagen predeterminada basada en la primera letra
  const index = destination.charCodeAt(0) % availableImages.length;
  return availableImages[index];
}

/**
 * Formatea un nombre desde slug (convierte "san-andres" a "San Andrés")
 */
export function formatName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .replace(/\ban\b/gi, 'Andrés') // Reemplazar casos específicos
    .replace(/\beje\b/gi, 'Eje');
}

/**
 * Obtiene el nombre formateado de un slug
 */
export function getFormattedNameFromSlug(slug: string): string {
  return formatName(slug);
}

/**
 * Formatea nombre de destino
 */
export function formatDestination(destination: string): string {
  return destination; // Devolver tal como viene, ya que ahora es input libre
}

/**
 * Extrae la duración de un título
 */
export function formatDuration(title: string): string {
  const match = title.match(/(\d+)\s*días\s*(\d+)\s*noches/i);
  if (match) {
    return `${match[1]} días ${match[2]} noches`;
  }
  return '';
}

/**
 * Formatea texto a camelCase
 */
export const toCamelCase = (str: string) => {
    if (!str) return '';
    return slugify(str, { lower: false, strict: true })
        .replace(/-(\w)/g, (_, c) => c.toUpperCase())
        .replace(/^[A-Z]/, c => c.toLowerCase());
};

/**
 * Formatea moneda con locale específico
 */
export function formatCurrency(
  amount: number, 
  currencyCode: string = 'COP',
  locale: string = 'es-CO'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (error) {
    // Fallback si el locale o moneda no es válido
    return `${currencyCode} ${amount.toLocaleString()}`;
  }
}

/**
 * Formatea números grandes con abreviaciones (K, M, B)
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  return (num / 1000000000).toFixed(1) + 'B';
}

/**
 * Formatea fechas de forma amigable
 */
export function formatRelativeDate(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Hace unos segundos';
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 2592000) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
  if (diffInSeconds < 31536000) return `Hace ${Math.floor(diffInSeconds / 2592000)} meses`;
  
  return `Hace ${Math.floor(diffInSeconds / 31536000)} años`;
}

/**
 * Formatea fechas con formato específico
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium',
  locale: string = 'es-ES'
): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  let options: Intl.DateTimeFormatOptions;
  
  switch (format) {
    case 'short':
      options = { year: 'numeric', month: 'numeric', day: 'numeric' };
      break;
    case 'medium':
      options = { year: 'numeric', month: 'short', day: 'numeric' };
      break;
    case 'long':
      options = { year: 'numeric', month: 'long', day: 'numeric' };
      break;
    case 'full':
      options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      break;
    default:
      options = { year: 'numeric', month: 'short', day: 'numeric' };
  }

  return new Intl.DateTimeFormat(locale, options).format(targetDate);
}

/**
 * Limpia y formatea texto para slugs
 */
export function createSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
}

/**
 * Trunca texto con elipsis
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Formatea bytes a formato legible (KB, MB, GB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Capitaliza la primera letra de cada palabra
 */
export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Convierte texto a snake_case
 */
export function toSnakeCase(text: string): string {
  return text
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('_');
}

/**
 * Extrae iniciales de un nombre
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
