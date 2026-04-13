import { type DETGeneralInput } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { atom } from 'nanostores';
import makeFieldStore from '../field-store';

export const $generalInputState = atom<Partial<DETGeneralInput>>({});

export const buildingTypeField = makeFieldStore({
  store: $generalInputState,
  getValue: (obj) => obj.type,
  setValue: (draft, value) => {
    draft.type = value;
  },
  resettable: true,
});

export const numberOfStoriesField = makeFieldStore({
  store: $generalInputState,
  getValue: (obj) => obj.numberOfStories,
  setValue: (draft, value) => {
    draft.numberOfStories = value;
  },
  resettable: true,
});

export const buildingHeightField = makeFieldStore({
  store: $generalInputState,
  getValue: (obj) => obj.buildingHeight,
  setValue: (draft, value) => {
    draft.buildingHeight = value;
  },
});

export const buildingBaseAreaField = makeFieldStore({
  store: $generalInputState,
  getValue: (obj) => obj.buildingBaseArea,
  setValue: (draft, value) => {
    draft.buildingBaseArea = value;
  },
});

export const livingAreaField = makeFieldStore({
  store: $generalInputState,
  getValue: (obj) => obj.livingArea,
  setValue: (draft, value) => {
    draft.livingArea = value;
  },
});
