import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import { hasRenewableEnergyField } from '@/lib/state/inputs/electricity';
import EnergyBooleanInput from '../EnergyBooleanInput';

export default function ElectricityStepForm() {
  return (
    <FieldGroup>
      <Paper variant="outlined" className="p-3">
        <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
          <FieldLegend>Strom</FieldLegend>
          <EnergyBooleanInput
            field={hasRenewableEnergyField}
            labelKey="electricity.hasRenewableEnergy"
          />
        </FieldSet>
      </Paper>
    </FieldGroup>
  );
}
