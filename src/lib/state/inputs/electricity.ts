import makeFieldStore from '../../field-store';
import { $resolvedElectricityInput } from '../computed/resolved-input';
import { $electricityInputState } from './atoms';

export { $electricityInputState };

export const hasRenewableEnergyField = makeFieldStore({
  store: $electricityInputState,
  getValue: (obj) => obj.hasRenewableEnergy ?? undefined,
  setValue: (draft, value) => {
    draft.hasRenewableEnergy = value;
  },
  placeholderStore: $resolvedElectricityInput,
  resettable: false,
});
