import { useStore } from '@nanostores/react';
import type { ParseKeys } from 'i18next';
import type { ReactNode } from 'react';
import { NumberInput, type NumberInputProps } from '@/components/ui/number-input';
import type { FieldStore } from '@/lib/field-store';
import EnergyCalculationField from './EnergyCalculationField';

type EnergyNumberInputProps = Omit<NumberInputProps, 'value' | 'onValueChange'> & {
  field: FieldStore<number | undefined>;
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

  return (
    <EnergyCalculationField labelKey={labelKey} info={info}>
      <NumberInput
        value={value ?? ''}
        onValueChange={(values) => field.setValue(values.floatValue)}
        {...props}
      />
    </EnergyCalculationField>
  );
}
