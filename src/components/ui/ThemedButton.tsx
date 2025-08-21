// src/components/ui/ThemedButton.tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from './button'

/**
 * ThemedButton: wrapper sobre Button que aplica tokens del tema
 * Variantes:
 * - solidNeutral: card + texto del tema, borde suave
 * - outline: borde + card + texto
 * - ghost: igual al ghost base
 */
export interface ThemedButtonProps extends ButtonProps {
  variantTone?: 'solidNeutral' | 'outline' | 'ghost'
}

export const ThemedButton = React.forwardRef<HTMLButtonElement, ThemedButtonProps>(
  ({ className, variantTone = 'outline', ...props }, ref) => {
    const toneClass =
      variantTone === 'solidNeutral'
        ? 'theme-card theme-text border theme-border hover:theme-card-hover'
        : variantTone === 'outline'
          ? 'theme-card theme-text border theme-border hover:theme-card-hover'
          : ''

    return (
      <Button
        ref={ref}
        variant={variantTone === 'ghost' ? 'ghost' : 'outline'}
        className={cn(toneClass, className)}
        {...props}
      />
    )
  },
)
ThemedButton.displayName = 'ThemedButton'

export default ThemedButton
