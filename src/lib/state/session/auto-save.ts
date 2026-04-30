import { $building } from '../building';
import {
  $inputState,
  $selectedHeatingRenovations,
  $selectedHeatingSurfaceRenovations,
  $selectedInsulationRenovations,
} from '../inputs/atoms';
import { $step } from '../ui/progress';
import { saveSession } from './index';

const stores = [
  $building,
  $step,
  $inputState,
  $selectedInsulationRenovations,
  $selectedHeatingSurfaceRenovations,
  $selectedHeatingRenovations,
];

let pending: ReturnType<typeof setTimeout> | undefined;

function schedule() {
  clearTimeout(pending);
  pending = setTimeout(saveSession, 1000);
}

for (const store of stores) {
  store.subscribe(schedule);
}
