import { EnergyEfficiencyClass } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { useStore } from '@nanostores/react';
import { useTranslation } from 'react-i18next';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip';
import { $config } from '../../../lib/state/calculation-config';
import { $currentEnergyState } from '../../../lib/state/computed/current-energy-state';
import { $renovatedEnergyState } from '../../../lib/state/computed/renovated-energy-state';

const COLOR_MAP: Record<EnergyEfficiencyClass, string> = {
  [EnergyEfficiencyClass.A_PLUS]: 'var(--energy-class-a-plus)',
  [EnergyEfficiencyClass.A]: 'var(--energy-class-a)',
  [EnergyEfficiencyClass.B]: 'var(--energy-class-b)',
  [EnergyEfficiencyClass.C]: 'var(--energy-class-c)',
  [EnergyEfficiencyClass.D]: 'var(--energy-class-d)',
  [EnergyEfficiencyClass.E]: 'var(--energy-class-e)',
  [EnergyEfficiencyClass.F]: 'var(--energy-class-f)',
  [EnergyEfficiencyClass.G]: 'var(--energy-class-g)',
  [EnergyEfficiencyClass.H]: 'var(--energy-class-h)',
};

const CHEVRON_CLIP =
  'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)';

function formatRange(from: number | undefined, to: number | undefined): string {
  if (from == null) return `< ${to} kWh/m²a`;
  if (to == null) return `> ${from} kWh/m²a`;
  return `${from} – ${to} kWh/m²a`;
}

function EnergyClassRow({
  cls,
  color,
  fill,
  rangeText,
  ringClass,
  tooltipText,
  selected,
}: {
  cls: string;
  color: string;
  fill: string;
  rangeText: string;
  ringClass: string;
  tooltipText: string;
  selected: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`group flex items-stretch gap-4 p-2 ring-2 ${ringClass}`}>
          <div
            className="flex w-16 shrink-0 items-center justify-center p-1 text-sm font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {cls}
          </div>
          <div className="relative flex-1 bg-neutral-150">
            <div
              className={`absolute inset-y-0 left-0 transition-opacity group-hover:opacity-100 ${selected ? 'opacity-80' : 'opacity-40'}`}
              style={{ clipPath: CHEVRON_CLIP, width: fill, backgroundColor: color }}
            />
            <span className="relative z-10 flex h-full items-center pl-2 text-sm">
              {rangeText}
            </span>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" align="start">{tooltipText}</TooltipContent>
    </Tooltip>
  );
}

export default function EnergyClassBars() {
  const config = useStore($config);
  const current = useStore($currentEnergyState);
  const renovated = useStore($renovatedEnergyState);

  const bands = config.general.energyEfficiencyClasses;
  const steps = bands.length - 1;

  const { t } = useTranslation('energyCalculation');
  const classIndex = Object.fromEntries(
    bands.map((band, i) => [band.value, i]),
  );
  const beforeClass = current.energyEfficiencyClass;
  const afterClass = renovated.energyEfficiencyClass;
  const same = beforeClass === afterClass;
  const improved = classIndex[afterClass] < classIndex[beforeClass];

  function ringClass(cls: EnergyEfficiencyClass): string {
    if (cls === afterClass) {
      if (same) return 'ring-neutral-850';
      return improved ? 'ring-green-600' : 'ring-red-600';
    }
    if (cls === beforeClass) return 'ring-neutral-850';
    return 'ring-transparent';
  }

  function tooltipText(cls: EnergyEfficiencyClass, rangeText: string): string {
    const values = { cls, range: rangeText };
    if (cls === afterClass && cls !== beforeClass)
      return t('result.classTooltipAfterRenovation', values);
    if (cls === beforeClass && cls !== afterClass)
      return t('result.classTooltipCurrentState', values);
    return t('result.classTooltip', values);
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-1">
        {bands.map((band, i) => {
          const rangeText = formatRange(
            'from' in band ? band.from : undefined,
            'to' in band ? band.to : undefined,
          );
          return (
            <EnergyClassRow
              key={band.value}
              cls={band.value}
              color={COLOR_MAP[band.value]}
              fill={`min(100%, calc(160px + ${i} * (100% - 160px) / ${steps}))`}
              rangeText={rangeText}
              ringClass={ringClass(band.value)}
              tooltipText={tooltipText(band.value, rangeText)}
              selected={band.value === beforeClass || band.value === afterClass}
            />
          );
        })}
      </div>
    </TooltipProvider>
  );
}
