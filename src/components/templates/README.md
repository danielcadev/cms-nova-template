# 🎯 Templates Dashboard - Formularios Especializados

## Ubicación y Propósito
**Ruta:** `src/components/admin/dashboard/templates/`

Sistema de formularios especializados para tipos de contenido con estructura fija y lógica de negocio específica. Integrado dentro del contexto del dashboard administrativo para una mejor organización.

## Templates Disponibles

### 🏖️ TouristPlan
**Carpeta:** `./TouristPlan/`

Formularios especializados para la gestión de planes turísticos:
- ✅ **EditPlanForm.tsx** - Editor de planes existentes
- ✅ **CreatePlanForm.tsx** - Creador de nuevos planes
- ✅ **sections/** - Secciones modulares (BasicInfo, Itinerary, Pricing, Video, Includes)
- ✅ **components/** - Componentes específicos (MainImage, DeleteButton, etc.)

**Características:**
- Arquitectura basada en secciones colapsables
- Auto-guardado con `useFormPersistence`
- Validación con schema `planSchema` de Zod
- UX optimizada para gestión de itinerarios complejos

## Arquitectura de Templates

### Estructura Estándar
```
templates/
├── index.tsx                     # Exportaciones centralizadas
├── README.md                     # Este archivo
└── [TemplateName]/              # Cada template en su carpeta
    ├── EditForm.tsx             # Editor del template
    ├── CreateForm.tsx           # Creador del template  
    ├── README.md                # Documentación específica
    ├── sections/                # Secciones modulares
    │   ├── BasicInfoSection.tsx
    │   └── ...                  # Otras secciones
    └── components/              # Componentes específicos
        ├── SpecificComponent.tsx
        └── ...                  # Otros componentes
```

### Patrones de Desarrollo

#### 1. Secciones Colapsables (Patrón Actual)
```tsx
<Collapsible defaultOpen={true}>
  <CollapsibleTrigger className="flex w-full items-center justify-between...">
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-blue-600" />
      <div className="text-left">
        <h3 className="font-semibold">Sección</h3>
        <p className="text-sm text-gray-500">Descripción</p>
      </div>
    </div>
    <ChevronsUpDown className="h-4 w-4 transition-transform" />
  </CollapsibleTrigger>
  <CollapsibleContent className="mt-4">
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <YourSectionComponent />
    </div>
  </CollapsibleContent>
</Collapsible>
```

#### 2. Context para Datos de Formulario
```tsx
// En el formulario principal
<FormProvider {...form}>
  <BasicInfoSection />
  <ItinerarySection />
  <PricingSection />
</FormProvider>

// En las secciones
const form = useFormContext();
const { watch, setValue } = form;
```

#### 3. Auto-guardado Implementado
```tsx
useFormPersistence({
  formData: watch(),
  key: 'createPlan',
  debounceMs: 2000
});
```

## Integración con Dashboard

### Navegación
Los templates están integrados en:
- **Quick Actions** del dashboard principal
- **Sidebar** de navegación administrativo
- **Rutas protegidas** bajo `/admin/dashboard/templates/`

### Consistencia UI
- Sigue el estilo **iPhone-like** del dashboard
- Usa componentes **shadcn/ui** configurados
- Mantiene **glass-morphism** y transiciones suaves
- **Responsive design** optimizado

## Diferencias con Headless CMS

| Template System | Headless CMS |
|----------------|--------------|
| ✅ Estructura fija optimizada | ✅ Contenido dinámico |
| ✅ UX especializada por dominio | ✅ Creación de tipos por usuarios |
| ✅ Validaciones complejas de negocio | ✅ Validación genérica configurable |
| ✅ Lógica específica integrada | ✅ CRUD universal |
| 📍 `/admin/dashboard/templates/` | 📍 `/src/components/cms/HeadlessCMS/` |

## Próximos Templates

### 🎪 Events (Planeado)
- Gestión de eventos y actividades
- Programación de horarios
- Gestión de entradas y precios

### ⭐ Testimonials (Planeado)  
- Reseñas y testimonios
- Calificaciones por estrellas
- Moderación de contenido

### 🎁 Promotions (Planeado)
- Paquetes promocionales
- Descuentos y ofertas especiales
- Gestión de vigencia

## Exportaciones
Todas las exportaciones están centralizadas en `./index.tsx` para facilitar las importaciones:

```tsx
// Importación simple desde cualquier parte del proyecto
import { EditPlanForm, CreatePlanForm } from '@/components/admin/dashboard/templates';
```
