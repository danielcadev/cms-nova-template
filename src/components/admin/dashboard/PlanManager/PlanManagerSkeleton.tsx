'use client';

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Package } from 'lucide-react';

const skeletonVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Componente simple para una fila del skeleton
function SkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-5 w-[250px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-[150px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-7 w-[120px] rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-11 rounded-full" />
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Skeleton className="h-9 w-[100px] rounded-lg" />
          <Skeleton className="h-9 w-[100px] rounded-lg" />
        </div>
      </TableCell>
    </TableRow>
  );
}

export function PlanManagerSkeleton() {
  return (
    <div className="container mx-auto py-10 space-y-8 relative">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-gray-300" />
            <Skeleton className="h-10 w-[250px]" />
          </div>
          <Skeleton className="h-6 w-[350px]" />
        </div>
        <Skeleton className="h-11 w-[180px] rounded-lg" />
      </div>

      {/* Table Section */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="font-semibold">Título</TableHead>
              <TableHead className="font-semibold">Destino</TableHead>
              <TableHead className="font-semibold">Categoría</TableHead>
              <TableHead className="font-semibold">Publicado</TableHead>
              <TableHead className="text-right font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonRow key={`skeleton-row-${index}`} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
