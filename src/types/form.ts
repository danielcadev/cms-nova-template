import { UseFormReturn } from "react-hook-form";
import { ReactNode } from "react";
import type { PlanFormValues } from "@/schemas/plan";
import { z } from 'zod';

// Re-exportar PlanFormValues para que esté disponible desde @/types/form
export type { PlanFormValues };

// Tipo para el modo del formulario
export type FormMode = 'create' | 'edit';

// Tipo para mensajes de error
export interface ErrorMessageProps {
  message?: string;
}

// Tipo para la imagen principal
export interface MainImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  key?: string;
}

// Tipos para los campos JSON
export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  image?: string;
}

// Definir la interfaz para opciones de precio
export interface PriceOption {
  id: string;
  numPersons: number;
  price: number | null;
  groupPrice?: number | null;
  accommodation: string;
  currency?: string;
}

export interface TransportOption {
  id: string;
  title: string;
  features: string;
  frequency: string;
  price: number;
}

// Tipo Plan completo y explícito
export interface Plan {
  id: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Campos del formulario
  mainTitle: string;
  articleAlias: string;
  categoryAlias: string;
  promotionalText: string;
  attractionsTitle: string;
  attractionsText: string;
  transfersTitle: string;
  transfersText: string;
  holidayTitle: string;
  holidayText: string;
  destination: string;
  includes: string;
  notIncludes: string;
  
  // Campos JSON
  itinerary: ItineraryItem[];
  transportOptions: TransportOption[];
  priceOptions: JsonValue[];
  
  // Campos opcionales/nullables
  generalPolicies: string | null;
  videoUrl: string | null;
  mainImage: MainImage | null;
}

export interface StepProps {
  form: UseFormReturn<PlanFormValues>;
  onNext: () => Promise<void>;
  onBack?: () => void;
  currentStep: number;
  totalSteps: number;
  isLastStep: boolean;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
  mode?: FormMode;
  onStepChange: (step: number) => Promise<void>;
  completedSteps: number[];
  // Propiedades adicionales
  generatePlaceholder?: (placeholder: string) => string;
  updateAliases?: (mainTitle: string, href: string) => {
    categoryAlias: string;
    articleAlias: string;
  };
  initialData?: Partial<PlanFormValues>;
  planId?: string; // ID del plan para revalidación de caché
  s3Config?: any; // Añadimos la prop aquí
}

export interface PlanFormProps {
  initialData?: Partial<PlanFormValues>;
  onSubmit: (data: PlanFormValues) => Promise<void>;
  mode?: FormMode;
  isSubmitting?: boolean;
  planId?: string; // Añadir planId opcional para usar con revalidación de caché
}

export interface FormStep {
  title: string;
  description: string;
  component: React.ComponentType<StepProps>;
  validationFields: (keyof PlanFormValues)[];
  optional?: boolean;
  isPreview?: boolean;
}

export interface StepProgressProps {
  currentStep: number;
  steps: Array<Pick<FormStep, 'title' | 'description'>>;
}

export interface StepLayoutProps extends StepProps {
  title: string;
  description?: string;
  children: ReactNode;
  showPreview?: boolean;
  PreviewComponent?: ReactNode;
  mode?: FormMode; // Agregar modo aquí
}
export interface PlanManagerProps {
  onPlanUpdate?: (plan: Plan) => void;
}

// Interfaces para API y búsqueda
export interface GetPlansOptions {
  orderBy?: 'createdAt' | 'mainTitle' | 'destination';
  orderDirection?: 'asc' | 'desc';
  published?: boolean;
  search?: string;
}

export interface PlanApiResponse {
  success: boolean;
  plans?: Plan[];
  error?: string;
  message?: string;
  details?: unknown;
}

// Respuestas específicas para crear y editar
export interface PlanCreateResponse extends PlanApiResponse {
  plan?: Plan;
}

export interface PlanUpdateResponse extends PlanApiResponse {
  plan?: Plan;
  updated?: boolean;
}

// Respuestas específicas para imágenes
export interface ImageUploadResponse {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export interface ImageDeleteResponse {
  success: boolean;
  error?: string;
}

export type PlanSearchParams = {
  [K in keyof GetPlansOptions]: string;
};
// PlANES EXISTENTES
export interface ExistingPlan {
  id: string;
  articleAlias: string;
  mainTitle: string;
  categoryAlias: string;
}

//STEPS
export interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
  stepsCompleted: number[];
  mode?: FormMode;
}


export interface NavigationButtonsProps {
  isLastStep: boolean;
  handleNextStep: () => Promise<void>;
  prevStep: () => Promise<void>;
  isDisabled: boolean;
  currentStep: number;
  completedSteps?: number[]; // Hacer opcional para evitar error
  mode?: FormMode;
}

// Tipo genérico para JSON values
export type JsonValue = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export interface PlanFormData {
  id?: string;
  mainTitle: string;
  articleAlias: string;
  categoryAlias: string;
  promotionalText: string;
  attractionsTitle: string;
  attractionsText: string;
  transfersTitle: string;
  transfersText: string;
  holidayTitle: string;
  holidayText: string;
  destination: string;
  includes: string;
  notIncludes: string;
  itinerary: ItineraryDay[];
  priceOptions: JsonValue[];
  generalPolicies?: string;
  transportOptions: TransportOption[];
  allowGroundTransport: boolean;
  videoUrl?: string;
  mainImage?: MainImageData;
  published: boolean;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities?: string[];
}

export interface TransportOption {
  id: string;
  type: 'flight' | 'bus' | 'car' | 'train';
  name: string;
  description?: string;
  included: boolean;
}

export interface MainImageData {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

// Schemas de validación con Zod
export const planFormSchema = z.object({
  mainTitle: z.string().min(1, 'El título es requerido'),
  articleAlias: z.string().min(1, 'El alias es requerido'),
  categoryAlias: z.string().min(1, 'La categoría es requerida'),
  promotionalText: z.string().min(1, 'El texto promocional es requerido'),
  attractionsTitle: z.string().min(1, 'El título de atracciones es requerido'),
  attractionsText: z.string().min(1, 'El texto de atracciones es requerido'),
  transfersTitle: z.string().min(1, 'El título de transfers es requerido'),
  transfersText: z.string().min(1, 'El texto de transfers es requerido'),
  holidayTitle: z.string().min(1, 'El título de holidays es requerido'),
  holidayText: z.string().min(1, 'El texto de holidays es requerido'),
  destination: z.string().min(1, 'El destino es requerido'),
  includes: z.string().min(1, 'Las inclusiones son requeridas'),
  notIncludes: z.string().min(1, 'Las exclusiones son requeridas'),
  itinerary: z.array(z.object({
    day: z.number(),
    title: z.string(),
    description: z.string(),
    activities: z.array(z.string()).optional()
  })),
  priceOptions: z.array(z.any()),
  generalPolicies: z.string().optional(),
  transportOptions: z.array(z.object({
    id: z.string(),
    type: z.enum(['flight', 'bus', 'car', 'train']),
    name: z.string(),
    description: z.string().optional(),
    included: z.boolean()
  })),
  allowGroundTransport: z.boolean(),
  videoUrl: z.string().optional(),
  mainImage: z.object({
    url: z.string(),
    alt: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional()
  }).optional(),
  published: z.boolean()
});
