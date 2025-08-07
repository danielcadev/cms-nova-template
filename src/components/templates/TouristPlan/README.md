# TouristPlan Template

## Descripción
Template especializado para la gestión de planes turísticos con estructura fija y validaciones específicas del dominio.

## Componentes

### Formularios Principales
- **`EditPlanForm.tsx`** - Editor principal con secciones colapsables
- **`CreatePlanForm.tsx`** - Creador de nuevos planes

### Secciones
- **`BasicInfoSection.tsx`** - Información básica, URLs y destino
- **`IncludesSection.tsx`** - Servicios incluidos y no incluidos  
- **`ItinerarySection.tsx`** - Programa día a día del viaje
- **`PricingSection.tsx`** - Opciones de precios y monedas
- **`VideoSection.tsx`** - Video promocional de YouTube

## Características Técnicas

### Validación
- Schema Zod: `planSchema` en `/src/schemas/plan.ts`
- Validación en tiempo real con React Hook Form
- Manejo de errores específicos del dominio

### Auto-guardado
- Implementa `useFormPersistence` con debounce de 2000ms
- Guarda en localStorage automáticamente
- Sincronización con servidor via Server Actions

### UI/UX
- Secciones colapsables con shadcn/ui `Collapsible`
- iPhone-style design con animaciones suaves
- Iconos específicos para cada sección
- Estados de carga y éxito

### Base de Datos
- Tablas dedicadas: `plans`, `itinerary`, etc.
- NO usa `ContentEntry` (eso es para headless CMS)
- Optimizado para estructura fija de planes turísticos

## Uso

```typescript
import { EditPlanForm } from '@/components/forms/TemplateSystem/TouristPlan/EditPlanForm';

<EditPlanForm 
  initialData={planData} 
  planId={id}
  mode="edit" 
/>
```

## Extensión

Para agregar nuevas secciones:
1. Crear componente en `sections/`
2. Implementar con `useFormContext()`
3. Agregar al formulario principal
4. Actualizar el schema de validación

## Diferencias con Headless CMS

| TouristPlan Template | Headless CMS |
|---------------------|--------------|
| ✅ Estructura fija | ✅ Estructura dinámica |
| ✅ Validaciones específicas | ✅ Validaciones genéricas |
| ✅ UX especializada | ✅ UX configurable |
| ✅ Tablas dedicadas | ✅ Tabla `ContentEntry` |
| ✅ Lógica de negocio | ✅ Máxima flexibilidad |
