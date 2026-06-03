import { FieldLegend, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import { Separator } from '@/components/ui/separator';
import {
  exteriorWallWindowsAreaField,
  exteriorWallWindowsUValueField,
  exteriorWallWindowsWindowTypeField,
  exteriorWallWindowsWindowTypeOptions,
  exteriorWallWindowsYearField,
} from '@/lib/state/inputs/exterior-wall-windows';
import { buildingYearOptions } from '@/lib/state/inputs/general';
import { useTranslation } from 'react-i18next';
import { Typography } from '../../../components/ui/typography';
import EnergyNumberInput from '../EnergyNumberInput';
import EnergySelectInput from '../EnergySelectInput';
import { InfoTooltipButton } from '../InfoButton';

export default function WindowsPaper() {
  const { t } = useTranslation('energyCalculation');
  return (
    <Paper variant="outlined" className="pt-4 pr-5 pb-5 pl-5">
      <FieldSet className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FieldLegend className="col-span-full">
          <Typography variant="h4">{t('outerParts.windows.windows')}</Typography>
        </FieldLegend>
        <Separator className="col-span-full" />
        <EnergySelectInput
          field={exteriorWallWindowsYearField}
          labelKey="outerParts.windows.year"
          rangeBandStore={buildingYearOptions}
        />
        <EnergyNumberInput
          field={exteriorWallWindowsAreaField}
          labelKey="outerParts.windows.area"
          suffix=" m²"
          decimalScale={1}
          allowNegative={false}
          info={
            <InfoTooltipButton
              content={t('outerParts.windows.tooltips.area')}
            ></InfoTooltipButton>
          }
        />
        <EnergySelectInput
          field={exteriorWallWindowsWindowTypeField}
          labelKey="outerParts.windows.windowType"
          selectionStore={exteriorWallWindowsWindowTypeOptions}
          info={
            <InfoTooltipButton
              content={t('outerParts.windows.tooltips.windowType')}
            ></InfoTooltipButton>
          }
        />
        <EnergyNumberInput
          field={exteriorWallWindowsUValueField}
          labelKey="outerParts.windows.uValue"
          suffix=" W/m²K"
          decimalScale={2}
          allowNegative={false}
          info={
            <InfoTooltipButton
              content={t('outerParts.windows.tooltips.uValue')}
            ></InfoTooltipButton>
          }
        />
      </FieldSet>
    </Paper>
  );
}
