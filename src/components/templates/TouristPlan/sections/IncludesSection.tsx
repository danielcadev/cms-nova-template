'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle } from 'lucide-react';

export function IncludesSection() {
    const { control } = useFormContext();

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Incluye / No Incluye</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Especifica detalladamente qué servicios y productos están cubiertos por el precio del plan.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <FormField
                        control={control}
                        name="includes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
                                    <span>¿Qué incluye el plan?</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Ej: Alojamiento 3 noches, Tiquetes aéreos, Desayunos y cenas..."
                                        rows={8}
                                        className="rounded-lg border-gray-200 dark:border-gray-700 resize-none"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="space-y-3">
                    <FormField
                        control={control}
                        name="notIncludes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" strokeWidth={1.5} />
                                    <span>¿Qué NO incluye el plan?</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Ej: Gastos no especificados, Tarjeta de asistencia médica, Propinas..."
                                        rows={8}
                                        className="rounded-lg border-gray-200 dark:border-gray-700 resize-none"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    );
} 
