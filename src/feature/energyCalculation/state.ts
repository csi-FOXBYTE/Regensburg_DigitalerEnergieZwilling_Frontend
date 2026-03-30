import { atom, type ReadableAtom } from 'nanostores';
import { $building } from '../map/state';

export type EnergyCalculationState = {};

const loadingState = atom<boolean>(false);
export const $energyState = atom<EnergyCalculationState>({});
export const $energyStateLoading: ReadableAtom<boolean> = loadingState;

$building.subscribe((building) => {
  if (building == null) return;
  loadingState.set(true);
  const saved = localStorage.getItem(`energy_state-${building.id}`);
  if (saved) $energyState.set(JSON.parse(saved));
  else {
    //Load Building Data
    $energyState.set({});
  }
  loadingState.set(false);
});

$energyState.subscribe((state) => {
  if (loadingState.get()) return;
  const building = $building.get();
  if (building)
    localStorage.setItem(`energy_state-${building.id}`, JSON.stringify(state));
});
