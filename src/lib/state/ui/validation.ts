import { computed } from 'nanostores';
import { $isThermalBaseRateInvalid } from '../inputs/heat';
import { $step, Step } from './progress';

/**
 * Whether navigating to the next step is currently blocked by a validation
 * error on the active step.
 */
export const $isNextBlocked = computed(
  [$step, $isThermalBaseRateInvalid],
  (step, baseRateInvalid) => step === Step.Heat && baseRateInvalid,
);
