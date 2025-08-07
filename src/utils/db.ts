// src/utils/db.ts
import type { PlanFormValues } from "../schemas/plan";
import { Prisma } from "@prisma/client";

export function formatPlanData(data: PlanFormValues) {
  // Definir tipos específicos para los objetos JSON
  type ItineraryItem = {
    day: number;
    title: string;
    description: string;
    image?: string;
  };

  type TransportOption = {
    title: string;
    features: string;
    frequency: string;
  };

  type PriceOptionJson = {
    id: string;
    numPersons: number;
    price: number | null;
    groupPrice: number | null;
    accommodation: string;
    currency: string;
  };

  type MainImage = {
    url: string;
    alt: string;
    width: number;
    height: number;
    caption?: string;
    key?: string;
  };

  // Formatear el itinerario
  const itineraryJson: ItineraryItem[] = data.itinerary ? data.itinerary.map(item => ({
    day: Number(item.day),
    title: String(item.title),
    description: String(item.description || ''),
    image: item.image ? String(item.image) : undefined
  })) : [];

  // Formatear opciones de transporte
  const transportOptionsJson: TransportOption[] = data.transportOptions.map(item => ({
    title: String(item.title),
    features: String(item.features),
    frequency: String(item.frequency)
  }));

  // Crear objeto de opciones de precio si existen
  let priceOptionsJson: PriceOptionJson[] = [];
  
  if (data.priceOptions && Array.isArray(data.priceOptions)) {
    console.log(' Server  [formatPlanData] Procesando priceOptions:', { 
      hasPriceOptions: true, 
      totalOptions: data.priceOptions.length,
      priceOptions: data.priceOptions.map(p => ({ 
        id: p.id, 
        numPersons: p.numPersons,
        perPersonPrice: p.perPersonPrice, 
        tipoPrecio: typeof p.perPersonPrice,
        esNull: p.perPersonPrice === null,
        currency: p.currency
      }))
    });
    
    // Filtrar opciones inválidas y procesarlas adecuadamente
    priceOptionsJson = data.priceOptions
      .filter(option => option && typeof option === 'object')
      .map((option: Record<string, unknown>) => {
        // Asegurar que cada campo tenga un valor válido
        const id = option && option.id ? String(option.id) : String(Math.random().toString(36).substring(2, 9));
        const numPersons = option && option.numPersons ? Number(option.numPersons) : 1;
        
        // Para el precio, garantizar explícitamente que sea número o null
        let price: number | null = null;
        if (option.price !== undefined) {
          if (option.price === null) {
            price = null;
          } else {
            const numPrice = Number(option.price);
            price = isNaN(numPrice) ? null : numPrice;
          }
        }
        
        // Para el precio grupal, garantizar explícitamente que sea número o null
        let groupPrice: number | null = null;
        if (option.groupPrice !== undefined) {
          if (option.groupPrice === null) {
            groupPrice = null;
          } else {
            const numGroupPrice = Number(option.groupPrice);
            groupPrice = isNaN(numGroupPrice) ? null : numGroupPrice;
          }
        }
        
        // Calcular el precio faltante si es posible
        if (price === null && groupPrice !== null && numPersons > 0) {
          price = Math.round(groupPrice / numPersons);
        } else if (groupPrice === null && price !== null) {
          groupPrice = price * numPersons;
        }
        
        const accommodation = option && option.accommodation 
          ? String(option.accommodation) 
          : 'doble';
        
        // Agregar soporte para currency
        const currency = option && option.currency 
          ? String(option.currency) 
          : 'COP';
        
        // Verificar que el objeto final tiene los tipos correctos
        const result = { 
          id, 
          numPersons, 
          price, 
          groupPrice,
          accommodation,
          currency
        };
        
        console.log(' Server  [formatPlanData] Opción procesada:', {
          id: result.id,
          numPersons: result.numPersons,
          price: result.price,
          tipoPrecio: typeof result.price,
          esNull: result.price === null,
          groupPrice: result.groupPrice,
          tipoGroupPrice: typeof result.groupPrice,
          esNullGroup: result.groupPrice === null
        });
        
        return result;
      });
      
    console.log(' Server  [formatPlanData] priceOptions procesadas:', 
      priceOptionsJson.map(p => ({
        id: p.id,
        numPersons: p.numPersons,
        price: p.price,
        tipoPrecio: typeof p.price,
        esNull: p.price === null,
        groupPrice: p.groupPrice,
        tipoGroupPrice: typeof p.groupPrice,
        esNullGroup: p.groupPrice === null
      }))
    );
  } else {
    console.log(' Server  [formatPlanData] No se encontraron precios definidos, se guardará un array vacío');
    
    // No crear precios predeterminados falsos, dejar el array vacío
    priceOptionsJson = [];
  }
  
  // Permitir que priceOptionsJson esté vacío para indicar que los precios están disponibles bajo consulta
  // No añadir valores predeterminados

  // Formatear imagen principal
  const mainImageJson: MainImage | null = data.mainImage ? {
    url: String(data.mainImage.url),
    alt: String(data.mainImage.alt),
    width: Number(data.mainImage.width),
    height: Number(data.mainImage.height),
    caption: data.mainImage.caption?.trim(),
    key: data.mainImage.key
  } : null;

  // Procesar el campo includes según su tipo
  const includesValue = typeof data.includes === 'string' 
    ? data.includes.trim() 
    : JSON.stringify(data.includes);

  // Crear el objeto base para Prisma con los campos comunes
  const baseData = {
    mainTitle: data.mainTitle.trim(),
    articleAlias: data.articleAlias?.trim() || '',
    categoryAlias: data.categoryAlias?.trim() || '',
    promotionalText: data.promotionalText?.trim() || '',
    attractionsTitle: data.attractionsTitle?.trim() || '',
    attractionsText: data.attractionsText?.trim() || '',
    transfersTitle: data.transfersTitle?.trim() || '',
    transfersText: data.transfersText?.trim() || '',
    holidayTitle: data.holidayTitle?.trim() || '',
    holidayText: data.holidayText?.trim() || '',
    destination: data.destinationId?.trim() || '',
    includes: includesValue,
    notIncludes: data.notIncludes?.trim() || '',
    itinerary: itineraryJson as Prisma.InputJsonValue[],
    generalPolicies: data.generalPolicies?.trim() || '',
    transportOptions: transportOptionsJson as Prisma.InputJsonValue[],
    videoUrl: data.videoUrl?.trim() || null,
    mainImage: mainImageJson as Prisma.InputJsonValue,
    priceOptions: priceOptionsJson as Prisma.InputJsonValue[],
    published: false
  };

  console.log('🔥🔥🔥 Datos finales para persistir, priceOptions: ', 
    JSON.stringify(priceOptionsJson.map(p => ({ 
      id: p.id, 
      price: p.price, 
      numPersons: p.numPersons 
    }))));

  return baseData as Prisma.PlanCreateInput;
}

export const validateRequiredFields = (data: PlanFormValues) => {
  const requiredFields = {
    mainTitle: 'Título principal',
    articleAlias: 'Alias del artículo',
    categoryAlias: 'Categoría',
    promotionalText: 'Texto promocional',
    destination: 'Destino'
  } as const;

  const missingFields = Object.entries(requiredFields)
    .filter(([key]) => !data[key as keyof PlanFormValues])
    .map(([, label]) => label);

  if (missingFields.length > 0) {
    throw new Error(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
  }
};

export const createSearchFilter = (field: string, search: string) => ({
  [field]: {
    contains: search,
    mode: 'insensitive' as Prisma.QueryMode
  }
});
