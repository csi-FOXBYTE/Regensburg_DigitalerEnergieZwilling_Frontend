import { FieldGroup, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import type { SelectOption } from '@/components/ui/select';
import { BuildingType } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { useStore } from '@nanostores/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TooltipProvider } from '../../../components/ui/tooltip';
import {
  $isLivingAreaInvalid,
  buildingTypeField,
  buildingYearField,
  buildingYearOptions,
  livingAreaField,
  numberOfStoriesField,
} from '../../../lib/state/inputs/general';

import EnergyNumberInput from '../EnergyNumberInput';
import EnergySelectInput from '../EnergySelectInput';
import { InfoTooltipButton } from '../InfoButton';

export default function GeneralDataStepForm() {
  const { t } = useTranslation('energyCalculation');
  const livingAreaInvalid = useStore($isLivingAreaInvalid);

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
        <Paper variant="outlined" className="pt-4 pr-5 pb-5 pl-5">
          <FieldSet className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <EnergySelectInput
              field={buildingYearField}
              labelKey="generalData.fields.constructionYear"
              rangeBandStore={buildingYearOptions}
              info={
                <InfoTooltipButton content={t('generalData.tooltips.constructionYear')} />
              }
            />
            <EnergySelectInput
              field={buildingTypeField}
              labelKey="generalData.fields.buildingType"
              options={buildingTypeOptions}
              sortAlphabetically
              info={
                <InfoTooltipButton content={t('generalData.tooltips.buildingType')} />
              }
            />
            <EnergyNumberInput
              className="col-span-1"
              field={numberOfStoriesField}
              labelKey="generalData.fields.numberOfFloors"
              decimalScale={0}
              allowNegative={false}
              isAllowed={({ floatValue }) =>
                floatValue == null || floatValue >= 1
              }
              info={
                <InfoTooltipButton content={t('generalData.tooltips.numberOfFloors')} />
              }
            />
            <EnergyNumberInput
              className="col-span-1"
              field={livingAreaField}
              labelKey="generalData.fields.livingArea"
              suffix=" m²"
              decimalScale={1}
              allowNegative={false}
              error={
                livingAreaInvalid
                  ? t('generalData.errors.livingAreaMustBePositive')
                  : undefined
              }
              info={
                <InfoTooltipButton content={t('generalData.tooltips.livingArea')} />
              }
            />
          </FieldSet>
        </Paper>
      </FieldGroup>
    </TooltipProvider>
  );
}
