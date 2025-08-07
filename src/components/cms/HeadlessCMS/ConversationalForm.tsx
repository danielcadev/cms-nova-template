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
import { ArrowRight, Sparkles, MessageCircle, Edit3, Calendar, Hash, ToggleRight, Image, CheckCircle2, Bot } from 'lucide-react';
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
          <div className="max-w-2xl mx-auto">
            {/* Mensaje del asistente */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                <Bot className="w-6 h-6" />
              </div>
              <div className="flex-1 bg-white rounded-3xl rounded-tl-lg p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{getFieldEmoji(field.type)}</span>
                  <span className="font-bold text-gray-900">{field.label}</span>
                  {field.isRequired && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                      Importante
                    </span>
                  )}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {getConversationalPrompt(field)}
                </p>
              </div>
            </div>

            {/* Respuesta del usuario */}
            <div className="flex items-end gap-4 mb-8">
              <div className="flex-1">
                <FormControl>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl rounded-br-lg p-6 border-2 border-blue-200/50 shadow-sm">
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
                        rows={6}
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
                          <span className="text-lg font-medium text-gray-700">
                            {formField.value ? '✅ Sí' : '❌ No'}
                          </span>
                          <span className="text-gray-500">Toca para cambiar</span>
                        </div>
                        <Switch
                          checked={formField.value}
                          onCheckedChange={formField.onChange}
                          className="data-[state=checked]:bg-blue-500 scale-125"
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
                          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 text-green-700">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-sm font-medium">¡Perfecto! URL válida</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </FormControl>
              </div>
              
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
            </div>

            {/* Error message como mensaje del asistente */}
            {fieldState.error && (
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg">
                  <span className="text-xl">😅</span>
                </div>
                <div className="flex-1 bg-red-50 rounded-3xl rounded-tl-lg p-4 border border-red-200">
                  <p className="text-red-700 font-medium">
                    Oops! <FormMessage className="inline" />
                  </p>
                </div>
              </div>
            )}

            {/* Botón para continuar */}
            {isActive && onNext && (
              <div className="flex justify-center mt-8">
                <Button
                  type="button"
                  onClick={onNext}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full px-8 py-3 text-lg shadow-lg transition-all duration-300 group"
                >
                  Continuar
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
    
    setIsSubmitting(true);
    try {
      if (onSave) {
        await onSave(data);
        toast({
          title: '🎉 ¡Increíble!',
          description: 'Tu contenido se ha guardado exitosamente.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '😔 Algo salió mal',
        description: 'No pudimos guardar tu contenido. Inténtalo de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      {/* Header minimalista */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {mode === 'create' ? 'Crear' : 'Editar'} {contentType.name}
                </h1>
                <p className="text-gray-600">
                  {currentStep + 1} de {contentType.fields.length} • {contentType.description}
                </p>
              </div>
            </div>
            
            {/* Progreso visual */}
            <div className="flex items-center gap-2">
              {contentType.fields.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    index <= currentStep 
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 scale-110" 
                      : "bg-gray-200"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido conversacional */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-16">
            
            {/* Campo actual */}
            {contentType.fields.map((field, index) => (
              <div
                key={field.id}
                className={cn(
                  "transition-all duration-500",
                  index === currentStep ? "block" : "hidden"
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

            {/* Resumen final */}
            {currentStep >= contentType.fields.length - 1 && (
              <div className="max-w-2xl mx-auto mt-16">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      ¡Perfecto! Ya casi terminamos
                    </h3>
                    <p className="text-gray-600">
                      Revisa tu contenido y guárdalo cuando estés listo.
                    </p>
                  </div>

                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl py-4 text-lg shadow-lg transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Guardando...
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
  );
}
