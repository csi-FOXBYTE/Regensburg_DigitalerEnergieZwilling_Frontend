import { useStore } from '@nanostores/react';
import type { ParseKeys } from 'i18next';
import { Euro, Leaf, TrendingUp, Zap } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper } from '../../components/ui/paper';
import { Typography } from '../../components/ui/typography';
import { $currentEnergyState } from '../../lib/state/computed/current-energy-state';

function CurrentStatsCard({
  value,
  unit,
  titleKey,
  icon,
}: {
  value: string;
  unit?: string;
  titleKey: ParseKeys<'energyCalculation'>;
  icon: ReactNode;
}) {
  const { t } = useTranslation('energyCalculation');

  return (
    <Paper className="flex flex-col gap-2 p-3" elevation={2}>
      <div className="flex gap-2">
        {icon}
        <Typography variant={'h4'} className="text-[16px] font-bold">
          {t(titleKey)}
        </Typography>
      </div>
      <Typography variant={'h3'} className="self-start text-[30px] font-bold">
        {value}
        {unit && <span className="ml-1 text-base">{unit}</span>}
      </Typography>
    </Paper>
  );
}

export default function CurrentStats() {
  const { t } = useTranslation('energyCalculation');
  const currentStats = useStore($currentEnergyState);
  const formatValue = (value: number) =>
    value.toLocaleString('de-DE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <CurrentStatsCard
        value={formatValue(currentStats.energyConsumptionPerSquareMeter)}
        unit={t('stats.units.energyDemand')}
        titleKey="stats.energyDemand"
        icon={<Zap className="size-5 text-amber-600" />}
      />
      <CurrentStatsCard
        value={t('stats.energyEfficiencyValue', {
          value: currentStats.energyEfficiencyClass,
        })}
        titleKey="stats.energyEfficiency"
        icon={<TrendingUp className="size-5 text-green-600" />}
      />
      <CurrentStatsCard
        value={formatValue(currentStats.yearlyCost)}
        unit={t('stats.units.annualCosts')}
        titleKey="stats.annualCosts"
        icon={<Euro className="size-5 text-blue-600" />}
      />
      <CurrentStatsCard
        value={formatValue(currentStats.co2Emissions)}
        unit={t('stats.units.co2Emissions')}
        titleKey="stats.co2Emissions"
        icon={<Leaf className="size-5 text-green-700" />}
      />
    </div>
  );
}
