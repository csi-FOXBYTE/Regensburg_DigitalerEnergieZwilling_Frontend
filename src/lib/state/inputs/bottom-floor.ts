import { type DETBottomFloorInput, type RangeKey } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import makeFieldStore from '../../field-store';
import { makeSelectionStore } from '../../selection-store';
import { $resolvedBottomFloorInput } from '../computed/resolved-input';
import { $bottomFloorInputState } from './atoms';

export { $bottomFloorInputState };

export const bottomFloorYearField = makeFieldStore({
  store: $bottomFloorInputState,
  getValue: (obj) => obj.year as RangeKey | undefined,
  setValue: (draft, value) => {
    draft.year = value;
  },
  placeholderStore: $resolvedBottomFloorInput,
  resettable: true,
});

export const hasBasementField = makeFieldStore({
  store: $bottomFloorInputState,
  getValue: (obj) => obj.hasBasement ?? undefined,
  setValue: (draft, value) => {
    draft.hasBasement = value;
  },
  placeholderStore: $resolvedBottomFloorInput,
  resettable: true,
});

export const isBasementHeatedField = makeFieldStore({
  store: $bottomFloorInputState,
  getValue: (obj) => obj.isBasementHeated ?? undefined,
  setValue: (draft, value) => {
    draft.isBasementHeated = value;
  },
  placeholderStore: $resolvedBottomFloorInput,
  resettable: true,
});

export const bottomFloorConstructionTypeOptions = makeSelectionStore(
  (config) => config.bottomFloor.constructionTypes,
  {
    $store: $bottomFloorInputState,
    getKey: (state) => state.hasBasement === false || state.isBasementHeated === true,
    getFilter: (config) => config.bottomFloor.allowedConstructionTypesByHeatedCellar,
  },
);

export const bottomFloorConstructionTypeField = makeFieldStore({
  store: $bottomFloorInputState,
  getValue: (obj) => obj.constructionType ?? undefined,
  setValue: (draft, value) => {
    draft.constructionType = value;
  },
  placeholderStore: $resolvedBottomFloorInput,
  resettable: true,
});

export const bottomFloorHasInsulationField = makeFieldStore({
  store: $bottomFloorInputState,
  getValue: (obj) => obj.hasInsulation ?? undefined,
  setValue: (draft, value) => {
    draft.hasInsulation = value;
  },
  placeholderStore: $resolvedBottomFloorInput,
  resettable: true,
});

export const bottomFloorInsulationThicknessField = makeFieldStore({
  store: $bottomFloorInputState,
  getValue: (obj): number | null | undefined => obj.insulationThickness,
  setValue: (draft, value) => {
    draft.insulationThickness = value;
  },
  placeholderStore: $resolvedBottomFloorInput,
  resettable: true,
});
