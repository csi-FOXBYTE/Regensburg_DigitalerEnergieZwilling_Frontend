import {
  BuildingType,
  DEFAULT_CONFIG,
  type DETBottomFloorInput,
  type DETExteriorWallWindowsInput,
  type DETGeneralInput,
  type DETHeatInput,
  type DETInput,
  type DETOuterWallInput,
  type DETRoofInput,
  type DETRoofWindowsInput,
  type DETTopFloorInput,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { computed } from 'nanostores';

function defined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}
import {
  $bottomFloorInputState,
  $exteriorWallWindowsInputState,
  $generalInputState,
  $heatInputState,
  $outerWallInputState,
  $roofInputState,
  $roofWindowsInputState,
  $topFloorInputState,
} from '../inputs/atoms';
import { $lod2Input } from './lod2-input';

const placeholderGeneral: DETGeneralInput = {
  buildingBaseArea: 0,
  buildingHeight: 0,
  type: BuildingType.SINGLE_FAMILY,
  buildingYear: DEFAULT_CONFIG.general.generalYearBands[0],
};

const placeholderHeat: DETHeatInput = {};

const placeholderBottomFloor: DETBottomFloorInput = {
  area: 0,
};

const placeholderExteriorWall: DETExteriorWallWindowsInput = {
  area: 0,
};

const placeholderRoofWindow: DETRoofWindowsInput = {
  area: 0,
};

const placeholderOuterWall: DETOuterWallInput = {
  area: 0,
};

const placeholderRoof: DETRoofInput = {
  area: 0,
};

const placeholderTopFloor: DETTopFloorInput = {
  area: 0,
};

const inputStores: [
  typeof $lod2Input,
  typeof $generalInputState,
  typeof $heatInputState,
  typeof $bottomFloorInputState,
  typeof $exteriorWallWindowsInputState,
  typeof $outerWallInputState,
  typeof $roofInputState,
  typeof $roofWindowsInputState,
  typeof $topFloorInputState,
] = [
  $lod2Input,
  $generalInputState,
  $heatInputState,
  $bottomFloorInputState,
  $exteriorWallWindowsInputState,
  $outerWallInputState,
  $roofInputState,
  $roofWindowsInputState,
  $topFloorInputState,
];

export const $calculationInput = computed<DETInput, typeof inputStores>(
  inputStores,
  (
    lod2,
    general,
    heat,
    bottomFloor,
    exteriorWallWindows,
    outerWall,
    roof,
    roofWindows,
    topFloor,
  ) => {
    return {
      general: {
        ...placeholderGeneral,
        ...lod2.general,
        ...defined(general),
      },
      heat: {
        ...placeholderHeat,
        ...defined(heat),
      },
      bottomFloor: {
        ...placeholderBottomFloor,
        ...lod2.bottomFloor,
        ...defined(bottomFloor),
      },
      exteriorWallWindows: {
        ...placeholderExteriorWall,
        ...defined(exteriorWallWindows),
      },
      roofWindows: {
        ...placeholderRoofWindow,
        ...defined(roofWindows),
      },
      outerWall: {
        ...placeholderOuterWall,
        ...lod2.outerWall,
        ...defined(outerWall),
      },
      roof: {
        ...placeholderRoof,
        ...lod2.roof,
        ...defined(roof),
      },
      topFloor: {
        ...placeholderTopFloor,
        ...lod2.topFloor,
        ...defined(topFloor),
      },
    } satisfies DETInput;
  },
);
