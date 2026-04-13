import {
  BuildingType,
  type DETGeneralInput,
  type DETHeatInput,
  type DETInput,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { computed } from 'nanostores';
import { $building } from '../../feature/map/state';
import { $generalInputState } from './general-user-input';

const placeholderGeneral: DETGeneralInput = {
  buildingBaseArea: 0,
  buildingHeight: 0,
  type: BuildingType.SINGLE_FAMILY,
};

const placeholderHeat: DETHeatInput = {
  isBasementHeated: false,
};

const inputStores: [typeof $building, typeof $generalInputState] = [
  $building,
  $generalInputState,
];

export const $calculationInput = computed<DETInput | null, typeof inputStores>(
  inputStores,
  (building, general) => {
    if (building == null) return null;
    return {
      general: {
        ...placeholderGeneral,
        ...general,
      },
      heat: {
        ...placeholderHeat,
      },
    } satisfies DETInput;
  },
);
