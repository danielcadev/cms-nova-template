'use client';

import { Sparkles } from 'lucide-react';

interface DropPlaceholderProps {
  isOver: boolean;
}

export function DropPlaceholder({ isOver }: DropPlaceholderProps) {
  return (
    <div
      className={`h-16 my-3 flex items-center justify-center border-2 border-dashed rounded-2xl transition-all duration-200 ${
        isOver ? 'bg-purple-50 border-purple-400' : 'bg-gray-50/50 border-gray-200'
      }`}>
      {isOver && (
        <div className="flex items-center gap-2 text-purple-600">
          <Sparkles className="h-5 w-5" />
          <p className="font-semibold">Suelta aquí para añadir campo</p>
        </div>
      )}
    </div>
  );
}
