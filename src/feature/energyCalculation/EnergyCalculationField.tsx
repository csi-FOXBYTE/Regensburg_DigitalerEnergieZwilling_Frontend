import { Field, FieldLabel } from '@/components/ui/field';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
        <div className="flex w-fit items-center gap-2">
          <FieldLabel>{t(labelKey)}</FieldLabel>
          {info}
        </div>
      )}
      <div className="flex w-full items-center gap-2">
        {children}
        {onReset ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onReset}
                  disabled={resetDisabled}
                  className={
                    resetDisabled
                      ? 'cursor-not-allowed text-neutral-200'
                      : 'text-foreground hover:text-[#e30613] cursor-pointer transition-colors'
                  }
                >
                  <RotateCcw className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                hideArrow
                className="bg-background text-foreground border shadow-sm"
              >
                {t('common.resetTooltip')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <div className="size-4 shrink-0" />
        )}
      </div>
    </Field>
  );
}
