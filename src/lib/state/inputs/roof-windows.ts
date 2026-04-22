import { type DETRoofWindowsInput, type RangeKey } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import makeFieldStore from '../../field-store';
import { makeSelectionStore } from '../../selection-store';
import { $resolvedRoofWindowsInput } from '../computed/resolved-input';
import { $roofWindowsInputState } from './atoms';

export { $roofWindowsInputState };

export const roofWindowsAreaField = makeFieldStore({
  store: $roofWindowsInputState,
  getValue: (obj): number | null | undefined => obj.area,
  setValue: (draft, value) => {
    draft.area = value;
  },
  placeholderStore: $resolvedRoofWindowsInput,
  resettable: true,
});

export const roofWindowsWindowTypeOptions = makeSelectionStore(
  (config) => config.windows.windowTypes,
);

export const roofWindowsWindowTypeField = makeFieldStore({
  store: $roofWindowsInputState,
  getValue: (obj) => obj.windowType ?? undefined,
  setValue: (draft, value) => {
    draft.windowType = value;
  },
  placeholderStore: $resolvedRoofWindowsInput,
  resettable: true,
});

export const roofWindowsUValueField = makeFieldStore({
  store: $roofWindowsInputState,
  getValue: (obj) => obj.uValue,
  setValue: (draft, value) => {
    draft.uValue = value;
  },
  placeholderStore: $resolvedRoofWindowsInput,
  resettable: true,
});

export const roofWindowsYearField = makeFieldStore({
  store: $roofWindowsInputState,
  getValue: (obj) => obj.year as RangeKey | undefined,
  setValue: (draft, value) => {
    draft.year = value;
  },
  placeholderStore: $resolvedRoofWindowsInput,
  resettable: true,
});
