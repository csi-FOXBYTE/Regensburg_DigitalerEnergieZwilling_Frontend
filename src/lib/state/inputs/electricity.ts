import makeFieldStore from '../../field-store';
import { makeSelectionStore } from '../../selection-store';
import { $resolvedElectricityInput } from '../computed/resolved-input';
import { $electricityInputState } from './atoms';

export { $electricityInputState };

export const electricityTypeOptions = makeSelectionStore(
  (config) => config.heat.electricityTypes,
);

export const electricityTypeField = makeFieldStore({
  store: $electricityInputState,
  getValue: (obj) => obj.electricityType ?? undefined,
  setValue: (draft, value) => {
    draft.electricityType = value;
  },
  placeholderStore: $resolvedElectricityInput,
  resettable: true,
});

export const userElectricityConsumptionField = makeFieldStore({
  store: $electricityInputState,
  getValue: (obj) => obj.userElectricityConsumption ?? undefined,
  setValue: (draft, value) => {
    draft.userElectricityConsumption = value;
  },
  placeholderStore: $resolvedElectricityInput,
  resettable: true,
});

export const electricityUnitRateField = makeFieldStore({
  store: $electricityInputState,
  getValue: (obj) => obj.electricityUnitRate ?? undefined,
  setValue: (draft, value) => {
    draft.electricityUnitRate = value;
  },
  placeholderStore: $resolvedElectricityInput,
  resettable: true,
});
