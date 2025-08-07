'use client';

import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from "@/components/ui/switch";
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GripVertical, Trash2 } from 'lucide-react';
import { toCamelCase } from '@/utils/formatters';
import { ContentTypeFormValues } from '../ContentTypesManager/ContentTypeForm';
import { fieldTypes } from './constants';

interface SortableFieldRowProps {
  field: any;
  index: number;
  remove: (index: number) => void;
}

export function SortableFieldRow({ field, index, remove }: SortableFieldRowProps) {
  const { control, setValue, getValues } = useFormContext<ContentTypeFormValues>();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });
  const style = { transform: CSS.Transform.toString(transform), transition: transition || 'transform 250ms ease' };
  const labelValue = useWatch({ control, name: `fields.${index}.label` });
  
  useEffect(() => { 
    if (labelValue) setValue(`fields.${index}.apiIdentifier`, toCamelCase(labelValue)) 
  }, [labelValue, index, setValue]);

  const fieldTypeInfo = fieldTypes.find(ft => ft.type === field.type);

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="group">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
        <div className="flex items-center gap-4">
          {/* Drag Handle */}
          <Button 
            variant="ghost" 
            size="icon" 
            {...attributes} 
            {...listeners} 
            className="cursor-grab hover:bg-gray-100 rounded-xl"
          >
            <GripVertical className="h-5 w-5 text-gray-400" />
          </Button>

          {/* Field Type Icon */}
          <div className={`w-10 h-10 bg-gradient-to-br ${fieldTypeInfo?.color || 'from-gray-400 to-gray-500'} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <span className="text-white text-sm">{fieldTypeInfo?.icon}</span>
          </div>

          {/* Field Configuration */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
            {/* Label */}
            <FormField 
              control={control} 
              name={`fields.${index}.label`} 
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Etiqueta del campo" 
                      {...field} 
                      className="rounded-xl border-gray-200 bg-white/90 focus:border-purple-300 focus:ring-purple-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />

            {/* API Identifier */}
            <Input 
              readOnly 
              value={getValues(`fields.${index}.apiIdentifier`)} 
              className="bg-gray-50 font-mono text-sm rounded-xl border-gray-200" 
              placeholder="api_identifier"
            />

            {/* Field Type Selector */}
            <FormField 
              control={control} 
              name={`fields.${index}.type`} 
              render={({ field: selectField }) => (
                <Select onValueChange={selectField.onChange} defaultValue={selectField.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-xl border-gray-200 bg-white/90">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl">
                    {fieldTypes.map(ft => (
                      <SelectItem key={ft.type} value={ft.type} className="rounded-lg m-1">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 bg-gradient-to-br ${ft.color} rounded-lg flex items-center justify-center`}>
                            <span className="text-white text-xs">{ft.icon}</span>
                          </div>
                          {ft.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} 
            />

            {/* Required Switch */}
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
                        className="data-[state=checked]:bg-purple-500"
                      />
                      <span className="text-sm text-gray-600 font-medium">
                        {switchField.value ? 'Requerido' : 'Opcional'}
                      </span>
                    </div>
                  </FormControl>
                </FormItem>
              )} 
            />
          </div>

          {/* Delete Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => remove(index)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
