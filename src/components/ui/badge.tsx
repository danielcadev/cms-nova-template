import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900',
        secondary:
          'border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300',
        destructive: 'border-transparent bg-red-600 text-white hover:bg-red-700',
        outline:
          'text-gray-700 border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800',
        success: 'border-transparent bg-emerald-600 text-white hover:bg-emerald-700',
        warning: 'border-transparent bg-amber-500 text-white hover:bg-amber-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
