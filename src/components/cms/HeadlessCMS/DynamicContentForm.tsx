'use client';

/**
 * NOVA CMS - CONVERSATIONAL CONTENT CREATOR
 * ==========================================
 * 
 * Una experiencia de creación de contenido conversacional e interactiva,
 * que no parece un formulario tradicional sino un asistente inteligente.
 */

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Sparkles, MessageCircle, Edit3, Calendar, Hash, ToggleRight, Image, CheckCircle2, Bot, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types para el contenido dinámico
interface Field {
  id: string;
  label: string;
  apiIdentifier: string;
  type: 'TEXT' | 'RICH_TEXT' | 'NUMBER' | 'BOOLEAN' | 'DATE' | 'MEDIA';
  isRequired: boolean;
}

interface ContentType {
  id: string;
  name: string;
  apiIdentifier: string;
  description?: string;
  fields: Field[];
}

interface DynamicContentFormProps {
  contentType: ContentType;
  initialData?: Record<string, any>;
  entryId?: string;
  mode?: 'create' | 'edit';
  onSave?: (data: Record<string, any>) => Promise<void>;
}

// Generador de schema dinámico basado en fields
function generateDynamicSchema(fields: Field[]) {
  const schemaShape: Record<string, any> = {};
  
  fields.forEach(field => {
    let fieldValidator;
    
    switch (field.type) {
      case 'TEXT':
      case 'RICH_TEXT':
      case 'MEDIA':
        fieldValidator = z.string();
        if (field.isRequired) {
          fieldValidator = fieldValidator.min(1, `${field.label} es requerido`);
        }
        break;
      case 'NUMBER':
        fieldValidator = z.number();
        if (field.isRequired) {
          fieldValidator = fieldValidator.min(0, `${field.label} debe ser un número válido`);
        }
        break;
      case 'BOOLEAN':
        fieldValidator = z.boolean();
        break;
      case 'DATE':
        fieldValidator = z.string();
        if (field.isRequired) {
          fieldValidator = fieldValidator.min(1, `${field.label} es requerido`);
        }
        break;
      default:
        fieldValidator = z.string();
    }
    
    if (!field.isRequired) {
      fieldValidator = fieldValidator.optional();
    }
    
    schemaShape[field.apiIdentifier] = fieldValidator;
  });
  
  return z.object(schemaShape);
}

// Componente de conversación para cada campo
function ConversationField({ field, control, isActive, onNext }: { 
  field: Field; 
  control: any; 
  isActive: boolean;
  onNext?: () => void;
}) {
  const getFieldEmoji = (type: Field['type']) => {
    switch (type) {
      case 'TEXT': return '✍️';
      case 'RICH_TEXT': return '📝';
      case 'NUMBER': return '🔢';
      case 'BOOLEAN': return '⚡';
      case 'DATE': return '📅';
      case 'MEDIA': return '🖼️';
      default: return '💭';
    }
  };

  const getConversationalPrompt = (field: Field) => {
    switch (field.type) {
      case 'TEXT': 
        return `Hola! 👋 Me puedes contar ${field.label.toLowerCase()}?`;
      case 'RICH_TEXT': 
        return `Perfecto! Ahora cuéntame más sobre ${field.label.toLowerCase()}. Puedes escribir todo lo que quieras aquí:`;
      case 'NUMBER': 
        return `¿Cuál sería el valor numérico para ${field.label.toLowerCase()}?`;
      case 'BOOLEAN': 
        return `Una pregunta rápida: ¿${field.label.toLowerCase()}?`;
      case 'DATE': 
        return `¿Cuándo sería la fecha para ${field.label.toLowerCase()}?`;
      case 'MEDIA': 
        return `¡Genial! ¿Tienes alguna imagen o archivo para ${field.label.toLowerCase()}? Puedes pegar la URL aquí:`;
      default: 
        return `Cuéntame sobre ${field.label.toLowerCase()}:`;
    }
  };

  return (
    <FormField
      control={control}
      name={field.apiIdentifier}
      render={({ field: formField, fieldState }) => (
        <div className={cn(
          "transition-all duration-700 ease-out",
          isActive ? "opacity-100 transform translate-y-0" : "opacity-40 transform translate-y-4"
        )}>
          <div className="w-full">
            {/* Mensaje del asistente mejorado */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl flex-shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-3xl rounded-tl-xl p-6 shadow-xl border border-white/50 max-w-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{getFieldEmoji(field.type)}</span>
                  <div>
                    <span className="font-bold text-gray-900 text-lg">{field.label}</span>
                    {field.isRequired && (
                      <span className="ml-3 px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 text-xs rounded-full font-semibold border border-orange-200">
                        Campo Importante
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 text-base leading-relaxed">
                  {getConversationalPrompt(field)}
                </p>
              </div>
            </div>

            {/* Respuesta del usuario mejorada */}
            <div className="flex items-end gap-4 mb-8 justify-end">
              <div className="flex-1 max-w-2xl">
                <FormControl>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl rounded-br-xl p-6 border-2 border-green-200/50 shadow-xl ml-auto backdrop-blur-sm">
                    {field.type === 'TEXT' && (
                      <Input
                        {...formField}
                        placeholder="Escribe tu respuesta aquí..."
                        className="border-0 bg-transparent text-lg placeholder:text-gray-400 focus:ring-0 focus:outline-none p-0 h-auto font-medium"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && onNext) {
                            onNext();
                          }
                        }}
                      />
                    )}
                    
                    {field.type === 'RICH_TEXT' && (
                      <Textarea
                        {...formField}
                        placeholder="Comparte todos los detalles que quieras..."
                        rows={4}
                        className="border-0 bg-transparent text-lg placeholder:text-gray-400 focus:ring-0 focus:outline-none resize-none p-0 font-medium"
                      />
                    )}
                    
                    {field.type === 'NUMBER' && (
                      <Input
                        {...formField}
                        type="number"
                        placeholder="Ingresa un número"
                        onChange={(e) => formField.onChange(Number(e.target.value))}
                        className="border-0 bg-transparent text-lg placeholder:text-gray-400 focus:ring-0 focus:outline-none p-0 h-auto font-medium"
                      />
                    )}
                    
                    {field.type === 'BOOLEAN' && (
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold text-gray-800">
                            {formField.value ? '✅ Sí, absolutamente' : '❌ No, en absoluto'}
                          </span>
                          <span className="text-sm text-gray-500 bg-white/60 px-3 py-1 rounded-full">Toca para cambiar</span>
                        </div>
                        <Switch
                          checked={formField.value}
                          onCheckedChange={formField.onChange}
                          className="data-[state=checked]:bg-green-500 scale-125"
                        />
                      </div>
                    )}
                    
                    {field.type === 'DATE' && (
                      <Input
                        {...formField}
                        type="datetime-local"
                        className="border-0 bg-transparent text-lg focus:ring-0 focus:outline-none p-0 h-auto font-medium"
                      />
                    )}
                    
                    {field.type === 'MEDIA' && (
                      <div className="space-y-3">
                        <Input
                          {...formField}
                          placeholder="https://ejemplo.com/mi-imagen.jpg"
                          className="border-0 bg-transparent text-lg placeholder:text-gray-400 focus:ring-0 focus:outline-none p-0 h-auto font-medium"
                        />
                        {formField.value && (
                          <div className="mt-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                            <div className="flex items-center gap-3 text-green-700">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="text-sm font-semibold">¡Excelente! URL válida detectada</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </FormControl>
              </div>
              
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-2xl">👤</span>
              </div>
            </div>

            {/* Error message como mensaje del asistente mejorado */}
            {fieldState.error && (
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-xl flex-shrink-0">
                  <span className="text-2xl">😅</span>
                </div>
                <div className="flex-1 bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl rounded-tl-xl p-6 border border-red-200 max-w-2xl shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-red-700 text-lg">¡Oops! Un pequeño detalle</span>
                  </div>
                  <p className="text-red-700 font-medium text-base">
                    <FormMessage className="inline" />
                  </p>
                </div>
              </div>
            )}

            {/* Botón para continuar mejorado */}
            {isActive && onNext && !fieldState.error && (
              <div className="flex justify-center mt-8">
                <Button
                  type="button"
                  onClick={onNext}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl px-8 py-3 text-lg font-semibold shadow-xl transition-all duration-300 group transform hover:scale-105"
                >
                  Continuar al siguiente campo
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    />
  );
}

export function DynamicContentForm({ 
  contentType, 
  initialData = {}, 
  entryId, 
  mode = 'create',
  onSave 
}: DynamicContentFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  console.log('🟡 DynamicContentForm mounted:', {
    contentType: contentType.name,
    mode,
    fieldsCount: contentType.fields.length,
    hasOnSave: !!onSave
  });

  // Generar valores por defecto para todos los campos
  const generateDefaultValues = () => {
    const defaultValues: Record<string, any> = {};
    
    contentType.fields.forEach(field => {
      if (initialData[field.apiIdentifier] !== undefined) {
        defaultValues[field.apiIdentifier] = initialData[field.apiIdentifier];
      } else {
        switch (field.type) {
          case 'TEXT':
          case 'RICH_TEXT':
          case 'MEDIA':
          case 'DATE':
            defaultValues[field.apiIdentifier] = '';
            break;
          case 'NUMBER':
            defaultValues[field.apiIdentifier] = 0;
            break;
          case 'BOOLEAN':
            defaultValues[field.apiIdentifier] = false;
            break;
          default:
            defaultValues[field.apiIdentifier] = '';
        }
      }
    });
    
    return defaultValues;
  };

  const dynamicSchema = generateDynamicSchema(contentType.fields);
  
  const form = useForm({
    resolver: zodResolver(dynamicSchema),
    defaultValues: generateDefaultValues(),
  });

  const handleNext = () => {
    if (currentStep < contentType.fields.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async (data: Record<string, any>) => {
    if (isSubmitting) return;
    
    console.log('🟡 Form submission started:', data);
    setIsSubmitting(true);
    try {
      if (onSave) {
        console.log('🟡 Calling onSave with data:', data);
        await onSave(data);
        console.log('🟢 onSave completed successfully');
        toast({
          title: '🎉 ¡Increíble!',
          description: 'Tu contenido se ha guardado exitosamente.',
        });
      }
    } catch (error) {
      console.error('🔴 Error in handleSubmit:', error);
      toast({
        variant: 'destructive',
        title: '😔 Algo salió mal',
        description: `No pudimos guardar tu contenido: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-transparent">
      {/* Header minimalista mejorado con progreso */}
      <div className="bg-gradient-to-r from-gray-50 to-green-50/50 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {mode === 'create' ? 'Creando' : 'Editando'} {contentType.name}
              </h2>
              <p className="text-sm text-gray-600">
                Paso {currentStep + 1} de {contentType.fields.length}
                {contentType.description && ` • ${contentType.description}`}
              </p>
            </div>
          </div>
          
          {/* Progreso visual mejorado */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">
              {Math.round(((currentStep + 1) / contentType.fields.length) * 100)}%
            </span>
            <div className="flex items-center gap-1.5">
              {contentType.fields.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "transition-all duration-500 rounded-full",
                    index <= currentStep 
                      ? "w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg scale-110" 
                      : index === currentStep + 1
                      ? "w-2.5 h-2.5 bg-green-200 scale-105"
                      : "w-2 h-2 bg-gray-200"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido conversacional */}
      <div className="px-8 py-8 pb-16">
        <div className="max-w-3xl mx-auto">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              
              {/* Campo actual */}
              {contentType.fields.map((field, index) => (
                <div
                  key={field.id}
                  className={cn(
                    "transition-all duration-700",
                    index === currentStep ? "block opacity-100 transform translate-y-0" : "hidden opacity-0 transform translate-y-4"
                  )}
                >
                  <ConversationField
                    field={field}
                    control={form.control}
                    isActive={index === currentStep}
                    onNext={index < contentType.fields.length - 1 ? handleNext : undefined}
                  />
                </div>
              ))}

              {/* Resumen final mejorado */}
              {currentStep >= contentType.fields.length - 1 && (
                <div className="mt-12">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 shadow-xl border border-green-100">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        ¡Excelente trabajo! 🎉
                      </h3>
                      <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
                        Has completado todos los campos. Tu contenido está listo para ser guardado.
                      </p>
                    </div>

                    {/* Preview de datos */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/50">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Resumen de tu contenido:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contentType.fields.map((field) => {
                          const value = form.watch(field.apiIdentifier);
                          return (
                            <div key={field.id} className="bg-gray-50 rounded-xl p-3">
                              <div className="text-sm font-medium text-gray-700 mb-1">{field.label}</div>
                              <div className="text-sm text-gray-600 truncate">
                                {field.type === 'BOOLEAN' 
                                  ? (value ? '✅ Sí' : '❌ No')
                                  : (value || '(vacío)')
                                }
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl py-4 text-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Guardando tu {contentType.name.toLowerCase()}...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-3" />
                          Guardar {contentType.name}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
