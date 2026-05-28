import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/ui/typography';
import type { Subsidy } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { SubsidyCard } from './SubsidyCard';

export function SubsidySection({ subsidies }: { subsidies: Subsidy[] }) {
  const { t } = useTranslation('energyCalculation');

  if (subsidies.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Typography variant="h3">{t('subsidy.sectionTitle')}</Typography>
        <Typography variant="muted">
          Die angezeigten Förderprogramme sind Beispieldaten und erheben keinen Anspruch auf Vollständigkeit oder Aktualität.
        </Typography>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {subsidies.map((subsidy) => (
          <SubsidyCard key={subsidy.href} {...subsidy} />
        ))}
      </div>
    </div>
  );
}
