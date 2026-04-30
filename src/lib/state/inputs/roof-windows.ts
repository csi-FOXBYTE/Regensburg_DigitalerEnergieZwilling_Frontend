import { type RangeKey } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import makeFieldStore from '../../field-store';
import { makeSelectionStore } from '../../selection-store';
import { $resolvedInputState } from '../computed/resolved-input';
import { $inputState } from './atoms';

export const roofWindowsAreaField = makeFieldStore({
  store: $inputState,
  getValue: (obj): number | null | undefined => obj.roofWindows.area,
  setValue: (draft, value) => {
    draft.roofWindows.area = value ?? undefined;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const roofWindowsWindowTypeOptions = makeSelectionStore(
  (config) => config.windows.windowTypes,
);

export const roofWindowsWindowTypeField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.roofWindows.windowType ?? undefined,
  setValue: (draft, value) => {
    draft.roofWindows.windowType = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const roofWindowsUValueField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.roofWindows.uValue,
  setValue: (draft, value) => {
    draft.roofWindows.uValue = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const roofWindowsYearField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.roofWindows.year as RangeKey | undefined,
  setValue: (draft, value) => {
    draft.roofWindows.year = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});
