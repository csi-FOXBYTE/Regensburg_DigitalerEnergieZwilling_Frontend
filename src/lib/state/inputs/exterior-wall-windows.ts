import { type DETExteriorWallWindowsInput, type RangeKey } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import makeFieldStore from '../../field-store';
import { makeSelectionStore } from '../../selection-store';
import { $resolvedExteriorWallWindowsInput } from '../computed/resolved-input';
import { $exteriorWallWindowsInputState } from './atoms';

export { $exteriorWallWindowsInputState };

export const exteriorWallWindowsAreaField = makeFieldStore({
  store: $exteriorWallWindowsInputState,
  getValue: (obj): number | null | undefined => obj.area,
  setValue: (draft, value) => {
    draft.area = value;
  },
  placeholderStore: $resolvedExteriorWallWindowsInput,
  resettable: true,
});

export const exteriorWallWindowsWindowTypeOptions = makeSelectionStore(
  (config) => config.windows.windowTypes,
);

export const exteriorWallWindowsWindowTypeField = makeFieldStore({
  store: $exteriorWallWindowsInputState,
  getValue: (obj) => obj.windowType ?? undefined,
  setValue: (draft, value) => {
    draft.windowType = value;
  },
  placeholderStore: $resolvedExteriorWallWindowsInput,
  resettable: true,
});

export const exteriorWallWindowsUValueField = makeFieldStore({
  store: $exteriorWallWindowsInputState,
  getValue: (obj) => obj.uValue,
  setValue: (draft, value) => {
    draft.uValue = value;
  },
  placeholderStore: $resolvedExteriorWallWindowsInput,
  resettable: true,
});

export const exteriorWallWindowsYearField = makeFieldStore({
  store: $exteriorWallWindowsInputState,
  getValue: (obj) => obj.year as RangeKey | undefined,
  setValue: (draft, value) => {
    draft.year = value;
  },
  placeholderStore: $resolvedExteriorWallWindowsInput,
  resettable: true,
});
