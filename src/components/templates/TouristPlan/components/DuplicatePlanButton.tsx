'use client';

import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface DuplicatePlanButtonProps {
  planId: string;
  planTitle?: string;
  onDuplicate: (id: string) => Promise<any>;
  disabled?: boolean;
}

export function DuplicatePlanButton({ planId, onDuplicate, disabled }: DuplicatePlanButtonProps) {
  const handleDuplicate = async () => {
    await onDuplicate(planId);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDuplicate}
      disabled={disabled}
      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
}

export default DuplicatePlanButton;
