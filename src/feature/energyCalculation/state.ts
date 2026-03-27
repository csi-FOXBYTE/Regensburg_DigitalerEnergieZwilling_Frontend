import { atom, type ReadableAtom } from 'nanostores';
import { $building } from '../map/state';

export type EnergyCalculationState = {};

const loadingState = atom<boolean>(false);
export const $energyState = atom<EnergyCalculationState>({});
export const $energyStateLoading: ReadableAtom<boolean> = loadingState;

$building.subscribe(async (building) => {
  loadingState.set(true);

  loadingState.set(false);
});
