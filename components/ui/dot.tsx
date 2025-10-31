"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const dotVariants = cva(
  "block rounded-full shrink-0",
  {
    variants: {
      size: {
        sm: "w-1.5 h-1.5",
        md: "w-2 h-2",
        lg: "w-3 h-3",
      },
      color: {
        gray: "bg-gray-400",
        red: "bg-red-500",
        green: "bg-green-500",
      }
    },
    defaultVariants: { size: "sm", color: "gray" }
  }
)

const Dot = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof dotVariants>
>(({ className, size, color, ...props }, ref) => (
  <span ref={ref} className={cn(dotVariants({ size, color }), className)} {...props} />
))
Dot.displayName = "Dot"

export { Dot }
