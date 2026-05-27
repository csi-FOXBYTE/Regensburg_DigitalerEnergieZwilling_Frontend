import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  electricityTypeField,
  electricityTypeOptions,
  electricityUnitRateField,
  userElectricityConsumptionField,
} from '@/lib/state/inputs/electricity';
import { Typography } from '../../../components/ui/typography';
import EnergyNumberInput from '../EnergyNumberInput';
import EnergySelectInput from '../EnergySelectInput';
import { InfoTooltipButton } from '../InfoButton';

export default function ElectricityStepForm() {
  return (
    <TooltipProvider>
      <FieldGroup>
        <Paper variant="outlined" className="pt-4 pr-5 pb-5 pl-5">
          <FieldSet className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FieldLegend className="col-span-full">
              <Typography variant="h4">
                Strom
              </Typography>
            </FieldLegend>
            <Separator className="col-span-full" />
            <EnergySelectInput
              field={electricityTypeField}
              labelKey="electricity.type"
              selectionStore={electricityTypeOptions}
              info={
                <InfoTooltipButton
                  content="Mix-Strom enthält Strom aus verschiedenen Quellen, auch aus fossiler Energie. 
                  Erneuerbarer Strom stammt aus Wind, Sonne oder Wasser und hat eine deutlich bessere CO₂-Bilanz."
                ></InfoTooltipButton>
              }
            />
            <EnergyNumberInput
              field={userElectricityConsumptionField}
              labelKey="electricity.consumption"
              suffix=" kWh/a"
              decimalScale={0}
              allowNegative={false}
              info={
                <InfoTooltipButton
                  content="Tragen Sie Ihren jährlichen Stromverbrauch in kWh ein. 
                  Den Wert finden Sie auf Ihrer Jahresabrechnung. 
                  Bei einem Durchschnittshaushalt sind es ca. 2.500–4.000 kWh pro Jahr."
                ></InfoTooltipButton>
              }
            />
            <EnergyNumberInput
              field={electricityUnitRateField}
              labelKey="electricity.unitRate"
              suffix=" €/kWh"
              decimalScale={2}
              allowNegative={false}
              info={
                <InfoTooltipButton
                  content="Der Preis, den Sie pro Kilowattstunde (kWh) Strom zahlen.
                  Diesen Wert finden Sie auf Ihrer Stromrechnung. 
                  Der Durchschnittspreis liegt bei ca. 30–40 Cent pro kWh."
                ></InfoTooltipButton>
              }
            />
          </FieldSet>
        </Paper>
      </FieldGroup>
    </TooltipProvider>
  );
}
