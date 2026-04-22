import { type DETRoofInput, RoofInsulationType, type RangeKey } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import makeFieldStore from '../../field-store';
import { makeSelectionStore } from '../../selection-store';
import { $resolvedRoofInput } from '../computed/resolved-input';
import { $roofInputState } from './atoms';

export { $roofInputState };

export const roofAreaField = makeFieldStore({
  store: $roofInputState,
  getValue: (obj) => obj.area,
  setValue: (draft, value) => {
    draft.area = value;
  },
  placeholderStore: $resolvedRoofInput,
  resettable: true,
});

export const roofConstructionTypeOptions = makeSelectionStore(
  (config) => config.roof.constructionTypes,
);

export const roofConstructionTypeField = makeFieldStore({
  store: $roofInputState,
  getValue: (obj) => obj.constructionType ?? undefined,
  setValue: (draft, value) => {
    draft.constructionType = value;
  },
  placeholderStore: $resolvedRoofInput,
  resettable: true,
});

export const roofHasInsulationField = makeFieldStore({
  store: $roofInputState,
  getValue: (obj) => obj.hasInsulation ?? undefined,
  setValue: (draft, value) => {
    draft.hasInsulation = value;
  },
  placeholderStore: $resolvedRoofInput,
  resettable: true,
});

export const roofInsulationThicknessField = makeFieldStore({
  store: $roofInputState,
  getValue: (obj) => obj.insulationThickness,
  setValue: (draft, value) => {
    draft.insulationThickness = value;
  },
  placeholderStore: $resolvedRoofInput,
  resettable: true,
});

export const roofInsulationTypeField = makeFieldStore({
  store: $roofInputState,
  getValue: (obj) => obj.insulationType ?? undefined,
  setValue: (draft, value) => {
    draft.insulationType = value;
  },
  placeholderStore: $resolvedRoofInput,
  resettable: true,
});

export { RoofInsulationType };

export const roofYearField = makeFieldStore({
  store: $roofInputState,
  getValue: (obj) => obj.year as RangeKey | undefined,
  setValue: (draft, value) => {
    draft.year = value;
  },
  placeholderStore: $resolvedRoofInput,
  resettable: true,
});
