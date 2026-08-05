import { $building } from '../building';
import {
  $inputState,
  $selectedHeatingRenovations,
  $selectedHeatingSurfaceRenovations,
  $selectedInsulationRenovations,
} from '../inputs/atoms';
import { $maxStepReached, $step, setMaxStepReached } from '../ui/progress';
import { saveSession } from './index';
import { getSession } from './storage';

$building.subscribe((building) => {
  if (!building) {
    setMaxStepReached($step.get());
    return;
  }

  const session = getSession(building.id);
  setMaxStepReached(
    session
      ? (Math.max(
          session.step,
          session.maxStepReached ?? session.step,
        ) as typeof session.step)
      : $step.get(),
  );
});

const stores = [
  $building,
  $step,
  $maxStepReached,
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
