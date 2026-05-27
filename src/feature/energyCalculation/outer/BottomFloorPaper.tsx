import { FieldLegend, FieldSeparator, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import { Separator } from '@/components/ui/separator';
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
    <Paper variant="outlined" className="flex flex-col gap-6 pt-4 pr-5 pb-5 pl-5">
      <FieldSet className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FieldLegend className="col-span-full">
          <Typography variant="h4">
            Unterste Geschossdecke
          </Typography>
        </FieldLegend>
        <Separator className="col-span-full" />
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
            trueKey={{ ns: 'energyCalculation', key: 'booleanLabels.heated' }}
            falseKey={{
              ns: 'energyCalculation',
              key: 'booleanLabels.notHeated',
            }}
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
              content={`Geben Sie die Fläche ${context === 'noBasement' ? 'des Bodens' : context === 'heated' ? 'des Kellerbodens' : 'der Kellerdecke'} an. 
              Die Fläche beeinflusst, wie viel Wärme über den unteren Gebäudeabschluss verloren gehen kann.`}
            ></InfoTooltipButton>
          }
        />
        <EnergySelectInput
          field={bottomFloorYearField}
          labelKey={`outerParts.bottomFloor.year.${context}`}
          rangeBandStore={buildingYearOptions}
          info={
            <InfoTooltipButton
              content={`Geben Sie das Baujahr oder das Jahr der letzten Sanierung an. Ältere, ungedämmte ${context === 'noBasement' ? 'Böden' : context === 'heated' ? 'Kellerböden' : 'Kellerdecken'} lassen Kälte in die Wohnräume aufsteigen.`}
            ></InfoTooltipButton>
          }
        />
        <EnergySelectInput
          field={bottomFloorConstructionTypeField}
          labelKey={`outerParts.bottomFloor.constructionType.${context}`}
          selectionStore={bottomFloorConstructionTypeOptions}
          info={
            <InfoTooltipButton
              content={`Massive ${context === 'default' ? 'Betondecken' : 'Betonböden'} lassen sich gut dämmen und speichern Wärme besser. ${context === 'default' ? 'Holzbalkendecken' : 'Holzbalkenböden'} haben andere Dämmeigenschaften.`}
            ></InfoTooltipButton>
          }
        />
      </FieldSet>
      <FieldSeparator />
      <FieldSet className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FieldLegend variant="label" className="col-span-full font-bold">
          Dämmung
        </FieldLegend>
        <EnergyBooleanInput
          field={bottomFloorHasInsulationField}
          labelKey={`outerParts.bottomFloor.hasInsulation.${context}`}
          trueKey={{ ns: 'energyCalculation', key: 'booleanLabels.insulated' }}
          falseKey={{
            ns: 'energyCalculation',
            key: 'booleanLabels.notInsulated',
          }}
          info={
            <InfoTooltipButton
              content={`Eine Dämmung ${context === 'noBasement' ? 'des Bodens' : context === 'heated' ? 'des Kellerbodens' : 'der Kellerdecke'} hilft, Wärme im Gebäude zu halten. 
              Dadurch bleiben Fußböden wärmer und Heizkosten können reduziert werden.`}
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
