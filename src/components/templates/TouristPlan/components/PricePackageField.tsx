import { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Users, DollarSign } from 'lucide-react';
import { PricePackage, CURRENCY_OPTIONS } from '@/schemas/plan';

interface PricePackageFieldProps {
  package: PricePackage;
  onChange: (updatedPackage: PricePackage) => void;
  onRemove: () => void;
  isRemovable?: boolean;
}

export default memo(function PricePackageField({ 
  package: pkg, 
  onChange, 
  onRemove, 
  isRemovable = true 
}: PricePackageFieldProps) {
  
  const handlePersonsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const numPersons = parseInt(e.target.value) || 1;
    onChange({ ...pkg, numPersons });
  }, [pkg, onChange]);

  const handleCurrencyChange = useCallback((currency: string) => {
    if (currency === 'COP' || currency === 'USD' || currency === 'EUR') {
      onChange({ ...pkg, currency });
    }
  }, [pkg, onChange]);

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const perPersonPrice = value ? parseFloat(value) : null;
    onChange({ ...pkg, perPersonPrice });
  }, [pkg, onChange]);

  const currencySymbol = CURRENCY_OPTIONS.find((opt) => opt.value === pkg.currency)?.symbol || '$';

  return (
    <Card className="border-slate-200">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Personas
            </label>
            <Input
              type="number"
              value={pkg.numPersons}
              onChange={handlePersonsChange}
              min={1}
              max={20}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Moneda
            </label>
            <Select value={pkg.currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger>
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Precio por persona ({currencySymbol})
            </label>
            <Input
              type="number"
              value={pkg.perPersonPrice || ''}
              onChange={handlePriceChange}
              placeholder="0"
              min={0}
              step="0.01"
            />
          </div>

          {isRemovable && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
