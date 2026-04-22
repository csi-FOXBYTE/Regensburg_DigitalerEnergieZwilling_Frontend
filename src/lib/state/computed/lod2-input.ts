import type {
  DETBottomFloorInput,
  DETGeneralInput,
  DETOuterWallInput,
  DETRoofInput,
  DETTopFloorInput,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { computed } from 'nanostores';
import { $building } from '../building';

export type Lod2DerivedInput = {
  general: Partial<DETGeneralInput>;
  bottomFloor: Partial<DETBottomFloorInput>;
  topFloor: Partial<DETTopFloorInput>;
  outerWall: Partial<DETOuterWallInput>;
  roof: Partial<DETRoofInput>;
};

export const $lod2Input = computed($building, (building): Lod2DerivedInput => {
  const det = building?.properties.digitalEnergyTwin;
  const height = det?.height ?? building?.properties.measuredHeight;

  return {
    general: {
      ...(det?.groundArea != null && { buildingBaseArea: det.groundArea }),
      ...(height != null && { buildingHeight: height }),
    },
    bottomFloor: {
      ...(det?.groundArea != null && { area: det.groundArea }),
    },
    topFloor: {
      ...(det?.upperFloorArea != null && { area: det.upperFloorArea }),
    },
    outerWall: {
      ...(det?.grossExternalWallArea != null && { area: det.grossExternalWallArea }),
    },
    roof: {
      ...(det?.roofArea != null && { area: det.roofArea }),
    },
  };
});
