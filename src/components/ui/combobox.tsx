"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  label: string;
  value: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  onCreate?: (inputValue: string) => void;
  placeholder?: string;
  emptyMessage?: string;
}

export function Combobox({ options, value, onChange, onCreate, placeholder, emptyMessage }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleSelect = (currentValue: string) => {
    onChange(currentValue === value ? "" : currentValue);
    setOpen(false);
  };

  const handleCreate = () => {
    if (onCreate && inputValue) {
      onCreate(inputValue);
      setInputValue("");
      setOpen(false);
    }
  };

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );
  
  const showCreateOption = onCreate && inputValue && !filteredOptions.some(option => option.label.toLowerCase() === inputValue.toLowerCase());

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-12 px-4 bg-gray-50 border-2 hover:bg-white hover:border-teal-300 focus:bg-white focus:border-teal-500 transition-all duration-200",
            "text-left font-normal",
            !selectedOption && "text-gray-500"
          )}
        >
          <span className="truncate">
            {selectedOption?.label || placeholder || "Selecciona una opción..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 shadow-xl border-2 bg-white" align="start">
        <Command className="rounded-xl">
          <CommandInput 
            placeholder="Buscar o crear destino..."
            value={inputValue}
            onValueChange={setInputValue}
            className="h-12 px-4 text-base border-0 focus:ring-0"
          />
          <CommandList className="max-h-64">
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                  className={cn(
                    "flex items-center px-4 py-3 text-base cursor-pointer transition-colors hover:bg-teal-50",
                    value === option.value && "bg-teal-100 text-teal-900"
                  )}
                >
                  <Check className={cn(
                    "mr-3 h-4 w-4 text-teal-600", 
                    value === option.value ? "opacity-100" : "opacity-0"
                  )} />
                  <span className="font-medium">{option.label}</span>
                </CommandItem>
              ))}
              {showCreateOption && (
                <CommandItem 
                  onSelect={handleCreate} 
                  className="flex items-center px-4 py-3 text-base cursor-pointer text-teal-700 bg-teal-50 hover:bg-teal-100 border-t"
                >
                  <PlusCircle className="mr-3 h-4 w-4" />
                  <span className="font-medium">Crear "{inputValue}"</span>
                </CommandItem>
              )}
            </CommandGroup>
            {filteredOptions.length === 0 && !showCreateOption && (
                <CommandEmpty className="py-8 text-center text-gray-500">
                  {emptyMessage || "No se encontraron opciones."}
                </CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 
