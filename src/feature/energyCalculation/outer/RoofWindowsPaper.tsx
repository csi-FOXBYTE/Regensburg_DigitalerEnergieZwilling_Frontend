import { FieldLegend, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import { buildingYearOptions } from '@/lib/state/inputs/general';
import {
  roofWindowsAreaField,
  roofWindowsUValueField,
  roofWindowsWindowTypeField,
  roofWindowsWindowTypeOptions,
  roofWindowsYearField,
} from '@/lib/state/inputs/roof-windows';
import { hasAtticField, isAtticHeatedField } from '@/lib/state/inputs/top-floor';
import { useStore } from '@nanostores/react';
import EnergyNumberInput from '../EnergyNumberInput';
import EnergySelectInput from '../EnergySelectInput';

export default function RoofWindowsPaper() {
  const hasAtticValue = useStore(hasAtticField.$store);
  const hasAtticPlaceholder = useStore(hasAtticField.$placeholder);
  const hasAttic = hasAtticValue ?? hasAtticPlaceholder;

  const isAtticHeatedValue = useStore(isAtticHeatedField.$store);
  const isAtticHeatedPlaceholder = useStore(isAtticHeatedField.$placeholder);
  const isAtticHeated = isAtticHeatedValue ?? isAtticHeatedPlaceholder;

  if (hasAttic && !isAtticHeated) return null;

  return (
    <Paper variant="outlined" className="p-3">
      <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
        <FieldLegend>Dachfenster</FieldLegend>
        <EnergySelectInput
          field={roofWindowsYearField}
          labelKey="outerParts.roofWindows.year"
          rangeBandStore={buildingYearOptions}
        />
        <EnergyNumberInput
          field={roofWindowsAreaField}
          labelKey="outerParts.roofWindows.area"
          suffix=" m²"
          decimalScale={1}
          allowNegative={false}
        />
        <EnergySelectInput
          field={roofWindowsWindowTypeField}
          labelKey="outerParts.roofWindows.windowType"
          selectionStore={roofWindowsWindowTypeOptions}
        />
        <EnergyNumberInput
          field={roofWindowsUValueField}
          labelKey="outerParts.roofWindows.uValue"
          suffix=" W/m²K"
          decimalScale={2}
          allowNegative={false}
        />
      </FieldSet>
    </Paper>
  );
}
