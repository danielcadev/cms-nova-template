'use client';

/**
 * NOVA CMS - APPLE-STYLE SEARCH BAR COMPONENT
 * ==========================================
 * 
 * Barra de búsqueda estilo macOS/iOS reutilizable con:
 * - Diseño glassmorphic
 * - Shortcuts de teclado (⌘K)
 * - Animaciones suaves
 * - Iconografía estilo Apple
 */

import { useState, useEffect, useRef } from 'react';
import { Search, Command, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AppleSearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  showShortcut?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'solid';
}

export function AppleSearchBar({
  placeholder = "Buscar...",
  value = "",
  onChange,
  className = "",
  showShortcut = true,
  size = 'md',
  variant = 'glass'
}: AppleSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Manejo de atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && isFocused) {
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFocused]);

  // Sincronizar valor externo
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    setInternalValue("");
    onChange?.("");
    inputRef.current?.focus();
  };

  // Estilos dinámicos basados en props
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const variantClasses = {
    default: 'bg-white border-gray-200 hover:border-gray-300 focus-within:border-blue-400',
    glass: 'bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white/95 focus-within:bg-white focus-within:border-blue-300 shadow-lg hover:shadow-xl',
    solid: 'bg-gray-50 border-gray-300 hover:bg-gray-100 focus-within:bg-white focus-within:border-blue-400'
  };

  return (
    <div
      className={cn(
        "relative group transition-all duration-300 ease-out",
        "hover:scale-[1.01] focus-within:scale-[1.02]",
        className
      )}
    >
      <div
        className={cn(
          "relative flex items-center gap-3 rounded-2xl border transition-all duration-300",
          sizeClasses[size], 
          variantClasses[variant],
          isFocused && "ring-4 ring-blue-100"
        )}
      >
        {/* Icono de búsqueda */}
        <div
          className={cn(
            "transition-all duration-200",
            iconSizes[size],
            isFocused ? "text-blue-500 scale-110" : "text-gray-400"
          )}
        >
          <Search className={iconSizes[size]} />
        </div>

        {/* Input principal */}
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={internalValue}
          onChange={(e) => handleValueChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
        />

        {/* Área de acciones (shortcut/clear) */}
        <div className="flex items-center gap-2">
          {/* Botón de limpiar (aparece cuando hay texto) */}
          {internalValue && (
            <button
              onClick={handleClear}
              className={cn(
                "p-1 rounded-full transition-all duration-200 ease-out",
                "hover:bg-gray-100 text-gray-400 hover:text-gray-600",
                "hover:scale-110 active:scale-90",
                "animate-in fade-in zoom-in duration-200"
              )}
              type="button"
            >
              <X className={iconSizes[size]} />
            </button>
          )}

          {/* Shortcut indicator */}
          {showShortcut && !internalValue && (
            <div
              className={cn(
                "hidden sm:flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg",
                "transition-all duration-200",
                isFocused ? "opacity-0 scale-80" : "opacity-100 scale-100"
              )}
            >
              <Command className="h-3 w-3 text-gray-500" />
              <span className="text-xs font-medium text-gray-500">K</span>
            </div>
          )}
        </div>
      </div>

      {/* Indicador de focus sutil */}
      <div
        className={cn(
          "absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl blur-sm -z-10",
          "transition-all duration-300",
          isFocused ? "opacity-20 scale-100" : "opacity-0 scale-80"
        )}
      />
    </div>
  );
}
