import { Typography } from '@/components/ui/typography';
import { type Subsidy } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DUMMY_SUBSIDIES } from '../../../lib/subsidies/dummies';
import { SubsidyCard } from './SubsidyCard';

export function SubsidySection() {
  const { t } = useTranslation('energyCalculation');
  const [subsides, setSubsides] = useState<Subsidy[]>([]);

  useEffect(() => {
    const fetchSubsides = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/public/config/active',
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setSubsides(JSON.parse(data.subsidies));
      } catch {
        setSubsides(DUMMY_SUBSIDIES);
      }
    };
    fetchSubsides();
  }, []);

  if (subsides.length === 0) return null;

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
        {subsides.map((subsidy) => {
          return <SubsidyCard key={subsidy.href} {...subsidy} />;
        })}
      </div>
    </div>
  );
}
