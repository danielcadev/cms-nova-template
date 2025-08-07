import { useCallback, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PlanFormValues, PriceOption } from '@/schemas/plan';

interface UsePricingStateProps {
  form: UseFormReturn<PlanFormValues>;
}

export default function usePricingState({ form }: UsePricingStateProps) {
  const priceOptions = form.watch('priceOptions') || [];

  const pricePackages: PriceOption[] = useMemo(() => {
    return priceOptions.map(option => ({
      ...option,
      perPersonPrice: option.perPersonPrice || null
    }));
  }, [priceOptions]);

  const addPricePackage = useCallback((numPersons: number, currency: 'COP' | 'USD' | 'EUR'): boolean => {
    try {
      const newPackage: PriceOption = {
        id: `${numPersons}-${currency}-${Date.now()}`,
        numPersons,
        currency,
        perPersonPrice: null
      };

      const currentOptions = form.getValues('priceOptions') || [];
      form.setValue('priceOptions', [...currentOptions, newPackage], { shouldDirty: true });
      return true;
    } catch (error) {
      console.error('Error adding price package:', error);
      return false;
    }
  }, [form]);

  const updatePricePackage = useCallback((id: string, updates: Partial<Omit<PriceOption, 'id'>>) => {
    const currentOptions = form.getValues('priceOptions') || [];
    const updatedOptions = currentOptions.map(option => 
      option.id === id ? { ...option, ...updates } : option
    );
    form.setValue('priceOptions', updatedOptions, { shouldDirty: true });
  }, [form]);

  const removePricePackage = useCallback((id: string) => {
    const currentOptions = form.getValues('priceOptions') || [];
    const filteredOptions = currentOptions.filter(option => option.id !== id);
    form.setValue('priceOptions', filteredOptions, { shouldDirty: true });
  }, [form]);

  return {
    pricePackages,
    addPricePackage,
    updatePricePackage,
    removePricePackage
  };
}
