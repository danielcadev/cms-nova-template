'use client';

/**
 * NOVA CMS - DYNAMIC CONTENT FORM
 * ================================
 * 
 * Formulario dinámico profesional con diseño iOS para crear/editar contenido.
 * Cada campo se presenta como una tarjeta individual con diseño elegante.
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

// Componente para renderizar un campo individual con diseño de formulario profesional
function DynamicField({ field, control }: { field: Field; control: any }) {
  const getFieldIcon = (type: Field['type']) => {
    switch (type) {
      case 'TEXT': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'RICH_TEXT': return <FileText className="h-5 w-5 text-purple-600" />;
      case 'NUMBER': return <Hash className="h-5 w-5 text-green-600" />;
      case 'BOOLEAN': return <ToggleRight className="h-5 w-5 text-orange-600" />;
      case 'DATE': return <Calendar className="h-5 w-5 text-rose-600" />;
      case 'MEDIA': return <Image className="h-5 w-5 text-indigo-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getFieldDescription = (type: Field['type']) => {
    switch (type) {
      case 'TEXT': return 'Texto simple de una línea';
      case 'RICH_TEXT': return 'Texto con formato y múltiples líneas';
      case 'NUMBER': return 'Valores numéricos y decimales';
      case 'BOOLEAN': return 'Opción verdadero/falso (sí/no)';
      case 'DATE': return 'Fechas y horarios';
      case 'MEDIA': return 'URLs de imágenes y archivos';
      default: return 'Campo de contenido';
    }
  };

  return (
    <FormField
      control={control}
      name={field.apiIdentifier}
      render={({ field: formField, fieldState }) => (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
          <FormItem>
            {/* Header elegante del campo */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                  {getFieldIcon(field.type)}
                </div>
                <div className="flex-1">
                  <FormLabel className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    {field.label}
                    {field.isRequired && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full font-bold uppercase tracking-wide">
                        Obligatorio
                      </span>
                    )}
                  </FormLabel>
                  <p className="text-sm text-gray-600 mt-1 font-medium">
                    {getFieldDescription(field.type)}
                  </p>
                </div>
              </div>
            </div>

            {/* Contenido del campo */}
            <div className="p-6">
              <FormControl>
                <div className="space-y-4">
                  {field.type === 'TEXT' && (
                    <div className="relative group">
                      <Input
                        {...formField}
                        placeholder={`Escribe ${field.label.toLowerCase()} aquí...`}
                        className="h-16 text-lg bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 px-6 font-medium placeholder:text-gray-400 group-hover:border-gray-300"
                      />
                    </div>
                  )}
                  
                  {field.type === 'RICH_TEXT' && (
                    <div className="relative group">
                      <Textarea
                        {...formField}
                        placeholder={`Escribe el contenido de ${field.label.toLowerCase()}...\n\nPuedes usar múltiples líneas y dar formato al texto.`}
                        rows={8}
                        className="text-lg bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none p-6 font-medium placeholder:text-gray-400 group-hover:border-gray-300"
                      />
                      <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white/90 px-3 py-1 rounded-lg backdrop-blur-sm border border-gray-200">
                        ✨ Formato enriquecido
                      </div>
                    </div>
                  )}
                  
                  {field.type === 'NUMBER' && (
                    <div className="relative group">
                      <Input
                        {...formField}
                        type="number"
                        placeholder="0"
                        onChange={(e) => formField.onChange(Number(e.target.value))}
                        className="h-16 text-lg bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 px-6 pr-16 font-medium placeholder:text-gray-400 group-hover:border-gray-300"
                      />
                      <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                        <Hash className="h-6 w-6 text-gray-400 group-hover:text-green-600 transition-colors duration-200" />
                      </div>
                    </div>
                  )}
                  
                  {field.type === 'BOOLEAN' && (
                    <div className="bg-gradient-to-r from-gray-50 to-orange-50/30 rounded-2xl p-6 border-2 border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <ToggleRight className="h-6 w-6 text-orange-600" />
                          </div>
                          <div>
                            <span className="text-lg font-bold text-gray-900 block">
                              {field.label}
                            </span>
                            <p className="text-sm text-gray-600 mt-1 font-medium">
                              {formField.value ? 'Activado' : 'Desactivado'} • Toca para cambiar
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={formField.value}
                          onCheckedChange={formField.onChange}
                          className="data-[state=checked]:bg-orange-500 scale-150 shadow-lg"
                        />
                      </div>
                    </div>
                  )}
                  
                  {field.type === 'DATE' && (
                    <div className="relative group">
                      <Input
                        {...formField}
                        type="datetime-local"
                        className="h-16 text-lg bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 px-6 pr-16 font-medium group-hover:border-gray-300"
                      />
                      <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                        <Calendar className="h-6 w-6 text-gray-400 group-hover:text-rose-600 transition-colors duration-200" />
                      </div>
                    </div>
                  )}
                  
                  {field.type === 'MEDIA' && (
                    <div className="space-y-4">
                      <div className="relative group">
                        <Input
                          {...formField}
                          placeholder="https://ejemplo.com/imagen.jpg"
                          className="h-16 text-lg bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 px-6 pr-16 font-medium placeholder:text-gray-400 group-hover:border-gray-300"
                        />
                        <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                          <Image className="h-6 w-6 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
                        <Image className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span className="font-medium">
                          💡 Ingresa la URL completa de tu imagen o archivo multimedia
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </FormControl>

              {/* Mensaje de error elegante */}
              {fieldState.error && (
                <div className="mt-4 flex items-start gap-4 text-red-700 text-sm bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 p-5 rounded-2xl shadow-sm">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-red-800 mb-1">Error en el campo</div>
                    <FormMessage className="text-red-700 font-medium" />
                  </div>
                </div>
              )}
            </div>
          </FormItem>
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
  const [openSections, setOpenSections] = useState({ main: true });

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

  // Generar schema dinámico
  const dynamicSchema = generateDynamicSchema(contentType.fields);
  
  // Configurar formulario con valores por defecto apropiados
  const form = useForm({
    resolver: zodResolver(dynamicSchema),
    defaultValues: generateDefaultValues(),
  });

  const handleSubmit = async (data: Record<string, any>) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (onSave) {
        await onSave(data);
        toast({
          title: mode === 'create' ? '✅ Contenido creado' : '✅ Contenido actualizado',
          description: 'Los cambios se han guardado exitosamente.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '❌ Error',
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
        <div className="max-w-5xl mx-auto px-6 py-6">
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
      <div className="max-w-5xl mx-auto px-6 py-8">
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
                      <h3 className="text-xl font-bold text-gray-900">Formulario de Contenido</h3>
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
                    <div className="bg-gray-50/30 rounded-2xl p-8">
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
                        <div className="space-y-8">
                          {contentType.fields.map((field, index) => (
                            <div key={field.id} className="group">
                              <DynamicField 
                                field={field} 
                                control={form.control}
                              />
                              
                              {/* Línea de separación elegante entre campos */}
                              {index < contentType.fields.length - 1 && (
                                <div className="my-8 flex items-center">
                                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                                  <div className="px-4 py-2 bg-white rounded-full text-xs text-gray-400 font-medium border border-gray-200">
                                    Campo {index + 1} de {contentType.fields.length}
                                  </div>
                                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                                </div>
                              )}
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
