import { type DETOuterWallInput, type RangeKey } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import makeFieldStore from '../../field-store';
import { makeSelectionStore } from '../../selection-store';
import { $resolvedOuterWallInput } from '../computed/resolved-input';
import { $outerWallInputState } from './atoms';

export { $outerWallInputState };

export const outerWallYearField = makeFieldStore({
  store: $outerWallInputState,
  getValue: (obj) => obj.year as RangeKey | undefined,
  setValue: (draft, value) => {
    draft.year = value;
  },
  placeholderStore: $resolvedOuterWallInput,
  resettable: true,
});

export const outerWallAreaField = makeFieldStore({
  store: $outerWallInputState,
  getValue: (obj): number | null | undefined => obj.area,
  setValue: (draft, value) => {
    draft.area = value ?? undefined;
  },
  placeholderStore: $resolvedOuterWallInput,
  resettable: true,
});

export const outerWallConstructionTypeOptions = makeSelectionStore(
  (config) => config.outerWall.constructionTypes,
);

export const outerWallConstructionTypeField = makeFieldStore({
  store: $outerWallInputState,
  getValue: (obj) => obj.constructionType ?? undefined,
  setValue: (draft, value) => {
    draft.constructionType = value;
  },
  placeholderStore: $resolvedOuterWallInput,
  resettable: true,
});

export const outerWallHasInsulationField = makeFieldStore({
  store: $outerWallInputState,
  getValue: (obj) => obj.hasInsulation ?? undefined,
  setValue: (draft, value) => {
    draft.hasInsulation = value;
  },
  placeholderStore: $resolvedOuterWallInput,
  resettable: true,
});

export const outerWallInsulationThicknessField = makeFieldStore({
  store: $outerWallInputState,
  getValue: (obj): number | null | undefined => obj.insulationThickness,
  setValue: (draft, value) => {
    draft.insulationThickness = value;
  },
  placeholderStore: $resolvedOuterWallInput,
  resettable: true,
});
