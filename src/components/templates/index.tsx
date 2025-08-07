/**
 * NOVA CMS - TEMPLATE SYSTEM
 * ===========================
 * 
 * Este archivo organiza las exportaciones del sistema de templates.
 * Cada template tiene su propia carpeta con formularios especializados.
 * 
 * TEMPLATES DISPONIBLES:
 * - TouristPlan: Gestión de planes turísticos
 * 
 * AGREGAR NUEVOS TEMPLATES:
 * 1. Crear carpeta [TemplateName] en esta ubicación
 * 2. Implementar EditForm.tsx y CreateForm.tsx
 * 3. Exportar aquí los componentes
 * 4. Documentar en el README
 */

// Template: Tourist Plan
export { EditPlanForm } from './TouristPlan/EditPlanForm';
export { CreatePlanForm } from './TouristPlan/CreatePlanForm';

// Legacy re-exports para compatibilidad durante migración
export { EditPlanForm as EditPlanForm_Legacy } from './TouristPlan/EditPlanForm';
export { CreatePlanForm as CreatePlanForm_Legacy } from './TouristPlan/CreatePlanForm';

// TODO: Próximos templates a implementar
// export { EditEventForm } from './Events/EditEventForm';
// export { CreateEventForm } from './Events/CreateEventForm';
// export { EditTestimonialForm } from './Testimonials/EditTestimonialForm';
// export { CreateTestimonialForm } from './Testimonials/CreateTestimonialForm';
