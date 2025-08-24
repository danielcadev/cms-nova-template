import { DollarSign, Trash2, Users } from 'lucide-react'
import { memo, useCallback, useId } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CURRENCY_OPTIONS, type PricePackage } from '@/schemas/plan'

interface PricePackageFieldProps {
  package: PricePackage
  onChange: (updatedPackage: PricePackage) => void
  onRemove: () => void
  isRemovable?: boolean
}

export default memo(function PricePackageField({
  package: pkg,
  onChange,
  onRemove,
  isRemovable = true,
}: PricePackageFieldProps) {
  const personsId = useId()
  const priceId = useId()
  const handlePersonsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const numPersons = parseInt(e.target.value, 10) || 1
      onChange({ ...pkg, numPersons })
    },
    [pkg, onChange],
  )

  const handleCurrencyChange = useCallback(
    (currency: string) => {
      if (currency === 'COP' || currency === 'USD' || currency === 'EUR') {
        onChange({ ...pkg, currency })
      }
    },
    [pkg, onChange],
  )

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      const perPersonPrice = value ? parseFloat(value) : null
      onChange({ ...pkg, perPersonPrice })
    },
    [pkg, onChange],
  )

  const currencySymbol = CURRENCY_OPTIONS.find((opt) => opt.value === pkg.currency)?.symbol || '$'

  return (
    <div className="theme-card rounded-xl p-6 theme-border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        <div className="space-y-3">
          <label
            htmlFor={personsId}
            className="text-sm font-semibold theme-text flex items-center gap-2"
          >
            <Users className="h-4 w-4 theme-text-secondary" />
            People
          </label>
          <Input
            id={personsId}
            type="number"
            value={pkg.numPersons}
            onChange={handlePersonsChange}
            min={1}
            max={20}
            className="text-lg py-3 text-center font-semibold"
          />
        </div>

        <div className="space-y-3">
          <span className="text-sm font-semibold theme-text flex items-center gap-2">
            <DollarSign className="h-4 w-4 theme-text-secondary" />
            Currency
          </span>
          <Select value={pkg.currency} onValueChange={handleCurrencyChange}>
            <SelectTrigger className="text-lg py-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label htmlFor={priceId} className="text-sm font-semibold theme-text">
            Price per person ({currencySymbol})
          </label>
          <Input
            id={priceId}
            type="number"
            value={pkg.perPersonPrice || ''}
            onChange={handlePriceChange}
            placeholder="0"
            min={0}
            step="0.01"
            className="text-lg py-3 font-semibold"
          />
        </div>

        {isRemovable && (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg p-3"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {pkg.perPersonPrice && (
        <div className="mt-4 pt-4 theme-border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm theme-text-secondary">
              Total for {pkg.numPersons} person{pkg.numPersons > 1 ? 's' : ''}:
            </span>
            <span className="text-xl font-bold theme-accent">
              {currencySymbol}
              {(pkg.perPersonPrice * pkg.numPersons).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
})
