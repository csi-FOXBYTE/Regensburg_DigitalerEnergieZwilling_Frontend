import { FieldGroup, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import EnergyCalculationField from '../EnergyCalculationField';

export default function GeneralDataStepForm() {
  return (
    <Paper variant="outlined" className='p-3'>
      <FieldGroup>
        <FieldSet>
          <EnergyCalculationField labelKey='backButton'/>
        </FieldSet>
      </FieldGroup>
    </Paper>
  )
}