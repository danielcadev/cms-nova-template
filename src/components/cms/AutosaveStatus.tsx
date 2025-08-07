'use client';

import { Check, Loader2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'dirty' | 'saving';

interface AutosaveStatusProps {
  isDirty: boolean;
  isSaving: boolean;
  className?: string;
}

export function AutosaveStatus({ isDirty, isSaving, className }: AutosaveStatusProps) {
  let status: Status = 'idle';
  if (isSaving) {
    status = 'saving';
  } else if (isDirty) {
    status = 'dirty';
  }

  const messages = {
    idle: {
      text: 'Guardado',
      icon: <Check className="h-4 w-4 text-green-600" />,
      className: 'text-green-600',
    },
    dirty: {
      text: 'Cambios pendientes',
      icon: <Edit className="h-4 w-4 text-slate-500" />,
      className: 'text-slate-500',
    },
    saving: {
      text: 'Guardando...',
      icon: <Loader2 className="h-4 w-4 animate-spin text-blue-600" />,
      className: 'text-blue-600',
    },
  };

  const currentStatus = messages[status];

  return (
    <div className={cn("flex items-center gap-2 text-sm font-medium transition-all duration-300", currentStatus.className, className)}>
      {currentStatus.icon}
      <span>{currentStatus.text}</span>
    </div>
  );
} 
