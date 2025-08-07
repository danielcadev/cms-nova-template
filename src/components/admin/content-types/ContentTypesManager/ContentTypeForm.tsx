'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Database, Type, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import FieldsBuilder from '../FieldsBuilder/index';
import { toCamelCase } from '@/utils/formatters';
import { createContentTypeAction, updateContentTypeAction } from '@/app/actions/content-type-actions';
import { z } from 'zod';

const fieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "El label es requerido"),
  apiIdentifier: z.string().min(1, "El identificador API es requerido"),
  type: z.enum(["TEXT", "RICH_TEXT", "NUMBER", "BOOLEAN", "DATE", "MEDIA"]),
  isRequired: z.boolean().default(false)
});

const contentTypeSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  apiIdentifier: z.string().min(1, "El identificador API es requerido"),
  description: z.string().optional(),
  fields: z.array(fieldSchema).min(1, "Debe tener al menos un campo")
});

export type ContentTypeFormValues = z.infer<typeof contentTypeSchema>;

interface ContentTypeFormProps {
  initialData?: Partial<ContentTypeFormValues>;
  contentTypeId?: string;
  isLoading?: boolean;
}

export default function ContentTypeForm({ initialData, contentTypeId, isLoading }: ContentTypeFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  console.log('🟢 ContentTypeForm - Initial data received:', initialData);
  console.log('🟢 ContentTypeForm - Content type ID:', contentTypeId);

  const methods = useForm<ContentTypeFormValues>({
    resolver: zodResolver(contentTypeSchema),
    defaultValues: {
      name: initialData?.name || '',
      apiIdentifier: initialData?.apiIdentifier || '',
      description: initialData?.description || '',
      fields: initialData?.fields || [],
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = methods;
  const nameValue = watch('name');

  // Auto-generate API identifier from name
  useEffect(() => {
    if (nameValue && !initialData?.apiIdentifier) {
      setValue('apiIdentifier', toCamelCase(nameValue), { shouldValidate: true });
    }
  }, [nameValue, setValue, initialData?.apiIdentifier]);

  const handleFormSubmit = async (data: ContentTypeFormValues) => {
    try {
      setIsSaving(true);
      
      const submitAction = contentTypeId
        ? (d: ContentTypeFormValues) => updateContentTypeAction(contentTypeId!, d)
        : createContentTypeAction;
      
      await submitAction(data);
      
      toast({
        title: contentTypeId ? "Tipo de contenido actualizado" : "Tipo de contenido creado",
        description: `El tipo de contenido se ha ${contentTypeId ? 'actualizado' : 'creado'} correctamente.`,
      });
      
      router.push('/admin/dashboard/content-types');
    } catch (error) {
      console.error('Error saving content type:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el tipo de contenido.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Save Button - Fixed at top */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isSaving || isLoading}
            className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Save className="h-4 w-4 mr-2" strokeWidth={1.5} />
            {isSaving ? 'Guardando...' : 'Guardar Tipo de Contenido'}
          </Button>
        </div>

        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Database className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Información Básica</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Define el nombre y descripción del tipo de contenido</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Type className="h-4 w-4" strokeWidth={1.5} />
                Nombre del Tipo
              </Label>
              <Input
                id="name"
                placeholder="ej. Blog Posts, Productos, Noticias"
                {...register('name', { required: 'El nombre es requerido' })}
                className="rounded-lg border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-gray-400 dark:focus:ring-gray-500 bg-white dark:bg-gray-800"
              />
              {errors.name && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="apiIdentifier" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Database className="h-4 w-4" strokeWidth={1.5} />
                Identificador API
              </Label>
              <Input
                id="apiIdentifier"
                placeholder="ej. blogPosts, productos, noticias"
                {...register('apiIdentifier', { required: 'El identificador API es requerido' })}
                className="rounded-lg border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-gray-400 dark:focus:ring-gray-500 bg-white dark:bg-gray-800"
              />
              {errors.apiIdentifier && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.apiIdentifier.message}</p>
              )}
            </div>
            
            <div className="md:col-span-2 space-y-3">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FileText className="h-4 w-4" strokeWidth={1.5} />
                Descripción
              </Label>
              <Textarea
                id="description"
                placeholder="Describe qué tipo de contenido almacenará esta estructura..."
                {...register('description')}
                className="rounded-lg border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-gray-400 dark:focus:ring-gray-500 bg-white dark:bg-gray-800 resize-none h-24"
              />
            </div>
          </div>
        </div>

        {/* Fields Builder */}
        <div>
          <FieldsBuilder />
        </div>
      </form>
    </FormProvider>
  );
}
