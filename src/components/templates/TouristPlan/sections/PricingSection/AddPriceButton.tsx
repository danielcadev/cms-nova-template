'use client'

import { DollarSign, Info, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AddPriceButtonProps {
  onAdd: () => void
  hasGeneralPrice: boolean
  buttonText?: string
}

export function AddPriceButton({ onAdd, hasGeneralPrice, buttonText }: AddPriceButtonProps) {
  // If there is a general price, do not show the add button
  if (hasGeneralPrice) {
    return null
  }

  return (
    <div className="border-2 border-dashed theme-border rounded-2xl p-4 sm:p-8 text-center transition-all duration-200">
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 theme-accent-bg rounded-xl flex items-center justify-center">
          <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <div className="space-y-1 sm:space-y-2">
          <h3 className="text-base sm:text-lg font-semibold theme-text">
            {hasGeneralPrice ? 'Need specific prices?' : 'Need another price option?'}
          </h3>
          <p className="text-xs sm:text-sm theme-text-secondary max-w-md">
            {hasGeneralPrice
              ? 'Add specific prices for different group types or services'
              : 'Add different price options for different group sizes or service types'}
          </p>
          {hasGeneralPrice && (
            <div className="flex items-center gap-2 text-xs theme-accent bg-[var(--theme-accent-light)] px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg max-w-md">
              <Info className="h-3 w-3" />
              <span>New prices will be automatically "Specific"</span>
            </div>
          )}
        </div>
        <Button
          type="button"
          onClick={onAdd}
          className="theme-accent-bg hover:theme-accent-hover text-white shadow-ios transition-all rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">
            {buttonText || (hasGeneralPrice ? 'Add Specific Price' : 'Add New Option')}
          </span>
          <span className="sm:hidden">
            {buttonText ? 'Add' : hasGeneralPrice ? 'Add Specific' : 'Add Option'}
          </span>
        </Button>
      </div>
    </div>
  )
}
