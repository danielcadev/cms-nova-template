import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-ios-lg ios-callout font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ios-interactive font-sf-text",
  {
    variants: {
      variant: {
        default:
          "ios-button-primary text-white shadow-ios",
        destructive:
          "bg-gradient-to-r from-ios-danger to-red-600 text-white shadow-ios hover:from-red-600 hover:to-red-700",
        outline:
          "ios-button-secondary border border-white/20 shadow-ios hover:ios-glass-secondary hover:border-white/30",
        secondary:
          "ios-glass-secondary border border-white/10 shadow-ios hover:border-white/20",
        ghost: "hover:ios-glass hover:shadow-ios",
        link: "text-ios-primary underline-offset-4 hover:underline hover:text-ios-secondary",
      },
      size: {
        default: "h-10 px-ios py-2",
        sm: "h-8 rounded-ios px-ios text-xs",
        lg: "h-12 rounded-ios-xl px-ios-lg ios-headline",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
