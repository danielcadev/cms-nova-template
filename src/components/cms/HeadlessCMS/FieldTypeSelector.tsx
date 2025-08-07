'use client';

/**
 * NOVA CMS - FIELD TYPE SELECTOR
 * ===============================
 * 
 * Selector visual para tipos de campos en el headless CMS.
 * Usado en FieldsBuilder para seleccionar el tipo de campo.
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Text, 
  Pilcrow, 
  Hash, 
  ToggleRight, 
  Calendar, 
  ImageIcon 
} from 'lucide-react';

export type FieldType = 'TEXT' | 'RICH_TEXT' | 'NUMBER' | 'BOOLEAN' | 'DATE' | 'MEDIA';

interface FieldTypeOption {
  type: FieldType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const fieldTypeOptions: FieldTypeOption[] = [
  {
    type: 'TEXT',
    label: 'Texto Corto',
    description: 'Una línea de texto para títulos, nombres, etc.',
    icon: <Pilcrow className="h-5 w-5" />,
    color: 'text-blue-600'
  },
  {
    type: 'RICH_TEXT',
    label: 'Texto Largo',
    description: 'Múltiples líneas para descripciones, contenido detallado',
    icon: <Text className="h-5 w-5" />,
    color: 'text-green-600'
  },
  {
    type: 'NUMBER',
    label: 'Número',
    description: 'Valores numéricos, precios, cantidades',
    icon: <Hash className="h-5 w-5" />,
    color: 'text-purple-600'
  },
  {
    type: 'BOOLEAN',
    label: 'Sí/No',
    description: 'Interruptor verdadero/falso, activado/desactivado',
    icon: <ToggleRight className="h-5 w-5" />,
    color: 'text-orange-600'
  },
  {
    type: 'DATE',
    label: 'Fecha',
    description: 'Selector de fecha para eventos, publicaciones',
    icon: <Calendar className="h-5 w-5" />,
    color: 'text-red-600'
  },
  {
    type: 'MEDIA',
    label: 'Media',
    description: 'URLs de imágenes, videos o archivos',
    icon: <ImageIcon className="h-5 w-5" />,
    color: 'text-pink-600'
  }
];

interface FieldTypeSelectorProps {
  selectedType?: FieldType;
  onSelect: (type: FieldType) => void;
  mode?: 'grid' | 'list';
}

export function FieldTypeSelector({ 
  selectedType, 
  onSelect, 
  mode = 'grid' 
}: FieldTypeSelectorProps) {
  if (mode === 'list') {
    return (
      <div className="space-y-2">
        {fieldTypeOptions.map((option) => (
          <Button
            key={option.type}
            variant={selectedType === option.type ? "default" : "outline"}
            onClick={() => onSelect(option.type)}
            className="w-full justify-start h-auto p-3"
          >
            <span className={option.color}>{option.icon}</span>
            <div className="ml-3 text-left">
              <div className="font-medium">{option.label}</div>
              <div className="text-xs text-gray-500">{option.description}</div>
            </div>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {fieldTypeOptions.map((option) => (
        <Card
          key={option.type}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedType === option.type 
              ? 'ring-2 ring-blue-500 bg-blue-50' 
              : 'hover:border-gray-300'
          }`}
          onClick={() => onSelect(option.type)}
        >
          <CardContent className="p-4 text-center">
            <div className={`${option.color} mb-2 flex justify-center`}>
              {option.icon}
            </div>
            <h3 className="font-medium text-sm mb-1">{option.label}</h3>
            <p className="text-xs text-gray-500 leading-tight">
              {option.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Export types para uso en otros componentes
export { fieldTypeOptions };
export type { FieldTypeOption };
