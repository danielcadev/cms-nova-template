'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ContentTypeFormValues } from './ContentTypeForm';

interface BasicInfoSectionProps {
  form: UseFormReturn<ContentTypeFormValues>;
  mode: 'create' | 'edit';
}

export function BasicInfoSection({ form, mode }: BasicInfoSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Información Básica</h2>
        <p className="text-sm text-gray-500">Define el nombre y propósito de tu tipo de contenido personalizado</p>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Nombre del Tipo
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Ej: Artículo de Blog"
                    className="rounded-lg border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apiIdentifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Identificador API
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="articulo_blog"
                    className="rounded-lg border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono text-sm"
                    readOnly={mode === 'edit'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Descripción
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe para qué se usará este tipo de contenido..."
                  className="rounded-lg border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 min-h-[80px] resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
