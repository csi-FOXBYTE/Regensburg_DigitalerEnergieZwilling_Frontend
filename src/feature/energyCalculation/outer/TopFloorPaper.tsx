import { FieldLegend, FieldSeparator, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import { buildingYearOptions } from '@/lib/state/inputs/general';
import {
  hasAtticField,
  isAtticHeatedField,
  topFloorAreaField,
  topFloorHasInsulationField,
  topFloorInsulationThicknessField,
  topFloorTypeField,
  topFloorTypeOptions,
  topFloorYearField,
} from '@/lib/state/inputs/top-floor';
import { useStore } from '@nanostores/react';
import { Typography } from '../../../components/ui/typography';
import EnergyBooleanInput from '../EnergyBooleanInput';
import EnergyNumberInput from '../EnergyNumberInput';
import EnergySelectInput from '../EnergySelectInput';
import { InfoTooltipButton } from '../InfoButton';

export default function TopFloorPaper() {
  const hasAtticValue = useStore(hasAtticField.$store);
  const hasAtticPlaceholder = useStore(hasAtticField.$placeholder);
  const hasAttic = hasAtticValue ?? hasAtticPlaceholder;

  const isAtticHeatedValue = useStore(isAtticHeatedField.$store);
  const isAtticHeatedPlaceholder = useStore(isAtticHeatedField.$placeholder);
  const isAtticHeated = isAtticHeatedValue ?? isAtticHeatedPlaceholder;

  const topFloorHasInsulationValue = useStore(
    topFloorHasInsulationField.$store,
  );
  const topFloorHasInsulationPlaceholder = useStore(
    topFloorHasInsulationField.$placeholder,
  );
  const topFloorHasInsulation =
    topFloorHasInsulationValue ?? topFloorHasInsulationPlaceholder;

  if (!hasAttic || isAtticHeated) return null;

  return (
    <Paper variant="outlined" className="flex flex-col gap-4 p-4">
      <FieldSet className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FieldLegend>
          <Typography variant="h3" className="mb-2">
            Oberste Geschossdecke
          </Typography>
        </FieldLegend>
        <EnergySelectInput
          field={topFloorYearField}
          labelKey="outerParts.topFloor.year"
          rangeBandStore={buildingYearOptions}
          info={
            <InfoTooltipButton
              content="Geben Sie das Baujahr oder das Jahr der letzten Sanierung an. 
              Das Baujahr der Decke zwischen Wohnbereich und Dachraum hilft, die Dämmqualität einzuschätzen. Ältere Decken sind oft ungedämmt."
            ></InfoTooltipButton>
          }
        />
        <EnergyNumberInput
          field={topFloorAreaField}
          labelKey="outerParts.topFloor.area"
          suffix=" m²"
          decimalScale={1}
          allowNegative={false}
          info={
            <InfoTooltipButton
              content="Geben Sie die Fläche der Decke zwischen Wohnbereich und Dachraum in m² an. 
              Die Fläche der Decke zum Dachraum bestimmt, wie viel Wärme aus Ihrer Wohnung in den (meist unbeheizten) Dachraum entweichen kann."
            ></InfoTooltipButton>
          }
        />
        <EnergySelectInput
          field={topFloorTypeField}
          labelKey="outerParts.topFloor.type"
          selectionStore={topFloorTypeOptions}
        />
      </FieldSet>
      <FieldSeparator />
      <FieldSet className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FieldLegend variant="label" className="col-span-full">
          <Typography variant="h5" className="mb-2">
            Dämmung
          </Typography>
        </FieldLegend>
        <EnergyBooleanInput
          field={topFloorHasInsulationField}
          labelKey="outerParts.topFloor.hasInsulation"
          trueKey={{ ns: 'energyCalculation', key: 'booleanLabels.insulated' }}
          falseKey={{ ns: 'energyCalculation', key: 'booleanLabels.notInsulated' }}
          info={
            <InfoTooltipButton
              content="Eine Dämmung der Decke unter dem Dachraum verhindert, dass Wärme aus Ihrer Wohnung nach oben entweicht. 
              Das kann bis zu 15 % der Heizkosten sparen."
            ></InfoTooltipButton>
          }
        />
        {topFloorHasInsulation && (
          <EnergyNumberInput
            field={topFloorInsulationThicknessField}
            labelKey="outerParts.topFloor.insulationThickness"
            suffix=" m"
            decimalScale={2}
            allowNegative={false}
            className="col-start-1"
          />
        )}
      </FieldSet>
    </Paper>
  );
}
