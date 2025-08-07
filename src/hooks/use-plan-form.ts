// hooks/use-plan-form.ts
import { UseFormReturn } from "react-hook-form";
import type { PlanFormValues } from "@/schemas/plan";
import { destinations } from "@/data/destinations";
import type { FormMode } from "@/types/form";
import logger from "@/utils/logger";

interface UsePlanFormProps {
  form?: UseFormReturn<PlanFormValues>;
  mode?: FormMode;
}

export function usePlanForm(props: UsePlanFormProps) {
  const { form, mode = 'create' } = props;

  /**
   * Encuentra la etiqueta de destino a partir de una URL href
   */
  const findDestinationLabel = (href: string): string => {
    if (!href) return 'destino';
    
    try {
      for (const region of destinations) {
        if (region.subItems) {
          const destination = region.subItems.find(item => item.href === `/Planes/${href}`);
          if (destination) {
            return destination.label;
          }
        }
      }
    } catch (error) {
      logger.error('Error en findDestinationLabel:', error);
    }
    
    return href;
  };

  /**
   * Genera un placeholder sustituyendo {destination} con el destino real
   */
  const generatePlaceholder = (placeholder: string): string => {
    if (!form || !placeholder) return placeholder || '';
    
    try {
      const categoryAlias = form.getValues('categoryAlias');
      if (!categoryAlias) return placeholder;

      const destinationLabel = findDestinationLabel(categoryAlias);
      return placeholder.replace(/\{destination\}/g, destinationLabel);
    } catch (error) {
      logger.error('Error generando placeholder:', error);
      return placeholder;
    }
  };

  /**
   * Normaliza un texto eliminando acentos, caracteres especiales, etc.
   */
  const normalizeText = (str: string): string => {
    if (!str) return '';
    
    try {
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ñ/g, 'n')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    } catch (error) {
      logger.error('Error normalizando texto:', error);
      return str.toLowerCase().replace(/\s+/g, '-');
    }
  };

  /**
   * Extrae el número de días de un texto
   */
  const extractDaysFromText = (text: string): string => {
    const daysMatch = text.toLowerCase().match(/(\d+)(?:\s+)?(?:días|dias|day|days)/i);
    return daysMatch?.[1] || '';
  };

  /**
   * Extrae el texto después del guión para auto-llenar campos
   */
  const extractTextAfterDash = (title: string): string => {
    if (!title) return '';
    
    try {
      // Buscar todo lo que viene después del primer guión (- o –) hasta el pipe (|) si existe
      // Usar regex para detectar ambos tipos de guiones y espacios alrededor
      const dashRegex = /\s*[-–]\s*/;
      const dashMatch = title.match(dashRegex);
      
      if (!dashMatch) {
        logger.log('❌ No se encontró guión en el título');
        return '';
      }
      
      const dashIndex = dashMatch.index! + dashMatch[0].length;
      
      // Tomar todo después del primer guión encontrado
      let afterDash = title.substring(dashIndex).trim();
      
      // Si hay pipe (|), tomar solo lo que está antes del pipe
      if (afterDash.includes('|')) {
        afterDash = afterDash.split('|')[0].trim();
      }
      
      // Limpiar texto extra innecesario
      afterDash = afterDash
        .replace(/\s+tours?\s+\d{4}$/i, '') // Remover "Tours 2025" del final
        .replace(/\s+\d{4}$/i, '') // Remover años del final
        .trim();
      
      logger.log(`📄 Texto extraído después del guión: "${afterDash}"`);
      return afterDash;
    } catch (error) {
      logger.error('Error extrayendo texto después del guión:', error);
      return '';
    }
  };

  /**
   * Determina si un alias debe actualizarse basado en los cambios del título
   */
  const shouldUpdateAlias = (currentAlias: string, newTitle: string): boolean => {
    if (mode === 'create') return true;
    
    try {
      // Si no hay alias actual, siempre actualizar
      if (!currentAlias) return true;
      
      const currentDaysMatch = currentAlias.match(/(\d+)dias$/);
      const currentDays = currentDaysMatch?.[1] || '';
      
      const newDays = extractDaysFromText(newTitle);
      
      // Si el número de días ha cambiado, actualizar el alias
      if (currentDays && newDays && currentDays !== newDays) {
        logger.log(`Detectado cambio en días: ${currentDays} -> ${newDays}`);
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error('Error en shouldUpdateAlias:', error);
      return false;
    }
  };

  /**
   * Genera un alias de artículo a partir del título principal
   */
  const generateArticleAlias = (text: string): string => {
    if (!form || !text) return '';

    try {
      const categoryAlias = form.getValues('categoryAlias');
      if (!categoryAlias) {
        logger.warn('⚠️ categoryAlias no encontrado para generar articleAlias');
        return '';
      }

      // En modo edición, verificar si realmente necesitamos actualizar el alias
      if (mode === 'edit') {
        const currentAlias = form.getValues('articleAlias');
        if (currentAlias && !shouldUpdateAlias(currentAlias, text)) {
          logger.log('Preservando articleAlias existente en modo edición:', currentAlias);
          return currentAlias;
        }
      }
  
      // Extraer días del título - buscar patrones como "5 días", "5 dias", "5 days", "5days"
      const days = extractDaysFromText(text);
      logger.log('Extracción de días:', days ? days : 'no encontrado');
      
      // Determinar si es un circuito (Conociendo Colombia) o plan normal
      const isCircuit = categoryAlias.startsWith('circuitos-');
      logger.log('Es circuito:', isCircuit, 'CategoryAlias:', categoryAlias);
      
      let alias = '';
      
      if (isCircuit) {
        // LÓGICA PARA CIRCUITOS (Conociendo Colombia)
        // Estructura: origen ya está en categoryAlias, solo necesitamos destinos
        
                          // Extraer destinos principales del título
         const extractCircuitDestinations = (title: string): string[] => {
           logger.log('🔍 Analizando título para circuito:', title);
           
           // Obtener la parte del título antes del guión o pipe
           const mainPart = title.split(/[-–|]/)[0];
           logger.log('📝 Parte principal:', mainPart);
           
           // Extraer la ciudad origen del categoryAlias para excluirla
           const originCity = normalizeText(categoryAlias.replace('circuitos-', ''));
           logger.log('🏠 Ciudad origen a excluir:', originCity);
           
           // Dividir por comas y "y" para obtener todos los destinos
           const parts = mainPart
             .split(/,|\sy\s/)
             .map(part => part.trim())
             .filter(part => part.length > 0);
           
           logger.log('📍 Partes divididas:', parts);
           
           const destinations: string[] = [];
           
           // Procesar cada parte
           parts.forEach((part, index) => {
             logger.log(`🔍 Procesando parte ${index + 1}:`, part);
             
             // Para la primera parte, solo tomar la última palabra (el destino)
             if (index === 0) {
               // "Plan Turístico Bogotá" -> tomar solo "Bogotá"
               const words = part.split(/\s+/).filter(word => word.length > 0);
               const lastWord = words[words.length - 1];
               
               if (lastWord) {
                 const destination = normalizeText(lastWord);
                 logger.log(`  ➡️ Última palabra de primera parte: "${lastWord}" -> "${destination}"`);
                 
                 if (destination !== originCity) {
                   destinations.push(destination);
                   logger.log(`  ✅ Añadido: ${destination}`);
                 } else {
                   logger.log(`  ❌ Excluido (es origen): ${destination}`);
                 }
               }
             } else {
               // Para las demás partes, tomar todo (ya son destinos)
               const destination = normalizeText(part);
               logger.log(`  ➡️ Parte ${index + 1}: "${part}" -> "${destination}"`);
               
               if (destination && destination !== originCity && !destinations.includes(destination)) {
                 destinations.push(destination);
                 logger.log(`  ✅ Añadido: ${destination}`);
               } else {
                 logger.log(`  ❌ Excluido: ${destination}`);
               }
             }
           });
           
           logger.log('🎯 Destinos finales:', destinations);
           return destinations.slice(0, 3);
         };
        
        const circuitDestinations = extractCircuitDestinations(text);
        logger.log('Destinos de circuito extraídos:', circuitDestinations);
        
        // Construir alias para circuito: solo destinos principales
        if (circuitDestinations.length > 0) {
          alias = circuitDestinations.join('-');
        } else {
          // Fallback: usar palabra clave del título
          const fallbackMatch = text.match(/(?:plan|tour|circuito)\s+(.+?)\s+\d+\s*días/i);
          if (fallbackMatch) {
            const keywords = fallbackMatch[1].split(/\s+y\s+|\s*,\s*/)
              .map(word => normalizeText(word))
              .filter(word => word.length > 2)
              .slice(0, 2);
            alias = keywords.join('-') || 'tour';
          } else {
            alias = 'tour';
          }
        }
        
      } else {
        // LÓGICA SIMPLIFICADA PARA PLANES NORMALES
        // Estructura: categoryAlias (que ya es el destino) + duración
        // Ejemplo: "capurgana" + "4dias" = "capurgana-4dias"
        
        logger.log('📍 Plan normal detectado, usando categoryAlias como base:', categoryAlias);
        
        // Para planes normales, el categoryAlias ya ES el destino (ej: "capurgana")
        // Solo necesitamos limpiar el categoryAlias en caso de que tenga formato complejo
        const cleanDestination = categoryAlias
          .toLowerCase()
          .replace(/^planes?-?/i, '') // Remover "plan-" o "planes-" al inicio
          .replace(/circuitos?-?/i, '') // Remover "circuito-" por si acaso
          .trim();
        
        alias = cleanDestination;
        logger.log('🎯 Base del alias para plan normal:', alias);
      }
      
      // Añadir días para ambos tipos (circuitos y planes normales)
      if (days) {
        alias += `-${days}dias`;
      }

      // TODO: Implement duplicate checking with proper external data source
      // Duplicate checking removed due to schema mismatch
      
      logger.log('Alias final generado:', alias);
      return alias;
  
    } catch (error) {
      logger.error('Error generando alias de artículo:', error);
      return '';
    }
  };

  /**
   * Genera un alias de categoría a partir del href
   */
  const generateCategoryAlias = (href: string): string => {
    if (!href) return '';
    
    try {
      // Limpieza básica: quitar '/Planes/' si existe
      const alias = href.replace('/Planes/', '');
      
      // Normalizar
      return alias;
    } catch (error) {
      logger.error('Error generando alias de categoría:', error);
      return '';
    }
  };

  /**
   * Actualiza ambos alias (categoria y artículo) en el formulario
   */
  const updateAliases = (mainTitle: string, href: string) => {
    if (!form) {
      logger.warn('⚠️ No se puede actualizar alias sin formulario');
      return { categoryAlias: '', articleAlias: '' };
    }

    try {
      logger.log('Actualizando alias con:', { mainTitle, href });
      
      // Obtener valores actuales para comparar
      const currentCategoryAlias = form.getValues('categoryAlias');
      const currentArticleAlias = form.getValues('articleAlias');
      
      // Primero actualizamos categoryAlias solo si es necesario
      const categoryAlias = generateCategoryAlias(href);
      if (categoryAlias !== currentCategoryAlias) {
        form.setValue('categoryAlias', categoryAlias, {
          shouldDirty: true,
          shouldValidate: false, // No validar para evitar efectos secundarios
          shouldTouch: false // No marcar como tocado para evitar efectos secundarios
        });
      }
      
      // Luego generamos el articleAlias basado en el categoryAlias
      const articleAlias = generateArticleAlias(mainTitle);
      
      // Solo actualizar si el alias generado es diferente al actual
      if (articleAlias && articleAlias !== currentArticleAlias) {
        form.setValue('articleAlias', articleAlias, {
          shouldDirty: true,
          shouldValidate: false, // No validar para evitar efectos secundarios
          shouldTouch: false // No marcar como tocado para evitar efectos secundarios
        });
      }
      
      logger.log('Alias actualizados:', { categoryAlias, articleAlias });
      
      return {
        categoryAlias,
        articleAlias
      };
    } catch (error) {
      logger.error('Error actualizando alias:', error);
      return { categoryAlias: '', articleAlias: '' };
    }
  };

  /**
   * Extrae el destino principal del título (ej: "Llanos Orientales" de un título)
   */
  const extractMainDestination = (title: string): string => {
    if (!title) return '';
    
    try {
      // Buscar patrones comunes de destinos en títulos
      // Ejemplo: "Plan Turístico Llanos Orientales 7 Días" -> "Llanos Orientales"
      
      // Patrón 1: "Plan Turístico [DESTINO] X Días"
      const pattern1 = /plan\s+turístico\s+(.+?)\s+\d+\s+días/i;
      const match1 = title.match(pattern1);
      if (match1) {
        return match1[1].trim();
      }
      
      // Patrón 2: Extraer primeras 1-3 palabras del texto después del guión
      const afterDash = extractTextAfterDash(title);
      if (afterDash) {
        // Tomar las primeras 1-3 palabras significativas
        const words = afterDash.split(/[,\s]+/).filter(word => 
          word.length > 2 && 
          !word.toLowerCase().includes('parque') &&
          !word.toLowerCase().includes('bioparque') &&
          !word.toLowerCase().includes('tours')
        );
        
        // Si hay palabras como "Llanos Orientales", tomarlas
        if (words.length >= 2 && words[0].length > 3 && words[1].length > 3) {
          return `${words[0]} ${words[1]}`;
        } else if (words.length >= 1 && words[0].length > 3) {
          return words[0];
        }
      }
      
      // Fallback: usar categoryAlias como destino
      if (form) {
        const categoryAlias = form.getValues('categoryAlias');
        if (categoryAlias) {
          return findDestinationLabel(categoryAlias);
        }
      }
      
      return '';
    } catch (error) {
      logger.error('Error extrayendo destino principal:', error);
      return '';
    }
  };

  /**
   * Auto-llena los campos de atracciones, traslados y vacaciones basado en el título
   */
  const autoFillFields = (mainTitle: string) => {
    if (!form || !mainTitle) {
      logger.log('❌ No se puede auto-llenar: form o mainTitle vacío');
      return;
    }

    try {
      logger.log(`🔍 Analizando título: "${mainTitle}"`);
      const extractedText = extractTextAfterDash(mainTitle);
      const mainDestination = extractMainDestination(mainTitle);
      
      logger.log(`📄 Texto completo extraído: "${extractedText}"`);
      logger.log(`🎯 Destino principal extraído: "${mainDestination}"`);
      
      if (extractedText || mainDestination) {
        logger.log('🚀 Auto-llenando campos...');
        
        // Solo auto-llenar si los campos están vacíos
        const currentAttractions = form.getValues('attractionsTitle');
        const currentTransfers = form.getValues('transfersTitle');
        const currentHoliday = form.getValues('holidayTitle');
        
        // ATRACCIONES: Usar el texto completo de atracciones
        if (!currentAttractions || currentAttractions.trim() === '') {
          const attractionsTitle = extractedText ? `PLAN ${extractedText.toUpperCase()}` : '';
          logger.log(`🎢 Llenando attractionsTitle: "${attractionsTitle}"`);
          form.setValue('attractionsTitle', attractionsTitle, {
            shouldDirty: true,
            shouldValidate: false
          });
        }
        
        // TRASLADOS: Usar el destino principal
        if (!currentTransfers || currentTransfers.trim() === '') {
          const transfersTitle = mainDestination ? `PLAN ${mainDestination.toUpperCase()}` : 
                                (extractedText ? `PLAN ${extractedText.toUpperCase()}` : '');
          logger.log(`🚗 Llenando transfersTitle: "${transfersTitle}"`);
          form.setValue('transfersTitle', transfersTitle, {
            shouldDirty: true,
            shouldValidate: false
          });
        }
        
        // VACACIONES: Usar el destino principal
        if (!currentHoliday || currentHoliday.trim() === '') {
          const holidayTitle = mainDestination ? `VACACIONES ${mainDestination.toUpperCase()}` : 
                              (extractedText ? `VACACIONES ${extractedText.toUpperCase()}` : '');
          logger.log(`🏖️ Llenando holidayTitle: "${holidayTitle}"`);
          form.setValue('holidayTitle', holidayTitle, {
            shouldDirty: true,
            shouldValidate: false
          });
        }
        
        // TEXTO PROMOCIONAL: Generar automáticamente
        const currentPromotionalText = form.getValues('promotionalText');
        if (!currentPromotionalText || currentPromotionalText.trim() === '') {
          if (mainDestination && extractedText) {
            const promotionalText = `¿Buscas el mejor tour en ${mainDestination}? Disfruta de nuestro plan: ${extractedText}.`;
            logger.log(`📢 Llenando promotionalText: "${promotionalText}"`);
            form.setValue('promotionalText', promotionalText, {
              shouldDirty: true,
              shouldValidate: false
            });
          }
        }
        
        // Auto-llenar descripciones con textos estándar
        const currentAttractionsText = form.getValues('attractionsText');
        const currentTransfersText = form.getValues('transfersText');
        const currentHolidayText = form.getValues('holidayText');
        
        if (!currentAttractionsText || currentAttractionsText.trim() === '') {
          form.setValue('attractionsText', 'Tour guiado por los principales atractivos turísticos con entradas incluidas.', {
            shouldDirty: true,
            shouldValidate: false
          });
        }
        
        if (!currentTransfersText || currentTransfersText.trim() === '') {
          form.setValue('transfersText', 'Hotel en ubicación estratégica, traslados privados y tours guiados.', {
            shouldDirty: true,
            shouldValidate: false
          });
        }
        
        if (!currentHolidayText || currentHolidayText.trim() === '') {
          form.setValue('holidayText', 'Experiencia completa con los mejores atractivos turísticos de la región.', {
            shouldDirty: true,
            shouldValidate: false
          });
        }
        
        logger.log('✅ Campos auto-llenados exitosamente');
      }
    } catch (error) {
      logger.error('Error auto-llenando campos:', error);
    }
  };

  return {
    generateArticleAlias,
    generateCategoryAlias,
    updateAliases,
    normalizeText,
    generatePlaceholder,
    shouldUpdateAlias,
    extractDaysFromText,
    extractTextAfterDash,
    extractMainDestination,
    autoFillFields
  };
}
