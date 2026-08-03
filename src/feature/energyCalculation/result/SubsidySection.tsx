import { Typography } from '@/components/ui/typography';
import { useStore } from '@nanostores/react';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  $configLoadFailed,
  $subsidies,
} from '../../../lib/state/calculation-config';
import { SubsidyCard } from './SubsidyCard';

export function SubsidySection() {
  const { t } = useTranslation('energyCalculation');
  const subsidies = useStore($subsidies);
  const loadFailed = useStore($configLoadFailed);

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div>
        <Typography variant="h3">{t('subsidy.sectionTitle')}</Typography>
        <Typography variant="muted">{t('subsidy.disclaimer')}</Typography>
      </div>
      {loadFailed ? (
        <div
          role="alert"
          className="flex items-start gap-2 border border-[#e30613] bg-white px-3 py-2.5 text-sm text-[#e30613]"
        >
          <Info className="mt-0.5 size-4 shrink-0" />
          <span>{t('subsidy.loadError')}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {subsidies
            .filter(({ isActive }) => isActive)
            .map(({ subsidy }) => (
              <SubsidyCard key={subsidy.title} {...subsidy} />
            ))}
        </div>
      )}
    </div>
  );
}
