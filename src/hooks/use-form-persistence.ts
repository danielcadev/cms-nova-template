'use client';

import { useEffect, useRef } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { PlanFormValues } from "@/schemas/plan";
import { useDebounce } from './useDebounce';
import { isEqual } from 'lodash'; // Usaremos una utilidad para comparar objetos

interface UseFormPersistenceOptions {
  autoSaveInterval?: number;
  mode?: 'create' | 'edit';
  onSave?: (values: PlanFormValues) => Promise<void>;
}

export function useFormPersistence(
  form: UseFormReturn<PlanFormValues>,
  storageKey: string,
  initialData?: Partial<PlanFormValues>,
  defaultValues?: PlanFormValues,
  options: UseFormPersistenceOptions = {}
) {
  const { 
    autoSaveInterval = 2000,
    mode = 'create',
    onSave 
  } = options;

  const watchedValues = form.watch();
  const debouncedValues = useDebounce(watchedValues, autoSaveInterval);
  const previousDebouncedValuesRef = useRef<PlanFormValues>();
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
        isMounted.current = true;
        // Guardamos los valores iniciales para la primera comparación
        previousDebouncedValuesRef.current = debouncedValues;
        return;
    }
    
    if (!onSave || mode !== 'edit') return;
    
    // Comparamos el valor actual con el anterior. Si son iguales, no hacemos nada.
    if (isEqual(debouncedValues, previousDebouncedValuesRef.current)) {
        return;
    }

    if (form.formState.isDirty) {
      onSave(debouncedValues);
      }

    // Actualizamos la referencia con los últimos valores guardados.
    previousDebouncedValuesRef.current = debouncedValues;

  }, [debouncedValues, onSave, mode, form.formState.isDirty]);

  return {}; // Ya no necesitamos devolver clearStorage
}
