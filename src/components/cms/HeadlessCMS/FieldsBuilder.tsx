'use client';

import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Text, Pilcrow, Hash, ToggleRight, Calendar, ImageIcon, GripVertical, Trash2 } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, useDraggable, useDroppable, DragOverEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { toCamelCase } from '@/utils/formatters';
import { ContentTypeFormValues, fieldSchema } from './ContentTypeForm';
import * as z from 'zod';

const fieldTypes: { type: z.infer<typeof fieldSchema>['type']; label: string; icon: JSX.Element }[] = [
    { type: 'TEXT', label: 'Texto Corto', icon: <Pilcrow className="h-5 w-5" /> },
    { type: 'RICH_TEXT', label: 'Texto Largo', icon: <Text className="h-5 w-5" /> },
    { type: 'NUMBER', label: 'Número', icon: <Hash className="h-5 w-5" /> },
    { type: 'BOOLEAN', label: 'Sí/No', icon: <ToggleRight className="h-5 w-5" /> },
    { type: 'DATE', label: 'Fecha', icon: <Calendar className="h-5 w-5" /> },
    { type: 'MEDIA', label: 'Media', icon: <ImageIcon className="h-5 w-5" /> },
];

function PaletteItem({ fieldType }: { fieldType: typeof fieldTypes[0] }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ 
        id: `palette-${fieldType.type}`,
        data: {
            type: 'palette',
            fieldType: fieldType.type
        }
    });
    
    return (
        <button 
            ref={setNodeRef} 
            {...listeners} 
            {...attributes} 
            type="button"
            className={`flex items-center gap-3 p-3 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-all cursor-grab w-full ${
                isDragging ? 'opacity-50 scale-95' : ''
            }`}
        >
            <span className="text-blue-600">{fieldType.icon}</span>
            <span className="font-semibold text-sm text-slate-800">{fieldType.label}</span>
        </button>
    );
}

function SortableFieldRow({ field, index, remove }: { field: any; index: number; remove: (index: number) => void; }) {
    const { control, setValue, getValues } = useFormContext<ContentTypeFormValues>();
    const { 
        attributes, 
        listeners, 
        setNodeRef, 
        transform, 
        transition, 
        isDragging 
    } = useSortable({ 
        id: field.id,
        data: {
            type: 'field',
            field,
            index
        }
    });
    
    const style = { 
        transform: CSS.Transform.toString(transform), 
        transition: transition || 'transform 250ms ease',
        zIndex: isDragging ? 1000 : 1
    };
    
    const labelValue = useWatch({ control, name: `fields.${index}.label` });
    
    useEffect(() => { 
        if (labelValue) {
            setValue(`fields.${index}.apiIdentifier`, toCamelCase(labelValue));
        }
    }, [labelValue, index, setValue]);

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className={`transition-all duration-200 ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}`}
        >
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    {...attributes} 
                    {...listeners} 
                    className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600"
                    type="button"
                >
                    <GripVertical className="h-5 w-5" />
                </Button>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <FormField 
                        control={control} 
                        name={`fields.${index}.label`} 
                        render={({ field: formField }) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                        placeholder="Etiqueta del campo" 
                                        {...formField} 
                                        className="border-gray-300 focus:border-blue-500"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} 
                    />
                    
                    <Input 
                        readOnly 
                        value={getValues(`fields.${index}.apiIdentifier`)} 
                        className="bg-slate-100 font-mono text-sm border-gray-300" 
                        placeholder="api_identifier"
                    />
                    
                    <FormField 
                        control={control} 
                        name={`fields.${index}.type`} 
                        render={({ field: selectField }) => (
                            <Select onValueChange={selectField.onChange} defaultValue={selectField.value}>
                                <FormControl>
                                    <SelectTrigger className="border-gray-300 focus:border-blue-500">
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {fieldTypes.map(ft => (
                                        <SelectItem key={ft.type} value={ft.type}>
                                            <div className="flex items-center gap-2">
                                                {ft.icon}
                                                {ft.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )} 
                    />
                    
                    <FormField 
                        control={control} 
                        name={`fields.${index}.isRequired`} 
                        render={({ field: switchField }) => (
                            <FormItem className="flex items-center justify-center h-full">
                                <FormControl>
                                    <div className="flex items-center gap-2">
                                        <Switch 
                                            checked={switchField.value} 
                                            onCheckedChange={switchField.onChange} 
                                        />
                                        <span className="text-sm text-gray-600">
                                            {switchField.value ? 'Requerido' : 'Opcional'}
                                        </span>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )} 
                    />
                </div>
                
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    type="button"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

const DropPlaceholder = ({ isOver, index }: { isOver: boolean; index?: number }) => {
    const { setNodeRef } = useDroppable({
        id: `drop-placeholder-${index || 0}`,
        data: {
            type: 'placeholder',
            index: index || 0
        }
    });

    return (
        <div 
            ref={setNodeRef}
            className={`h-16 my-2 flex items-center justify-center border-2 border-dashed rounded-xl transition-all duration-300 ${
                isOver 
                    ? 'bg-blue-50 border-blue-500 border-solid scale-105' 
                    : 'bg-gray-50/50 border-gray-300 hover:border-blue-300'
            }`}
        >
            {isOver ? (
                <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <p className="text-sm font-medium">Suelta aquí para añadir campo</p>
                </div>
            ) : (
                <p className="text-xs text-gray-400">Zona de drop</p>
            )}
        </div>
    );
};

export function FieldsBuilder() {
    const { control, setValue, getValues } = useFormContext<ContentTypeFormValues>();
    const { fields, append, remove, move } = useFieldArray({ control, name: "fields" });
    const [activeId, setActiveId] = useState<string | null>(null);
    const [overId, setOverId] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => { 
        setIsMounted(true);
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, { 
            activationConstraint: { 
                distance: 8 
            } 
        })
    );

    const handleDragStart = (event: DragEndEvent) => {
        console.log('🟡 Drag Start:', event.active.id);
        setActiveId(event.active.id as string);
    };
    
    const handleDragOver = (event: DragOverEvent) => {
        const overId = event.over?.id as string | null;
        console.log('🔵 Drag Over:', { activeId: event.active.id, overId });
        setOverId(overId);
    };
    
    const handleDragCancel = () => {
        console.log('🔴 Drag Cancel');
        setActiveId(null);
        setOverId(null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        console.log('🟢 Drag End:', { activeId: active.id, overId: over?.id });
        
        setActiveId(null);
        setOverId(null);
        
        if (!over) {
            console.log('❌ No drop target');
            return;
        }

        const activeIdStr = active.id.toString();
        const overIdStr = over.id.toString();

        // Si arrastramos desde la paleta
        if (activeIdStr.startsWith('palette-')) {
            const fieldType = activeIdStr.replace('palette-', '');
            const newLabel = `Campo ${fieldType.toLowerCase()}`;
            const newField = { 
                id: `field-${Date.now()}`, 
                label: newLabel, 
                apiIdentifier: toCamelCase(newLabel), 
                type: fieldType as any, 
                isRequired: false 
            };
            
            console.log('➕ Adding new field:', newField);
            
            // Si se suelta en un placeholder
            if (overIdStr.startsWith('drop-placeholder-')) {
                const insertIndex = parseInt(overIdStr.replace('drop-placeholder-', ''), 10);
                const currentFields = getValues('fields') || [];
                const newFields = [...currentFields];
                newFields.splice(insertIndex, 0, newField);
                setValue('fields', newFields, { shouldDirty: true });
                console.log('✅ Field added at index:', insertIndex);
                return;
            }
            
            // Si se suelta sobre un campo existente, insertamos antes
            const overIndex = fields.findIndex((f) => f.id === overIdStr);
            if (overIndex !== -1) {
                const currentFields = getValues('fields') || [];
                const newFields = [...currentFields];
                newFields.splice(overIndex, 0, newField);
                setValue('fields', newFields, { shouldDirty: true });
                console.log('✅ Field added before existing field at index:', overIndex);
                return;
            }
            
            // Si no hay target específico, añadir al final
            append(newField);
            console.log('✅ Field added at end');
            return;
        }

        // Si reorganizamos campos existentes
        if (activeIdStr !== overIdStr) {
            const oldIndex = fields.findIndex((f) => f.id === activeIdStr);
            const newIndex = fields.findIndex((f) => f.id === overIdStr);
            
            if (oldIndex !== -1 && newIndex !== -1) {
                console.log('🔄 Moving field from', oldIndex, 'to', newIndex);
                move(oldIndex, newIndex);
            }
        }
    };
    
    const activeItem = activeId ? (
        fieldTypes.find(f => `palette-${f.type}` === activeId) || 
        fields.find(f => f.id === activeId)
    ) : null;

    return (
        <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragStart={handleDragStart} 
            onDragEnd={handleDragEnd} 
            onDragOver={handleDragOver} 
            onDragCancel={handleDragCancel}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GripVertical className="h-5 w-5 text-blue-600" />
                                Estructura de Contenido
                            </CardTitle>
                            <CardDescription>
                                Arrastra campos desde la paleta y reordénalos según necesites.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                                <div className="space-y-2">
                                    {/* Drop zone inicial */}
                                    <DropPlaceholder 
                                        isOver={overId === 'drop-placeholder-0'} 
                                        index={0}
                                    />
                                    
                                    {fields.map((field, index) => (
                                        <div key={field.id}>
                                            <SortableFieldRow 
                                                field={field} 
                                                index={index} 
                                                remove={remove} 
                                            />
                                            {/* Drop zone después de cada campo */}
                                            <DropPlaceholder 
                                                isOver={overId === `drop-placeholder-${index + 1}`} 
                                                index={index + 1}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </SortableContext>
                            
                            {fields.length === 0 && !activeId && (
                                <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50">
                                    <GripVertical className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg font-medium">
                                        Arrastra un campo desde la paleta para empezar
                                    </p>
                                    <p className="text-gray-400 text-sm mt-2">
                                        Los campos aparecerán aquí y podrás reordenarlos
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                
                <div className="lg:col-span-1 lg:sticky top-24">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Paleta de Campos
                            </CardTitle>
                            <CardDescription>
                                Arrastra estos campos al constructor
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {fieldTypes.map(ft => (
                                <PaletteItem key={ft.type} fieldType={ft} />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            {/* Drag overlay */}
            {isMounted && createPortal(
                <DragOverlay>
                    {activeId && activeItem ? (
                        <div className="p-4 bg-white rounded-lg shadow-2xl border-2 border-blue-500 flex items-center gap-3 transform rotate-3 scale-105">
                            <span className="text-blue-600">
                                {(activeItem as any).icon || '📝'}
                            </span>
                            <span className="font-semibold text-gray-800">
                                {activeItem.label}
                            </span>
                        </div>
                    ) : null}
                </DragOverlay>, 
                document.body
            )}
        </DndContext>
    );
} 
