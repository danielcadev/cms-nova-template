'use client'

import { Check, ChevronsUpDown, PlusCircle, Trash2, X } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface ComboboxOption {
  label: string
  value: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange: (value: string) => void
  onCreate?: (inputValue: string) => void
  onDeleteOption?: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  clearable?: boolean
}

export function Combobox({
  options,
  value,
  onChange,
  onCreate,
  onDeleteOption,
  placeholder,
  emptyMessage,
  clearable = true,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

  const handleSelect = (currentValue: string) => {
    onChange(currentValue === value ? '' : currentValue)
    setOpen(false)
  }

  const handleCreate = () => {
    if (onCreate && inputValue) {
      onCreate(inputValue)
      setInputValue('')
      setOpen(false)
    }
  }

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase()),
  )

  const showCreateOption =
    onCreate &&
    inputValue &&
    !filteredOptions.some((option) => option.label.toLowerCase() === inputValue.toLowerCase())

  const selectedOption = options.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between h-11 pl-3 pr-8 bg-white border border-gray-200 hover:bg-gray-50 focus:bg-white focus:border-gray-400 transition-colors duration-150 rounded-lg',
              'text-left font-normal',
              !selectedOption && 'text-gray-500',
            )}
          >
            <span className="truncate">
              {selectedOption?.label || placeholder || 'Select an option...'}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
          {clearable && value ? (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 text-gray-500"
              onClick={(e) => {
                e.stopPropagation()
                onChange('')
              }}
              aria-label="Clear"
              title="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 bg-white border border-gray-200 rounded-lg shadow-md"
        align="start"
      >
        <Command className="rounded-lg">
          <CommandInput
            placeholder="Search or create..."
            value={inputValue}
            onValueChange={setInputValue}
            className="h-11 px-3 text-sm border-0 focus:ring-0"
          />
          <CommandList className="max-h-64">
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-gray-50',
                    value === option.value && 'bg-gray-100 text-gray-900',
                  )}
                >
                  <div className="flex items-center min-w-0">
                    <Check
                      className={cn(
                        'mr-3 h-4 w-4 text-gray-600',
                        value === option.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <span className="font-medium truncate">{option.label}</span>
                  </div>
                  {onDeleteOption ? (
                    <button
                      type="button"
                      className="ml-2 p-1 rounded hover:bg-gray-100 text-gray-500"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteOption(option.value)
                      }}
                      aria-label={`Delete ${option.label}`}
                      title={`Delete ${option.label}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </CommandItem>
              ))}
              {showCreateOption && (
                <CommandItem
                  onSelect={handleCreate}
                  className="flex items-center px-3 py-2 text-sm cursor-pointer text-gray-700 bg-gray-50 hover:bg-gray-100 border-t"
                >
                  <PlusCircle className="mr-3 h-4 w-4" />
                  <span className="font-medium">Create "{inputValue}"</span>
                </CommandItem>
              )}
            </CommandGroup>
            {filteredOptions.length === 0 && !showCreateOption && (
              <CommandEmpty className="py-8 text-center text-gray-500">
                {emptyMessage || 'No results.'}
              </CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
