import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
  leftIcon?: React.ReactNode;
  onClear?: () => void;
}

function Input({ className, type, leftIcon, onClear, ...props }: InputProps) {
  const showClear = onClear && props.value;

  return (
    <div className="relative w-full">
      {leftIcon && (
        <div className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
          {leftIcon}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          // layout & sizing
          'w-full min-w-0 rounded-lg px-3 py-2',
          // left icon padding
          leftIcon && 'pl-11',
          // clear button padding
          showClear && 'pr-10',
          // colors & border
          'border-input-border bg-input border',
          // typography
          'text-(length:--text-body) leading-(--leading-body)',
          // misc
          'transition-colors outline-none',
          // placeholder
          'placeholder:text-muted-foreground',
          // focus
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
          // disabled
          'disabled:bg-input/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          // invalid
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3',
          className,
        )}
        {...props}
      />
      {showClear && (
        <button
          type="button"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors"
          aria-label="Eingabe löschen"
        >
          <X className="size-6" />
        </button>
      )}
    </div>
  );
}

export { Input };
