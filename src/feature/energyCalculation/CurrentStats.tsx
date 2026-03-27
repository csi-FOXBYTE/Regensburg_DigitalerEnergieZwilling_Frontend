import type { ParseKeys } from 'i18next';
import { Euro, Leaf, TrendingUp, Zap } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper } from '../../components/ui/paper';
import { Typography } from '../../components/ui/typography';

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
        {t(valueKey, { value })}
      </Typography>
    </Paper>
  );
}

export default function CurrentStats() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <CurrentStatsCard
        value={150}
        titleKey="stats.energyDemand"
        valueKey="stats.energyDemandValue"
        icon={<Zap className="size-5 text-amber-600" />}
      />
      <CurrentStatsCard
        value={'E'}
        titleKey="stats.energyEfficiency"
        valueKey="stats.energyEfficiencyValue"
        icon={<TrendingUp className="size-5 text-green-600" />}
      />
      <CurrentStatsCard
        value={12600}
        titleKey="stats.annualCosts"
        valueKey="stats.annualCostsValue"
        icon={<Euro className="size-5 text-blue-600" />}
      />
      <CurrentStatsCard
        value={17.6}
        titleKey="stats.co2Emissions"
        valueKey="stats.co2EmissionsValue"
        icon={<Leaf className="size-5 text-green-700" />}
      />
    </div>
  );
}
