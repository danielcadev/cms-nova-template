import { 
  Type, 
  AlignLeft, 
  Hash, 
  ToggleLeft, 
  Calendar, 
  ImageIcon,
  FileText,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  Star,
  DollarSign,
  Palette
} from 'lucide-react';

export interface FieldType {
  value: string;
  label: string;
  icon: any;
  description: string;
  category: 'basic' | 'advanced' | 'media';
  color: string;
}

export const FIELD_TYPES: FieldType[] = [
  // Basic Fields
  {
    value: 'TEXT',
    label: 'Texto Corto',
    icon: Type,
    description: 'Campo de texto simple para títulos o nombres',
    category: 'basic',
    color: 'bg-gradient-to-br from-blue-500 to-indigo-600'
  },
  {
    value: 'TEXTAREA',
    label: 'Texto Largo',
    icon: AlignLeft,
    description: 'Área de texto para descripciones extensas',
    category: 'basic',
    color: 'bg-gradient-to-br from-green-500 to-emerald-600'
  },
  {
    value: 'RICH_TEXT',
    label: 'Editor Rico',
    icon: FileText,
    description: 'Editor con formato para contenido enriquecido',
    category: 'advanced',
    color: 'bg-gradient-to-br from-purple-500 to-violet-600'
  },
  {
    value: 'NUMBER',
    label: 'Número',
    icon: Hash,
    description: 'Campo numérico para precios o cantidades',
    category: 'basic',
    color: 'bg-gradient-to-br from-orange-500 to-red-600'
  },
  {
    value: 'BOOLEAN',
    label: 'Verdadero/Falso',
    icon: ToggleLeft,
    description: 'Switch para valores booleanos',
    category: 'basic',
    color: 'bg-gradient-to-br from-teal-500 to-cyan-600'
  },
  {
    value: 'DATE',
    label: 'Fecha',
    icon: Calendar,
    description: 'Selector de fecha y hora',
    category: 'basic',
    color: 'bg-gradient-to-br from-pink-500 to-rose-600'
  },
  {
    value: 'DATETIME',
    label: 'Fecha y Hora',
    icon: Clock,
    description: 'Selector con fecha y hora específica',
    category: 'basic',
    color: 'bg-gradient-to-br from-indigo-500 to-purple-600'
  },
  
  // Advanced Fields
  {
    value: 'EMAIL',
    label: 'Email',
    icon: Mail,
    description: 'Campo de correo electrónico con validación',
    category: 'advanced',
    color: 'bg-gradient-to-br from-blue-600 to-indigo-700'
  },
  {
    value: 'PHONE',
    label: 'Teléfono',
    icon: Phone,
    description: 'Campo de número telefónico',
    category: 'advanced',
    color: 'bg-gradient-to-br from-green-600 to-emerald-700'
  },
  {
    value: 'URL',
    label: 'Enlace Web',
    icon: LinkIcon,
    description: 'Campo para URLs con validación',
    category: 'advanced',
    color: 'bg-gradient-to-br from-cyan-500 to-blue-600'
  },
  {
    value: 'RATING',
    label: 'Calificación',
    icon: Star,
    description: 'Sistema de estrellas para valoraciones',
    category: 'advanced',
    color: 'bg-gradient-to-br from-yellow-500 to-orange-600'
  },
  {
    value: 'PRICE',
    label: 'Precio',
    icon: DollarSign,
    description: 'Campo monetario con formato de moneda',
    category: 'advanced',
    color: 'bg-gradient-to-br from-emerald-500 to-green-600'
  },
  {
    value: 'COLOR',
    label: 'Color',
    icon: Palette,
    description: 'Selector de color visual',
    category: 'advanced',
    color: 'bg-gradient-to-br from-pink-500 to-purple-600'
  },
  {
    value: 'LOCATION',
    label: 'Ubicación',
    icon: MapPin,
    description: 'Campo de dirección o coordenadas GPS',
    category: 'advanced',
    color: 'bg-gradient-to-br from-red-500 to-pink-600'
  },
  
  // Media Fields
  {
    value: 'IMAGE',
    label: 'Imagen',
    icon: ImageIcon,
    description: 'Subida de imágenes con preview',
    category: 'media',
    color: 'bg-gradient-to-br from-violet-500 to-purple-600'
  },
  {
    value: 'GALLERY',
    label: 'Galería',
    icon: ImageIcon,
    description: 'Múltiples imágenes organizadas',
    category: 'media',
    color: 'bg-gradient-to-br from-purple-600 to-indigo-700'
  },
  {
    value: 'FILE',
    label: 'Archivo',
    icon: FileText,
    description: 'Subida de documentos y archivos',
    category: 'media',
    color: 'bg-gradient-to-br from-gray-500 to-slate-600'
  }
];

export const FIELD_CATEGORIES = {
  basic: {
    label: 'Campos Básicos',
    description: 'Campos fundamentales para cualquier contenido',
    color: 'text-blue-600'
  },
  advanced: {
    label: 'Campos Avanzados', 
    description: 'Campos especializados con validaciones específicas',
    color: 'text-purple-600'
  },
  media: {
    label: 'Multimedia',
    description: 'Campos para archivos, imágenes y contenido multimedia',
    color: 'text-green-600'
  }
} as const;

export const DEFAULT_FIELD_CONFIG = {
  TEXT: { maxLength: 255, required: false },
  TEXTAREA: { maxLength: 1000, required: false },
  RICH_TEXT: { maxLength: 5000, required: false },
  NUMBER: { min: 0, max: 999999, required: false },
  BOOLEAN: { defaultValue: false },
  DATE: { required: false },
  DATETIME: { required: false },
  EMAIL: { required: false },
  PHONE: { required: false },
  URL: { required: false },
  RATING: { min: 1, max: 5, required: false },
  PRICE: { currency: 'COP', required: false },
  COLOR: { format: 'hex', required: false },
  LOCATION: { type: 'address', required: false },
  IMAGE: { maxSize: '5MB', formats: ['jpg', 'png', 'webp'], required: false },
  GALLERY: { maxImages: 10, maxSize: '5MB', required: false },
  FILE: { maxSize: '10MB', formats: ['pdf', 'doc', 'docx'], required: false }
} as const;

export type FieldTypeValue = typeof FIELD_TYPES[number]['value'];
export type FieldCategory = typeof FIELD_TYPES[number]['category'];
