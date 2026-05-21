import { FieldLegend, FieldSeparator, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import {
  bottomFloorAreaField,
  bottomFloorConstructionTypeField,
  bottomFloorConstructionTypeOptions,
  bottomFloorHasInsulationField,
  bottomFloorInsulationThicknessField,
  bottomFloorYearField,
  hasBasementField,
  isBasementHeatedField,
} from '@/lib/state/inputs/bottom-floor';
import { buildingYearOptions } from '@/lib/state/inputs/general';
import { useStore } from '@nanostores/react';
import { Typography } from '../../../components/ui/typography';
import EnergyBooleanInput from '../EnergyBooleanInput';
import EnergyNumberInput from '../EnergyNumberInput';
import EnergySelectInput from '../EnergySelectInput';
import { InfoTooltipButton } from '../InfoButton';

export default function BottomFloorPaper() {
  const hasBasementValue = useStore(hasBasementField.$store);
  const hasBasementPlaceholder = useStore(hasBasementField.$placeholder);
  const hasBasement = hasBasementValue ?? hasBasementPlaceholder;

  const isBasementHeatedValue = useStore(isBasementHeatedField.$store);
  const isBasementHeatedPlaceholder = useStore(
    isBasementHeatedField.$placeholder,
  );
  const isBasementHeated = isBasementHeatedValue ?? isBasementHeatedPlaceholder;

  const bottomFloorHasInsulationValue = useStore(
    bottomFloorHasInsulationField.$store,
  );
  const bottomFloorHasInsulationPlaceholder = useStore(
    bottomFloorHasInsulationField.$placeholder,
  );
  const bottomFloorHasInsulation =
    bottomFloorHasInsulationValue ?? bottomFloorHasInsulationPlaceholder;

  const context = !hasBasement
    ? 'noBasement'
    : isBasementHeated
      ? 'heated'
      : 'default';

  return (
    <Paper variant="outlined" className="flex flex-col gap-4 p-4">
      <FieldSet className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FieldLegend>
          <Typography variant="h3" className="mb-2">
            Unterste Geschossdecke
          </Typography>
        </FieldLegend>
        <EnergyBooleanInput
          field={hasBasementField}
          labelKey="outerParts.bottomFloor.hasBasement"
          info={
            <InfoTooltipButton
              content="Geben Sie an, ob Ihr Gebäude einen Keller hat. 
              Ein Keller unter den Wohnräumen beeinflusst die Wärmedämmung und damit Ihren Energiebedarf – 
              besonders wenn er unbeheizt ist."
            ></InfoTooltipButton>
          }
        />
        {hasBasement && (
          <EnergyBooleanInput
            field={isBasementHeatedField}
            labelKey="outerParts.bottomFloor.isBasementHeated"
            info={
              <InfoTooltipButton
                content="Bei einem unbeheizten Keller ist die Dämmung der Kellerdecke besonders
                 sinnvoll, damit keine Kälte in die Wohnräume aufsteigt."
              ></InfoTooltipButton>
            }
          />
        )}
        <EnergyNumberInput
          field={bottomFloorAreaField}
          labelKey={`outerParts.bottomFloor.area.${context}`}
          suffix=" m²"
          decimalScale={1}
          allowNegative={false}
          className="col-start-1"
          info={
            <InfoTooltipButton
              content="Geben Sie die Fläche der/des Kellerdecke/Kellerbodens/Bodens an. 
               Die Fläche der/des Kellerdecke/Kellerbodens/Bodens zeigt, 
               wie viel Kälte aus dem Keller in Ihre Wohnräume dringen kann."
            ></InfoTooltipButton>
          }
        />
        <EnergySelectInput
          field={bottomFloorYearField}
          labelKey={`outerParts.bottomFloor.year.${context}`}
          rangeBandStore={buildingYearOptions}
          info={
            <InfoTooltipButton
              content="Geben Sie das Baujahr oder das Jahr der letzten Sanierung an. 
              Ältere, ungedämmte Kellerdecken/Kellerböden lassen Kälte in die Wohnräume aufsteigen."
            ></InfoTooltipButton>
          }
        />
        <EnergySelectInput
          field={bottomFloorConstructionTypeField}
          labelKey={`outerParts.bottomFloor.constructionType.${context}`}
          selectionStore={bottomFloorConstructionTypeOptions}
          info={
            <InfoTooltipButton
              content="Massive Betondecken/Betonböden lassen sich gut dämmen und speichern Wärme besser.
               Holzbalkendecken haben andere Dämmeigenschaften."
            ></InfoTooltipButton>
          }
        />
      </FieldSet>
      <FieldSeparator />
      <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
        <FieldLegend variant="label" className="col-span-full">
          <Typography variant="h5" className="mb-2">
            Dämmung
          </Typography>
        </FieldLegend>
        <EnergyBooleanInput
          field={bottomFloorHasInsulationField}
          labelKey={`outerParts.bottomFloor.hasInsulation.${context}`}
          info={
            <InfoTooltipButton
              content="Eine Dämmung der/des Kellerdecke/Kellerbodens/Bodens verhindert, 
              dass Kälte aus dem Keller in Ihre Wohnräume dringt. 
              Das verbessert den Wohnkomfort und senkt Heizkosten."
            ></InfoTooltipButton>
          }
        />
        {bottomFloorHasInsulation && (
          <EnergyNumberInput
            field={bottomFloorInsulationThicknessField}
            labelKey="outerParts.bottomFloor.insulationThickness"
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
