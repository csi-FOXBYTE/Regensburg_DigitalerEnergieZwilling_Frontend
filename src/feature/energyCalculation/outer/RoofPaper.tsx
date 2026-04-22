import { FieldLegend, FieldSeparator, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import { buildingYearOptions } from '@/lib/state/inputs/general';
import {
  roofAreaField,
  roofConstructionTypeField,
  roofConstructionTypeOptions,
  roofHasInsulationField,
  roofInsulationThicknessField,
  RoofInsulationType,
  roofInsulationTypeField,
  roofYearField,
} from '@/lib/state/inputs/roof';
import {
  hasAtticField,
  isAtticHeatedField,
} from '@/lib/state/inputs/top-floor';
import { useStore } from '@nanostores/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import EnergyBooleanInput from '../EnergyBooleanInput';
import EnergyNumberInput from '../EnergyNumberInput';
import EnergySelectInput from '../EnergySelectInput';

export default function RoofPaper() {
  const { t } = useTranslation('energyCalculation');

  const hasAtticValue = useStore(hasAtticField.$store);
  const hasAtticPlaceholder = useStore(hasAtticField.$placeholder);
  const hasAttic = hasAtticValue ?? hasAtticPlaceholder;

  const roofHasInsulationValue = useStore(roofHasInsulationField.$store);
  const roofHasInsulationPlaceholder = useStore(roofHasInsulationField.$placeholder);
  const roofHasInsulation = roofHasInsulationValue ?? roofHasInsulationPlaceholder;

  const roofInsulationTypeOptions = useMemo(
    () => [
      {
        value: RoofInsulationType.BETWEEN_RAFTER,
        label: t('outerParts.roof.insulationTypes.betweenRafter'),
      },
      {
        value: RoofInsulationType.ABOVE_RAFTER,
        label: t('outerParts.roof.insulationTypes.aboveRafter'),
      },
    ],
    [t],
  );

  return (
    <Paper variant="outlined" className="flex flex-col gap-4 p-3">
      <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
        <FieldLegend>Dach</FieldLegend>
        <EnergySelectInput
          field={roofYearField}
          labelKey="outerParts.roof.year"
          rangeBandStore={buildingYearOptions}
        />
        <EnergyNumberInput
          field={roofAreaField}
          labelKey="outerParts.roof.area"
          suffix=" m²"
          decimalScale={1}
          allowNegative={false}
        />
        <EnergySelectInput
          field={roofConstructionTypeField}
          labelKey="outerParts.roof.constructionType"
          selectionStore={roofConstructionTypeOptions}
        />
      </FieldSet>
      <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
        <EnergyBooleanInput
          field={hasAtticField}
          labelKey="outerParts.roof.hasAttic"
        />
        {hasAttic && (
          <EnergyBooleanInput
            field={isAtticHeatedField}
            labelKey="outerParts.roof.isAtticHeated"
          />
        )}
      </FieldSet>
      <FieldSeparator />
      <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
        <FieldLegend variant="label" className="col-span-full">Dämmung</FieldLegend>
        <EnergyBooleanInput
          field={roofHasInsulationField}
          labelKey="outerParts.roof.hasInsulation"
        />
        {roofHasInsulation && (
          <>
            <EnergyNumberInput
              field={roofInsulationThicknessField}
              labelKey="outerParts.roof.insulationThickness"
              suffix=" m"
              decimalScale={2}
              allowNegative={false}
              className="col-start-1"
            />
            <EnergySelectInput
              field={roofInsulationTypeField}
              labelKey="outerParts.roof.insulationType"
              options={roofInsulationTypeOptions}
            />
          </>
        )}
      </FieldSet>
    </Paper>
  );
}
