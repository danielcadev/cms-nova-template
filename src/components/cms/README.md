# Nova CMS - Arquitectura de Formularios

## Sistema Dual de Gestión de Contenido

Nova CMS implementa **dos sistemas complementarios** para la gestión de contenido:

### 1. 🎯 Sistema de Templates (Formularios Predefinidos)
**Ubicación:** `/src/components/admin/dashboard/templates/`

Formularios especializados para tipos específicos de contenido integrados en el dashboard administrativo:
- **TouristPlan** - Gestión de planes turísticos
- Secciones predefinidas (BasicInfo, Itinerary, Pricing, etc.)
- Schemas específicos de Zod (`planSchema`)
- Tablas dedicadas en la base de datos
- Lógica de negocio específica del dominio

**Casos de uso:**
- Planes turísticos con estructura fija
- Contenido que requiere validaciones específicas
- Formularios con flujos complejos de UX

### 2. 🧱 Sistema Headless CMS (Contenido Flexible) ✅ IMPLEMENTADO
**Ubicación:** `/src/components/cms/HeadlessCMS/`

Sistema flexible para crear tipos de contenido personalizados:
- ✅ Creación dinámica de content types (`ContentTypeForm.tsx`)
- ✅ Constructor de campos (`FieldsBuilder.tsx`) 
- ✅ Formulario dinámico universal (`DynamicContentForm.tsx`)
- ✅ Lista y editor de entradas (`ContentEntryList.tsx`, `ContentEntryEditor.tsx`)
- ✅ Validación dinámica basada en configuración
- ✅ Tabla `ContentEntry` genérica en Prisma
- ✅ API completa en `/api/content/`
- ✅ Server Actions (`content-type-actions.ts`)

**Casos de uso:**
- Blogs, artículos, testimonios
- Contenido que cambia frecuentemente su estructura
- Tipos de contenido creados por usuarios

## Arquitectura de Archivos

```
src/components/
├── cms/                                    # 🧱 SISTEMA HEADLESS CMS FLEXIBLE
│   ├── HeadlessCMS/                       # Contenido dinámico creado por usuarios
│   │   ├── ContentTypeForm.tsx            # ✅ Constructor de tipos
│   │   ├── DynamicContentForm.tsx         # ✅ Formulario universal
│   │   ├── ContentEntryList.tsx           # ✅ Lista de entradas
│   │   └── ...                            # ✅ Todos los componentes dinámicos
│   ├── AutosaveIndicator.tsx              # Utilidades de auto-guardado
│   └── README.md                          # Documentación del sistema
│
└── admin/dashboard/
    └── templates/                          # 🎯 TEMPLATES ESPECIALIZADOS
        └── TouristPlan/                    # Formularios con estructura fija
            ├── EditPlanForm.tsx            # Editor especializado
            └── sections/                   # Secciones predefinidas
```

## Cuándo Usar Cada Sistema

### Usar Templates cuando:
- ✅ El tipo de contenido tiene estructura fija
- ✅ Requiere validaciones complejas específicas  
- ✅ Necesita UX especializada
- ✅ Tiene lógica de negocio específica

### Usar Headless CMS cuando:
- ✅ El tipo de contenido puede variar
- ✅ Los usuarios necesitan crear sus propios tipos
- ✅ El contenido es principalmente textual/informativo
- ✅ Se requiere flexibilidad máxima

## Principios de Desarrollo

1. **Templates son especializados** - Cada template debe tener su propio schema y lógica
2. **Headless es genérico** - Ya implementado, funciona para cualquier tipo de contenido
3. **Coherencia de UI** - Ambos sistemas usan shadcn/ui y iPhone-style design
4. **Auto-save consistente** - Templates implementan `useFormPersistence`
5. **Validación robusta** - Templates usan Zod, Headless usa validación dinámica

## Estado Actual y Evolución

- **Sistema de Templates** ✅ Implementado para planes turísticos
- **Sistema Headless CMS** ✅ Completamente implementado y funcional
- **API unificada** ✅ Disponible en `/api/content/`
- **Interfaz de administración** ✅ Disponible para crear content types

### Próximos Templates a Implementar:
- Eventos y actividades
- Testimonios y reseñas  
- Paquetes promocionales
- Destinos detallados
