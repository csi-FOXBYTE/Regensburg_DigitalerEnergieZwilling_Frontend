import { Field, FieldLabel } from '@/components/ui/field';
import type { ParseKeys } from 'i18next';
import { RotateCcw } from 'lucide-react';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export default function EnergyCalculationField({
  children,
  labelKey,
  info,
  onReset,
  resetDisabled,
  className,
}: {
  children?: ReactNode;
  labelKey?: ParseKeys<'energyCalculation'>;
  info?: ReactNode;
  onReset?: () => void;
  resetDisabled?: boolean;
  className?: string;
}) {
  const { t } = useTranslation('energyCalculation');

  return (
    <Field className={className}>
      {labelKey && (
        <FieldLabel>
          {t(labelKey)}
          {info}
        </FieldLabel>
      )}
      <div className="flex items-center gap-2">
        {children}
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            disabled={resetDisabled}
            className={
              resetDisabled
                ? 'cursor-not-allowed text-neutral-200'
                : 'text-foreground hover:text-muted-foreground cursor-pointer transition-colors'
            }
          >
            <RotateCcw className="size-4" />
          </button>
        ) : (
          <div className="size-4 shrink-0" />
        )}
      </div>
    </Field>
  );
}
