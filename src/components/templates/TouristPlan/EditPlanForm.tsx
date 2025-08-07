'use client';

/**
 * NOVA CMS - SISTEMA DE TEMPLATES
 * ================================
 * 
 * Este componente es parte del SISTEMA DE TEMPLATES de Nova CMS.
 * Los templates son formularios predefinidos para tipos específicos de contenido.
 * 
 * ARQUITECTURA DUAL:
 * 1. TEMPLATES (este archivo) - Formularios predefinidos como "Plan Turístico"
 * 2. HEADLESS CMS - Sistema flexible para crear tipos de contenido personalizados
 * 
 * Este EditPlanForm es un TEMPLATE específico para planes turísticos que:
 * - Tiene secciones predefinidas (BasicInfo, Itinerary, Pricing, etc.)
 * - Usa el schema planSchema de Zod para validación
 * - Se guarda en las tablas específicas de planes (no en ContentEntry)
 * - Forma parte del sistema tradicional de gestión de planes
 */

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTransition, useEffect, useCallback, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { planSchema, type PlanFormValues } from '@/schemas/plan';
// AdminLayout se maneja en la página padre
import { BasicInfoSection } from './sections/BasicInfoSection';
import { IncludesSection } from './sections/IncludesSection';
import { ItinerarySection } from './sections/ItinerarySection';
import { PricingSection } from './sections/PricingSection';
import { VideoSection } from './sections/VideoSection';
import { updatePlanAction } from '@/app/actions/plan-actions';
import { useFormPersistence } from '@/hooks/use-form-persistence';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, Info, ListOrdered, Check, DollarSign, Video, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AutosaveStatus } from '@/components/cms/AutosaveStatus';

interface EditPlanFormProps {
  initialData: PlanFormValues;
  planId: string;
}

const FORM_STORAGE_KEY_PREFIX = 'planForm-edit-';

// Componente para una sección plegable con diseño Notion
const SectionWrapper = ({ icon, title, description, children, defaultOpen = false }: { icon: React.ReactNode, title: string, description: string, children: React.ReactNode, defaultOpen?: boolean }) => (
    <Collapsible defaultOpen={defaultOpen}>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-6 text-left group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        {icon}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{title}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                    </div>
                </div>
                <ChevronsUpDown className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-200 ui-open:rotate-180" strokeWidth={1.5} />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-6 pt-0">
                {children}
            </CollapsibleContent>
        </div>
    </Collapsible>
);

export function EditPlanForm({ initialData, planId }: EditPlanFormProps) {
  const router = useRouter();
  const { toast } = useToast();
    const [isSubmitting, startTransition] = useTransition();

    const form = useForm<PlanFormValues>({
        resolver: zodResolver(planSchema),
        defaultValues: initialData,
        mode: 'onChange',
    });

    const { formState: { isDirty } } = form;

    const onSaveRef = useRef<((values: PlanFormValues) => Promise<void>) | null>(null);

    const saveImplementation = useCallback(async (data: PlanFormValues) => {
        startTransition(async () => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
                }
            });
            formData.append('planId', planId);

            const result = await updatePlanAction(null, formData);
            if (result.success) {
                form.clearErrors();
            } else {
                if (result.error) {
                    toast({ variant: "destructive", title: "Error de Guardado", description: result.error || "No se pudieron guardar los cambios." });
                } else {
                    toast({ variant: "destructive", title: "Error de Guardado", description: "No se pudieron guardar los cambios." });
                }
            }
        });
    }, [planId, toast, form, startTransition]);

    useEffect(() => {
        onSaveRef.current = saveImplementation;
    }, [saveImplementation]);

    useFormPersistence(form, `${FORM_STORAGE_KEY_PREFIX}${planId}`, initialData, undefined, {
        mode: 'edit',
        onSave: (values) => {
            if (onSaveRef.current) return onSaveRef.current(values);
            return Promise.resolve();
        },
    });
    
    const handleFinalSubmit = async (data: PlanFormValues) => {
        await saveImplementation(data);
        toast({ title: "Plan Guardado", description: "Todos los cambios han sido guardados." });
        router.push('/admin/dashboard/view-content');
  };

  const handleGoBack = () => {
    router.push('/admin/dashboard/templates/tourism');
  };

  return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative">
                {/* Clean editorial background */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900/50" />

                <div className="relative z-10">
                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="flex flex-col min-h-screen">
                            {/* Header */}
                            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-6 sticky top-0 z-10">
                                <div className="max-w-7xl mx-auto flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={handleGoBack}
                                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors"
                                        >
                                            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                                            <span className="font-medium">Volver a Planes</span>
                                        </Button>
                                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
                                        <div>
                                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Editando Plan Turístico</h1>
                                            <AutosaveStatus isDirty={isDirty} isSaving={isSubmitting} className="mt-1" />
                                        </div>
                                    </div>
                                    <Button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                    >
                                        {isSubmitting ? 'Guardando...' : 'Finalizar y Salir'}
                                    </Button>
                                </div>
                            </header>
                            
                            {/* Main Content */}
                            <main className="flex-1 p-8">
                                <div className="max-w-7xl mx-auto space-y-8">
                                <SectionWrapper
                                    icon={<Info className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />}
                                    title="1. Información Básica"
                                    description="Título, destino, URLs y la imagen principal de tu plan."
                                    defaultOpen={true}
                                >
                                    <BasicInfoSection />
                                </SectionWrapper>
                                
                                <SectionWrapper
                                    icon={<Check className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />}
                                    title="2. Incluye / No Incluye"
                                    description="Especifica qué servicios y productos están cubiertos por el precio."
                                >
                                    <IncludesSection />
                                </SectionWrapper>

                                <SectionWrapper
                                    icon={<ListOrdered className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />}
                                    title="3. Itinerario Detallado"
                                    description="Organiza los días, las actividades y las imágenes de cada jornada."
                                >
                                    <ItinerarySection />
                                </SectionWrapper>

                                <SectionWrapper
                                    icon={<DollarSign className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />}
                                    title="4. Precios y Opciones"
                                    description="Define los precios para diferentes cantidades de personas y monedas."
                                >
                                    <PricingSection />
                                </SectionWrapper>

                                <SectionWrapper
                                    icon={<Video className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />}
                                    title="5. Video Promocional"
                                    description="Añade un video de YouTube para hacerlo más atractivo."
                                >
                                    <VideoSection />
                                </SectionWrapper>
                                </div>
                            </main>

                            {/* Footer */}
                            <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 p-6 sticky bottom-0 z-10">
                                <div className="max-w-7xl mx-auto flex items-center justify-end">
                                    <Button 
                                        type="submit" 
                                        disabled={isSubmitting} 
                                        className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                    >
                                        {isSubmitting ? 'Guardando...' : 'Finalizar y Salir'}
                                    </Button>
                                </div>
                            </footer>
                        </form>
                    </FormProvider>
                </div>
            </div>
  );
}
