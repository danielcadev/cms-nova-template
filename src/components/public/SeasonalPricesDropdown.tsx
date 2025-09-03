'use client'

import { useMemo, useState } from 'react'

type Accommodation = {
  id: string
  accommodation: string
  price?: string
  currency: 'COP' | 'USD' | 'EUR'
}

export type SeasonalOption = {
  id: string
  seasonTitle: string
  seasonAccommodations: Accommodation[]
  currency: 'COP' | 'USD' | 'EUR'
}

interface SeasonalPricesDropdownProps {
  options: SeasonalOption[]
  preselectedId?: string
}

function currencySymbol(c?: string) {
  return c === 'USD' ? 'US$' : c === 'EUR' ? '€' : '$'
}

export default function SeasonalPricesDropdown({
  options,
  preselectedId,
}: SeasonalPricesDropdownProps) {
  const validOptions = useMemo(
    () => (Array.isArray(options) ? options.filter(Boolean) : []),
    [options],
  )
  const defaultId = useMemo(() => {
    if (!validOptions.length) return undefined
    const found = preselectedId && validOptions.find((o) => o.id === preselectedId)
    return found?.id || validOptions[0].id
  }, [validOptions, preselectedId])

  const [selectedId, setSelectedId] = useState<string | undefined>(defaultId)

  const selectId = useId()

  const selected = useMemo(
    () => validOptions.find((o) => o.id === selectedId) || validOptions[0],
    [validOptions, selectedId],
  )
  const sym = currencySymbol(selected?.currency)

  if (!validOptions.length) return null

  return (
    <div className="space-y-4">
      {/* Selector */}
      <div className="flex items-center gap-3">
        <label htmlFor={selectId} className="text-sm text-gray-700 dark:text-gray-300">
          Temporada
        </label>
        <select
          id={selectId}
          className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
          value={selected?.id}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {validOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.seasonTitle}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de alojamientos y precios */}
      <div className="mt-2 space-y-2">
        {!selected?.seasonAccommodations || selected.seasonAccommodations.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">No hay alojamientos definidos.</p>
        ) : (
          selected.seasonAccommodations.map((row) => (
            <div key={row.id} className="flex items-center justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">{row.accommodation}</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {sym} {row.price || ''}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
