'use client';

import { useFormContext } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Users, PlusCircle, DollarSign } from "lucide-react";
import { memo, useState, useCallback } from 'react';
import usePricingState from '../components/usePricingState';
import PricePackageField from '../components/PricePackageField';
import { PricePackage, CURRENCY_OPTIONS } from '@/schemas/plan';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlanFormValues } from '@/schemas/plan';

export const PricingSection = memo(function PricingSection() {
    const { toast } = useToast();
    const form = useFormContext<PlanFormValues>();
    const [newPersons, setNewPersons] = useState<number>(2);
    const [newCurrency, setNewCurrency] = useState<'COP' | 'USD' | 'EUR'>('COP');

    const { addPricePackage, updatePricePackage, removePricePackage, pricePackages } = usePricingState({ form });
  
    const handleAddPriceOption = useCallback(() => {
        if (newCurrency === 'USD' && newPersons < 2) {
            toast({ title: "Mínimo 2 personas", description: "Para planes en dólares, el número mínimo de personas es 2.", variant: "destructive" });
            return;
        }
        if (newPersons <= 0) {
            toast({ title: "Número inválido", description: "El número de personas debe ser mayor que cero.", variant: "destructive" });
            return;
        }
        if (pricePackages.some(pkg => pkg.numPersons === newPersons && pkg.currency === newCurrency)) {
            toast({ title: "Opción duplicada", description: `Ya existe una opción de precio para ${newPersons} personas en ${newCurrency}.`, variant: "destructive" });
            return;
        }
        if (addPricePackage(newPersons, newCurrency)) {
            setNewPersons(prev => Math.min(prev + 1, 20));
        }
    }, [addPricePackage, newPersons, newCurrency, pricePackages, toast]);
  
    const handleUpdatePackage = useCallback((updatedPackage: PricePackage) => {
        const { id, ...updates } = updatedPackage;
        updatePricePackage(id, updates);
    }, [updatePricePackage]);
  
    const handleRemovePackage = useCallback((id: string) => removePricePackage(id), [removePricePackage]);
    const handlePersonsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setNewPersons(parseInt(e.target.value) || 1), []);
    const handleCurrencyChange = useCallback((value: string) => {
        if (value === 'COP' || value === 'USD' || value === 'EUR') {
            setNewCurrency(value);
            if (value === 'USD' && newPersons < 2) setNewPersons(2);
        }
    }, [newPersons]);
  
    const sortedPackages = [...pricePackages].sort((a, b) => a.currency === 'USD' ? -1 : (a.numPersons - b.numPersons));
  
    return (
        <div className="space-y-6">
            <div className="space-y-5">
                {sortedPackages.length > 0 ? (
                    sortedPackages.map((pkg) => (
                        <PricePackageField key={pkg.id} package={pkg} onChange={handleUpdatePackage} onRemove={() => handleRemovePackage(pkg.id)} isRemovable={true} />
                    ))
                ) : (
                    <div className="text-center py-10 px-6 bg-slate-50 rounded-xl border-2 border-dashed">
                        <DollarSign className="mx-auto h-12 w-12 text-slate-400" />
                        <h4 className="mt-4 text-lg font-semibold text-slate-800">Aún no hay opciones de precio</h4>
                        <p className="text-slate-500 mt-2">Usa el formulario de abajo para empezar a añadir precios.</p>
                    </div>
                )}
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl border">
                <h4 className="font-bold text-slate-800 mb-4">Añadir nueva opción de precio</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                        <label htmlFor="numPersons" className="text-sm font-medium text-slate-700 flex items-center gap-2"><Users className="h-4 w-4" />Número de personas</label>
                        <Input id="numPersons" type="number" value={newPersons} onChange={handlePersonsChange} min={1} />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="currency" className="text-sm font-medium text-slate-700 flex items-center gap-2"><DollarSign className="h-4 w-4" />Moneda</label>
                        <Select value={newCurrency} onValueChange={handleCurrencyChange}>
                            <SelectTrigger><SelectValue placeholder="Selecciona moneda" /></SelectTrigger>
                            <SelectContent>{CURRENCY_OPTIONS.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleAddPriceOption} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"><PlusCircle className="h-5 w-5 mr-2" />Añadir</Button>
                </div>
            </div>
        </div>
    );
}); 
