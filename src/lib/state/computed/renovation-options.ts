import {
  generateHeatingRenovations,
  generateHeatingSurfaceRenovations,
  generateInsulationRenovations,
  type InsulationRenovationKeys,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import i18next from 'i18next';
import { computed } from 'nanostores';
import { $config } from '../calculation-config';
import { $resolvedInput } from './resolved-input';

const translateInsulationKey = (key: InsulationRenovationKeys) =>
  i18next.t(`energyCalculation:renovation.insulation.${key}`);

export const $insulationRenovations = computed([$config], (config) =>
  generateInsulationRenovations(config, translateInsulationKey),
);

export const $heatingSurfaceRenovations = computed([$config, $resolvedInput], (config, resolvedInput) =>
  generateHeatingSurfaceRenovations(config, resolvedInput, i18next.language),
);

export const $heatingRenovations = computed([$config, $resolvedInput], (config, resolvedInput) =>
  generateHeatingRenovations(config, resolvedInput, i18next.language, i18next.t('energyCalculation:renovation.heating.renewal')),
);
