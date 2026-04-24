import { useStore } from '@nanostores/react';
import type { ParseKeys } from 'i18next';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ArrowIcon from '../../components/ArrowIcon';
import { Button } from '../../components/ui/button';
import { $step, setStep } from '../../lib/state/ui/progress';

export type ButtonBarProps = {
  backTextKey?: ParseKeys<'energyCalculation'>;
  continueTextKey?: ParseKeys<'energyCalculation'>;
};

export default function ButtonBar({
  continueTextKey,
  backTextKey,
}: ButtonBarProps) {
  const { t } = useTranslation('energyCalculation');

  const step = useStore($step);

  const hasNextStep = step < 7;

  const nextStep = useCallback(() => {
    setStep(step + 1);
  }, [step]);
  const previousStep = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  return (
    <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
      <Button
        onClick={previousStep}
        className={`w-full ${!hasNextStep ? 'col-span-full' : 'col-span-1'}`}
        variant="secondary"
      >
        {t(backTextKey ?? 'backButton')}
      </Button>
      {hasNextStep && (
        <Button
          onClick={nextStep}
          className="col-span-1 flex w-full gap-2"
          variant="primary"
        >
          {t(continueTextKey ?? 'continueButton')} <ArrowIcon />
        </Button>
      )}
    </div>
  );
}
