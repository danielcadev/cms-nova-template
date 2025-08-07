'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Sparkles, Database } from 'lucide-react';
import { toCamelCase } from '@/utils/formatters';
import { ContentTypeFormValues } from '../ContentTypesManager/ContentTypeForm';
import { PaletteItem } from './PaletteItem';
import { SortableFieldRow } from './SortableFieldRow';
import { DropPlaceholder } from './DropPlaceholder';
import { fieldTypes } from './constants';

export default function FieldsBuilder() {
  const { control, setValue } = useFormContext<ContentTypeFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "fields" });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => { setIsMounted(true) }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragStart = (event: DragEndEvent) => setActiveId(event.active.id as string);
  const handleDragOver = (event: DragEndEvent) => setOverId(event.over?.id as string | null);
  const handleDragCancel = () => setActiveId(null);

  // Componente para la zona de drop vacía
  function EmptyDropZone() {
    const { setNodeRef, isOver } = useDroppable({
      id: 'empty-drop-zone',
    });

    return (
      <div 
        ref={setNodeRef}
        className={`text-center py-20 border-2 border-dashed rounded-xl transition-all duration-300 ${
          isOver || activeId?.startsWith('palette-') 
            ? 'border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-800/50' 
            : 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20'
        }`}
        style={{ minHeight: '300px' }}
      >
        <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6">
          <Plus className="h-8 w-8 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
        </div>
        <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2 tracking-tight">
          {activeId?.startsWith('palette-') ? 'Suelta el campo aquí' : 'Comienza añadiendo campos'}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-500 max-w-md mx-auto leading-relaxed">
          {activeId?.startsWith('palette-') 
            ? 'Suelta el campo para agregarlo a tu estructura de contenido.'
            : 'Arrastra un campo desde los "Tipos de Campo" para empezar a diseñar.'
          }
        </p>
      </div>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    if (!over) return;

    if (active.id.toString().startsWith('palette-')) {
      const fieldType = active.id.toString().replace('palette-', '');
      const newLabel = 'Nuevo Campo';
      const newField = { 
        id: `field-${Date.now()}`, 
        label: newLabel, 
        apiIdentifier: toCamelCase(newLabel), 
        type: fieldType as any, 
        isRequired: false 
      };
      
      // Si se suelta en la zona vacía o no hay campos
      if (over.id === 'empty-drop-zone' || fields.length === 0) {
        append(newField);
        return;
      }
      
      const overIdStr = over.id.toString();
      if (overIdStr.startsWith('drop-placeholder-')) {
        const newIndex = parseInt(overIdStr.replace('drop-placeholder-', ''), 10);
        append(newField);
      } else {
        // Insertar en posición específica
        const overIndex = fields.findIndex((f) => f.id === over.id);
        if (overIndex !== -1) {
          const newFields = [...fields];
          newFields.splice(overIndex + 1, 0, newField);
          setValue('fields', newFields, { shouldDirty: true, shouldValidate: true });
        } else {
          // Si no encuentra la posición, agregar al final
          append(newField);
        }
      }
      return;
    }

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) move(oldIndex, newIndex);
    }
  };
  
  const activeItem = activeId ? (fieldTypes.find(f => `palette-${f.type}` === activeId) || fields.find(f => f.id === activeId)) : null;

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd} 
      onDragOver={handleDragOver} 
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Main Builder Area */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-8 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Database className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Estructura de Campos</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Arrastra campos desde la lateral y configúralos según tus necesidades</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {activeId?.startsWith('palette-') && <DropPlaceholder isOver={overId === 'drop-placeholder-0'} />}
                  
                    {fields.map((field, index) => (
                      <div key={field.id}>
                        <SortableFieldRow field={field} index={index} remove={remove} />
                        {activeId?.startsWith('palette-') && <DropPlaceholder isOver={overId === field.id} />}
                      </div>
                    ))}
                  
                </div>
              </SortableContext>
              
              {fields.length === 0 && <EmptyDropZone />}
            </div>
          </div>
        </div>

        {/* Fields Palette */}
        <div className="lg:col-span-1 lg:sticky top-24">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Tipos de Campo</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {fieldTypes.map((ft, index) => (
                <div key={ft.type}>
                  <PaletteItem fieldType={ft} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Drag Overlay */}
      {isMounted && createPortal(
        <DragOverlay>
          {activeId && activeItem ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 dark:text-gray-400">{(activeItem as any)?.icon}</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100">{activeItem?.label}</span>
            </div>
          ) : null}
        </DragOverlay>, 
        document.body
      )}
    </DndContext>
  );
}
