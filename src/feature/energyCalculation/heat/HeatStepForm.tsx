import { useStore } from '@nanostores/react';
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import { TooltipProvider } from '@/components/ui/tooltip';
import { buildingYearOptions } from '@/lib/state/inputs/general';
import {
  hasBioGasField,
  hasGasSupplyField,
  hasStorageField,
  heatingSurfaceTypeField,
  heatingSurfaceTypeOptions,
  heatingSystemConstructionYearField,
  heatingSystemTypeField,
  heatingSystemTypeOptions,
  primaryEnergyCarrierField,
  primaryEnergyCarrierOptions,
} from '@/lib/state/inputs/heat';
import EnergyBooleanInput from '../EnergyBooleanInput';
import EnergySelectInput from '../EnergySelectInput';

export default function HeatStepForm() {
  const hasGasSupplyValue = useStore(hasGasSupplyField.$store);
  const hasGasSupplyPlaceholder = useStore(hasGasSupplyField.$placeholder);
  const showBioGas = hasGasSupplyValue ?? hasGasSupplyPlaceholder;

  return (
    <TooltipProvider>
      <FieldGroup>
        <Paper variant="outlined" className="p-3">
          <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
            <FieldLegend>Versorgung</FieldLegend>
            <EnergyBooleanInput
              field={hasGasSupplyField}
              labelKey="heat.supply.hasGasSupply"
            />
            {showBioGas && (
              <EnergyBooleanInput
                field={hasBioGasField}
                labelKey="heat.supply.hasBioGas"
              />
            )}
            <EnergyBooleanInput
              field={hasStorageField}
              labelKey="heat.supply.hasStorage"
              className="lg:col-start-1"
            />
          </FieldSet>
        </Paper>
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
