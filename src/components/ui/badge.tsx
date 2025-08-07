import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-ios border px-2 py-1 ios-caption font-sf-text font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ios-primary/50",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-ios-primary text-white shadow-ios hover:bg-ios-primary/90",
        secondary:
          "border-transparent bg-ios-gray-2 text-ios-gray-6 hover:bg-ios-gray-3",
        destructive:
          "border-transparent bg-ios-danger text-white shadow-ios hover:bg-ios-danger/90",
        outline: "text-ios-gray-6 border-ios-gray-3 hover:bg-ios-gray-2",
        success:
          "border-transparent bg-ios-success text-white shadow-ios hover:bg-ios-success/90",
        warning:
          "border-transparent bg-ios-warning text-white shadow-ios hover:bg-ios-warning/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
