import React from 'react';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { PlanFormValues } from '@/schemas/plan';

interface AutoFillSeasonalPricesButtonProps {
  form: UseFormReturn<PlanFormValues>;
}

export function AutoFillSeasonalPricesButton({
  form
}: AutoFillSeasonalPricesButtonProps) {
  const { setValue } = form;

  const handleAutoFill = () => {
    // Check if 3 seasons already exist
    const currentOptions = form.getValues('priceOptions') || [];
    const existingSeasons = currentOptions.filter((option) => option && typeof option === 'object' && 'mode' in option && option.mode === 'seasonal');

    if (existingSeasons.length >= 3) {
      // Already present; do nothing
      return;
    }

    // Clear all existing options
    setValue('priceOptions', [], { shouldDirty: true, shouldValidate: true });

    // Default accommodations
    const accommodations = [
      'SINGLE',
      'DOUBLE',
      'TRIPLE',
      'QUADRUPLE',
      'QUINTUPLE',
      'CHILD 3 TO 10 YEARS',
      'INFANT 0 TO 2 YEARS'
    ];

    // Create 3 seasons
    const seasons = [
      'LOW SEASON',
      'MID SEASON',
      'HIGH SEASON'
    ];

    const newSeasons = seasons.map((seasonTitle) => {
      const seasonAccommodations = accommodations.map((accommodation) => ({
        id: Math.random().toString(36).substring(2, 9),
        accommodation,
        price: '1.000.000', // Default price with dot thousand separators
        currency: 'COP'
      }));

      return {
        id: Math.random().toString(36).substring(2, 9),
        mode: 'seasonal' as const,
        label: seasonTitle,
        price: '',
        seasonTitle,
        seasonAccommodations,
        currency: 'COP'
      };
    });

    // Set new seasons
    setValue('priceOptions', newSeasons, { shouldDirty: true, shouldValidate: true });
  };

  // Check if 3 seasons already exist for the label
  const currentOptions = form.getValues('priceOptions') || [];
  const existingSeasons = currentOptions.filter((option) => option && typeof option === 'object' && 'mode' in option && option.mode === 'seasonal');
  const hasAllSeasons = existingSeasons.length >= 3;

  return (
    <div className="rounded-2xl p-3 sm:p-4 border theme-border theme-card w-full sm:w-auto">
      <div className="text-center mb-2 sm:mb-3">
        <p className="text-xs sm:text-sm theme-text-secondary font-medium">
          {hasAllSeasons ? 'Recreate seasons?' : 'Need help getting started?'}
        </p>
        <p className="text-xs theme-text-secondary hidden sm:block">
          {hasAllSeasons
            ? 'This will replace existing seasons'
            : 'Creates 3 seasons with standard accommodations'
          }
        </p>
      </div>
      <Button
        type="button"
        onClick={handleAutoFill}
        className="theme-accent-bg hover:theme-accent-hover text-white font-semibold px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl shadow-ios transition-all duration-200 flex items-center gap-2 sm:gap-3 text-sm sm:text-base w-full sm:w-auto justify-center"
      >
        <Wand2 className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline">
          {hasAllSeasons ? 'Recreate seasons' : 'Create seasons with accommodations'}
        </span>
        <span className="sm:hidden">Auto-fill</span>
      </Button>
    </div>
  );
}
