import { useStore } from '@nanostores/react';
import type { ParseKeys } from 'i18next';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ArrowIcon from '../../components/ArrowIcon';
import { Button } from '../../components/ui/button';
import { $step, setStep } from '../progressBar/state';

export type ButtonBarProps = {
  backTextKey?: ParseKeys<"energyCalculation">,
  continueTextKey?: ParseKeys<"energyCalculation">,
}

export default function ButtonBar({continueTextKey, backTextKey}: ButtonBarProps) {
  const {t} = useTranslation("energyCalculation");
  
  const step = useStore($step);

  const hasNextStep = step < 7;

  const nextStep = useCallback(() => {
    setStep(step + 1);
  }, [step]);
  const previousStep = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-2 w-full'>
      <Button onClick={previousStep} className={`w-full ${!hasNextStep ? "col-span-full" : "col-span-1"}`} variant="secondary">
        {t(backTextKey ?? "backButton")}
      </Button>
      {hasNextStep && <Button onClick={nextStep} className="col-span-1 w-full flex gap-2" variant="primary">
        {t(continueTextKey ?? "continueButton")} <ArrowIcon/>
      </Button>}
    </div>
  )
}