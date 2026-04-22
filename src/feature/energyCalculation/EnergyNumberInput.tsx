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
  className?: string;
};

export default function EnergyNumberInput({
  field,
  labelKey,
  info,
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
    : undefined;

  return (
    <EnergyCalculationField
      labelKey={labelKey}
      info={info}
      onReset={field.resettable ? () => field.setValue(undefined) : undefined}
      resetDisabled={value == null}
      className={className}
    >
      <NumberInput
        value={value ?? ''}
        onValueChange={(values) => field.setValue(values.floatValue)}
        placeholder={placeholderStr}
        {...props}
      />
    </EnergyCalculationField>
  );
}
