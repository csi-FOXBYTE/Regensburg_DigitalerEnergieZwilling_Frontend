import { FieldLegend, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import {
  exteriorWallWindowsAreaField,
  exteriorWallWindowsUValueField,
  exteriorWallWindowsWindowTypeField,
  exteriorWallWindowsWindowTypeOptions,
  exteriorWallWindowsYearField,
} from '@/lib/state/inputs/exterior-wall-windows';
import { buildingYearOptions } from '@/lib/state/inputs/general';
import EnergyNumberInput from '../EnergyNumberInput';
import EnergySelectInput from '../EnergySelectInput';

export default function WindowsPaper() {
  return (
    <Paper variant="outlined" className="p-3">
      <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
        <FieldLegend>Fenster</FieldLegend>
        <EnergySelectInput
          field={exteriorWallWindowsYearField}
          labelKey="outerParts.windows.year"
          rangeBandStore={buildingYearOptions}
        />
        <EnergyNumberInput
          field={exteriorWallWindowsAreaField}
          labelKey="outerParts.windows.area"
          suffix=" m²"
          decimalScale={1}
          allowNegative={false}
        />
        <EnergySelectInput
          field={exteriorWallWindowsWindowTypeField}
          labelKey="outerParts.windows.windowType"
          selectionStore={exteriorWallWindowsWindowTypeOptions}
        />
        <EnergyNumberInput
          field={exteriorWallWindowsUValueField}
          labelKey="outerParts.windows.uValue"
          suffix=" W/m²K"
          decimalScale={2}
          allowNegative={false}
        />
      </FieldSet>
    </Paper>
  );
}
