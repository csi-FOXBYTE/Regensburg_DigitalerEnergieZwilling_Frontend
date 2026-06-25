import {
  NumberInput,
  type NumberInputProps,
} from '@/components/ui/number-input';
import type { FieldStore } from '@/lib/field-store';
import { useStore } from '@nanostores/react';
import type { ParseKeys } from 'i18next';
import type { ReactNode } from 'react';
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
  ...props
}: EnergyNumberInputProps) {
  const value = useStore(field.$store);
  const placeholder = useStore(field.$placeholder);
  const { decimalScale, suffix } = props;
  const placeholderStr = placeholder != null
    ? `${placeholder.toLocaleString('de-DE', {
        minimumFractionDigits: decimalScale,
        maximumFractionDigits: decimalScale,
      })}${suffix ?? ''}`
    : suffix != null ? `- ${suffix.trim()}` : undefined;

  return (
    <EnergyCalculationField
      labelKey={labelKey}
      info={info}
      error={error}
      onReset={field.resettable ? () => field.setValue(undefined) : undefined}
      resetDisabled={value == null}
      className={className}
    >
      <NumberInput
        value={value ?? ''}
        onValueChange={(values) => field.setValue(values.floatValue)}
        placeholder={placeholderStr}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    </EnergyCalculationField>
  );
}
