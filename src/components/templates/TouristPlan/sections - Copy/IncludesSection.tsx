'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle } from 'lucide-react';

export function IncludesSection() {
    const { control } = useFormContext();

    return (
        <Card className="shadow-none border border-slate-200 bg-white rounded-xl">
            <CardHeader>
                <div className="space-y-1">
                    <CardTitle>Incluye / No Incluye</CardTitle>
                    <p className="text-sm text-slate-500">
                        Especifica detalladamente qué servicios y productos están cubiertos por el precio del plan.
                    </p>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <FormField
                        control={control}
                        name="includes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    <span>¿Qué incluye el plan?</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Ej: Alojamiento 3 noches, Tiquetes aéreos, Desayunos y cenas..."
                                        rows={8}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <FormField
                        control={control}
                        name="notIncludes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                    <span>¿Qué NO incluye el plan?</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Ej: Gastos no especificados, Tarjeta de asistencia médica, Propinas..."
                                        rows={8}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    );
} 
