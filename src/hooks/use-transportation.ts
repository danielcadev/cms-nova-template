import { UseFormReturn } from 'react-hook-form';
import { PlanFormValues, TransportOption } from '@/schemas/plan';

interface UseTransportationProps {
  form?: UseFormReturn<PlanFormValues>;
  destination?: string;
  transportType?: 'air-only' | 'air-temporary' | 'ground-optional' | 'ground-included';
}

export function useTransportation({ 
  form,
  destination = '',
  transportType = 'ground-included'
}: UseTransportationProps = {}) {
  // Determinar si el transporte terrestre está disponible
  const isGroundTransportAvailable = transportType !== 'air-only' && transportType !== 'air-temporary';
  
  // Determinar si el transporte terrestre está incluido
  const isGroundTransportIncluded = transportType === 'ground-included';

  // Determinar si el transporte aéreo es temporal
  const isAirTransportTemporary = transportType === 'air-temporary' || 
    (form && form.getValues('transportOptions')?.some(option => 
      option.title === 'Temporalmente Aéreo' && 
      option.features.includes('Temporalmente solo accesible')
    ));

  const addVehicle = () => {
    if (!form) return;
    
    const currentFields = form.getValues('transportOptions') || [];
    const newField: TransportOption = {
      id: Date.now().toString(),
      title: '',
      features: '',
      frequency: '',
      price: 0
    };
    
    form.setValue('transportOptions', [...currentFields, newField]);
  };

  const remove = (index: number) => {
    if (!form) return;
    
    const currentFields = form.getValues('transportOptions') || [];
    const newFields = currentFields.filter((_: unknown, i: number) => i !== index);
    form.setValue('transportOptions', newFields);
  };

  const getTransportCost = () => {
    if (!isGroundTransportAvailable) return 0;
    
    const transportOptions = form?.getValues('transportOptions') || [];
    return transportOptions.reduce((total, option) => {
      // Asegurar que el precio sea un número válido
      const price = typeof option.price === 'number' && !isNaN(option.price) ? option.price : 0;
      return total + price;
    }, 0);
  };

  const getTransportSummary = () => {
    if (transportType === 'air-only') {
      return {
        type: 'air-only',
        message: `Este destino (${destination}) solo es accesible por vía aérea. Los pasajeros deberán organizar su propio transporte aéreo.`,
        cost: 0,
        isTemporary: false
      };
    }

    if (transportType === 'air-temporary') {
      return {
        type: 'air-temporary',
        message: `Actualmente, este destino (${destination}) solo es accesible por vía aérea. Estamos desarrollando opciones de transporte terrestre que estarán disponibles en el futuro.`,
        cost: 0,
        isTemporary: true
      };
    }

    if (!isGroundTransportIncluded) {
      const cost = getTransportCost();
      return {
        type: 'ground-optional',
        message: cost > 0 
          ? `Transporte terrestre disponible con costo adicional de $${cost}. Los pasajeros pueden optar por organizar su propio transporte.`
          : 'Transporte terrestre disponible. Los pasajeros pueden optar por organizar su propio transporte.',
        cost,
        isTemporary: false
      };
    }

    return {
      type: 'ground-included',
      message: 'Transporte terrestre incluido en el plan. No es necesario que los pasajeros organicen su propio transporte.',
      cost: 0,
      isTemporary: false
    };
  };

  const fields = form ? form.getValues('transportOptions') || [] : [];

  return {
    fields,
    isGroundTransportAvailable,
    isGroundTransportIncluded,
    isAirTransportTemporary,
    addVehicle,
    remove,
    getTransportCost,
    getTransportSummary
  };
}
