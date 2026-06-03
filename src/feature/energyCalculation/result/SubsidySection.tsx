import { Typography } from '@/components/ui/typography';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  foerderprogrammToSubsidy,
  type Foerderprogramm,
} from '../../../hooks/useActiveConfig';
import { SubsidyCard } from './SubsidyCard';

export function SubsidySection() {
  const { t } = useTranslation('energyCalculation');
  const [subsides, setSubsides] = useState<Foerderprogramm[]>([]);

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
        console.error('fetchSubsides failed:');
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
          const s = foerderprogrammToSubsidy(subsidy);
          return <SubsidyCard key={s.href} {...s} />;
        })}
      </div>
    </div>
  );
}
