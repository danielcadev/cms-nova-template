import { useCallback, useState } from 'react';
import { PlanFormValues } from '@/schemas/plan';
import { FormMode } from '@/types/form';

interface UsePlanFormDataProps {
  mode: FormMode;
  step: number;
  totalSteps: number;
  generateArticleAlias?: (title: string) => string | undefined;
}

/**
 * Hook para gestionar la preparación y manipulación de datos del formulario de planes
 * Separado para reducir la complejidad del componente principal
 */
export function usePlanFormData({
  mode,
  step: initialStep,
  totalSteps: initialTotalSteps,
  generateArticleAlias
}: UsePlanFormDataProps) {
  // Estado interno para el paso actual y total
  const [stepInfo, setStepInfo] = useState({
    step: initialStep,
    totalSteps: initialTotalSteps
  });
  
  /**
   * Actualiza la información del paso actual y total
   */
  const updateStepInfo = useCallback((step: number, totalSteps: number) => {
    // Solo actualizar si los valores realmente cambiaron
    setStepInfo(prev => {
      if (prev.step === step && prev.totalSteps === totalSteps) {
        return prev; // No cambiar nada si los valores son iguales
      }
      return { step, totalSteps };
    });
  }, []);
  
  /**
   * Prepara los datos del formulario para su envío a la API
   * Valida, limpia y transforma los datos según sea necesario
   */
  const prepareDataForSubmission = useCallback((
    formValues: PlanFormValues,
    currentStep?: number
  ): PlanFormValues => {
    // Usar el paso proporcionado o el del estado
    const step = currentStep !== undefined ? currentStep : stepInfo.step;
    
    // Validar y asegurar que priceOptions es un array
    let finalPriceOptions = formValues.priceOptions;
    if (!finalPriceOptions || !Array.isArray(finalPriceOptions)) {
      finalPriceOptions = [];
    }
    
    // Generar alias si es necesario (modo creación)
    let articleAliasValue = formValues.articleAlias;
    if (mode === 'create' && formValues.mainTitle && formValues.categoryAlias && generateArticleAlias) {
      const generatedAlias = generateArticleAlias(formValues.mainTitle);
      if (generatedAlias) {
        articleAliasValue = generatedAlias;
      }
    }
    
    // Devolver los datos procesados y listos para enviar
    return {
      ...formValues,
      articleAlias: articleAliasValue,
      priceOptions: finalPriceOptions,
      _lastStep: step
    };
  }, [mode, stepInfo.step, generateArticleAlias]);
  
  /**
   * Determina si el formulario debe enviar datos a la API en este momento
   */
  const shouldSubmitData = useCallback(() => {
    return mode === 'edit' || stepInfo.step === stepInfo.totalSteps;
  }, [mode, stepInfo.step, stepInfo.totalSteps]);
  
  return {
    prepareDataForSubmission,
    shouldSubmitData,
    updateStepInfo
  };
} 
