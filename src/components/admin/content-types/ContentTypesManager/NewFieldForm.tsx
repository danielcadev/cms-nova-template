'use client';

import { useState } from 'react';
import { Plus, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FIELD_TYPES } from './constants';

interface NewFieldFormProps {
  onAdd: (field: any) => void;
  onCancel: () => void;
}

export function NewFieldForm({ onAdd, onCancel }: NewFieldFormProps) {
  const [selectedType, setSelectedType] = useState<string>('TEXT');
  const [label, setLabel] = useState('');
  const [isRequired, setIsRequired] = useState(false);

  const handleAdd = () => {
    if (!label.trim()) return;
    
    const apiIdentifier = label
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

    onAdd({
      id: `temp_${Date.now()}`,
      label: label.trim(),
      apiIdentifier,
      type: selectedType,
      isRequired
    });

    setLabel('');
    setSelectedType('TEXT');
    setIsRequired(false);
    onCancel();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mt-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Etiqueta del Campo
          </label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Ej: Título del Post"
            className="w-full rounded-lg border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Campo
          </label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="rounded-lg border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 h-auto py-3">
              <SelectValue asChild>
                <div className="flex items-center gap-3 w-full">
                  {(() => {
                    const selectedTypeData = FIELD_TYPES.find(t => t.value === selectedType);
                    if (!selectedTypeData) return (
                      <div className="flex items-center gap-3 text-gray-500">
                        <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Hash className="h-4 w-4 text-gray-400" />
                        </div>
                        <span className="text-sm">Selecciona un tipo de campo...</span>
                      </div>
                    );
                    const IconComponent = selectedTypeData.icon;
                    return (
                      <>
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedTypeData.color} flex-shrink-0`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm">{selectedTypeData.label}</div>
                          <div className="text-xs text-gray-500">{selectedTypeData.description}</div>
                          <div className="text-xs text-gray-400 mt-1">{selectedTypeData.category}</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-lg border shadow-lg max-w-lg">
              {FIELD_TYPES.map((type) => {
                const IconComponent = type.icon;
                return (
                  <SelectItem key={type.value} value={type.value} className="rounded-lg my-1 p-3">
                    <div className="flex items-start gap-3 w-full">
                      <div className={`p-2.5 rounded-lg bg-gradient-to-br ${type.color} flex-shrink-0`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm">{type.label}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                            {type.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1 leading-relaxed">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <Switch
              checked={isRequired}
              onCheckedChange={setIsRequired}
              className="data-[state=checked]:bg-blue-600"
            />
            <div>
              <label className="text-sm font-medium text-gray-700">
                Campo requerido
              </label>
              <p className="text-xs text-gray-500">
                Los usuarios deben llenar este campo obligatoriamente
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button 
            onClick={handleAdd} 
            disabled={!label.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Añadir Campo
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="rounded-lg border-gray-300 hover:bg-gray-50 px-4 py-2 text-sm"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
