'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeletePlanButtonProps {
  planId: string;
  planTitle?: string;
  onDelete: (id: string) => Promise<void>;
  disabled?: boolean;
}

export function DeletePlanButton({ planId, onDelete, disabled }: DeletePlanButtonProps) {
  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este plan?')) {
      await onDelete(planId);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={disabled}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
