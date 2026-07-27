import {
  DEFAULT_CONFIG,
  resolveKeyedValue,
  validateConfig,
  type DETConfig,
  type RangeKey,
  type Subsidy,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { atom, computed } from 'nanostores';

type ActiveConfig = {
  versionName: string;
  calculationConfig: DETConfig;
  subsidies: Array<{ subsidy: Subsidy; isActive: boolean }>;
};

const $activeConfig = atom<ActiveConfig | null>(null);

export const $versionName = computed(
  $activeConfig,
  (c) => c?.versionName ?? 'DEFAULT',
);
export const $config = computed(
  $activeConfig,
  (c) => c?.calculationConfig ?? DEFAULT_CONFIG,
);
export const $subsidies = computed($activeConfig, (c) => c?.subsidies ?? []);

(async () => {
  try {
    const res = await fetch('/api/public/config/active');
    if (!res.ok) return;
    const data = await res.json();
    const result = validateConfig(JSON.parse(data.calculationConfig));
    if (!result.success) return;
    $activeConfig.set({
      versionName: data.versionName,
      calculationConfig: result.data,
      subsidies: JSON.parse(data.subsidies),
    });
  } catch {
    // keep defaults
  }
})();

export type EnergyEfficiencyClassData = Map<
  string,
  { threshhold: RangeKey; color: string }
>;

export const $energyEfficiencyClasses = computed($config, (config) => {
  const classData: EnergyEfficiencyClassData = new Map();

  for (const effClass of config.general.energyEfficiencyClasses) {
    const color = resolveKeyedValue(
      config.general.energyEfficiencyClassColors,
      effClass.value,
    );
    const threshhold: RangeKey = {
      from: (effClass as RangeKey).from,
      to: (effClass as RangeKey).to,
    };
    classData.set(effClass.value, { threshhold, color });
  }
  return classData;
});
