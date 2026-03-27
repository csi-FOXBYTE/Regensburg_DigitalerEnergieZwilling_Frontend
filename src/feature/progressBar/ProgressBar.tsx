import DesktopOnly from '@/components/DesktopOnly';
import MobileOnly from '@/components/MobileOnly';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { useStore } from '@nanostores/react';
import { ArrowLeft } from 'lucide-react';
import { useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/button';
import { $step, setStep, Step } from './state';

type VisualProgressBarProps = {
  step: Step;
};

function MobileProgressBar({ step }: VisualProgressBarProps) {
  const { t } = useTranslation('progressBar');
  const label = t(`steps.${step}`);

  const stepBack = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  return (
    <nav className="px-gutter sticky top-0 z-30 flex h-(--nav-height) flex-col justify-between py-4">
      <div className="flex gap-3">
        {step > 1 ? (
          <Button
            size="icon"
            variant="elevated"
            className="shadow-none"
            onClick={stepBack}
          >
            <ArrowLeft />
          </Button>
        ) : null}
        <div className="flex flex-col">
          <Typography variant="verySmall">
            {t('mobileStepsIndicator', { step: step, maxSteps: 7 })}
          </Typography>
          <Typography variant="small">{label}</Typography>
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-neutral-200">
        <div
          className="bg-primary h-full rounded-full"
          style={{ width: (step / 7) * 100 + '%' }}
        />
      </div>
    </nav>
  );
}

function DesktopTick({
  index,
  step,
  onClick,
}: {
  index: number;
  step: number;
  onClick: (step: number) => void;
}) {
  const isHighlighted = index <= step;
  const isClickable = index < step;

  const clicked = useCallback(() => {
    onClick(index);
  }, [onClick, step]);

  return (
    <button
      disabled={!isClickable}
      onClick={clicked}
      className={cn(
        'h-full flex-1 cursor-pointer bg-neutral-200 disabled:cursor-default',
        isHighlighted && 'bg-primary',
      )}
    />
  );
}

function DesktopProgressBar({ step }: VisualProgressBarProps) {
  const { t } = useTranslation('progressBar');

  const label = t(`steps.${step}`);

  const ticks: ReactNode[] = [];
  for (let i = 1; i <= Step.Result; i++) {
    ticks.push(<DesktopTick step={step} index={i} key={i} onClick={setStep} />);
  }

  return (
    <nav className="max-w-content mx-auto flex h-(--nav-height) flex-col justify-center gap-1">
      <div>
        <Typography variant="h4">
          {step > 0 ? `${step}. ` : ''}
          {label}
        </Typography>
      </div>
      <div className={cn('flex h-2 w-full justify-between gap-1')}>{ticks}</div>
    </nav>
  );
}

export default function ProgressBar() {
  const step = useStore($step);

  return (
    <>
      <DesktopOnly>
        <DesktopProgressBar step={step} />
      </DesktopOnly>
      <MobileOnly>
        <MobileProgressBar step={step} />
      </MobileOnly>
    </>
  );
}
