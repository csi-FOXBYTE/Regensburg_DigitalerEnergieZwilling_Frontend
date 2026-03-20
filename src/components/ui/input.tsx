import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  leftIcon?: React.ReactNode
}

function Input({ className, type, leftIcon, ...props }: InputProps) {
  return (
    <div className="relative w-full">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {leftIcon}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          // layout & sizing
          "w-full min-w-0 rounded-lg px-3 py-2",
          // left icon padding
          leftIcon && "pl-11",
          // colors & border
          "border border-input-border bg-input",
          // typography
          "text-(length:--text-body) leading-(--leading-body)",
          // misc
          "transition-colors outline-none",
          // placeholder
          "placeholder:text-muted-foreground",
          // focus
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          // disabled
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
          // invalid
          "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Input }
