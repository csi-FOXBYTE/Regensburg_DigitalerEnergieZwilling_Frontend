import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import { TooltipProvider } from '@/components/ui/tooltip';
import { buildingYearOptions } from '@/lib/state/inputs/general';
import {
  heatingSurfaceTypeField,
  heatingSurfaceTypeOptions,
  heatingSystemConstructionYearField,
  heatingSystemTypeField,
  heatingSystemTypeOptions,
  primaryEnergyCarrierField,
  primaryEnergyCarrierOptions,
} from '@/lib/state/inputs/heat';
import EnergySelectInput from '../EnergySelectInput';

export default function HeatStepForm() {
  return (
    <TooltipProvider>
      <FieldGroup>
        <Paper variant="outlined" className="p-3">
          <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
            <FieldLegend>Heizung</FieldLegend>
            <EnergySelectInput
              field={heatingSystemConstructionYearField}
              labelKey="heat.heating.constructionYear"
              rangeBandStore={buildingYearOptions}
            />
            <EnergySelectInput
              field={primaryEnergyCarrierField}
              labelKey="heat.heating.primaryEnergyCarrier"
              selectionStore={primaryEnergyCarrierOptions}
            />
            <EnergySelectInput
              field={heatingSystemTypeField}
              labelKey="heat.heating.heatingSystemType"
              selectionStore={heatingSystemTypeOptions}
            />
            <EnergySelectInput
              field={heatingSurfaceTypeField}
              labelKey="heat.heating.heatingSurfaceType"
              selectionStore={heatingSurfaceTypeOptions}
            />
          </FieldSet>
        </Paper>
      </FieldGroup>
    </TooltipProvider>
  );
}
