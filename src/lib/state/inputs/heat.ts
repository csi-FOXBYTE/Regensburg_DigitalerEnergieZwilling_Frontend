import { type DETHeatInput, type RangeKey } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import makeFieldStore from '../../field-store';
import { makeSelectionStore } from '../../selection-store';
import { $resolvedHeatInput } from '../computed/resolved-input';
import { $heatInputState } from './atoms';

export { $heatInputState };

export const heatingSystemConstructionYearField = makeFieldStore({
  store: $heatInputState,
  getValue: (obj) => obj.heatingSystemConstructionYear as RangeKey | undefined,
  setValue: (draft, value) => {
    draft.heatingSystemConstructionYear = value;
  },
  placeholderStore: $resolvedHeatInput,
  resettable: true,
});

export const primaryEnergyCarrierField = makeFieldStore({
  store: $heatInputState,
  getValue: (obj) => obj.primaryEnergyCarrier ?? undefined,
  setValue: (draft, value) => {
    draft.primaryEnergyCarrier = value;
  },
  placeholderStore: $resolvedHeatInput,
  resettable: true,
});

export const primaryEnergyCarrierOptions = makeSelectionStore(
  (config) => config.heat.primaryEnergyCarriers,
);

export const heatingSystemTypeOptions = makeSelectionStore(
  (config) => config.heat.heatingSystemTypes,
  {
    $store: $heatInputState,
    getKey: (state) => state.primaryEnergyCarrier,
    getFilter: (config) => config.heat.allowedHeatingSystemTypesByCarrier,
  },
);

export const heatingSystemTypeField = makeFieldStore({
  store: $heatInputState,
  getValue: (obj) => obj.heatingSystemType ?? undefined,
  setValue: (draft, value) => {
    draft.heatingSystemType = value;
  },
  placeholderStore: $resolvedHeatInput,
  resettable: true,
});

export const heatingSurfaceTypeOptions = makeSelectionStore(
  (config) => config.heat.heatingSurfaceTypes,
);

export const heatingSurfaceTypeField = makeFieldStore({
  store: $heatInputState,
  getValue: (obj) => obj.heatingSurfaceType ?? undefined,
  setValue: (draft, value) => {
    draft.heatingSurfaceType = value;
  },
  placeholderStore: $resolvedHeatInput,
  resettable: true,
});

