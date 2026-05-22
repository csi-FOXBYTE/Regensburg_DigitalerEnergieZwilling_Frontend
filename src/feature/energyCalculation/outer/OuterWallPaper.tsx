import { FieldLegend, FieldSeparator, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import { buildingYearOptions } from '@/lib/state/inputs/general';
import {
  outerWallAreaField,
  outerWallConstructionTypeField,
  outerWallConstructionTypeOptions,
  outerWallHasInsulationField,
  outerWallInsulationThicknessField,
  outerWallYearField,
} from '@/lib/state/inputs/outer-wall';
import { useStore } from '@nanostores/react';
import { Typography } from '../../../components/ui/typography';
import EnergyBooleanInput from '../EnergyBooleanInput';
import EnergyNumberInput from '../EnergyNumberInput';
import EnergySelectInput from '../EnergySelectInput';
import { InfoTooltipButton } from '../InfoButton';

export default function OuterWallPaper() {
  const outerWallHasInsulationValue = useStore(
    outerWallHasInsulationField.$store,
  );
  const outerWallHasInsulationPlaceholder = useStore(
    outerWallHasInsulationField.$placeholder,
  );
  const outerWallHasInsulation =
    outerWallHasInsulationValue ?? outerWallHasInsulationPlaceholder;

  return (
    <Paper variant="outlined" className="flex flex-col gap-4 p-4">
      <FieldSet className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FieldLegend>
          <Typography variant="h3" className="mb-2">
            Außenwand
          </Typography>
        </FieldLegend>
        <EnergySelectInput
          field={outerWallYearField}
          labelKey="outerParts.outerWall.year"
          rangeBandStore={buildingYearOptions}
          info={
            <InfoTooltipButton
              content="Geben Sie das Baujahr oder das Jahr der letzten größeren Fassadensanierung an. 
              Ältere Wände ohne Dämmung verlieren viel Heizwärme nach außen."
            ></InfoTooltipButton>
          }
        />
        <EnergyNumberInput
          field={outerWallAreaField}
          labelKey="outerParts.outerWall.area"
          suffix=" m²"
          decimalScale={1}
          allowNegative={false}
          info={
            <InfoTooltipButton
              content="Geben Sie die gesamte Fläche aller Außenwände an, ohne Abzug von Fensterflächen.
               Die Gesamtfläche aller Außenwände beeinflusst den Wärmeverlust. Größere Wandflächen bedeuten mehr Wärmeverlust."
            ></InfoTooltipButton>
          }
        />
        <EnergySelectInput
          field={outerWallConstructionTypeField}
          labelKey="outerParts.outerWall.constructionType"
          selectionStore={outerWallConstructionTypeOptions}
          info={
            <InfoTooltipButton content="Massivwände (z. B. Ziegel oder Beton) speichern Wärme gut."></InfoTooltipButton>
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
          field={outerWallHasInsulationField}
          labelKey="outerParts.outerWall.hasInsulation"
          trueKey={{ ns: 'energyCalculation', key: 'booleanLabels.insulated' }}
          falseKey={{ ns: 'energyCalculation', key: 'booleanLabels.notInsulated' }}
          info={
            <InfoTooltipButton
              content="Durch ungedämmte Außenwände gehen bis zu 40 % der Heizwärme verloren. 
              Eine Dämmung senkt die Heizkosten erheblich."
            ></InfoTooltipButton>
          }
        />
        {outerWallHasInsulation && (
          <EnergyNumberInput
            field={outerWallInsulationThicknessField}
            labelKey="outerParts.outerWall.insulationThickness"
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
