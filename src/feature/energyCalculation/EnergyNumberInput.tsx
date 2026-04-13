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
  field: FieldStore<number | null | undefined>;
  labelKey?: ParseKeys<'energyCalculation'>;
  info?: ReactNode;
};

export default function EnergyNumberInput({
  field,
  labelKey,
  info,
  ...props
}: EnergyNumberInputProps) {
  const value = useStore(field.$store);
  const placeholder = useStore(field.$placeholder);

  return (
    <EnergyCalculationField
      labelKey={labelKey}
      info={info}
      onReset={field.resettable ? () => field.setValue(undefined) : undefined}
      resetDisabled={value == null}
    >
      <NumberInput
        value={value ?? ''}
        onValueChange={(values) => field.setValue(values.floatValue)}
        placeholder={placeholder?.toString()}
        {...props}
      />
    </EnergyCalculationField>
  );
}
