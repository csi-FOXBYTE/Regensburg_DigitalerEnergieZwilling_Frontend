import {
  DEFAULT_CONFIG,
  resolveKeyedValue,
  type DETConfig,
  type RangeKey,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { atom, computed } from 'nanostores';

export const $config = atom<DETConfig>(DEFAULT_CONFIG);

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
