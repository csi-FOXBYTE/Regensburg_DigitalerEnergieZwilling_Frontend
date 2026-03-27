import { NumericFormat, type NumericFormatProps } from 'react-number-format';

import { Input } from '@/components/ui/input';

const unitPresets = {
  area: { suffix: ' m²', decimalScale: 2, allowNegative: false },
  a: { decimalScale: 0, allowNegative: false },
  energyPrice: {
    suffix: '€/kWh',
    decimalScale: 3,
    allowNegative: false,
    fixedDecimalScale: true,
  },
} satisfies Record<string, Partial<NumericFormatProps>>;

type NumberInputProps = Omit<NumericFormatProps, 'customInput'> & {
  leftIcon?: React.ReactNode;
  unit?: keyof typeof unitPresets;
};

function NumberInput({
  thousandSeparator = '.',
  decimalSeparator = ',',
  unit,
  leftIcon,
  ...props
}: NumberInputProps) {
  const presetProps = unit ? unitPresets[unit] : {};

  return (
    <NumericFormat
      customInput={Input}
      {...presetProps}
      thousandSeparator={thousandSeparator}
      decimalSeparator={decimalSeparator}
      leftIcon={leftIcon}
      {...props}
    />
  );
}

export { NumberInput, type NumberInputProps };
