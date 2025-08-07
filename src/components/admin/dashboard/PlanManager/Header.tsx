// src/components/admin/plans/PlanManager/Header.tsx
'use client';


import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchBar } from './SearchBar';
import { itemVariants } from './animations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HeaderProps {
  onSearch: (term: string) => void;
  onFilterChange?: (filter: string) => void;
}

export function Header({ onSearch, onFilterChange }: HeaderProps) {
  return (
    <div
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Planes Turísticos
          </h1>
          <p className="text-gray-500 mt-1">
            Gestiona tus planes turísticos
          </p>
        </div>
        <Link href="/admin/dashboard/plans/create">
          <Button 
            className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Crear Plan
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="w-full md:w-2/3">
          <SearchBar onSearch={onSearch} />
        </div>
        
        <div className="w-full md:w-1/3">
          <Select onValueChange={onFilterChange}>
            <SelectTrigger className="w-full rounded-xl border-gray-200">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los planes</SelectItem>
              <SelectItem value="published">Publicados</SelectItem>
              <SelectItem value="draft">Borradores</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
