import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type SelectOption,
} from '@/components/ui/select';
import type { FieldStore } from '@/lib/field-store';
import { useStore } from '@nanostores/react';
import type { ParseKeys } from 'i18next';
import type { ReactNode } from 'react';
import EnergyCalculationField from './EnergyCalculationField';

type EnergySelectInputProps<T extends string> = {
  field: FieldStore<T | undefined>;
  labelKey?: ParseKeys<'energyCalculation'>;
  info?: ReactNode;
  options: SelectOption[];
};

export default function EnergySelectInput<T extends string>({
  field,
  labelKey,
  info,
  options,
}: EnergySelectInputProps<T>) {
  const value = useStore(field.$store);
  const placeholder = useStore(field.$placeholder);

  return (
    <EnergyCalculationField
      labelKey={labelKey}
      info={info}
      onReset={field.resettable ? () => field.setValue(undefined) : undefined}
      resetDisabled={!value}
    >
      <Select value={value ?? ''} onValueChange={(v) => field.setValue(v as T)}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </EnergyCalculationField>
  );
}
