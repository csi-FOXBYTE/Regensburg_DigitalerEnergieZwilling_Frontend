import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field';
import { Paper } from '@/components/ui/paper';
import { TooltipProvider } from '@/components/ui/tooltip';
import { $config } from '@/lib/state/calculation-config';
import { buildingYearOptions } from '@/lib/state/inputs/general';
import {
  hasBioGasField,
  hasGasSupplyField,
  hasStorageField,
  heatingSurfaceTypeField,
  heatingSurfaceTypeOptions,
  heatingSystemConstructionYearField,
  heatingSystemTypeField,
  heatingSystemTypeOptions,
  primaryEnergyCarrierField,
  primaryEnergyCarrierOptions,
  userThermalConsumptionField,
  userThermalUnitRateField,
} from '@/lib/state/inputs/heat';
import { useStore } from '@nanostores/react';
import { Typography } from '../../../components/ui/typography';
import EnergyBooleanInput from '../EnergyBooleanInput';
import EnergyNumberInput from '../EnergyNumberInput';
import EnergySelectInput from '../EnergySelectInput';
import { InfoTooltipButton } from '../InfoButton';

export default function HeatStepForm() {
  const hasGasSupplyValue = useStore(hasGasSupplyField.$store);
  const hasGasSupplyPlaceholder = useStore(hasGasSupplyField.$placeholder);
  const showBioGas = hasGasSupplyValue ?? hasGasSupplyPlaceholder;

  const config = useStore($config);
  const carrierValue = useStore(primaryEnergyCarrierField.$store);
  const carrierPlaceholder = useStore(primaryEnergyCarrierField.$placeholder);
  const carrier = carrierValue ?? carrierPlaceholder;
  const thermalUnit = carrier
    ? (config.heat.primaryEnergyCarrierData.find((d) => d.key === carrier)
        ?.value.unit ?? '')
    : '';

  return (
    <TooltipProvider>
      <FieldGroup>
        <Paper variant="outlined" className="p-4">
          <FieldSet className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FieldLegend>
              <Typography variant="h3" className="mb-2">
                Versorgung
              </Typography>
            </FieldLegend>
            <EnergyBooleanInput
              field={hasGasSupplyField}
              labelKey="heat.supply.hasGasSupply"
              info={
                <InfoTooltipButton content="Ein Gasanschluss ermöglicht die Nutzung gasbetriebener Heizsysteme."></InfoTooltipButton>
              }
            />
            {showBioGas && (
              <EnergyBooleanInput
                field={hasBioGasField}
                labelKey="heat.supply.hasBioGas"
                info={
                  <InfoTooltipButton content="Biogas verursacht geringerer CO2-Emissionen."></InfoTooltipButton>
                }
              />
            )}
            <EnergyBooleanInput
              field={hasStorageField}
              labelKey="heat.supply.hasStorage"
              className="lg:col-start-1"
              info={
                <InfoTooltipButton content="Für Öl- oder Pelletheizungen wird ausreichend Lagerfläche benötigt."></InfoTooltipButton>
              }
            />
          </FieldSet>
        </Paper>
        <Paper variant="outlined" className="p-4">
          <FieldSet className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FieldLegend>
              <Typography variant="h3" className="mb-2">
                Heizung
              </Typography>
            </FieldLegend>
            <EnergySelectInput
              field={heatingSystemConstructionYearField}
              labelKey="heat.heating.constructionYear"
              rangeBandStore={buildingYearOptions}
              info={
                <InfoTooltipButton
                  content="Das Jahr, in dem Ihre aktuelle Heizungsanlage eingebaut wurde. 
                  Ältere Anlagen arbeiten oft weniger effizient und verbrauchen mehr Energie."
                ></InfoTooltipButton>
              }
            />
            <EnergySelectInput
              field={primaryEnergyCarrierField}
              labelKey="heat.heating.primaryEnergyCarrier"
              selectionStore={primaryEnergyCarrierOptions}
              info={
                <InfoTooltipButton
                  content="Wählen Sie den Brennstoff Ihrer Heizung – 
                  zum Beispiel Erdgas, Heizöl oder Strom für eine Wärmepumpe."
                ></InfoTooltipButton>
              }
            />
            <EnergySelectInput
              field={heatingSystemTypeField}
              labelKey="heat.heating.heatingSystemType"
              selectionStore={heatingSystemTypeOptions}
              info={
                <InfoTooltipButton
                  content="Das ist das Gerät, das die Wärme erzeugt, zum Beispiel ein Brennwertkessel oder eine Wärmepumpe. 
                  Modernere Geräte verbrauchen in der Regel weniger Energie."
                ></InfoTooltipButton>
              }
            />
            <EnergySelectInput
              field={heatingSurfaceTypeField}
              labelKey="heat.heating.heatingSurfaceType"
              selectionStore={heatingSurfaceTypeOptions}
              info={
                <InfoTooltipButton
                  content="Heizkörper sind die klassischen Radiatoren an der Wand. 
                  Eine Flächenheizung verteilt die Wärme über Boden, Wand oder Decke und arbeitet besonders 
                  effizient bei niedrigen Temperaturen."
                ></InfoTooltipButton>
              }
            />
          </FieldSet>
        </Paper>
        <Paper variant="outlined" className="p-4">
          <FieldSet className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FieldLegend>
              <Typography variant="h3" className="mb-2">
                Verbrauch
              </Typography>
            </FieldLegend>
            <EnergyNumberInput
              field={userThermalConsumptionField}
              labelKey="heat.bills.consumption"
              suffix={thermalUnit ? ` ${thermalUnit}/a` : undefined}
              decimalScale={0}
              allowNegative={false}
              info={
                <InfoTooltipButton content="Geben Sie Ihre jährlichen Heizkosten oder Ihren Verbrauch laut Abrechnung an."></InfoTooltipButton>
              }
            />
            <EnergyNumberInput
              field={userThermalUnitRateField}
              labelKey="heat.bills.unitRate"
              suffix={thermalUnit ? ` €/${thermalUnit}` : ' €'}
              decimalScale={2}
              allowNegative={false}
              info={
                <InfoTooltipButton
                  content="Der Preis pro Kilowattstunde (kWh) für Ihren Energieträger. 
                  Diesen finden Sie auf Ihrer Rechnung oder beim Anbieter."
                ></InfoTooltipButton>
              }
            />
          </FieldSet>
        </Paper>
      </FieldGroup>
    </TooltipProvider>
  );
}
