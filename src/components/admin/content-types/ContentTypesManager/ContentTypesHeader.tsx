'use client';

import { 
  Database, 
  Plus,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppleSearchBar } from '../../shared/AppleSearchBar';

interface ContentTypesHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onRefresh: () => void;
  totalCount: number;
}

export function ContentTypesHeader({
  searchTerm,
  onSearchChange,
  onRefresh,
  totalCount
}: ContentTypesHeaderProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 mb-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="flex-1">
          <AppleSearchBar
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Buscar tipos de contenido..."
            className="w-full"
          />
        </div>
        
        <div className="flex gap-4 items-center">
          <Button 
            variant="outline" 
            onClick={onRefresh}
            className="rounded-2xl border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-gray-50"
          >
            <Settings className="h-4 w-4 mr-2" />
            Actualizar
          </Button>

          <Link href="/admin/dashboard/content-types/create">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl px-6 py-2 flex items-center gap-2 shadow-lg">
              <Plus className="h-4 w-4" />
              Nuevo Tipo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
