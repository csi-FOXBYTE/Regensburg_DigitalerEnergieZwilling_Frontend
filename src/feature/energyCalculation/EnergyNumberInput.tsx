import {
  NumberInput,
  type NumberInputProps,
} from '@/components/ui/number-input';
import type { FieldStore } from '@/lib/field-store';
import { cn } from '@/lib/utils';
import { useStore } from '@nanostores/react';
import type { ParseKeys } from 'i18next';
import { useId, type ReactNode } from 'react';
import EnergyCalculationField from './EnergyCalculationField';

type EnergyNumberInputProps = Omit<
  NumberInputProps,
  'value' | 'onValueChange' | 'placeholder'
> & {
  field: Pick<FieldStore<number | null | undefined>, '$store' | '$placeholder' | 'resettable'> & {
    setValue: (value: number | undefined) => void;
  };
  labelKey?: ParseKeys<'energyCalculation'>;
  info?: ReactNode;
  error?: ReactNode;
  className?: string;
};

export default function EnergyNumberInput({
  field,
  labelKey,
  info,
  error,
  className,
  id: providedId,
  'aria-describedby': providedDescribedBy,
  ...props
}: EnergyNumberInputProps) {
  const generatedId = useId();
  const inputId = providedId ?? generatedId;
  const errorId = `${inputId}-error`;
  const describedBy =
    [providedDescribedBy, error ? errorId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;
  const value = useStore(field.$store);
  const placeholder = useStore(field.$placeholder);
  const { decimalScale, suffix } = props;
  const placeholderStr = placeholder != null
    ? `${placeholder.toLocaleString('de-DE', {
        minimumFractionDigits: decimalScale,
        maximumFractionDigits: decimalScale,
      })}${suffix ?? ''}`
    : suffix != null ? `- ${suffix.trim()}` : undefined;
  // Keep the overhang of the final italic glyph inside the input's clipping area.
  const paddedPlaceholder = placeholderStr != null
    ? `${placeholderStr}\u2009`
    : undefined;

  return (
    <EnergyCalculationField
      labelKey={labelKey}
      info={info}
      error={error}
      onReset={field.resettable ? () => field.setValue(undefined) : undefined}
      resetDisabled={value == null}
      className={className}
      labelFor={inputId}
      errorId={errorId}
    >
      <NumberInput
        id={inputId}
        value={value ?? ''}
        onValueChange={(values) => field.setValue(values.floatValue)}
        placeholder={paddedPlaceholder}
        className={cn(
          'placeholder:italic',
          value != null && 'border-neutral-450',
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      />
    </EnergyCalculationField>
  );
}
