import { useStore } from '@nanostores/react';
import type { ParseKeys } from 'i18next';
import { Euro, Leaf, TrendingUp, Zap } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper } from '../../components/ui/paper';
import { Typography } from '../../components/ui/typography';
import { $currentEnergyState } from '../../lib/state/computed/current-energy-state';

function getEnergyDemandDescriptionKey(
  value: number,
): ParseKeys<'energyCalculation'> {
  if (value <= 50) return 'stats.energyDemandLow';
  if (value <= 100) return 'stats.energyDemandModerate';
  if (value <= 150) return 'stats.energyDemandHigh';
  return 'stats.energyDemandVeryHigh';
}

function getEfficiencyDescriptionKey(
  cls: string,
): ParseKeys<'energyCalculation'> {
  if (cls === 'A+' || cls === 'A') return 'stats.efficiencyVeryGood';
  if (cls === 'B') return 'stats.efficiencyGood';
  if (cls === 'C' || cls === 'D') return 'stats.efficiencySatisfactory';
  if (cls === 'E' || cls === 'F') return 'stats.efficiencyPoor';
  return 'stats.efficiencyVeryPoor';
}

function getCo2DescriptionKey(value: number): ParseKeys<'energyCalculation'> {
  if (value <= 3) return 'stats.co2Low';
  if (value <= 6) return 'stats.co2Moderate';
  if (value <= 10) return 'stats.co2Elevated';
  return 'stats.co2High';
}

function CurrentStatsCard({
  value,
  titleKey,
  valueKey,
  descriptionKey,
  icon,
}: {
  value: unknown;
  titleKey: ParseKeys<'energyCalculation'>;
  valueKey: ParseKeys<'energyCalculation'>;
  descriptionKey?: ParseKeys<'energyCalculation'>;
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
        {t(valueKey, {
          value:
            typeof value === 'number'
              ? value.toLocaleString('de-DE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : value,
        })}
      </Typography>
      {descriptionKey && (
        <div className="flex items-center justify-between">
          <Typography variant="muted">{t(descriptionKey)}</Typography>
        </div>
      )}
    </Paper>
  );
}

export function CurrentStatsReduced() {
  const currentStats = useStore($currentEnergyState);

  return (
    <div className="grid grid-cols-1 gap-3">
      <CurrentStatsCard
        value={currentStats.energyConsumptionPerSquareMeter}
        titleKey="stats.energyDemand"
        valueKey="stats.energyDemandValue"
        descriptionKey={getEnergyDemandDescriptionKey(
          currentStats.energyConsumptionPerSquareMeter,
        )}
        icon={<Zap className="size-5 text-amber-600" />}
      />
      <CurrentStatsCard
        value={currentStats.energyEfficiencyClass}
        titleKey="stats.energyEfficiency"
        valueKey="stats.energyEfficiencyValue"
        descriptionKey={getEfficiencyDescriptionKey(
          String(currentStats.energyEfficiencyClass),
        )}
        icon={<TrendingUp className="size-5 text-green-600" />}
      />
      <CurrentStatsCard
        value={currentStats.co2Emissions}
        titleKey="stats.co2Emissions"
        valueKey="stats.co2EmissionsValue"
        descriptionKey={getCo2DescriptionKey(currentStats.co2Emissions)}
        icon={<Leaf className="size-5 text-green-700" />}
      />
    </div>
  );
}

export default function CurrentStats() {
  const currentStats = useStore($currentEnergyState);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
