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
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { atom } from 'nanostores';

export const $generalInputState = atom<Partial<DETGeneralInput>>({});
export const $heatInputState = atom<Partial<DETHeatInput>>({});
export const $roofInputState = atom<Partial<DETRoofInput>>({});
export const $roofWindowsInputState = atom<Partial<DETRoofWindowsInput>>({});
export const $exteriorWallWindowsInputState = atom<Partial<DETExteriorWallWindowsInput>>({});
export const $topFloorInputState = atom<Partial<DETTopFloorInput>>({});
export const $outerWallInputState = atom<Partial<DETOuterWallInput>>({});
export const $bottomFloorInputState = atom<Partial<DETBottomFloorInput>>({});
export const $electricityInputState = atom<Partial<DETElectricityInput>>({});
