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
  titleKey,
  valueKey,
  icon,
}: {
  value: unknown;
  titleKey: ParseKeys<'energyCalculation'>;
  valueKey: ParseKeys<'energyCalculation'>;
  icon: ReactNode;
}) {
  const { t } = useTranslation('energyCalculation');

  return (
    <Paper className="flex flex-col gap-2 p-3" elevation={2}>
      <div className="flex gap-2">
        {icon}
        <Typography variant={'h4'}>{t(titleKey)}</Typography>
      </div>
      <Typography variant={'lead'} className="self-end font-bold sm:self-start">
        {t(valueKey, { value: typeof value === 'number' ? value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value })}
      </Typography>
    </Paper>
  );
}

export default function CurrentStats() {
  const currentStats = useStore($currentEnergyState);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <CurrentStatsCard
        value={currentStats.energyConsumptionPerSquareMeter}
        titleKey="stats.energyDemand"
        valueKey="stats.energyDemandValue"
        icon={<Zap className="size-5 text-amber-600" />}
      />
      <CurrentStatsCard
        value={currentStats.energyEfficiencyClass}
        titleKey="stats.energyEfficiency"
        valueKey="stats.energyEfficiencyValue"
        icon={<TrendingUp className="size-5 text-green-600" />}
      />
      <CurrentStatsCard
        value={currentStats.yearlyCost}
        titleKey="stats.annualCosts"
        valueKey="stats.annualCostsValue"
        icon={<Euro className="size-5 text-blue-600" />}
      />
      <CurrentStatsCard
        value={currentStats.co2Emissions}
        titleKey="stats.co2Emissions"
        valueKey="stats.co2EmissionsValue"
        icon={<Leaf className="size-5 text-green-700" />}
      />
    </div>
  );
}
