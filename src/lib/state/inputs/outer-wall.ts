import { type RangeKey } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { produce } from 'immer';
import { computed } from 'nanostores';
import makeFieldStore from '../../field-store';
import {
  bindFieldToOptions,
  makeSelectionStore,
} from '../../selection-store';
import { rangeKeyEquals } from '../../yearHelper/rangeBandOptions';
import {
  $resolvedInput,
  $resolvedInputState,
} from '../computed/resolved-input';
import { $inputState } from './atoms';
import { buildingOrNewerYearOptions } from './general';

export const outerWallYearField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.outerWall.year as RangeKey | undefined,
  setValue: (draft, value) => {
    draft.outerWall.year = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

bindFieldToOptions(
  outerWallYearField,
  buildingOrNewerYearOptions,
  rangeKeyEquals,
);

export const outerWallAreaField = makeFieldStore({
  store: $inputState,
  getValue: (obj): number | null | undefined => obj.outerWall.area,
  setValue: (draft, value) => {
    draft.outerWall.area = value ?? undefined;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const outerWallAdjacentWallAreaField = makeFieldStore({
  store: $inputState,
  getValue: (obj): number | null | undefined => obj.outerWall.adjacentWallArea,
  setValue: (draft, value) => {
    draft.outerWall.adjacentWallArea = value ?? undefined;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const $isAdjacentWallAreaInvalid = computed(
  [$inputState, $resolvedInputState],
  (input, resolved) => {
    const outerWallArea = input.outerWall.area ?? resolved.outerWall.area;
    const adjacentWallArea =
      input.outerWall.adjacentWallArea ?? resolved.outerWall.adjacentWallArea;

    return (
      outerWallArea != null &&
      adjacentWallArea != null &&
      adjacentWallArea > outerWallArea
    );
  },
);

export const outerWallConstructionTypeOptions = makeSelectionStore(
  (config) => config.outerWall.constructionTypes,
);

export const outerWallConstructionTypeField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.outerWall.constructionType ?? undefined,
  setValue: (draft, value) => {
    draft.outerWall.constructionType = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

bindFieldToOptions(
  outerWallConstructionTypeField,
  outerWallConstructionTypeOptions,
);

export const outerWallHasInsulationField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.outerWall.hasInsulation ?? undefined,
  setValue: (draft, value) => {
    draft.outerWall.hasInsulation = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const outerWallInsulationThicknessField = makeFieldStore({
  store: $inputState,
  getValue: (obj): number | null | undefined => obj.outerWall.insulationThickness,
  setValue: (draft, value) => {
    draft.outerWall.insulationThickness = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const $allowsAdditionalOuterWallInsulation = computed(
  $resolvedInput,
  (input) => input.outerWall.allowsAdditionalInsulation,
);

$allowsAdditionalOuterWallInsulation.subscribe((allowsAdditionalInsulation) => {
  if (allowsAdditionalInsulation !== false) return;

  const input = $inputState.get();
  if (
    input.outerWall.hasInsulation === undefined &&
    input.outerWall.insulationThickness === undefined
  ) {
    return;
  }

  $inputState.set(
    produce(input, (draft) => {
      draft.outerWall.hasInsulation = undefined;
      draft.outerWall.insulationThickness = undefined;
    }),
  );
});
