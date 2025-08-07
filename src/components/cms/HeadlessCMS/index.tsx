/**
 * NOVA CMS - HEADLESS CMS SYSTEM
 * ===============================
 * 
 * Este archivo organiza las exportaciones del sistema headless CMS.
 * El sistema permite crear tipos de contenido dinámicos y flexibles.
 * 
 * COMPONENTES DISPONIBLES:
 * - ContentTypeForm: Crear/editar tipos de contenido
 * - FieldsBuilder: Constructor dinámico de campos
 * - DynamicContentForm: Formulario dinámico para cualquier content type
 * - ContentEntryList: Lista de entradas de contenido
 * 
 * CARACTERÍSTICAS:
 * - Tipos de contenido configurables por el usuario
 * - Campos dinámicos (TEXT, RICH_TEXT, NUMBER, BOOLEAN, DATE, MEDIA)
 * - Validación automática basada en configuración
 * - Storage en tabla genérica ContentEntry
 * - API unificada para CRUD operations
 */

// Core Components - Content Type Management
export { ContentTypeForm } from './ContentTypeForm';
export { FieldsBuilder } from './FieldsBuilder';

// Dynamic Content Components
export { DynamicContentForm } from './DynamicContentForm';
export { ContentEntryList } from './ContentEntryList';
export { ContentEntryEditor } from './ContentEntryEditor';

// Utility Components
export { FieldTypeSelector } from './FieldTypeSelector';
export { ContentPreview } from './ContentPreview';

// Types
export type { ContentTypeFormValues } from './ContentTypeForm';
export { fieldSchema, contentTypeSchema } from './ContentTypeForm';
