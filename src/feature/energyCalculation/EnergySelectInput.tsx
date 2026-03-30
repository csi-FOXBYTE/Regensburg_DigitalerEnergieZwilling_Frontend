import { useStore } from '@nanostores/react';
import type { ParseKeys } from 'i18next';
import type { ReactNode } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type SelectOption,
} from '@/components/ui/select';
import type { FieldStore } from '@/lib/field-store';
import EnergyCalculationField from './EnergyCalculationField';

type EnergySelectInputProps = {
  field: FieldStore<string | undefined>;
  labelKey?: ParseKeys<'energyCalculation'>;
  info?: ReactNode;
  options: SelectOption[];
  placeholder?: string;
};

export default function EnergySelectInput({
  field,
  labelKey,
  info,
  options,
  placeholder,
}: EnergySelectInputProps) {
  const value = useStore(field.$store);

  return (
    <EnergyCalculationField labelKey={labelKey} info={info}>
      <Select value={value ?? ''} onValueChange={(v) => field.setValue(v)}>
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
