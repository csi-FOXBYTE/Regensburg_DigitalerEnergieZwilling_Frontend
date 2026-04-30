import { type RangeKey } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import makeFieldStore from '../../field-store';
import { makeSelectionStore } from '../../selection-store';
import { $resolvedInputState } from '../computed/resolved-input';
import { $inputState } from './atoms';

export const hasAtticField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.topFloor.hasAttic ?? undefined,
  setValue: (draft, value) => {
    draft.topFloor.hasAttic = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const isAtticHeatedField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.topFloor.isAtticHeated ?? undefined,
  setValue: (draft, value) => {
    draft.topFloor.isAtticHeated = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const topFloorYearField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.topFloor.year as RangeKey | undefined,
  setValue: (draft, value) => {
    draft.topFloor.year = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const topFloorAreaField = makeFieldStore({
  store: $inputState,
  getValue: (obj): number | null | undefined => obj.topFloor.area,
  setValue: (draft, value) => {
    draft.topFloor.area = value ?? undefined;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const topFloorTypeOptions = makeSelectionStore(
  (config) => config.topFloor.topFloorTypes,
);

export const topFloorTypeField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.topFloor.topFloorType ?? undefined,
  setValue: (draft, value) => {
    draft.topFloor.topFloorType = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const topFloorHasInsulationField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.topFloor.hasInsulation ?? undefined,
  setValue: (draft, value) => {
    draft.topFloor.hasInsulation = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const topFloorInsulationThicknessField = makeFieldStore({
  store: $inputState,
  getValue: (obj): number | null | undefined => obj.topFloor.insulationThickness,
  setValue: (draft, value) => {
    draft.topFloor.insulationThickness = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});
