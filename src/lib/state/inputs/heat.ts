import { type RangeKey } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import makeFieldStore from '../../field-store';
import { makeSelectionStore } from '../../selection-store';
import { $resolvedInputState } from '../computed/resolved-input';
import { $inputState } from './atoms';

export const heatingSystemConstructionYearField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.heat.heatingSystemConstructionYear as RangeKey | undefined,
  setValue: (draft, value) => {
    draft.heat.heatingSystemConstructionYear = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const primaryEnergyCarrierField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.heat.primaryEnergyCarrier ?? undefined,
  setValue: (draft, value) => {
    draft.heat.primaryEnergyCarrier = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const primaryEnergyCarrierOptions = makeSelectionStore(
  (config) => config.heat.primaryEnergyCarriers,
);

export const heatingSystemTypeOptions = makeSelectionStore(
  (config) => config.heat.heatingSystemTypes,
  {
    $store: $resolvedInputState,
    getKey: (state) => state.heat.primaryEnergyCarrier,
    getFilter: (config) => config.heat.allowedHeatingSystemTypesByCarrier,
  },
);

export const heatingSystemTypeField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.heat.heatingSystemType ?? undefined,
  setValue: (draft, value) => {
    draft.heat.heatingSystemType = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const heatingSurfaceTypeOptions = makeSelectionStore(
  (config) => config.heat.heatingSurfaceTypes,
);

export const heatingSurfaceTypeField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.heat.heatingSurfaceType ?? undefined,
  setValue: (draft, value) => {
    draft.heat.heatingSurfaceType = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const hasGasSupplyField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.heat.hasGasSupply ?? undefined,
  setValue: (draft, value) => {
    draft.heat.hasGasSupply = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: false,
});

export const hasBioGasField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.heat.hasBioGas ?? undefined,
  setValue: (draft, value) => {
    draft.heat.hasBioGas = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: false,
});

export const hasStorageField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.heat.hasStorage ?? undefined,
  setValue: (draft, value) => {
    draft.heat.hasStorage = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: false,
});

export const userThermalConsumptionField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.heat.userThermalConsumption ?? undefined,
  setValue: (draft, value) => {
    draft.heat.userThermalConsumption = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});

export const userThermalUnitRateField = makeFieldStore({
  store: $inputState,
  getValue: (obj) => obj.heat.userThermalUnitRate ?? undefined,
  setValue: (draft, value) => {
    draft.heat.userThermalUnitRate = value;
  },
  placeholderStore: $resolvedInputState,
  resettable: true,
});
