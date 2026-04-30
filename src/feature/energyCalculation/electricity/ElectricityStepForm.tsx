import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  electricityTypeField,
  electricityTypeOptions,
  electricityUnitRateField,
  userElectricityConsumptionField,
} from '@/lib/state/inputs/electricity';
import EnergyNumberInput from '../EnergyNumberInput';
import EnergySelectInput from '../EnergySelectInput';

export default function ElectricityStepForm() {
  return (
    <TooltipProvider>
      <FieldGroup>
        <Paper variant="outlined" className="p-3">
          <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
            <FieldLegend>Strom</FieldLegend>
            <EnergySelectInput
              field={electricityTypeField}
              labelKey="electricity.type"
              selectionStore={electricityTypeOptions}
            />
            <EnergyNumberInput
              field={userElectricityConsumptionField}
              labelKey="electricity.consumption"
              suffix=" kWh/a"
              decimalScale={0}
              allowNegative={false}
            />
            <EnergyNumberInput
              field={electricityUnitRateField}
              labelKey="electricity.unitRate"
              suffix=" €/kWh"
              decimalScale={2}
              allowNegative={false}
            />
          </FieldSet>
        </Paper>
      </FieldGroup>
    </TooltipProvider>
  );
}
