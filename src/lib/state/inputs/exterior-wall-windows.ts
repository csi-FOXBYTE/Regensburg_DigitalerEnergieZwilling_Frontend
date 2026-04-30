import { type RangeKey } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import makeFieldStore from '../../field-store';
import { makeSelectionStore } from '../../selection-store';
import { $resolvedInputState } from '../computed/resolved-input';
import { $inputState } from './atoms';

export const exteriorWallWindowsAreaField = makeFieldStore({
  store: $inputState,
  getValue: (obj): number | null | undefined => obj.exteriorWallWindows.area,
  setValue: (draft, value) => {
    draft.exteriorWallWindows.area = value ?? undefined;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const exteriorWallWindowsWindowTypeOptions = makeSelectionStore(
  (config) => config.windows.windowTypes,
);

export const exteriorWallWindowsWindowTypeField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.exteriorWallWindows.windowType ?? undefined,
  setValue: (draft, value) => {
    draft.exteriorWallWindows.windowType = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const exteriorWallWindowsUValueField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.exteriorWallWindows.uValue,
  setValue: (draft, value) => {
    draft.exteriorWallWindows.uValue = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const exteriorWallWindowsYearField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.exteriorWallWindows.year as RangeKey | undefined,
  setValue: (draft, value) => {
    draft.exteriorWallWindows.year = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});
