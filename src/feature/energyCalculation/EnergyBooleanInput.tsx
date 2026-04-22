import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { FieldStore } from '@/lib/field-store';
import { cn } from '@/lib/utils';
import { useStore } from '@nanostores/react';
import type { ParseKeys } from 'i18next';
import { useId, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import EnergyCalculationField from './EnergyCalculationField';

type EnergyBooleanInputProps = {
  field: FieldStore<boolean | undefined>;
  labelKey?: ParseKeys<'energyCalculation'>;
  info?: ReactNode;
  className?: string;
};

export default function EnergyBooleanInput({
  field,
  labelKey,
  info,
  className,
}: EnergyBooleanInputProps) {
  const { t } = useTranslation('common');
  const value = useStore(field.$store);
  const placeholder = useStore(field.$placeholder);
  const id = useId();

  const isPlaceholder = value == null;
  const fakeChecked =
    'border-primary bg-background before:absolute before:top-1/2 before:left-1/2 before:size-2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-primary';

  return (
    <EnergyCalculationField
      labelKey={labelKey}
      info={info}
      onReset={field.resettable ? () => field.setValue(undefined) : undefined}
      resetDisabled={value == null}
      className={className}
    >
      <RadioGroup
        value={value != null ? String(value) : ''}
        onValueChange={(v) => field.setValue(v === 'true')}
        className="flex flex-row gap-4 pt-1"
      >
        <Label htmlFor={`${id}-true`}>
          <RadioGroupItem
            value="true"
            id={`${id}-true`}
            className={cn(isPlaceholder && placeholder === true && fakeChecked)}
          />
          {t('yes')}
        </Label>
        <Label htmlFor={`${id}-false`}>
          <RadioGroupItem
            value="false"
            id={`${id}-false`}
            className={cn(
              isPlaceholder && placeholder === false && fakeChecked,
            )}
          />
          {t('no')}
        </Label>
      </RadioGroup>
    </EnergyCalculationField>
  );
}
