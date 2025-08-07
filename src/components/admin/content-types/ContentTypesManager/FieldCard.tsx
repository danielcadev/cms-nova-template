'use client';

import { Settings, Trash2, GripVertical, FileText } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FIELD_TYPES } from './constants';

interface FieldCardProps {
  field: any;
  onEdit?: (field: any) => void;
  onDelete: (fieldId: string) => void;
  isDragging?: boolean;
}

interface SortableFieldCardProps {
  field: any;
  index?: number;
  onDelete: (fieldId: string) => void;
}

export function FieldCard({ field, onDelete }: FieldCardProps) {
  const onEdit = (field: any) => {
    // TODO: Implementar edición de campos
    console.log('Editando campo:', field);
  };

  return <SortableFieldCard field={field} onDelete={onDelete} />;
}

export function SortableFieldCard({ field, onDelete }: SortableFieldCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({ 
    id: field.id || field.apiIdentifier,
    data: {
      type: 'field',
      field
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: sortableIsDragging ? 1000 : 1
  };

  const fieldType = FIELD_TYPES.find((t: any) => t.value === field.type);
  const IconComponent = fieldType?.icon || FileText;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
        sortableIsDragging ? 'shadow-lg scale-105 opacity-50' : ''
      }`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div 
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded-md mt-1"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          
          <div className={`p-3 rounded-lg bg-gradient-to-br ${fieldType?.color || 'from-gray-400 to-gray-500'} flex-shrink-0`}>
            <IconComponent className="h-5 w-5 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-base mb-1">{field.label}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {fieldType?.label || 'Campo'}
                  </span>
                  {field.isRequired && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Requerido
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 font-mono mb-2">{field.apiIdentifier}</p>
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(field.id)}
                  className="h-8 w-8 p-0 rounded-md hover:bg-red-50 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {fieldType && (
              <div className="space-y-1">
                <p className="text-sm text-gray-600">{fieldType.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md font-medium">
                    {fieldType.category}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
