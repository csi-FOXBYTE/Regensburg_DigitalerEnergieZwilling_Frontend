import { FieldLegend, FieldSeparator, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import { buildingYearOptions } from '@/lib/state/inputs/general';
import {
  outerWallAreaField,
  outerWallConstructionTypeField,
  outerWallConstructionTypeOptions,
  outerWallHasInsulationField,
  outerWallInsulationThicknessField,
  outerWallYearField,
} from '@/lib/state/inputs/outer-wall';
import { useStore } from '@nanostores/react';
import EnergyBooleanInput from '../EnergyBooleanInput';
import EnergyNumberInput from '../EnergyNumberInput';
import EnergySelectInput from '../EnergySelectInput';

export default function OuterWallPaper() {
  const outerWallHasInsulationValue = useStore(outerWallHasInsulationField.$store);
  const outerWallHasInsulationPlaceholder = useStore(outerWallHasInsulationField.$placeholder);
  const outerWallHasInsulation = outerWallHasInsulationValue ?? outerWallHasInsulationPlaceholder;

  return (
    <Paper variant="outlined" className="flex flex-col gap-4 p-3">
      <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
        <FieldLegend>Außenwand</FieldLegend>
        <EnergySelectInput
          field={outerWallYearField}
          labelKey="outerParts.outerWall.year"
          rangeBandStore={buildingYearOptions}
        />
        <EnergyNumberInput
          field={outerWallAreaField}
          labelKey="outerParts.outerWall.area"
          suffix=" m²"
          decimalScale={1}
          allowNegative={false}
        />
        <EnergySelectInput
          field={outerWallConstructionTypeField}
          labelKey="outerParts.outerWall.constructionType"
          selectionStore={outerWallConstructionTypeOptions}
        />
      </FieldSet>
      <FieldSeparator />
      <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
        <FieldLegend variant="label" className="col-span-full">Dämmung</FieldLegend>
        <EnergyBooleanInput
          field={outerWallHasInsulationField}
          labelKey="outerParts.outerWall.hasInsulation"
        />
        {outerWallHasInsulation && (
          <EnergyNumberInput
            field={outerWallInsulationThicknessField}
            labelKey="outerParts.outerWall.insulationThickness"
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
