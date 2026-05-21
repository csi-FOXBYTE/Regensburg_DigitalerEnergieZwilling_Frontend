import { FieldLegend, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import {
  exteriorWallWindowsAreaField,
  exteriorWallWindowsUValueField,
  exteriorWallWindowsWindowTypeField,
  exteriorWallWindowsWindowTypeOptions,
  exteriorWallWindowsYearField,
} from '@/lib/state/inputs/exterior-wall-windows';
import { buildingYearOptions } from '@/lib/state/inputs/general';
import { Typography } from '../../../components/ui/typography';
import EnergyNumberInput from '../EnergyNumberInput';
import EnergySelectInput from '../EnergySelectInput';
import { InfoTooltipButton } from '../InfoButton';

export default function WindowsPaper() {
  return (
    <Paper variant="outlined" className="p-4">
      <FieldSet className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FieldLegend>
          <Typography variant="h3">Fenster</Typography>
        </FieldLegend>
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
              content="Geben Sie die Gesamtfläche aller Fenster in an. 
              Die Gesamtfläche aller Fenster beeinflusst den Wärmeverlust durch die Gebäudehülle. "
            ></InfoTooltipButton>
          }
        />
        <EnergySelectInput
          field={exteriorWallWindowsWindowTypeField}
          labelKey="outerParts.windows.windowType"
          selectionStore={exteriorWallWindowsWindowTypeOptions}
          info={
            <InfoTooltipButton
              content="Holz- und Kunststoffrahmen dämmen gut. 
              Aluminium- und Stahlrahmen leiten Kälte stärker und sind weniger energieeffizient."
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
