import { FieldLegend, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import { buildingYearOptions } from '@/lib/state/inputs/general';
import {
  roofWindowsAreaField,
  roofWindowsUValueField,
  roofWindowsWindowTypeField,
  roofWindowsWindowTypeOptions,
  roofWindowsYearField,
} from '@/lib/state/inputs/roof-windows';
import {
  hasAtticField,
  isAtticHeatedField,
} from '@/lib/state/inputs/top-floor';
import { useStore } from '@nanostores/react';
import { Typography } from '../../../components/ui/typography';
import EnergyNumberInput from '../EnergyNumberInput';
import EnergySelectInput from '../EnergySelectInput';
import { InfoTooltipButton } from '../InfoButton';

export default function RoofWindowsPaper() {
  const hasAtticValue = useStore(hasAtticField.$store);
  const hasAtticPlaceholder = useStore(hasAtticField.$placeholder);
  const hasAttic = hasAtticValue ?? hasAtticPlaceholder;

  const isAtticHeatedValue = useStore(isAtticHeatedField.$store);
  const isAtticHeatedPlaceholder = useStore(isAtticHeatedField.$placeholder);
  const isAtticHeated = isAtticHeatedValue ?? isAtticHeatedPlaceholder;

  if (hasAttic && !isAtticHeated) return null;

  return (
    <Paper variant="outlined" className="p-4">
      <FieldSet className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FieldLegend>
          <Typography variant="h3" className="mb-2">
            Dachfenster
          </Typography>
        </FieldLegend>
        <EnergySelectInput
          field={roofWindowsYearField}
          labelKey="outerParts.roofWindows.year"
          rangeBandStore={buildingYearOptions}
          info={
            <InfoTooltipButton content="Ältere Dachfenster verlieren mehr Wärme als neuere."></InfoTooltipButton>
          }
        />
        <EnergyNumberInput
          field={roofWindowsAreaField}
          labelKey="outerParts.roofWindows.area"
          suffix=" m²"
          decimalScale={1}
          allowNegative={false}
          info={
            <InfoTooltipButton
              content="Geben Sie die gesamte Fläche aller Dachfenster an. 
              Die Gesamtfläche aller Dachfenster beeinflusst den Wärmeverlust."
            ></InfoTooltipButton>
          }
        />
        <EnergySelectInput
          field={roofWindowsWindowTypeField}
          labelKey="outerParts.roofWindows.windowType"
          selectionStore={roofWindowsWindowTypeOptions}
          info={
            <InfoTooltipButton
              content="Holz- und Kunststoffrahmen dämmen gut. 
            Aluminium- und Stahlrahmen leiten Kälte stärker und sind weniger energieeffizient."
            ></InfoTooltipButton>
          }
        />
        <EnergyNumberInput
          field={roofWindowsUValueField}
          labelKey="outerParts.roofWindows.uValue"
          suffix=" W/m²K"
          decimalScale={2}
          allowNegative={false}
          info={
            <InfoTooltipButton
              content="Der U-Wert beschreibt die Wärmedämmung des Fensters. Niedrigere Werte bedeuten bessere Dämmung. 
              Alte Einfachfenster haben etwa 5,0 W/m²K. Moderne Dreifachfenster liegen bei etwa 0,7 W/m²K. 
              Den U-Wert finden Sie in den Unterlagen Ihrer Fenster oder auf dem Typenschild."
            ></InfoTooltipButton>
          }
        />
      </FieldSet>
    </Paper>
  );
}
