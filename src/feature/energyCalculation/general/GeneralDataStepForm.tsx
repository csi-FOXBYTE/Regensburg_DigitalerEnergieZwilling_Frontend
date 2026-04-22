import { FieldGroup, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import type { SelectOption } from '@/components/ui/select';
import { BuildingType } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TooltipProvider } from '../../../components/ui/tooltip';
import {
  buildingTypeField,
  buildingYearField,
  buildingYearOptions,
  livingAreaField,
  numberOfStoriesField,
} from '../../../lib/state/inputs/general';

import EnergyNumberInput from '../EnergyNumberInput';
import EnergySelectInput from '../EnergySelectInput';

export default function GeneralDataStepForm() {
  const { t } = useTranslation('energyCalculation');

  const buildingTypeOptions = useMemo<SelectOption<BuildingType>[]>(
    () => [
      {
        value: BuildingType.SINGLE_FAMILY,
        label: t('generalData.buildingType.singleFamily'),
      },
      {
        value: BuildingType.MULTI_FAMILY,
        label: t('generalData.buildingType.multiFamily'),
      },
    ],
    [t],
  );

  return (
    <TooltipProvider>
      <FieldGroup>
        <Paper variant="outlined" className="p-3">
          <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
            <EnergySelectInput
              field={buildingYearField}
              labelKey="generalData.fields.constructionYear"
              rangeBandStore={buildingYearOptions}
            />
            <EnergySelectInput
              field={buildingTypeField}
              labelKey="generalData.fields.buildingType"
              options={buildingTypeOptions}
            />
            <EnergyNumberInput
              className="col-span-1"
              field={numberOfStoriesField}
              labelKey="generalData.fields.numberOfFloors"
              decimalScale={0}
              allowNegative={false}
            />
            <EnergyNumberInput
              className="col-span-1"
              field={livingAreaField}
              labelKey="generalData.fields.livingArea"
              suffix=" m²"
              decimalScale={1}
              allowNegative={false}
            />

          </FieldSet>
        </Paper>
      </FieldGroup>
    </TooltipProvider>
  );
}
