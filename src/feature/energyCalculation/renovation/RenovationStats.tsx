import { type EnergyEfficiencyClass } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { useStore } from '@nanostores/react';
import type { ParseKeys } from 'i18next';
import { Euro, Leaf, TrendingUp, Zap } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper } from '../../../components/ui/paper';
import { Separator } from '../../../components/ui/separator';
import { Typography } from '../../../components/ui/typography';
import { $energyEfficiencyClasses } from '../../../lib/state/calculation-config';
import { $currentEnergyState } from '../../../lib/state/computed/current-energy-state';
import { $renovatedEnergyState } from '../../../lib/state/computed/renovated-energy-state';

function formatValue(value: number) {
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDelta(value: number) {
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always',
  });
}

function deltaPillClass(improved: boolean | null) {
  if (improved === true) return 'bg-green-600 text-white';
  if (improved === false) return 'bg-red-600 text-white';
  return 'bg-neutral-550 text-white';
}

function DeltaPill({
  children,
  improved,
}: {
  children: ReactNode;
  improved: boolean | null;
}) {
  return (
    <span
      className={`w-fit rounded-full px-2 py-1 text-xs font-bold ${deltaPillClass(improved)}`}
    >
      {children}
    </span>
  );
}

function NumericDelta({
  before,
  after,
  unit,
}: {
  before: number;
  after: number;
  unit: string;
}) {
  const delta = after - before;
  const improved = delta < 0 ? true : delta > 0 ? false : null;
  return (
    <DeltaPill improved={improved}>
      {formatDelta(delta)} {unit}
    </DeltaPill>
  );
}

function ClassDelta({
  before,
  after,
  classIndex,
}: {
  before: EnergyEfficiencyClass;
  after: EnergyEfficiencyClass;
  classIndex: Map<string, number>;
}) {
  const beforeIndex = classIndex.get(before) ?? 0;
  const afterIndex = classIndex.get(after) ?? 0;
  const improved =
    afterIndex < beforeIndex ? true : afterIndex > beforeIndex ? false : null;
  return (
    <DeltaPill improved={improved}>
      {before} → {after}
    </DeltaPill>
  );
}

function RenovationStatsCard({
  icon,
  titleKey,
  beforeFormatted,
  afterFormatted,
  delta,
}: {
  icon: ReactNode;
  titleKey: ParseKeys<'energyCalculation'>;
  beforeFormatted: string;
  afterFormatted: string;
  delta: ReactNode;
}) {
  const { t } = useTranslation('energyCalculation');

  return (
    <Paper className="flex flex-col gap-2 p-4" elevation={2}>
      <div className="flex gap-2">
        {icon}
        <Typography variant="h4">{t(titleKey)}</Typography>
      </div>
      <Typography variant="muted">{t('stats.beforeRenovation')}</Typography>
      <Typography variant="muted" style={{ fontSize: '16px' }}>
        {beforeFormatted}
      </Typography>
      <Separator style={{ margin: '4px 0' }} />
      <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>
        {t('stats.afterRenovation')}
      </Typography>
      <Typography
        style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}
      >
        {afterFormatted}
      </Typography>
      {delta}
    </Paper>
  );
}

export default function RenovationStats() {
  const { t } = useTranslation('energyCalculation');
  const effClasses = useStore($energyEfficiencyClasses);
  const before = useStore($currentEnergyState);
  const after = useStore($renovatedEnergyState);
  const classIndex = new Map(
    Array.from(effClasses.keys()).map((cls, i) => [cls, i]),
  );

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <RenovationStatsCard
        icon={<Zap className="size-5 text-amber-600" />}
        titleKey="stats.energyDemand"
        beforeFormatted={t('stats.energyDemandValue', {
          value: formatValue(before.energyConsumptionPerSquareMeter),
        })}
        afterFormatted={t('stats.energyDemandValue', {
          value: formatValue(after.energyConsumptionPerSquareMeter),
        })}
        delta={
          <NumericDelta
            before={before.energyConsumptionPerSquareMeter}
            after={after.energyConsumptionPerSquareMeter}
            unit="kWh/m²a"
          />
        }
      />
      <RenovationStatsCard
        icon={<TrendingUp className="size-5 text-green-600" />}
        titleKey="stats.energyEfficiency"
        beforeFormatted={t('stats.energyEfficiencyValue', {
          value: before.energyEfficiencyClass,
        })}
        afterFormatted={t('stats.energyEfficiencyValue', {
          value: after.energyEfficiencyClass,
        })}
        delta={
          <ClassDelta
            before={before.energyEfficiencyClass}
            after={after.energyEfficiencyClass}
            classIndex={classIndex}
          />
        }
      />
      <RenovationStatsCard
        icon={<Euro className="size-5 text-blue-600" />}
        titleKey="stats.annualCosts"
        beforeFormatted={t('stats.annualCostsValue', {
          value: formatValue(before.yearlyCost),
        })}
        afterFormatted={t('stats.annualCostsValue', {
          value: formatValue(after.yearlyCost),
        })}
        delta={
          <NumericDelta
            before={before.yearlyCost}
            after={after.yearlyCost}
            unit="€/a"
          />
        }
      />
      <RenovationStatsCard
        icon={<Leaf className="size-5 text-green-700" />}
        titleKey="stats.co2Emissions"
        beforeFormatted={t('stats.co2EmissionsValue', {
          value: formatValue(before.co2Emissions),
        })}
        afterFormatted={t('stats.co2EmissionsValue', {
          value: formatValue(after.co2Emissions),
        })}
        delta={
          <NumericDelta
            before={before.co2Emissions}
            after={after.co2Emissions}
            unit="t CO₂/a"
          />
        }
      />
    </div>
  );
}
