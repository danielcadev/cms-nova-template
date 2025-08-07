// Constants for TouristPlan Template System

export const CURRENCY_OPTIONS = [
  { value: 'COP', label: 'COP (Pesos Colombianos)', symbol: '$' },
  { value: 'USD', label: 'USD (Dólares)', symbol: 'US$' },
  { value: 'EUR', label: 'EUR (Euros)', symbol: '€' }
] as const;

export interface PricePackage {
  id: string;
  numPersons: number;
  currency: 'COP' | 'USD' | 'EUR';
  perPersonPrice: number | null;
}

export const DEFAULT_PRICE_OPTION = {
  id: '',
  numPersons: 1,
  currency: 'COP' as const,
  perPersonPrice: 0
};

export const MAX_PRICE_OPTIONS = 10;
export const MIN_PERSONS = 1;
export const MAX_PERSONS = 100;
