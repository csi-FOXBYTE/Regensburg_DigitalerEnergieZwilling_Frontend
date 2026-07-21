import { computed } from 'nanostores';
import { $isRoofWindowsAreaInvalid } from './roof-windows';
import { $isTopFloorAreaInvalid } from './top-floor';

export const $canProgressOuterPartsStep = computed(
  [$isRoofWindowsAreaInvalid, $isTopFloorAreaInvalid],
  (roofWindowsAreaInvalid, topFloorAreaInvalid) =>
    !roofWindowsAreaInvalid && !topFloorAreaInvalid,
);
