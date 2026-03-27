import { Field, FieldLabel } from '@/components/ui/field';
import type { ParseKeys } from 'i18next';
import { Info } from 'lucide-react';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export default function EnergyCalculationField({children, labelKey}: {children?: ReactNode, labelKey?: ParseKeys<"energyCalculation">}) {
  const {t} = useTranslation("energyCalculation");
  
  return (
    <Field>
      {labelKey && <FieldLabel>{t(labelKey)}<Info/></FieldLabel>}
      {children}
    </Field>
  )
}