import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/ui/typography';

export function NextStepsSection() {
  const { t } = useTranslation('energyCalculation');

  const STEPS = [
    { title: t('nextSteps.step1.title'), description: t('nextSteps.step1.description') },
    { title: t('nextSteps.step2.title'), description: t('nextSteps.step2.description') },
    { title: t('nextSteps.step3.title'), description: t('nextSteps.step3.description') },
    { title: t('nextSteps.step4.title'), description: t('nextSteps.step4.description') },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h3">{t('nextSteps.sectionTitle')}</Typography>
      <div className="mt-1.5 flex flex-col">
        {STEPS.map((step, index) => (
          <div key={index} className="flex gap-5">
            <div className="flex flex-col items-center">
              <div className="bg-primary flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                {index + 1}
              </div>
              {index < STEPS.length - 1 && (
                <div className="my-1 w-px flex-1 bg-neutral-200" />
              )}
            </div>
            <div className="flex flex-col gap-1 pb-6">
              <Typography variant="h4">{step.title}</Typography>
              <Typography variant="muted">{step.description}</Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
