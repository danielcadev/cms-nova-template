'use client';

import { useDraggable } from '@dnd-kit/core';

interface FieldType {
  type: string;
  label: string;
  icon: JSX.Element;
  description: string;
  color: string;
}

interface PaletteItemProps {
  fieldType: FieldType;
}

export function PaletteItem({ fieldType }: PaletteItemProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({ 
    id: `palette-${fieldType.type}` 
  });
  
  return (
    <button 
      ref={setNodeRef} 
      {...listeners} 
      {...attributes} 
      type="button"
      className="flex items-center gap-4 p-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 hover:shadow-lg transition-all cursor-grab w-full group">
      <div className={`w-12 h-12 bg-gradient-to-br ${fieldType.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <span className="text-white">{fieldType.icon}</span>
      </div>
      <div className="text-left flex-1">
        <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
          {fieldType.label}
        </h4>
        <p className="text-sm text-gray-500 leading-relaxed">
          {fieldType.description}
        </p>
      </div>
    </button>
  );
}
