import { useStore } from '@nanostores/react';
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import { TooltipProvider } from '@/components/ui/tooltip';
import { $config } from '@/lib/state/calculation-config';
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
  userThermalConsumptionField,
  userThermalUnitRateField,
} from '@/lib/state/inputs/heat';
import EnergyBooleanInput from '../EnergyBooleanInput';
import EnergyNumberInput from '../EnergyNumberInput';
import EnergySelectInput from '../EnergySelectInput';

export default function HeatStepForm() {
  const hasGasSupplyValue = useStore(hasGasSupplyField.$store);
  const hasGasSupplyPlaceholder = useStore(hasGasSupplyField.$placeholder);
  const showBioGas = hasGasSupplyValue ?? hasGasSupplyPlaceholder;

  const config = useStore($config);
  const carrierValue = useStore(primaryEnergyCarrierField.$store);
  const carrierPlaceholder = useStore(primaryEnergyCarrierField.$placeholder);
  const carrier = carrierValue ?? carrierPlaceholder;
  const thermalUnit = carrier
    ? config.heat.primaryEnergyCarrierData.find((d) => d.key === carrier)?.value.unit ?? ''
    : '';

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
        <Paper variant="outlined" className="p-3">
          <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
            <FieldLegend>Verbrauch</FieldLegend>
            <EnergyNumberInput
              field={userThermalConsumptionField}
              labelKey="heat.bills.consumption"
              suffix={thermalUnit ? ` ${thermalUnit}/a` : undefined}
              decimalScale={0}
              allowNegative={false}
            />
            <EnergyNumberInput
              field={userThermalUnitRateField}
              labelKey="heat.bills.unitRate"
              suffix={thermalUnit ? ` €/${thermalUnit}` : ' €'}
              decimalScale={2}
              allowNegative={false}
            />
          </FieldSet>
        </Paper>
      </FieldGroup>
    </TooltipProvider>
  );
}
