import { Field, FieldLabel } from '@/components/ui/field';
import type { ParseKeys } from 'i18next';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export default function EnergyCalculationField({children, labelKey, info}: {children?: ReactNode, labelKey?: ParseKeys<"energyCalculation">, info?: ReactNode}) {
  const {t} = useTranslation("energyCalculation");

  return (
    <Field>
      {labelKey && <FieldLabel>{t(labelKey)}{info}</FieldLabel>}
      {children}
    </Field>
  )
}