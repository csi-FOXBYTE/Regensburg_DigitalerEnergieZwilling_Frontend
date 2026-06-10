import { Typography } from '@/components/ui/typography';
import { useTranslation } from 'react-i18next';
import { DUMMY_SUBSIDIES } from '../../../lib/subsidies/dummies';
import { SubsidyCard } from './SubsidyCard';

export function SubsidySection() {
  const { t } = useTranslation('energyCalculation');

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Typography variant="h3">{t('subsidy.sectionTitle')}</Typography>
        <Typography variant="muted">
          Die angezeigten Förderprogramme sind Beispieldaten und erheben keinen
          Anspruch auf Vollständigkeit oder Aktualität.
        </Typography>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {DUMMY_SUBSIDIES.map((subsidy) => {
          return <SubsidyCard key={subsidy.href} {...subsidy} />;
        })}
      </div>
    </div>
  );
}
