import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

const paperVariants = cva("bg-background text-foreground transition-shadow", {
  variants: {
    variant: {
      elevation: "border-transparent",
      outlined: "border border-border border-neutral-200",
    },
    elevation: {
      0: "shadow-none",
      1: "shadow-sm",
      2: "shadow",
      3: "shadow-md",
      4: "shadow-lg",
      5: "shadow-xl",
    },
    square: {
      true: "rounded-none",
      false: "rounded-lg",
    },
  },
  defaultVariants: {
    variant: "elevation",
    elevation: 1,
    square: false,
  },
})

function Paper({
  className,
  variant,
  elevation,
  square,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof paperVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="paper"
      className={cn(paperVariants({ variant, elevation, square, className }))}
      {...props}
    />
  )
}

export { Paper, paperVariants }
