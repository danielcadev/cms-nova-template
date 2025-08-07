'use client';

import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useTransition } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { createContentTypeAction, updateContentTypeAction } from '@/app/actions/content-type-actions';
import { useRouter } from 'next/navigation';
import { toCamelCase } from '@/utils/formatters';
import { FieldsBuilder } from './FieldsBuilder';
import { Loader2 } from 'lucide-react';

// --- DEFINICIONES DE SCHEMA Y TIPOS ---
export const fieldSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(3, "La etiqueta es requerida."),
  apiIdentifier: z.string(),
  type: z.enum(["TEXT", "RICH_TEXT", "NUMBER", "BOOLEAN", "DATE", "MEDIA"]),
  isRequired: z.boolean(),
});

export const contentTypeSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  apiIdentifier: z.string().min(3, "El identificador API es requerido."),
  description: z.string().optional(),
  fields: z.array(fieldSchema).min(1, "Debes añadir al menos un campo."),
});

export type ContentTypeFormValues = z.infer<typeof contentTypeSchema>;

// --- Componente principal del formulario ---
export function ContentTypeForm({ mode = 'create', initialData, contentTypeId }: { mode?: 'create' | 'edit', initialData?: any, contentTypeId?: string }) {
    const { toast } = useToast();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<ContentTypeFormValues>({
        resolver: zodResolver(contentTypeSchema),
        defaultValues: initialData || { name: '', apiIdentifier: '', description: '', fields: [{ label: 'Título', apiIdentifier: 'titulo', type: 'TEXT', isRequired: true }] }
    });
    
    const nameValue = useWatch({ control: form.control, name: 'name' });

    useEffect(() => {
        if (mode === 'create' && nameValue) {
            form.setValue('apiIdentifier', toCamelCase(nameValue), { shouldValidate: true });
        }
    }, [nameValue, form.setValue, mode]);

    const onSubmit = (data: ContentTypeFormValues) => {
        startTransition(async () => {
            const action = mode === 'create'
                ? createContentTypeAction
                : (d: ContentTypeFormValues) => updateContentTypeAction(contentTypeId!, d);

            const result = await action(data);

            if (result.success) {
                toast({ title: "¡Éxito!", description: result.message });
                router.push('/admin/dashboard/view-content');
            } else {
                toast({ variant: "destructive", title: "Error", description: result.message });
            }
        });
    };
    
    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Información Básica</CardTitle>
                        <CardDescription>Define el nombre y la descripción de tu nuevo tipo de contenido.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Nombre del Tipo de Contenido</FormLabel><FormControl><Input placeholder="Ej: Post de Blog, Producto..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="apiIdentifier" render={({ field }) => (<FormItem><FormLabel>Identificador API (Automático)</FormLabel><FormControl><Input readOnly className="bg-slate-100" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Descripción</FormLabel><FormControl><Textarea placeholder="Describe brevemente para qué se usará este tipo de contenido." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </CardContent>
                </Card>
                
                <FieldsBuilder />

                <div className="flex justify-end">
                    <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isPending ? 'Guardando...' : 'Guardar y Finalizar'}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
} 
