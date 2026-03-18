import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      h1: "text-[var(--text-h1-mobile)] leading-[var(--leading-h1-mobile)] md:text-[var(--text-h1)] md:leading-[var(--leading-h1)] font-bold",
      h2: "text-[var(--text-h2-mobile)] leading-[var(--leading-h2-mobile)] md:text-[var(--text-h2)] md:leading-[var(--leading-h2)] font-bold",
      h3: "text-[var(--text-h3-mobile)] leading-[var(--leading-h3-mobile)] md:text-[var(--text-h3)] md:leading-[var(--leading-h3)] font-normal",
      h4: "text-[var(--text-h4)] leading-[var(--leading-h4)] font-bold",
      lead: "text-[var(--text-lead)] leading-[var(--leading-lead)] font-normal",
      body: "text-[var(--text-body)] leading-[var(--leading-body)] font-normal",
      small: "text-[var(--text-body-sm)] leading-[var(--leading-body-sm)] font-normal",
    },
  },
  defaultVariants: {
    variant: "body",
  },
})

type TypographyProps<T extends React.ElementType> = {
  as?: T
  className?: string
} & VariantProps<typeof typographyVariants> &
  Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">

function Typography<T extends React.ElementType = "p">({
  as,
  variant,
  className,
  ...props
}: TypographyProps<T>) {
  const Comp = as || "p"

  return (
    <Comp
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Typography, typographyVariants }