import { calculate } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { computed } from 'nanostores';
import { $config } from '../calculation-config';
import { $calculationInput } from './calculation-input';

export const $currentEnergyState = computed(
  [$calculationInput, $config],
  (input, config) => {
    console.log('Running calculation:', input);
    return calculate(config, input, { debug: true });
  },
);
