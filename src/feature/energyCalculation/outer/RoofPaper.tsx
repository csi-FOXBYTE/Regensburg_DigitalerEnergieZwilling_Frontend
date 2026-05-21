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
import { Typography } from '../../../components/ui/typography';
import EnergyBooleanInput from '../EnergyBooleanInput';
import EnergyNumberInput from '../EnergyNumberInput';
import EnergySelectInput from '../EnergySelectInput';
import { InfoDialogButton, InfoTooltipButton } from '../InfoButton';

export default function RoofPaper() {
  const { t } = useTranslation('energyCalculation');

  const hasAtticValue = useStore(hasAtticField.$store);
  const hasAtticPlaceholder = useStore(hasAtticField.$placeholder);
  const hasAttic = hasAtticValue ?? hasAtticPlaceholder;

  const roofHasInsulationValue = useStore(roofHasInsulationField.$store);
  const roofHasInsulationPlaceholder = useStore(
    roofHasInsulationField.$placeholder,
  );
  const roofHasInsulation =
    roofHasInsulationValue ?? roofHasInsulationPlaceholder;

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
    <Paper variant="outlined" className="flex flex-col gap-4 p-4">
      <FieldSet className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FieldLegend>
          <Typography variant="h3">Dach</Typography>
        </FieldLegend>
        <EnergySelectInput
          field={roofYearField}
          labelKey="outerParts.roof.year"
          rangeBandStore={buildingYearOptions}
          info={
            <InfoTooltipButton
              content="Geben Sie das Baujahr oder das Jahr der letzten Dachsanierung an. 
            Ältere Dächer sind oft schlechter gedämmt und verlieren mehr Wärme nach außen."
            ></InfoTooltipButton>
          }
        />
        <EnergyNumberInput
          field={roofAreaField}
          labelKey="outerParts.roof.area"
          suffix=" m²"
          decimalScale={1}
          allowNegative={false}
          info={
            <InfoTooltipButton
              content="Geben Sie die gesamte Fläche Ihres Dachs an, ohne Abzug von Fensterflächen. 
              Je größer die Fläche, desto wichtiger ist eine gute Dämmung."
            ></InfoTooltipButton>
          }
        />
        <EnergySelectInput
          field={roofConstructionTypeField}
          labelKey="outerParts.roof.constructionType"
          selectionStore={roofConstructionTypeOptions}
          info={
            <InfoDialogButton
              title="Dachformen"
              content="Ein Flachdach ist nahezu eben oder nur leicht geneigt. 
              Ein Schrägdach besitzt eine deutlich sichtbare Dachneigung, z. B. ein Satteldach oder Walmdach. 
              Die Dachform beeinflusst sowohl die Dachfläche als auch den Wärmeverlust eines Gebäudes: 
              Flachdächer (typisch massive Bauweise) haben bei gleicher Grundfläche eine geringere Fläche als Schrägdächer
               (typisch Holzbauweise) und damit andere energetische Eigenschaften."
            />
          }
        />
      </FieldSet>
      <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
        <EnergyBooleanInput
          field={hasAtticField}
          labelKey="outerParts.roof.hasAttic"
          info={
            <InfoTooltipButton
              content="Geben Sie an, ob Ihr Gebäude einen zugänglichen Dachraum (Dachboden) hat. 
              Ein vorhandener Dachraum beeinflusst die Dämmung der obersten Geschossdecke und 
              damit den Wärmeverlust des Gebäudes nach oben."
            ></InfoTooltipButton>
          }
        />
        {hasAttic && (
          <EnergyBooleanInput
            field={isAtticHeatedField}
            labelKey="outerParts.roof.isAtticHeated"
            info={
              <InfoTooltipButton content="Geben Sie an, ob der Raum direkt unter dem Dach beheizt wird."></InfoTooltipButton>
            }
          />
        )}
      </FieldSet>
      <FieldSeparator />
      <FieldSet className="grid grid-cols-1 lg:grid-cols-2">
        <FieldLegend variant="label" className="col-span-full">
          Dämmung
        </FieldLegend>
        <EnergyBooleanInput
          field={roofHasInsulationField}
          labelKey="outerParts.roof.hasInsulation"
          info={
            <InfoTooltipButton
              content="Eine vorhandene Dämmung reduziert den Wärmeverlust erheblich. 
              Ohne Dämmung gehen über das Dach bis zu 30 % der Heizwärme verloren."
            ></InfoTooltipButton>
          }
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
              info={
                <InfoDialogButton
                  title="Art der Dachdämmung"
                  content="Bei der Aufsparrendämmung wird die Dämmung oberhalb der Dachsparren angebracht. 
                  Sie bietet den besten Wärmeschutz, da keine Wärmebrücken durch die Sparren entstehen. 
                  Bei der Zwischensparrendämmung wird der Dämmstoff zwischen den Sparren eingebracht. 
                  Diese Variante ist kostengünstiger, bietet aber durch die Sparren als Wärmebrücken einen etwas geringeren Schutz."
                />
              }
            />
          </>
        )}
      </FieldSet>
    </Paper>
  );
}
