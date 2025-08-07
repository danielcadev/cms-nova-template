// src/components/admin/plans/PlanManager/components/SearchBar.tsx
'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        type="text"
        placeholder="Buscar planes por título, destino o categoría..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-10 py-6 rounded-xl border-gray-200 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
      />
    </div>
  );
}
