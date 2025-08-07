'use client';

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useFormContext, useWatch, Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MainImage } from '../components/MainImage';
import { Combobox as OriginalCombobox, type ComboboxOption } from '@/components/ui/combobox';
import { useToast } from '@/hooks/use-toast';
import slugify from 'slugify';
import { type PlanFormValues } from '@/schemas/plan';
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';

// =====================================================================================
// SECCIÓN UNIFICADA, SIN PASOS
// =====================================================================================

const URLPreview = memo(({ categoryAlias, destinationSlug, articleAlias }: { categoryAlias: string; destinationSlug: string; articleAlias: string;}) => (
    <div className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <span className="text-gray-500 dark:text-gray-400">tudominio.com</span>
        <span className="text-gray-600 dark:text-gray-300 font-medium">/</span><span className="text-gray-700 dark:text-gray-200">{categoryAlias||'categoria'}</span>
        <span className="text-gray-600 dark:text-gray-300 font-medium">/</span><span className="text-gray-700 dark:text-gray-200">{destinationSlug||'destino'}</span>
        <span className="text-gray-600 dark:text-gray-300 font-medium">/</span><span className="text-gray-700 dark:text-gray-200">{articleAlias||'mi-plan'}</span>
    </div>
));
URLPreview.displayName = 'URLPreview';

export function BasicInfoSection() {
    const { control, setValue, watch } = useFormContext<PlanFormValues>();
    const { toast } = useToast();

    const [destinations, setDestinations] = useState<ComboboxOption[]>([]);
    const [isLoadingDest, setIsLoadingDest] = useState(true);
    const [categoryOptions, setCategoryOptions] = useState<ComboboxOption[]>([]);
    const [planSlugOptions, setPlanSlugOptions] = useState<ComboboxOption[]>([]);
    
    const mainTitle = watch('mainTitle');
    const destinationId = watch('destinationId');
    const articleAlias = watch('articleAlias');

    const destinationSlug = useMemo(() => {
        const selected = destinations.find(d => d.value === destinationId);
        return selected ? slugify(selected.label, { lower: true, strict: true }) : '';
    }, [destinations, destinationId]);

    const generateSmartSlug = (text: string, count: number = 7): string[] => {
        if (!text) return [];
        const [title] = text.split(/[|]/).map(part => part.trim());
        const stopWords = new Set(['plan', 'tour', 'viaje', 'paquete', 'en', 'de', 'del', 'la', 'los', 'y', 'a', 'o']);
        const titleParts = title.replace(/^circuito\s+/i, '').split(/,|\sy\s/i).map(p => p.trim()).filter(Boolean);
        const dests = titleParts.map(p => (p.match(/\b[A-ZÀ-Ú][a-zà-ú']+\b/g) || []).map(d => d.toLowerCase()).filter(d => !stopWords.has(d))[0]).filter(Boolean).slice(0, 3) as string[];
        const durationMatch = text.match(/(\d+)\s*d[ií]as?/i);
        const duration = durationMatch ? `${durationMatch[1]}dias` : '';
        const suggestions = new Set<string>();
        if (dests.length > 0) {
            const base = dests.join('-');
            suggestions.add(base);
            if (duration) suggestions.add(`${base}-${duration}`);
        }
        return Array.from(suggestions).map(s => slugify(s, { lower: true, strict: true })).filter(Boolean).slice(0, count);
    };

    useEffect(() => {
        if (mainTitle) {
            const suggestions = generateSmartSlug(mainTitle, 7);
            setPlanSlugOptions(suggestions.map(s => ({ label: s, value: s })));
            if (suggestions.length > 0 && !watch('articleAlias')) {
                setValue('articleAlias', suggestions[0]);
            }
        } else {
            setPlanSlugOptions([]);
        }
    }, [mainTitle, setValue, watch]);

    useEffect(() => {
        const fetchDests = async () => {
            try {
                const res = await fetch('/api/destinations');
                const data = await res.json();
                setDestinations(data.map((d: any) => ({ label: d.name, value: d.id })));
            } catch (e) {
                toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar los destinos.' });
            } finally {
                setIsLoadingDest(false);
            }
        };
        fetchDests();
    }, [toast]);

    // Cargar categorías existentes desde la base de datos
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                const data = await res.json();
                setCategoryOptions(data);
            } catch (e) {
                console.error('Error loading categories:', e);
                // No mostrar toast para categorías ya que no es crítico
            }
        };
        fetchCategories();
    }, []);

    const handleCreateOption = (field: keyof PlanFormValues, optionsState: any, setOptionsState: any) => useCallback((inputValue: string) => {
        const newValue = slugify(inputValue, { lower: true, strict: true });
        if (!optionsState.some((o: ComboboxOption) => o.value === newValue)) {
            const newOption = { label: inputValue, value: newValue };
            setOptionsState((prev: ComboboxOption[]) => [newOption, ...prev]);
            setValue(field, newValue);
            toast({ title: 'Opción Añadida', description: `Se usará "${inputValue}".` });
        }
    }, [optionsState, setOptionsState, setValue, toast]);

    const handleCreateCategory = handleCreateOption('categoryAlias', categoryOptions, setCategoryOptions);
    const handleCreatePlanSlug = handleCreateOption('articleAlias', planSlugOptions, setPlanSlugOptions);
    
    // Función especial para crear destinos (requiere API call)
    const handleCreateDestination = useCallback(async (inputValue: string) => {
        try {
            const trimmedValue = inputValue.trim();
            
            // Verificar si ya existe por nombre
            if (destinations.some(d => d.label.toLowerCase() === trimmedValue.toLowerCase())) {
                toast({ title: 'Destino ya existe', description: `"${trimmedValue}" ya está en la lista.`, variant: 'destructive' });
                return;
            }
            
            // Crear destino en la base de datos
            const response = await fetch('/api/destinations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: trimmedValue })
            });
            
            if (!response.ok) {
                throw new Error('Error al crear destino');
            }
            
            const newDestination = await response.json();
            const newOption = { label: newDestination.name, value: newDestination.id };
            
            // Actualizar la lista local y seleccionar el nuevo destino
            setDestinations(prev => [newOption, ...prev]);
            setValue('destinationId', newDestination.id);
            
            toast({ 
                title: 'Destino Creado', 
                description: `"${trimmedValue}" ha sido añadido exitosamente.` 
            });
            
        } catch (error) {
            console.error('Error creating destination:', error);
            toast({ 
                title: 'Error', 
                description: 'No se pudo crear el destino. Inténtalo de nuevo.', 
                variant: 'destructive' 
            });
        }
    }, [destinations, setDestinations, setValue, toast]);

    return (
        <div className="space-y-8">
            {/* Sección de Imagen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Imagen de Portada</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Esta será la primera impresión de tu plan. Elige una imagen horizontal y de alta calidad.</p>
                </div>
                <div className="md:col-span-2">
                    <MainImage form={useFormContext<PlanFormValues>()} />
                </div>
            </div>

            {/* Sección de Destino y Transporte */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Detalles del Destino</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Selecciona el destino principal de tu base de datos y especifica sus características.</p>
                </div>
                <div className="md:col-span-2 space-y-6">
                    <FormField control={control} name="destinationId" render={({ field }) => (
                        <FormItem><FormLabel className="text-gray-700 dark:text-gray-300">Destino Principal</FormLabel><FormControl><OriginalCombobox value={field.value} onChange={field.onChange} options={destinations} onCreate={handleCreateDestination} placeholder={isLoadingDest ? "Cargando destinos..." : "Busca un destino o crea uno nuevo"} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"><div className="space-y-1"><FormLabel className="font-medium text-gray-800 dark:text-gray-200">¿Es un plan terrestre?</FormLabel><p className="text-sm text-gray-600 dark:text-gray-400">Actívalo si el principal medio de transporte para llegar es por tierra.</p></div><FormField control={control} name="allowGroundTransport" render={({ field }) => <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>} /></div>
                </div>
            </div>

            {/* Sección de Título y URLs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Título y Dirección Web</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">El nombre de tu plan y cómo se verá en la barra de direcciones del navegador. Clave para el SEO.</p>
                </div>
                <div className="md:col-span-2 space-y-6">
                    <FormField control={control} name="mainTitle" render={({ field }) => (
                        <FormItem><FormLabel className="text-gray-700 dark:text-gray-300">Título Principal del Plan</FormLabel><FormControl><Input {...field} placeholder="Ej: Circuito Mágico por la Riviera Maya" className="rounded-lg border-gray-200 dark:border-gray-700" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Nuestras sugerencias inteligentes para la URL se basan en el título que escribas.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormField control={control} name="categoryAlias" render={({ field }) => (
                                <FormItem><FormLabel className="text-gray-700 dark:text-gray-300">Categoría</FormLabel><FormControl><OriginalCombobox value={field.value} onChange={field.onChange} options={categoryOptions} onCreate={handleCreateCategory} placeholder="Elige..." /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormItem><FormLabel className="text-gray-700 dark:text-gray-300">Destino</FormLabel><FormControl><Input value={destinationSlug} readOnly placeholder="Automático" className="bg-gray-200 dark:bg-gray-700 rounded-lg" /></FormControl></FormItem>
                            <FormField control={control} name="articleAlias" render={({ field }) => (
                                <FormItem><FormLabel className="text-gray-700 dark:text-gray-300">Slug del Plan</FormLabel><FormControl><OriginalCombobox value={field.value} onChange={field.onChange} options={planSlugOptions} onCreate={handleCreatePlanSlug} placeholder="Elige o crea..." /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                        <URLPreview categoryAlias={watch('categoryAlias') || ''} destinationSlug={destinationSlug} articleAlias={articleAlias || ''} />
                    </div>
                </div>
            </div>
            
        </div>
    );
}
