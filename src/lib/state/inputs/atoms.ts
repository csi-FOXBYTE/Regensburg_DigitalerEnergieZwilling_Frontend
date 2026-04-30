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
import { getSession } from '../session/storage';

export type InputState = {
  general: Partial<DETGeneralInput>;
  heat: Partial<DETHeatInput>;
  roof: Partial<DETRoofInput>;
  roofWindows: Partial<DETRoofWindowsInput>;
  exteriorWallWindows: Partial<DETExteriorWallWindowsInput>;
  topFloor: Partial<DETTopFloorInput>;
  outerWall: Partial<DETOuterWallInput>;
  bottomFloor: Partial<DETBottomFloorInput>;
  electricity: Partial<DETElectricityInput>;
};

export const emptyInputState = (): InputState => ({
  general: {},
  heat: {},
  roof: {},
  roofWindows: {},
  exteriorWallWindows: {},
  topFloor: {},
  outerWall: {},
  bottomFloor: {},
  electricity: {},
});

export const $inputState = atom<InputState>(emptyInputState());

export const $selectedInsulationRenovations = atom<Renovation[]>([]);
export const $selectedHeatingSurfaceRenovations = atom<Renovation[]>([]);
export const $selectedHeatingRenovations = atom<Renovation[]>([]);

$building.subscribe((building) => {
  if (building === null) return;
  const session = getSession(building.id);
  if (session) {
    $inputState.set(session.inputState);
    $selectedInsulationRenovations.set(session.insulationRenovations);
    $selectedHeatingSurfaceRenovations.set(session.heatingSurfaceRenovations);
    $selectedHeatingRenovations.set(session.heatingRenovations);
  } else {
    $inputState.set(emptyInputState());
    $selectedInsulationRenovations.set([]);
    $selectedHeatingSurfaceRenovations.set([]);
    $selectedHeatingRenovations.set([]);
  }
});
