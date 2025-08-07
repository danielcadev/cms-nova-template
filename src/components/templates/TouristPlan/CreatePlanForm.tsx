// components/forms/PlanForm/CreatePlanForm.tsx
'use client';

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useTransition } from "react";
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { planSchema, type PlanFormValues } from '@/schemas/plan';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { BasicInfoSection } from './sections/BasicInfoSection';
import { IncludesSection } from './sections/IncludesSection';
import { ItinerarySection } from './sections/ItinerarySection';
import { PricingSection } from './sections/PricingSection';
import { VideoSection } from './sections/VideoSection';
import { createDraftPlanAction } from '@/app/actions/plan-actions';
import { Loader2, FileText, MapPin, DollarSign, Video, List, ArrowLeft } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';

// Este componente ahora obtendrá los datos del lado del cliente
export function CreatePlanForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isCreatingDraft, startTransition] = useTransition();

    const form = useForm<PlanFormValues>({
        resolver: zodResolver(planSchema),
        defaultValues: {
            mainTitle: '',
            promotionalText: '',
            itinerary: [],
            priceOptions: [],
        },
    });

  const { formState: { isDirty } } = form;

  const handleGoBack = () => {
    router.push('/admin/dashboard/templates/tourism');
  };

    useEffect(() => {
    // Si el formulario ha sido modificado y no estamos ya creando un borrador...
    if (isDirty && !isCreatingDraft) {
      startTransition(async () => {
        let toastId: string | undefined;
        try {
          toastId = toast({
            title: 'Creando borrador...',
            description: 'Espera un momento, estamos preparando todo para el autoguardado.',
          }).id;

          const formData = form.getValues();
          const result = await createDraftPlanAction(formData);

          if (result.success && result.planId) {
            toast({
              title: '¡Borrador creado!',
              description: 'Ahora todos tus cambios se guardarán automáticamente.',
            });
            // Redirigir a la página de edición del nuevo borrador
            router.push(`/admin/dashboard/templates/tourism/edit/${result.planId}`);
          } else {
            throw new Error(result.error || 'No se pudo inicializar el plan.');
          }
    } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Error al crear el borrador',
            description: error instanceof Error ? error.message : 'Error desconocido',
          });
        } finally {
          if (toastId) {
            // Opcional: cerrar el toast de "Creando..." si es necesario
          }
        }
      });
    }
  }, [isDirty, isCreatingDraft, startTransition, router, toast]);
  
  // Mientras se crea el borrador, mostramos un estado de carga para evitar interacción.
  if (isCreatingDraft) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-lg text-muted-foreground">Creando borrador y activando autoguardado...</p>
        </div>
      </AdminLayout>
    );
    }

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative">
                {/* Clean editorial background */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900/50" />

                <div className="relative z-10">
                    <FormProvider {...form}>
                        <form className="flex flex-col min-h-screen">
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
                                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Crear Nuevo Plan Turístico</h1>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Comienza a escribir para activar el autoguardado</p>
                                        </div>
                                    </div>
                                </div>
                            </header>

                            {/* Main Content */}
                            <main className="flex-1 p-8">
                                <div className="max-w-7xl mx-auto space-y-8">
                                    {/* Información Básica */}
                                    <Collapsible defaultOpen={true}>
                                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700">
                                            <CollapsibleTrigger className="flex items-center justify-between w-full p-6 text-left group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                                        <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">1. Información Básica</h2>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Título, descripción y detalles principales</p>
                                                    </div>
                                                </div>
                                                <ChevronsUpDown className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-200 ui-open:rotate-180" strokeWidth={1.5} />
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="p-6 pt-0">
                                                <BasicInfoSection />
                                            </CollapsibleContent>
                                        </div>
                                    </Collapsible>

                                    {/* Incluye y No Incluye */}
                                    <Collapsible defaultOpen={false}>
                                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700">
                                            <CollapsibleTrigger className="flex items-center justify-between w-full p-6 text-left group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                                        <List className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">2. Incluye / No Incluye</h2>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Servicios incluidos y exclusiones</p>
                                                    </div>
                                                </div>
                                                <ChevronsUpDown className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-200 ui-open:rotate-180" strokeWidth={1.5} />
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="p-6 pt-0">
                                                <IncludesSection />
                                            </CollapsibleContent>
                                        </div>
                                    </Collapsible>

                                    {/* Itinerario */}
                                    <Collapsible defaultOpen={false}>
                                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700">
                                            <CollapsibleTrigger className="flex items-center justify-between w-full p-6 text-left group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                                        <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">3. Itinerario Detallado</h2>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Actividades día a día</p>
                                                    </div>
                                                </div>
                                                <ChevronsUpDown className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-200 ui-open:rotate-180" strokeWidth={1.5} />
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="p-6 pt-0">
                                                <ItinerarySection />
                                            </CollapsibleContent>
                                        </div>
                                    </Collapsible>

                                    {/* Precios */}
                                    <Collapsible defaultOpen={false}>
                                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700">
                                            <CollapsibleTrigger className="flex items-center justify-between w-full p-6 text-left group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                                        <DollarSign className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">4. Precios y Opciones</h2>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Opciones de precios por persona</p>
                                                    </div>
                                                </div>
                                                <ChevronsUpDown className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-200 ui-open:rotate-180" strokeWidth={1.5} />
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="p-6 pt-0">
                                                <PricingSection />
                                            </CollapsibleContent>
                                        </div>
                                    </Collapsible>

                                    {/* Video Promocional */}
                                    <Collapsible defaultOpen={false}>
                                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-700">
                                            <CollapsibleTrigger className="flex items-center justify-between w-full p-6 text-left group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                                        <Video className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">5. Video Promocional</h2>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Video de YouTube (opcional)</p>
                                                    </div>
                                                </div>
                                                <ChevronsUpDown className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-200 ui-open:rotate-180" strokeWidth={1.5} />
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="p-6 pt-0">
                                                <VideoSection />
                                            </CollapsibleContent>
                                        </div>
                                    </Collapsible>
                                </div>
                            </main>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </AdminLayout>
    );
}
