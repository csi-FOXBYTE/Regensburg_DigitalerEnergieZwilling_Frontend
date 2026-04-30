import { type DETTopFloorInput, type RangeKey } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import makeFieldStore from '../../field-store';
import { makeSelectionStore } from '../../selection-store';
import { $resolvedTopFloorInput } from '../computed/resolved-input';
import { $topFloorInputState } from './atoms';

export { $topFloorInputState };

export const hasAtticField = makeFieldStore({
  store: $topFloorInputState,
  getValue: (obj) => obj.hasAttic ?? undefined,
  setValue: (draft, value) => {
    draft.hasAttic = value;
  },
  placeholderStore: $resolvedTopFloorInput,
  resettable: true,
});

export const isAtticHeatedField = makeFieldStore({
  store: $topFloorInputState,
  getValue: (obj) => obj.isAtticHeated ?? undefined,
  setValue: (draft, value) => {
    draft.isAtticHeated = value;
  },
  placeholderStore: $resolvedTopFloorInput,
  resettable: true,
});

export const topFloorYearField = makeFieldStore({
  store: $topFloorInputState,
  getValue: (obj) => obj.year as RangeKey | undefined,
  setValue: (draft, value) => {
    draft.year = value;
  },
  placeholderStore: $resolvedTopFloorInput,
  resettable: true,
});

export const topFloorAreaField = makeFieldStore({
  store: $topFloorInputState,
  getValue: (obj): number | null | undefined => obj.area,
  setValue: (draft, value) => {
    draft.area = value ?? undefined;
  },
  placeholderStore: $resolvedTopFloorInput,
  resettable: true,
});

export const topFloorTypeOptions = makeSelectionStore(
  (config) => config.topFloor.topFloorTypes,
);

export const topFloorTypeField = makeFieldStore({
  store: $topFloorInputState,
  getValue: (obj) => obj.topFloorType ?? undefined,
  setValue: (draft, value) => {
    draft.topFloorType = value;
  },
  placeholderStore: $resolvedTopFloorInput,
  resettable: true,
});

export const topFloorHasInsulationField = makeFieldStore({
  store: $topFloorInputState,
  getValue: (obj) => obj.hasInsulation ?? undefined,
  setValue: (draft, value) => {
    draft.hasInsulation = value;
  },
  placeholderStore: $resolvedTopFloorInput,
  resettable: true,
});

export const topFloorInsulationThicknessField = makeFieldStore({
  store: $topFloorInputState,
  getValue: (obj): number | null | undefined => obj.insulationThickness,
  setValue: (draft, value) => {
    draft.insulationThickness = value;
  },
  placeholderStore: $resolvedTopFloorInput,
  resettable: true,
});
