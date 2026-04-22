import {
  type DETConfig,
  type DETGeneralInput,
  type RangeKey,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import makeFieldStore from '../../field-store';
import { makeRangeBandStore } from '../../selection-store';
import { $resolvedGeneralInput } from '../computed/resolved-input';
import { $generalInputState } from './atoms';

export { $generalInputState };

export const buildingYearField = makeFieldStore({
  store: $generalInputState,
  getValue: (obj) => obj.buildingYear as RangeKey | undefined,
  setValue: (draft, value) => {
    draft.buildingYear = value;
  },
  placeholderStore: $resolvedGeneralInput,
  resettable: true,
});

export const buildingYearOptions = makeRangeBandStore({
  getRanges: (config: DETConfig) => {
    return config.general.generalYearBands;
  },
});

export const buildingTypeField = makeFieldStore({
  store: $generalInputState,
  getValue: (obj) => obj.type,
  setValue: (draft, value) => {
    draft.type = value;
  },
  placeholderStore: $resolvedGeneralInput,
  resettable: true,
});

export const numberOfStoriesField = makeFieldStore({
  store: $generalInputState,
  getValue: (obj) => obj.numberOfStories,
  setValue: (draft, value) => {
    draft.numberOfStories = value;
  },
  placeholderStore: $resolvedGeneralInput,
  resettable: true,
});

export const buildingHeightField = makeFieldStore({
  store: $generalInputState,
  getValue: (obj) => obj.buildingHeight,
  setValue: (draft, value) => {
    draft.buildingHeight = value;
  },
  placeholderStore: $resolvedGeneralInput,
});

export const buildingBaseAreaField = makeFieldStore({
  store: $generalInputState,
  getValue: (obj) => obj.buildingBaseArea,
  setValue: (draft, value) => {
    draft.buildingBaseArea = value;
  },
  placeholderStore: $resolvedGeneralInput,
});

export const livingAreaField = makeFieldStore({
  store: $generalInputState,
  getValue: (obj) => obj.livingArea,
  setValue: (draft, value) => {
    draft.livingArea = value;
  },
  placeholderStore: $resolvedGeneralInput,
  resettable: true,
});
