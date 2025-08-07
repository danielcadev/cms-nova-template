'use client';

import { Info, Eye, Settings2, Layers3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FieldCard, SortableFieldCard } from './FieldCard';
import { NewFieldForm } from './NewFieldForm';

interface TabContentProps {
  activeTab: string;
  formData: any;
  showNewFieldForm: boolean;
  onShowNewFieldForm: () => void;
  onHideNewFieldForm: () => void;
  onAddField: (field: any) => void;
  onDeleteField: (fieldId: string) => void;
  onFieldsReorder: (fields: any[]) => void;
  isDragOver: boolean;
}

export function TabContent({
  activeTab,
  formData,
  showNewFieldForm,
  onShowNewFieldForm,
  onHideNewFieldForm,
  onAddField,
  onDeleteField,
  onFieldsReorder,
  isDragOver
}: TabContentProps) {
  const renderFieldsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Layers3 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Campos del Contenido</h3>
            <p className="text-sm text-gray-600">Define qué información podrán agregar los usuarios</p>
          </div>
        </div>
        <div>
          <Button
            onClick={onShowNewFieldForm}
            disabled={showNewFieldForm}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Campo
          </Button>
        </div>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-all duration-300 ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50/50 shadow-md' 
            : 'border-gray-200 bg-gray-50/30'
        }`}>
        {formData?.fields?.length > 0 ? (
          <div className="space-y-3">
            {formData.fields.map((field: any, index: number) => (
              <SortableFieldCard
                key={field.id}
                field={field}
                index={index}
                onDelete={onDeleteField}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Layers3 className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay campos definidos
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Comienza añadiendo campos para definir la estructura de tu contenido
            </p>
            <Button
              onClick={onShowNewFieldForm}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 text-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Añadir Primer Campo
            </Button>
          </div>
        )}

        {showNewFieldForm && (
          <div className="mt-4">
            <NewFieldForm onAdd={onAddField} onCancel={onHideNewFieldForm} />
          </div>
        )}
      </div>
    </div>
  );

  const renderInfoTab = () => (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Info className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Información del Tipo de Contenido</h3>
          <p className="text-sm text-gray-600">Detalles y configuración general</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Tipo
              </label>
              <div className="bg-gray-50 rounded-lg p-3 border">
                <p className="text-base font-medium text-gray-900">
                  {formData?.name || 'Sin nombre'}
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Identificador API
              </label>
              <div className="bg-gray-50 rounded-lg p-3 border">
                <p className="text-base font-medium text-gray-900 font-mono">
                  {formData?.apiIdentifier || 'sin_identificador'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción
              </label>
              <div className="bg-gray-50 rounded-lg p-3 border min-h-[80px]">
                <p className="text-gray-900 text-sm">
                  {formData?.description || 'Sin descripción'}
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Total de Campos
              </label>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xl font-bold text-blue-600">
                  {formData?.fields?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreviewTab = () => (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <Eye className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Vista Previa del Formulario</h3>
          <p className="text-sm text-gray-600">Así se verá para los usuarios finales</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="space-y-6">
          <div className="text-center border-b border-gray-100 pb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Crear {formData?.name || 'Contenido'}
            </h2>
            <p className="text-sm text-gray-600">
              {formData?.description || 'Formulario de creación de contenido'}
            </p>
          </div>
          
          {formData?.fields?.length > 0 ? (
            <div className="space-y-4">
              {formData.fields.map((field: any, index: number) => (
                <div key={field.id} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {field.label}
                    {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.type === 'TEXT' && (
                    <input 
                      type="text" 
                      placeholder={`Ingresa ${field.label.toLowerCase()}`}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                      disabled
                    />
                  )}
                  
                  {field.type === 'RICH_TEXT' && (
                    <div className="w-full min-h-[100px] p-3 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
                      Editor de texto enriquecido
                    </div>
                  )}
                  
                  {field.type === 'NUMBER' && (
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                      disabled
                    />
                  )}
                  
                  {field.type === 'BOOLEAN' && (
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" disabled />
                      <span className="text-sm text-gray-600">Sí / No</span>
                    </div>
                  )}
                  
                  {field.type === 'DATE' && (
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                      disabled
                    />
                  )}
                  
                  {field.type === 'MEDIA' && (
                    <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                      Arrastra archivos aquí o haz clic para seleccionar
                    </div>
                  )}
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-100">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 text-sm" disabled>
                  Guardar Contenido
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                <Settings2 className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                No hay campos para mostrar
              </h3>
              <p className="text-sm text-gray-500">
                Añade campos en la pestaña "Campos" para ver la vista previa
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Settings2 className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Configuración Avanzada</h3>
          <p className="text-sm text-gray-600">Opciones y permisos del tipo de contenido</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="text-center py-8">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
            <Settings2 className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Configuración Próximamente
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Aquí podrás configurar permisos, validaciones avanzadas y otras opciones
          </p>
        </div>
      </div>
    </div>
  );

  switch (activeTab) {
    case 'fields':
      return renderFieldsTab();
    case 'info':
      return renderInfoTab();
    case 'preview':
      return renderPreviewTab();
    case 'settings':
      return renderSettingsTab();
    default:
      return renderFieldsTab();
  }
}
