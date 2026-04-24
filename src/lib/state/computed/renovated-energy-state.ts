import {
  applyRenovation,
  calculate,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { computed } from 'nanostores';
import { $config } from '../calculation-config';
import { $renovations } from '../inputs/renovation';
import { $calculationInput } from './calculation-input';

export const $renovatedEnergyState = computed(
  [$calculationInput, $renovations, $config],
  (input, renovations, config) => {
    const renovatedInput =
      renovations.length > 0 ? applyRenovation(input, renovations) : input;
    return calculate(config, renovatedInput, { debug: true });
  },
);
