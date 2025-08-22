'use client'

import { DollarSign, PlusCircle, Users } from 'lucide-react'
import { memo, useCallback, useId, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { CURRENCY_OPTIONS, type PlanFormValues, type PricePackage } from '@/schemas/plan'
import PricePackageField from '../components/PricePackageField'
import usePricingState from '../components/usePricingState'

export const PricingSection = memo(function PricingSection() {
  const { toast } = useToast()
  const form = useFormContext<PlanFormValues>()
  const [newPersons, setNewPersons] = useState<number>(2)
  const [newCurrency, setNewCurrency] = useState<'COP' | 'USD' | 'EUR'>('COP')
  const numPersonsId = useId()

  const { addPricePackage, updatePricePackage, removePricePackage, pricePackages } =
    usePricingState({ form })

  const handleAddPriceOption = useCallback(() => {
    if (newCurrency === 'USD' && newPersons < 2) {
      toast({
        title: 'Minimum 2 people',
        description: 'For plans in dollars, the minimum number of people is 2.',
        variant: 'destructive',
      })
      return
    }
    if (newPersons <= 0) {
      toast({
        title: 'Invalid number',
        description: 'The number of people must be greater than zero.',
        variant: 'destructive',
      })
      return
    }
    if (
      pricePackages.some((pkg) => pkg.numPersons === newPersons && pkg.currency === newCurrency)
    ) {
      toast({
        title: 'Duplicate option',
        description: `A price option for ${newPersons} people in ${newCurrency} already exists.`,
        variant: 'destructive',
      })
      return
    }
    if (addPricePackage(newPersons, newCurrency)) {
      setNewPersons((prev) => Math.min(prev + 1, 20))
    }
  }, [addPricePackage, newPersons, newCurrency, pricePackages, toast])

  const handleUpdatePackage = useCallback(
    (updatedPackage: PricePackage) => {
      const { id, ...updates } = updatedPackage
      updatePricePackage(id, updates)
    },
    [updatePricePackage],
  )

  const handleRemovePackage = useCallback(
    (id: string) => removePricePackage(id),
    [removePricePackage],
  )
  const handlePersonsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setNewPersons(parseInt(e.target.value, 10) || 1),
    [],
  )
  const handleCurrencyChange = useCallback(
    (value: string) => {
      if (value === 'COP' || value === 'USD' || value === 'EUR') {
        setNewCurrency(value)
        if (value === 'USD' && newPersons < 2) setNewPersons(2)
      }
    },
    [newPersons],
  )

  const sortedPackages = [...pricePackages].sort((a, b) =>
    a.currency === 'USD' ? -1 : a.numPersons - b.numPersons,
  )

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold theme-text mb-3">
          Pricing Options
        </h3>
        <p className="text-sm theme-text-secondary max-w-2xl mx-auto leading-relaxed">
          Define different prices based on the number of people. You can create options in different currencies to attract more customers.
        </p>
      </div>

      <div className="space-y-6">
        {sortedPackages.length > 0 ? (
          sortedPackages.map((pkg) => (
            <PricePackageField
              key={pkg.id}
              package={pkg}
              onChange={handleUpdatePackage}
              onRemove={() => handleRemovePackage(pkg.id)}
              isRemovable={true}
            />
          ))
        ) : (
          <div className="text-center py-16 px-8 theme-card rounded-xl theme-border">
            <div className="w-20 h-20 theme-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="h-10 w-10 theme-text-secondary" />
            </div>
            <h4 className="text-xl font-semibold theme-text mb-3">
              No pricing options yet
            </h4>
            <p className="theme-text-secondary max-w-md mx-auto">
              Use the form below to start adding different pricing options based on the number of people.
            </p>
          </div>
        )}
      </div>

      <div className="theme-card rounded-xl p-8 theme-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 theme-accent rounded-xl flex items-center justify-center">
            <PlusCircle className="h-5 w-5 text-white" />
          </div>
          <h4 className="text-xl font-semibold theme-text">Add new pricing option</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-3">
            <label
              htmlFor={numPersonsId}
              className="text-sm font-semibold theme-text flex items-center gap-2"
            >
              <Users className="h-4 w-4 theme-text-secondary" />
              Number of people
            </label>
            <Input
              id={numPersonsId}
              type="number"
              value={newPersons}
              onChange={handlePersonsChange}
              min={1}
              className="text-lg py-3"
            />
          </div>
          
          <div className="space-y-3">
            <label
              htmlFor="currency"
              className="text-sm font-semibold theme-text flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4 theme-text-secondary" />
              Currency
            </label>
            <Select value={newCurrency} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="text-lg py-3">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={handleAddPriceOption}
            className="theme-accent hover:theme-accent-hover text-white py-3 px-6 text-base font-medium rounded-lg"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Option
          </Button>
        </div>
      </div>
    </div>
  )
})
