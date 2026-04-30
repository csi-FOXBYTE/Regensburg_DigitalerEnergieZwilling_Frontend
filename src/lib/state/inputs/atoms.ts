import {
  type DETBottomFloorInput,
  type DETElectricityInput,
  type DETExteriorWallWindowsInput,
  type DETGeneralInput,
  type DETHeatInput,
  type DETOuterWallInput,
  type DETRoofInput,
  type DETRoofWindowsInput,
  type DETTopFloorInput,
  type Renovation,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { atom } from 'nanostores';
import { $building } from '../building';

export const $generalInputState = atom<Partial<DETGeneralInput>>({});
export const $heatInputState = atom<Partial<DETHeatInput>>({});
export const $roofInputState = atom<Partial<DETRoofInput>>({});
export const $roofWindowsInputState = atom<Partial<DETRoofWindowsInput>>({});
export const $exteriorWallWindowsInputState = atom<Partial<DETExteriorWallWindowsInput>>({});
export const $topFloorInputState = atom<Partial<DETTopFloorInput>>({});
export const $outerWallInputState = atom<Partial<DETOuterWallInput>>({});
export const $bottomFloorInputState = atom<Partial<DETBottomFloorInput>>({});
export const $electricityInputState = atom<Partial<DETElectricityInput>>({});

export const $selectedInsulationRenovations = atom<Renovation[]>([]);
export const $selectedHeatingSurfaceRenovations = atom<Renovation[]>([]);
export const $selectedHeatingRenovations = atom<Renovation[]>([]);

$building.subscribe((building) => {
  if (building === null) return;
  $generalInputState.set({});
  $heatInputState.set({});
  $roofInputState.set({});
  $roofWindowsInputState.set({});
  $exteriorWallWindowsInputState.set({});
  $topFloorInputState.set({});
  $outerWallInputState.set({});
  $bottomFloorInputState.set({});
  $electricityInputState.set({});
  $selectedInsulationRenovations.set([]);
  $selectedHeatingSurfaceRenovations.set([]);
  $selectedHeatingRenovations.set([]);
});
