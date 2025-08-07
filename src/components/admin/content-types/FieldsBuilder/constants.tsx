import { 
  Text, 
  Pilcrow, 
  Hash, 
  ToggleRight, 
  Calendar, 
  ImageIcon
} from 'lucide-react';
import * as z from 'zod';

// Schema para validar campos
export const fieldSchema = z.object({
  type: z.enum(['TEXT', 'RICH_TEXT', 'NUMBER', 'BOOLEAN', 'DATE', 'MEDIA']),
  label: z.string(),
  apiIdentifier: z.string(),
  isRequired: z.boolean().default(false)
});

export const fieldTypes: { 
  type: z.infer<typeof fieldSchema>['type']; 
  label: string; 
  icon: JSX.Element;
  description: string;
  color: string;
}[] = [
  { 
    type: 'TEXT', 
    label: 'Texto Corto', 
    icon: <Pilcrow className="h-5 w-5" />, 
    description: 'Campo de texto simple',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    type: 'RICH_TEXT', 
    label: 'Texto Largo', 
    icon: <Text className="h-5 w-5" />, 
    description: 'Editor de texto enriquecido',
    color: 'from-green-500 to-green-600'
  },
  { 
    type: 'NUMBER', 
    label: 'Número', 
    icon: <Hash className="h-5 w-5" />, 
    description: 'Campo numérico',
    color: 'from-orange-500 to-orange-600'
  },
  { 
    type: 'BOOLEAN', 
    label: 'Sí/No', 
    icon: <ToggleRight className="h-5 w-5" />, 
    description: 'Interruptor verdadero/falso',
    color: 'from-purple-500 to-purple-600'
  },
  { 
    type: 'DATE', 
    label: 'Fecha', 
    icon: <Calendar className="h-5 w-5" />, 
    description: 'Selector de fecha',
    color: 'from-pink-500 to-pink-600'
  },
  { 
    type: 'MEDIA', 
    label: 'Media', 
    icon: <ImageIcon className="h-5 w-5" />, 
    description: 'Archivos e imágenes',
    color: 'from-indigo-500 to-indigo-600'
  },
];
