'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2, AlertTriangle } from 'lucide-react';
import { ItineraryDayImage } from '../components/ItineraryDayImage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ItinerarySection() {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'itinerary',
    });

    return (
        <div className="space-y-6">
            {fields.map((item, index) => (
                <div key={item.id} className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Día {index + 1}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Configura las actividades para este día.</p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                                >
                                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800">
                                <AlertDialogHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" strokeWidth={1.5} />
                                        </div>
                                        <AlertDialogTitle className="text-gray-900 dark:text-gray-100">¿Eliminar Día del Itinerario?</AlertDialogTitle>
                                    </div>
                                    <AlertDialogDescription className="pl-13 pt-2 text-gray-600 dark:text-gray-400">
                                        Esta acción no se puede deshacer. Se eliminará permanentemente el día {index + 1} y toda su información asociada.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="pt-4">
                                    <AlertDialogCancel className="border-gray-300 dark:border-gray-700">Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => remove(index)}
                                        className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                                    >
                                        Sí, eliminar día
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <FormField
                                control={control}
                                name={`itinerary.${index}.title`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Título del Día</FormLabel>
                                        <FormControl><Input {...field} placeholder="Ej: Llegada a Cancún y tarde libre" className="rounded-lg border-gray-200 dark:border-gray-700" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name={`itinerary.${index}.description`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Descripción y Actividades</FormLabel>
                                        <FormControl><Textarea {...field} placeholder="Detalla las actividades, traslados, comidas y otra información relevante para este día." rows={5} className="rounded-lg border-gray-200 dark:border-gray-700 resize-none" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-4">
                            <ItineraryDayImage fieldIndex={index} />
                        </div>
                    </div>
                </div>
            ))}

            <Button
                type="button"
                variant="outline"
                className="w-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 py-6 border-dashed border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                onClick={() => append({ day: fields.length + 1, title: '', description: '', image: '' })}
            >
                <PlusCircle className="mr-2 h-4 w-4" strokeWidth={1.5} />
                Añadir Día al Itinerario
            </Button>
        </div>
    );
} 
