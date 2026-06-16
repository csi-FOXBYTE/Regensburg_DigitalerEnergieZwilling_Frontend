import ArrowIcon from '@/components/ArrowIcon';
import { Typography } from '@/components/ui/typography';
import { AlertCircle, Calculator, FileText, MapPin, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ICON_MAP = { MapPin, Calculator, Wrench, FileText } as const;
type IconName = keyof typeof ICON_MAP;

const FEATURE_KEYS: { icon: IconName; titleKey: string; descKey: string }[] = [
  { icon: 'MapPin', titleKey: 'features.0.title', descKey: 'features.0.description' },
  { icon: 'Calculator', titleKey: 'features.1.title', descKey: 'features.1.description' },
  { icon: 'Wrench', titleKey: 'features.2.title', descKey: 'features.2.description' },
  { icon: 'FileText', titleKey: 'features.3.title', descKey: 'features.3.description' },
];

export default function LandingPageContent() {
  const { t } = useTranslation('landingPage');

  return (
    <>
      <div className="flex flex-col gap-2">
        <Typography as="h1" variant="h1">
          {t('title')}
        </Typography>
        <Typography variant="lead">{t('aboutText')}</Typography>
      </div>

      <div className="flex flex-col gap-4">
        {FEATURE_KEYS.map(({ icon, titleKey, descKey }) => {
          const Icon = ICON_MAP[icon];
          return (
            <div key={icon} className="flex gap-4">
              <Icon className="text-primary mt-0.5 size-5 shrink-0" />
              <div>
                <Typography variant="h4">{t(titleKey)}</Typography>
                <Typography variant="body">{t(descKey)}</Typography>
              </div>
            </div>
          );
        })}
      </div>

      <button
        data-next-step
        className="group/button bg-primary text-primary-foreground flex w-full items-center justify-center gap-2 px-7 py-3"
      >
        {t('startButton')}
        <ArrowIcon />
      </button>

      <div className="border-primary flex gap-4 border p-4">
        <AlertCircle className="text-primary mt-0.5 size-5 shrink-0" />
        <div>
          <Typography variant="h4">{t('remarkTitle')}</Typography>
          <Typography variant="body">{t('remarkContent')}</Typography>
        </div>
      </div>
    </>
  );
}
