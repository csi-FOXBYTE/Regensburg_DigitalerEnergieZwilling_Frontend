import type {
  DETBottomFloorInput,
  DETGeneralInput,
  DETOuterWallInput,
  DETRoofInput,
  DETTopFloorInput,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { computed } from 'nanostores';
import { yearToRangeKey } from '../../yearHelper/rangeBandOptions';
import { $config } from '../calculation-config';
import { $building } from '../building';

export type Lod2DerivedInput = {
  general: Partial<DETGeneralInput>;
  bottomFloor: Partial<DETBottomFloorInput>;
  topFloor: Partial<DETTopFloorInput>;
  outerWall: Partial<DETOuterWallInput>;
  roof: Partial<DETRoofInput>;
};

export const $lod2Input = computed([$building, $config], (building, config): Lod2DerivedInput => {
  const det = building?.properties.digitalEnergyTwin;
  const height = det?.height ?? building?.properties.measuredHeight;
  const buildingYear = det?.constructionYear != null
    ? yearToRangeKey(det.constructionYear, config.general.generalYearBands)
    : undefined;

  return {
    general: {
      ...(det?.groundArea != null && { buildingBaseArea: det.groundArea }),
      ...(height != null && { buildingHeight: height }),
      ...(buildingYear != null && { buildingYear }),
    },
    bottomFloor: {
      ...(det?.groundArea != null && { area: det.groundArea }),
    },
    topFloor: {
      ...(det?.upperFloorArea != null && { area: det.upperFloorArea }),
    },
    outerWall: {
      ...(det?.grossExternalWallArea != null && { area: det.grossExternalWallArea }),
      ...(det?.adjacentWallArea != null && { adjacentWallArea: det.adjacentWallArea }),
    },
    roof: {
      ...(det?.roofArea != null && { area: det.roofArea }),
    },
  };
});
