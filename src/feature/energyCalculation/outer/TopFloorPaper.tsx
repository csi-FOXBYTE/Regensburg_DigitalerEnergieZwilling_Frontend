import { FieldLegend, FieldSeparator, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import { buildingYearOptions } from '@/lib/state/inputs/general';
import {
  hasAtticField,
  isAtticHeatedField,
  topFloorAreaField,
  topFloorHasInsulationField,
  topFloorInsulationThicknessField,
  topFloorTypeField,
  topFloorTypeOptions,
  topFloorYearField,
} from '@/lib/state/inputs/top-floor';
import { useStore } from '@nanostores/react';
import EnergyBooleanInput from '../EnergyBooleanInput';
import EnergyNumberInput from '../EnergyNumberInput';
import EnergySelectInput from '../EnergySelectInput';

export default function TopFloorPaper() {
  const hasAtticValue = useStore(hasAtticField.$store);
  const hasAtticPlaceholder = useStore(hasAtticField.$placeholder);
  const hasAttic = hasAtticValue ?? hasAtticPlaceholder;

  const isAtticHeatedValue = useStore(isAtticHeatedField.$store);
  const isAtticHeatedPlaceholder = useStore(isAtticHeatedField.$placeholder);
  const isAtticHeated = isAtticHeatedValue ?? isAtticHeatedPlaceholder;

  const topFloorHasInsulationValue = useStore(topFloorHasInsulationField.$store);
  const topFloorHasInsulationPlaceholder = useStore(topFloorHasInsulationField.$placeholder);
  const topFloorHasInsulation = topFloorHasInsulationValue ?? topFloorHasInsulationPlaceholder;

  if (!hasAttic || isAtticHeated) return null;

  return (
    <Paper variant="outlined" className="flex flex-col gap-4 p-3">
      <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
        <FieldLegend>Oberste Geschossdecke</FieldLegend>
        <EnergySelectInput
          field={topFloorYearField}
          labelKey="outerParts.topFloor.year"
          rangeBandStore={buildingYearOptions}
        />
        <EnergyNumberInput
          field={topFloorAreaField}
          labelKey="outerParts.topFloor.area"
          suffix=" m²"
          decimalScale={1}
          allowNegative={false}
        />
        <EnergySelectInput
          field={topFloorTypeField}
          labelKey="outerParts.topFloor.type"
          selectionStore={topFloorTypeOptions}
        />
      </FieldSet>
      <FieldSeparator />
      <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
        <FieldLegend variant="label" className="col-span-full">Dämmung</FieldLegend>
        <EnergyBooleanInput
          field={topFloorHasInsulationField}
          labelKey="outerParts.topFloor.hasInsulation"
        />
        {topFloorHasInsulation && (
          <EnergyNumberInput
            field={topFloorInsulationThicknessField}
            labelKey="outerParts.topFloor.insulationThickness"
            suffix=" m"
            decimalScale={2}
            allowNegative={false}
            className="col-start-1"
          />
        )}
      </FieldSet>
    </Paper>
  );
}
