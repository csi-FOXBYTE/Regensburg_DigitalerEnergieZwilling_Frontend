import { useStore } from '@nanostores/react';
import type { ParseKeys } from 'i18next';
import { ChevronDown, Euro, Leaf, TrendingUp, Zap } from 'lucide-react';
import { type ReactNode, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper } from '../../components/ui/paper';
import { Separator } from '../../components/ui/separator';
import { Typography } from '../../components/ui/typography';
import { $currentEnergyState } from '../../lib/state/computed/current-energy-state';
import { primaryEnergyCarrierOptions } from '../../lib/state/inputs/heat';

type StatDetail = {
  label: string;
  value: string;
  unit: string;
};

function CurrentStatsCard({
  value,
  unit,
  titleKey,
  icon,
  details,
  compact = false,
}: {
  value: string;
  unit?: string;
  titleKey: ParseKeys<'energyCalculation'>;
  icon: ReactNode;
  details?: StatDetail[];
  compact?: boolean;
}) {
  const { t } = useTranslation('energyCalculation');
  const [isOpen, setIsOpen] = useState(false);
  const detailsId = useId();

  if (compact) {
    return (
      <Paper className="flex flex-col gap-1 p-2" elevation={2}>
        <div className="flex gap-1">
          {icon}
          <Typography variant="h4" className="text-sm leading-5">
            {t(titleKey)}
          </Typography>
        </div>
        <Typography className="text-lg leading-6 font-bold">
          {value}
          {unit && <span className="ml-1 text-sm">{unit}</span>}
        </Typography>
      </Paper>
    );
  }

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
      {details && (
        <>
          <div
            id={detailsId}
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
              isOpen
                ? 'grid-rows-[1fr] opacity-100'
                : 'grid-rows-[0fr] opacity-0'
            }`}
            aria-hidden={!isOpen}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="mt-1 flex flex-col gap-2">
                <Separator />
                {details.map((detail) => (
                  <div
                    key={detail.label}
                    className="flex items-baseline justify-between gap-3 text-sm"
                  >
                    <span className="text-neutral-550">{detail.label}</span>
                    <span className="shrink-0 font-bold">
                      {detail.value}
                      <span className="ml-1 text-xs">{detail.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="text-neutral-450 hover:text-neutral-650 focus-visible:ring-ring/50 mt-auto flex w-fit cursor-pointer items-center rounded-sm p-0.5 focus-visible:ring-2 focus-visible:outline-none"
            aria-expanded={isOpen}
            aria-controls={detailsId}
            aria-label={t(
              isOpen
                ? 'stats.energyDemandBreakdown.collapse'
                : 'stats.energyDemandBreakdown.expand',
            )}
            onClick={() => setIsOpen((previous) => !previous)}
          >
            <span className="text-sm font-medium">
              {t('stats.energyDemandBreakdown.details')}
            </span>
            <ChevronDown
              className={`ml-1 size-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </>
      )}
    </Paper>
  );
}

function calculatePerSquareMeter(
  partialDemand: number,
  totalDemand: number,
  totalPerSquareMeter: number,
) {
  if (totalDemand === 0) return 0;
  return (partialDemand / totalDemand) * totalPerSquareMeter;
}

export default function CurrentStats({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { t, i18n } = useTranslation('energyCalculation');
  const currentStats = useStore($currentEnergyState);
  const energyCarrierOptions = useStore(primaryEnergyCarrierOptions);
  const formatValue = (value: number) =>
    value.toLocaleString('de-DE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  const energyDemandUnit = t('stats.units.energyDemand');
  const energyCarrier = energyCarrierOptions.find(
    ({ value }) => value === currentStats.energyCarrierType,
  );
  const energyCarrierLabel =
    energyCarrier?.localization[i18n.language] ??
    energyCarrier?.localization[i18n.language.split('-')[0]] ??
    energyCarrier?.localization.en ??
    currentStats.energyCarrierType;
  const energyDemandBreakdown: StatDetail[] = [
    {
      label: t('stats.energyDemandBreakdown.carrierHeating', {
        carrier: energyCarrierLabel,
      }),
      value: formatValue(
        calculatePerSquareMeter(
          currentStats.annualCarrierHeatingEnergyDemand,
          currentStats.annualTotalEnergyDemand,
          currentStats.energyConsumptionPerSquareMeter,
        ),
      ),
      unit: energyDemandUnit,
    },
    {
      label: t('stats.energyDemandBreakdown.electricalHeating'),
      value: formatValue(
        calculatePerSquareMeter(
          currentStats.annualElectricalHeatingEnergyDemand,
          currentStats.annualTotalEnergyDemand,
          currentStats.energyConsumptionPerSquareMeter,
        ),
      ),
      unit: energyDemandUnit,
    },
    {
      label: t('stats.energyDemandBreakdown.householdElectricity'),
      value: formatValue(
        calculatePerSquareMeter(
          currentStats.annualHouseholdElectricalEnergyDemand,
          currentStats.annualTotalEnergyDemand,
          currentStats.energyConsumptionPerSquareMeter,
        ),
      ),
      unit: energyDemandUnit,
    },
  ];

  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <CurrentStatsCard
        compact={compact}
        value={formatValue(currentStats.energyConsumptionPerSquareMeter)}
        unit={energyDemandUnit}
        titleKey="stats.energyDemand"
        icon={<Zap className="size-5 text-amber-600" />}
        details={energyDemandBreakdown}
      />
      <CurrentStatsCard
        compact={compact}
        value={t('stats.energyEfficiencyValue', {
          value: currentStats.energyEfficiencyClass,
        })}
        titleKey="stats.energyEfficiency"
        icon={<TrendingUp className="size-5 text-green-600" />}
      />
      <CurrentStatsCard
        compact={compact}
        value={formatValue(currentStats.yearlyCost)}
        unit={t('stats.units.annualCosts')}
        titleKey="stats.annualCosts"
        icon={<Euro className="size-5 text-blue-600" />}
      />
      <CurrentStatsCard
        compact={compact}
        value={formatValue(currentStats.co2Emissions)}
        unit={t('stats.units.co2Emissions')}
        titleKey="stats.co2Emissions"
        icon={<Leaf className="size-5 text-green-700" />}
      />
    </div>
  );
}
