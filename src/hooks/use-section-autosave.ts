'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { updatePlanAction } from '@/app/actions/plan-actions';
import { type PlanFormValues } from '@/schemas/plan';

interface SectionAutosaveOptions {
  planId?: string;
  delay?: number; // Delay en ms antes de guardar (default: 2000)
  fields?: (keyof PlanFormValues)[]; // Campos específicos a vigilar
  enabled?: boolean; // Si el autosave está habilitado
  onSaving?: () => void;
  onSaved?: () => void;
  onError?: (error: string) => void;
}

export function useSectionAutosave({
  planId,
  delay = 2000,
  fields,
  enabled = true,
  onSaving,
  onSaved,
  onError
}: SectionAutosaveOptions = {}) {
  const { watch, getValues, formState } = useFormContext<PlanFormValues>();
  const { toast } = useToast();
  
  // Referencias para controlar el autosave
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<string>('');
  const isSavingRef = useRef(false);
  const initialLoadRef = useRef(true);

  // Función para obtener los datos a guardar
  const getDataToSave = useCallback(() => {
    const allData = getValues();
    
    // Si se especificaron campos específicos, solo tomar esos
    if (fields && fields.length > 0) {
      const filteredData: Partial<PlanFormValues> = {};
      fields.forEach(field => {
        filteredData[field] = allData[field];
      });
      return filteredData;
    }
    
    return allData;
  }, [getValues, fields]);

  // Función para guardar los datos
  const saveData = useCallback(async () => {
    if (!planId || isSavingRef.current) return;

    const currentData = getDataToSave();
    const currentDataString = JSON.stringify(currentData);
    
    // No guardar si los datos no han cambiado
    if (currentDataString === lastSavedDataRef.current) {
      return;
    }

    try {
      isSavingRef.current = true;
      onSaving?.();

      // Crear FormData para enviar al server action
      const formData = new FormData();
      formData.append('planId', planId);
      
      // Agregar todos los campos del formulario
      Object.entries(currentData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value) || typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Llamar al server action
      const result = await updatePlanAction({ message: '', errors: {} }, formData);
      
      if (result?.error) {
        throw new Error('Error al guardar: ' + result.error);
      }

      // Actualizar la referencia de datos guardados
      lastSavedDataRef.current = currentDataString;
      
      onSaved?.();
      
      // Mostrar toast de éxito (discreto)
      toast({
        title: 'Guardado automático',
        description: 'Los cambios se han guardado automáticamente',
        duration: 2000,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      onError?.(errorMessage);
      
      // Mostrar toast de error
      toast({
        title: 'Error de guardado automático',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      isSavingRef.current = false;
    }
  }, [planId, getDataToSave, onSaving, onSaved, onError, toast]);

  // Función para programar el guardado automático
  const scheduleAutosave = useCallback(() => {
    if (!enabled || !planId) return;

    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Programar nuevo guardado
    timeoutRef.current = setTimeout(saveData, delay);
  }, [enabled, planId, saveData, delay]);

  // Vigilar cambios en los campos especificados o en todo el formulario
  const watchedData = fields && fields.length > 0 ? watch(fields) : watch();

  // Efecto para detectar cambios y programar autosave
  useEffect(() => {
    // Evitar guardar en la carga inicial
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      // Establecer los datos iniciales como ya guardados
      lastSavedDataRef.current = JSON.stringify(getDataToSave());
      return;
    }

    // Solo guardar si el formulario tiene cambios
    if (formState.isDirty) {
      scheduleAutosave();
    }

    // Cleanup al desmontar o cambiar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [watchedData, formState.isDirty, scheduleAutosave, getDataToSave]);

  // Función para forzar guardado inmediato
  const forceSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await saveData();
  }, [saveData]);

  // Estado del autosave
  const isAutosaving = isSavingRef.current;

  return {
    isAutosaving,
    forceSave,
    scheduleAutosave
  };
}
