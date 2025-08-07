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
        <Card className="shadow-none border-0 bg-transparent">
            <CardContent className="space-y-4 p-0">
                {fields.map((item, index) => (
                    <div key={item.id} className="bg-white p-6 border border-slate-200/80 rounded-xl space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-slate-900">Día {index + 1}</h3>
                                <p className="text-sm text-slate-500">Configura las actividades para este día.</p>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                <Button
                    type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-slate-500 hover:bg-red-50 hover:text-red-600"
                >
                                        <Trash2 className="h-4 w-4" />
                </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white rounded-2xl shadow-2xl">
                                    <AlertDialogHeader>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                                                <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                                            </div>
                                            <AlertDialogTitle>¿Eliminar Día del Itinerario?</AlertDialogTitle>
                                        </div>
                                        <AlertDialogDescription className="pl-16 pt-2">
                                            Esta acción no se puede deshacer. Se eliminará permanentemente el día {index + 1} y toda su información asociada.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="pt-4">
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => remove(index)}
                                            className="bg-red-600 hover:bg-red-700"
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
                                    <FormLabel>Título del Día</FormLabel>
                                            <FormControl><Input {...field} placeholder="Ej: Llegada a Cancún y tarde libre" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`itinerary.${index}.description`}
                            render={({ field }) => (
                                <FormItem>
                                            <FormLabel>Descripción y Actividades</FormLabel>
                                            <FormControl><Textarea {...field} placeholder="Detalla las actividades, traslados, comidas y otra información relevante para este día." rows={5} /></FormControl>
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
                    className="w-full bg-slate-50 hover:bg-slate-100 py-6 border-dashed"
                    onClick={() => append({ day: fields.length + 1, title: '', description: '', image: '' })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Añadir Día al Itinerario
                </Button>
            </CardContent>
        </Card>
    );
} 
