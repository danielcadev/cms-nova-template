# HeadlessCMS - Sistema de Contenido Flexible

## Descripción
Sistema headless CMS que permite crear tipos de contenido dinámicos y flexibles. Los usuarios pueden definir sus propios content types con campos personalizados.

## Componentes

### 🏗️ Gestión de Content Types
- **`ContentTypeForm.tsx`** - Crear/editar tipos de contenido
- **`FieldsBuilder.tsx`** - Constructor drag & drop de campos dinámicos
- **`FieldTypeSelector.tsx`** - Selector visual de tipos de campo

### 📝 Gestión de Contenido
- **`DynamicContentForm.tsx`** - Formulario que se genera dinámicamente
- **`ContentEntryList.tsx`** - Lista paginada de entradas con búsqueda
- **`ContentEntryEditor.tsx`** - Editor específico para entradas
- **`ContentPreview.tsx`** - Vista previa formateada del contenido

### 📁 Organización
- **`index.tsx`** - Exportaciones centralizadas

## Tipos de Campo Soportados

| Tipo | Descripción | Componente UI |
|------|-------------|---------------|
| `TEXT` | Texto corto | `Input` |
| `RICH_TEXT` | Texto largo | `Textarea` |
| `NUMBER` | Números | `Input[type=number]` |
| `BOOLEAN` | Sí/No | `Switch` |
| `DATE` | Fechas | `Input[type=date]` |
| `MEDIA` | URLs de archivos | `Input[type=url]` |

## Base de Datos

### Tablas Principales
```sql
ContentType {
  id: String
  name: String
  apiIdentifier: String (único)
  description: String?
  fields: Field[]
  entries: ContentEntry[]
}

Field {
  id: String
  label: String
  apiIdentifier: String
  type: FieldType
  isRequired: Boolean
  contentType: ContentType
}

ContentEntry {
  id: String
  data: Json (datos dinámicos)
  contentType: ContentType
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Flujo de Uso

### 1. Crear Content Type
```typescript
import { ContentTypeForm } from '@/components/forms/HeadlessCMS';

<ContentTypeForm mode="create" />
```

### 2. Gestionar Entradas
```typescript
import { ContentEntryList, ContentEntryEditor } from '@/components/forms/HeadlessCMS';

// Lista de entradas
<ContentEntryList 
  contentTypeId={id}
  onCreateNew={() => router.push(`/create`)}
  onEdit={(entryId) => router.push(`/edit/${entryId}`)}
/>

// Editor de entrada
<ContentEntryEditor 
  contentTypeId={typeId}
  entryId={entryId}
  mode="edit"
/>
```

### 3. Vista Previa
```typescript
import { ContentPreview } from '@/components/forms/HeadlessCMS';

<ContentPreview 
  contentType={contentType}
  data={entryData}
  createdAt={entry.createdAt}
  updatedAt={entry.updatedAt}
/>
```

## API Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/content-types` | GET, POST | Gestionar content types |
| `/api/content-types/[id]` | GET, PATCH, DELETE | Content type específico |
| `/api/content/[typeId]/entries` | GET, POST | Entradas de un tipo |
| `/api/content/entries/[id]` | GET, PATCH, DELETE | Entrada específica |

## Características Técnicas

### Validación Dinámica
- Schema Zod generado automáticamente basado en fields
- Validación en tiempo real
- Mensajes de error personalizados

### Auto-guardado
- Persistencia en localStorage (pendiente implementar versión genérica)
- Indicadores de estado de guardado
- Recuperación automática de borradores

### UI/UX
- iPhone-style design consistente
- Componentes responsivos con shadcn/ui
- Drag & drop para reordenar campos
- Búsqueda y filtrado en listas

### Performance
- Lazy loading de entradas
- Paginación optimizada
- Caché de content types

## Diferencias con Templates

| HeadlessCMS | Templates |
|-------------|-----------|
| ✅ Estructura dinámica | ✅ Estructura fija |
| ✅ Campos configurables | ✅ Campos predefinidos |
| ✅ Validación genérica | ✅ Validación específica |
| ✅ Tabla `ContentEntry` | ✅ Tablas dedicadas |
| ✅ Máxima flexibilidad | ✅ Lógica de negocio específica |
| ❌ Menos validaciones específicas | ❌ Menos flexibilidad |

## Extensión

### Agregar Nuevo Tipo de Campo
1. Actualizar enum `FieldType` en `FieldTypeSelector.tsx`
2. Agregar opción en `fieldTypeOptions`
3. Implementar renderizado en `DynamicField` dentro de `DynamicContentForm.tsx`
4. Actualizar validación en `generateDynamicSchema`
5. Agregar formato en `ContentPreview.tsx`

### Personalizar UI
- Todos los componentes usan shadcn/ui
- Estilos consistentes con el sistema de design
- Fácil modificación via props o CSS classes
