import { FieldGroup, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import { NumberInput } from '../../../components/ui/number-input';
import { TooltipProvider } from '../../../components/ui/tooltip';
import EnergyCalculationField from '../EnergyCalculationField';
import { InfoTooltipButton } from '../InfoButton';

export default function GeneralDataStepForm() {
  return (
    <TooltipProvider>
      <Paper variant="outlined" className="p-3">
        <FieldGroup>
          <FieldSet>
            <EnergyCalculationField
              labelKey="backButton"
              info={<InfoTooltipButton content={'Hi'} />}
            >
              <NumberInput />
            </EnergyCalculationField>
          </FieldSet>
        </FieldGroup>
      </Paper>
    </TooltipProvider>
  );
}
