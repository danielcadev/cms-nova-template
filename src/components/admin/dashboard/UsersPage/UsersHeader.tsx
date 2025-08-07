'use client';

import { Users, Filter, UserPlus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UsersHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function UsersHeader({ searchTerm, onSearchChange }: UsersHeaderProps) {
  return (
    <div className="px-ios-2xl pt-ios-2xl pb-ios-xl">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-ios-xl">
          <div className="flex items-center gap-ios">
            <div className="w-12 h-12 bg-gradient-to-br from-ios-primary to-ios-secondary rounded-ios-xl flex items-center justify-center shadow-ios">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="ios-title-3 font-sf-display text-black">Gestión de Usuarios</h1>
              <p className="ios-caption font-sf-text text-ios-gray-6">Administra usuarios y permisos</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="ios-callout font-sf-text text-ios-primary">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button className="ios-button-primary rounded-ios-lg px-ios-lg py-ios ios-callout font-sf-text">
              <UserPlus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-ios-xl">
          <div className="absolute inset-y-0 left-0 flex items-center pl-ios pointer-events-none">
            <Search className="h-5 w-5 text-ios-gray-5" />
          </div>
          <Input
            type="search"
            placeholder="Buscar usuarios por nombre o email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-ios py-4 ios-glass border-white/20 text-black ios-body rounded-ios-xl focus:ring-2 focus:ring-ios-primary/50 focus:ios-glass-secondary transition-all duration-300 placeholder:text-ios-gray-5 w-full shadow-ios font-sf-text bg-white/50"
          />
        </div>
      </div>
    </div>
  );
}