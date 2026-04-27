import { FieldLegend, FieldSeparator, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import {
  bottomFloorConstructionTypeField,
  bottomFloorConstructionTypeOptions,
  bottomFloorHasInsulationField,
  bottomFloorInsulationThicknessField,
  bottomFloorYearField,
  hasBasementField,
  isBasementHeatedField,
} from '@/lib/state/inputs/bottom-floor';
import { buildingYearOptions } from '@/lib/state/inputs/general';
import { useStore } from '@nanostores/react';
import EnergyBooleanInput from '../EnergyBooleanInput';
import EnergyNumberInput from '../EnergyNumberInput';
import EnergySelectInput from '../EnergySelectInput';

export default function BottomFloorPaper() {
  const hasBasementValue = useStore(hasBasementField.$store);
  const hasBasementPlaceholder = useStore(hasBasementField.$placeholder);
  const hasBasement = hasBasementValue ?? hasBasementPlaceholder;

  const isBasementHeatedValue = useStore(isBasementHeatedField.$store);
  const isBasementHeatedPlaceholder = useStore(isBasementHeatedField.$placeholder);
  const isBasementHeated = isBasementHeatedValue ?? isBasementHeatedPlaceholder;

  const bottomFloorHasInsulationValue = useStore(bottomFloorHasInsulationField.$store);
  const bottomFloorHasInsulationPlaceholder = useStore(bottomFloorHasInsulationField.$placeholder);
  const bottomFloorHasInsulation = bottomFloorHasInsulationValue ?? bottomFloorHasInsulationPlaceholder;

  const context = !hasBasement ? 'noBasement' : isBasementHeated ? 'heated' : 'default';

  return (
    <Paper variant="outlined" className="flex flex-col gap-4 p-3">
      <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
        <FieldLegend>Unterste Geschossdecke</FieldLegend>
        <EnergyBooleanInput
          field={hasBasementField}
          labelKey="outerParts.bottomFloor.hasBasement"
        />
        {hasBasement && (
          <EnergyBooleanInput
            field={isBasementHeatedField}
            labelKey="outerParts.bottomFloor.isBasementHeated"
          />
        )}
        <EnergySelectInput
          field={bottomFloorYearField}
          labelKey={`outerParts.bottomFloor.year.${context}`}
          rangeBandStore={buildingYearOptions}
          className="col-start-1"
        />
        <EnergySelectInput
          field={bottomFloorConstructionTypeField}
          labelKey={`outerParts.bottomFloor.constructionType.${context}`}
          selectionStore={bottomFloorConstructionTypeOptions}
        />
      </FieldSet>
      <FieldSeparator />
      <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
        <FieldLegend variant="label" className="col-span-full">Dämmung</FieldLegend>
        <EnergyBooleanInput
          field={bottomFloorHasInsulationField}
          labelKey={`outerParts.bottomFloor.hasInsulation.${context}`}
        />
        {bottomFloorHasInsulation && (
          <EnergyNumberInput
            field={bottomFloorInsulationThicknessField}
            labelKey="outerParts.bottomFloor.insulationThickness"
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
