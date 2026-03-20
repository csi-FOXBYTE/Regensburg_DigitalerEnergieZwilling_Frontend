import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border bg-clip-padding whitespace-nowrap outline-none select-none transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer disabled:cursor-default active:translate-y-px active:scale-[0.985]",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
        secondary:
          "border-primary bg-background text-primary hover:border-primary-hover hover:text-primary-hover focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
        map:
          "border-neutral-200 bg-background text-foreground shadow-lg hover:bg-neutral-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      },
      size: {
        default:
          "min-h-[42px] rounded-none px-5 py-2 text-[16px] leading-[26px] font-normal has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-10 rounded-lg p-2 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  
  const resolvedSize = size ?? (variant === "map" ? "icon" : "default")

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={resolvedSize}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
