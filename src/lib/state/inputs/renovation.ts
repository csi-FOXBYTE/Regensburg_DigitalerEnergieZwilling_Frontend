import { type Renovation } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { atom, computed } from 'nanostores';

export const $selectedInsulationRenovations = atom<Renovation[]>([]);
export const $selectedHeatingSurfaceRenovations = atom<Renovation[]>([]);
export const $selectedHeatingRenovations = atom<Renovation[]>([]);

export const $renovations = computed(
  [$selectedInsulationRenovations, $selectedHeatingSurfaceRenovations, $selectedHeatingRenovations],
  (insulation, heatingSurface, heating) => [...insulation, ...heatingSurface, ...heating],
);
