import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FieldStore } from '@/lib/field-store';
import {
  formatRangeLabel,
  rangeKeyEquals,
  type RangeBandOption,
} from '@/lib/yearHelper/rangeBandOptions';
import type {
  RangeKey,
  Selection,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { useStore } from '@nanostores/react';
import type { ParseKeys } from 'i18next';
import type { ReadableAtom } from 'nanostores';
import { useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import EnergyCalculationField from './EnergyCalculationField';

type BaseProps<T> = {
  field: FieldStore<T | undefined>;
  labelKey?: ParseKeys<'energyCalculation'>;
  info?: ReactNode;
  options: Array<{ value: T; label: string }>;
  isEqual?: (a: T, b: T) => boolean;
  disabled?: boolean;
  className?: string;
};

function EnergySelectInputBase<T>({
  field,
  labelKey,
  info,
  options,
  isEqual = Object.is,
  disabled,
  className,
}: BaseProps<T>) {
  const value = useStore(field.$store);
  const placeholder = useStore(field.$placeholder);
  const currentIndex = value != null
    ? options.findIndex((o) => isEqual(o.value, value))
    : -1;
  const placeholderLabel = placeholder != null
    ? options.find((o) => isEqual(o.value, placeholder))?.label
    : undefined;

  return (
    <EnergyCalculationField
      labelKey={labelKey}
      info={info}
      onReset={field.resettable ? () => field.setValue(undefined) : undefined}
      resetDisabled={!value}
      className={className}
    >
      <Select
        value={currentIndex >= 0 ? String(currentIndex) : ''}
        onValueChange={(v) => field.setValue(options[Number(v)].value)}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholderLabel} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem key={index} value={String(index)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </EnergyCalculationField>
  );
}

function EnergySelectInputSelectionPreprocessor<T extends string>({
  selectionStore,
  ...baseProps
}: Omit<BaseProps<T>, 'options' | 'isEqual'> & {
  selectionStore: ReadableAtom<Selection[]>;
}) {
  const { i18n } = useTranslation();
  const selections = useStore(selectionStore);
  const value = useStore(baseProps.field.$store);
  const options = selections.map((s) => ({
    value: s.value as T,
    label: s.localization[i18n.language] ?? s.localization['en'] ?? s.value,
  }));

  useEffect(() => {
    if (selections.length === 1) {
      baseProps.field.setValue(selections[0].value as T);
    } else if (value != null && !selections.some((s) => s.value === value)) {
      baseProps.field.setValue(undefined);
    }
  }, [selections]);

  return (
    <EnergySelectInputBase
      {...baseProps}
      options={options}
      disabled={selections.length === 1}
    />
  );
}

function EnergySelectInputRangeBandPreprocessor({
  rangeBandStore,
  ...baseProps
}: Omit<BaseProps<RangeKey>, 'options' | 'isEqual'> & {
  rangeBandStore: ReadableAtom<RangeBandOption[]>;
}) {
  const { t } = useTranslation('common');
  const rawOptions = useStore(rangeBandStore);
  const options = rawOptions.map((o) => ({ ...o, label: formatRangeLabel(o.value, t) }));
  const value = useStore(baseProps.field.$store);

  useEffect(() => {
    if (options.length === 1) {
      baseProps.field.setValue(options[0].value);
    } else if (value != null && !options.some((o) => rangeKeyEquals(o.value, value))) {
      baseProps.field.setValue(undefined);
    }
  }, [options]);

  return (
    <EnergySelectInputBase
      {...baseProps}
      options={options}
      isEqual={rangeKeyEquals}
      disabled={options.length === 1}
    />
  );
}

type EnergySelectInputProps<T extends string> =
  | (Omit<BaseProps<T>, 'isEqual'> & { selectionStore?: never; rangeBandStore?: never })
  | (Omit<BaseProps<T>, 'options' | 'isEqual'> & {
      selectionStore: ReadableAtom<Selection[]>;
      options?: never;
      rangeBandStore?: never;
    })
  | (Omit<BaseProps<RangeKey>, 'options' | 'isEqual'> & {
      rangeBandStore: ReadableAtom<RangeBandOption[]>;
      options?: never;
      selectionStore?: never;
    });

export default function EnergySelectInput<T extends string>(
  props: EnergySelectInputProps<T>,
) {
  if (props.rangeBandStore != null) {
    const { rangeBandStore, ...rest } = props;
    return (
      <EnergySelectInputRangeBandPreprocessor
        rangeBandStore={rangeBandStore}
        {...(rest as Omit<BaseProps<RangeKey>, 'options' | 'isEqual'>)}
      />
    );
  }
  if (props.selectionStore != null) {
    const { selectionStore, ...rest } = props;
    return (
      <EnergySelectInputSelectionPreprocessor
        selectionStore={selectionStore}
        {...rest}
      />
    );
  }
  const { options, ...rest } = props;
  return <EnergySelectInputBase options={options} {...(rest as BaseProps<T>)} />;
}
