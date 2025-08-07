'use client';

/**
 * NOVA CMS - DYNAMIC CONTENT FORM
 * ================================
 * 
 * Formulario dinámico que se genera automáticamente basado en 
 * la configuración de un ContentType. Este es el corazón del
 * sistema headless CMS.
 * 
 * CARACTERÍSTICAS:
 * - Genera campos dinámicamente según el ContentType
 * - Validación automática basada en field configuration
 * - Auto-save con useFormPersistence
 * - iPhone-style design consistente
 * - Guarda en tabla ContentEntry genérica
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronsUpDown, Save, FileText, Calendar, Hash, ToggleRight, Image } from 'lucide-react';
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
    let fieldValidator: any;
    
    switch (field.type) {
      case 'TEXT':
      case 'RICH_TEXT':
        fieldValidator = z.string();
        if (field.isRequired) {
          fieldValidator = fieldValidator.min(1, `${field.label} es requerido`);
        }
        break;
      case 'NUMBER':
        fieldValidator = z.number();
        if (field.isRequired) {
          fieldValidator = fieldValidator.min(0, `${field.label} es requerido`);
        }
        break;
      case 'BOOLEAN':
        fieldValidator = z.boolean();
        break;
      case 'DATE':
        fieldValidator = z.string().refine(date => !isNaN(Date.parse(date)), {
          message: 'Fecha inválida'
        });
        if (field.isRequired) {
          fieldValidator = fieldValidator.min(1, `${field.label} es requerido`);
        }
        break;
      case 'MEDIA':
        fieldValidator = z.string().url();
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

// Componente para renderizar un campo individual con diseño iOS profesional
function DynamicField({ field, control }: { field: Field; control: any }) {
  const getFieldIcon = (type: Field['type']) => {
    switch (type) {
      case 'TEXT': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'RICH_TEXT': return <FileText className="h-5 w-5 text-purple-500" />;
      case 'NUMBER': return <Hash className="h-5 w-5 text-green-500" />;
      case 'BOOLEAN': return <ToggleRight className="h-5 w-5 text-orange-500" />;
      case 'DATE': return <Calendar className="h-5 w-5 text-rose-500" />;
      case 'MEDIA': return <Image className="h-5 w-5 text-indigo-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getFieldDescription = (type: Field['type']) => {
    switch (type) {
      case 'TEXT': return 'Texto simple de una línea';
      case 'RICH_TEXT': return 'Texto con formato y múltiples líneas';
      case 'NUMBER': return 'Valores numéricos y decimales';
      case 'BOOLEAN': return 'Verdadero o falso (sí/no)';
      case 'DATE': return 'Fechas y horarios';
      case 'MEDIA': return 'URLs de imágenes y archivos';
      default: return 'Campo de contenido';
    }
  };

  const renderFieldInput = (formField: any) => {
    const baseClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400";
    
    switch (field.type) {
      case 'TEXT':
        return (
          <Input 
            {...formField} 
            value={formField.value || ''}
            placeholder={`Escribe tu ${field.label.toLowerCase()} aquí...`}
            className={baseClasses}
          />
        );
      case 'RICH_TEXT':
        return (
          <Textarea 
            {...formField} 
            value={formField.value || ''}
            placeholder={`Escribe tu ${field.label.toLowerCase()} aquí...\n\nPuedes usar múltiples líneas y dar formato al texto.`}
            rows={6}
            className={cn(baseClasses, "resize-none min-h-[150px]")}
          />
        );
      case 'NUMBER':
        return (
          <Input 
            {...formField} 
            type="number"
            value={formField.value || ''}
            placeholder="0"
            className={baseClasses}
            onChange={(e) => formField.onChange(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
          />
        );
      case 'BOOLEAN':
        return (
          <div className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ToggleRight className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {formField.value ? 'Activado' : 'Desactivado'}
                </p>
                <p className="text-sm text-gray-500">
                  {getFieldDescription(field.type)}
                </p>
              </div>
            </div>
            <Switch 
              checked={formField.value || false}
              onCheckedChange={formField.onChange}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
        );
      case 'DATE':
        return (
          <Input 
            {...formField} 
            type="datetime-local"
            value={formField.value || ''}
            className={baseClasses}
          />
        );
      case 'MEDIA':
        return (
          <div className="space-y-3">
            <Input 
              {...formField} 
              type="url"
              value={formField.value || ''}
              placeholder="https://ejemplo.com/imagen.jpg"
              className={baseClasses}
            />
            {formField.value && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Vista previa:</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Image className="h-4 w-4" />
                  <span className="truncate">{formField.value}</span>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return (
          <Input 
            {...formField} 
            value={formField.value || ''}
            placeholder={`Escribe tu ${field.label.toLowerCase()} aquí...`}
            className={baseClasses}
          />
        );
    }
  };

  return (
    <FormField
      control={control}
      name={field.apiIdentifier}
      render={({ field: formField, fieldState }) => (
        <FormItem className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0 mt-1">
                {getFieldIcon(field.type)}
              </div>
              <div className="flex-1">
                <FormLabel className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  {field.label}
                  {field.isRequired && (
                    <span className="text-red-500 text-sm">*</span>
                  )}
                </FormLabel>
                <p className="text-sm text-gray-500 mt-1">
                  {getFieldDescription(field.type)}
                </p>
              </div>
            </div>
          </div>
          
          <FormControl>
            <div className="space-y-2">
              {renderFieldInput(formField)}
              {fieldState.error && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <FormMessage className="text-red-700 text-sm" />
                </div>
              )}
            </div>
          </FormControl>
        </FormItem>
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
  const [openSections, setOpenSections] = useState({ main: true });

  // Generar valores por defecto para todos los campos
  const generateDefaultValues = () => {
    const defaultValues: Record<string, any> = {};
    
    contentType.fields.forEach(field => {
      // Si ya hay un valor inicial, usarlo; si no, usar valor por defecto según el tipo
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

  // Generar schema dinámico
  const dynamicSchema = generateDynamicSchema(contentType.fields);
  
  // Configurar formulario con valores por defecto apropiados
  const form = useForm({
    resolver: zodResolver(dynamicSchema),
    defaultValues: generateDefaultValues(),
  });

  // Auto-save con persistencia (comentado temporalmente hasta crear versión genérica)
  // useFormPersistence(
  //   form, 
  //   `headless-cms-${contentType.apiIdentifier}-${entryId || 'new'}`,
  //   initialData
  // );

  const handleSubmit = async (data: Record<string, any>) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (onSave) {
        await onSave(data);
        toast({
          title: mode === 'create' ? 'Contenido creado' : 'Contenido actualizado',
          description: 'Los cambios se han guardado exitosamente.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron guardar los cambios.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header profesional estilo iOS */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {mode === 'create' ? 'Crear' : 'Editar'} {contentType.name}
                </h1>
                <p className="text-lg text-gray-600 mt-1">{contentType.description}</p>
              </div>
            </div>
            
            <Button 
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 py-3 text-lg shadow-lg shadow-blue-500/25 transition-all duration-200"
            >
              <Save className="h-5 w-5 mr-3" />
              {isSubmitting ? 'Guardando...' : 'Guardar Contenido'}
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            
            {/* Información del contenido */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm overflow-hidden">
              <Collapsible 
                open={openSections.main}
                onOpenChange={(open) => setOpenSections({ main: open })}
                className="w-full"
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between p-8 hover:bg-gray-50/50 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-2xl">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-gray-900">Información del Contenido</h3>
                      <p className="text-gray-500 mt-1">
                        {contentType.fields.length} campos • Completa la información requerida
                      </p>
                    </div>
                  </div>
                  <ChevronsUpDown className={cn(
                    "h-6 w-6 transition-transform duration-200 text-gray-400",
                    openSections.main && "rotate-180"
                  )} />
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-8 pb-8">
                    <div className="bg-gray-50/50 rounded-2xl p-8">
                      {contentType.fields.length === 0 ? (
                        <div className="text-center py-16">
                          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                            <FileText className="h-8 w-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Sin campos configurados
                          </h3>
                          <p className="text-gray-500">
                            Este tipo de contenido no tiene campos definidos.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {contentType.fields.map((field, index) => (
                            <div key={field.id} className="group">
                              <DynamicField 
                                field={field} 
                                control={form.control}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Botón de guardado adicional al final */}
            <div className="flex justify-center pt-8">
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-12 py-4 text-lg shadow-lg shadow-blue-500/25 transition-all duration-200"
              >
                <Save className="h-5 w-5 mr-3" />
                {isSubmitting ? 'Guardando...' : `${mode === 'create' ? 'Crear' : 'Actualizar'} ${contentType.name}`}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
