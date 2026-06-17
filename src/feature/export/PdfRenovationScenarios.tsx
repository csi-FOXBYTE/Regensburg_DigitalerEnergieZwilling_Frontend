import {
  applyRenovation,
  calculate,
  type DETInput,
  type Renovation,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import i18next from 'i18next';
import type { ParseKeys } from 'i18next';
import { $config } from '@/lib/state/calculation-config';
import { $calculationInput } from '@/lib/state/computed/calculation-input';
import { $currentEnergyState } from '@/lib/state/computed/current-energy-state';
import {
  $selectedHeatingRenovations,
  $selectedHeatingSurfaceRenovations,
  $selectedInsulationRenovations,
} from '@/lib/state/inputs/renovation';
import { PdfRenovationItem } from './PdfRenovationItem';
import { pdf } from './pdfStyles';

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  category: {
    gap: 8,
  },
});

function renderCategory(
  titleKey: `energyCalculation:${ParseKeys<'energyCalculation'>}`,
  renovations: Renovation[],
  categoryBase: DETInput,
  baseEnergy: number,
  baseCost: number,
  originalEnergy: number,
  config: ReturnType<typeof $config.get>,
) {
  if (renovations.length === 0) return null;
  return (
    <View style={styles.category}>
      <Text style={pdf.h3}>
        {i18next.t('energyCalculation:export.categoryLabel')}: {i18next.t(titleKey)}
      </Text>
      {renovations.map((r) => {
        const result = calculate(config, applyRenovation(categoryBase, r));
        const energyDelta = result.energyConsumptionPerSquareMeter - baseEnergy;
        const energySavingPercent = energyDelta / originalEnergy * 100;
        const costSaving = result.yearlyCost - baseCost;
        return (
          <PdfRenovationItem
            key={r.id}
            label={r.label}
            energySavingPercent={energySavingPercent}
            costSaving={costSaving}
          />
        );
      })}
    </View>
  );
}

export function PdfRenovationScenarios() {
  const config = $config.get();
  const rawBaseInput = $calculationInput.get();
  const currentState = $currentEnergyState.get();
  const baseInput = { ...rawBaseInput, preRenovationValues: currentState.preRenovationValues };

  const selectedInsulation = $selectedInsulationRenovations.get();
  const selectedHeating = $selectedHeatingRenovations.get();
  const selectedHeatingSurface = $selectedHeatingSurfaceRenovations.get();

  // Chain: each category applies the previous category's selections to the base
  const insulationPatchedInput = selectedInsulation.length > 0
    ? applyRenovation(baseInput, selectedInsulation)
    : baseInput;

  const heatingPatchedInput = selectedHeating.length > 0
    ? applyRenovation(insulationPatchedInput, selectedHeating)
    : insulationPatchedInput;

  // Base results for each category's savings (reuse currentState for Dämmung)
  const insulationBaseResult = currentState;
  const heatingBaseResult = calculate(config, insulationPatchedInput);
  const heatingSurfaceBaseResult = calculate(config, heatingPatchedInput);

  return (
    <View style={styles.content}>
      <Text style={pdf.sectionHeader}>
        {i18next.t('energyCalculation:export.renovationScenariosTitle')}
      </Text>
      {renderCategory(
        'energyCalculation:export.categoryInsulation',
        selectedInsulation,
        baseInput,
        insulationBaseResult.energyConsumptionPerSquareMeter,
        insulationBaseResult.yearlyCost,
        insulationBaseResult.energyConsumptionPerSquareMeter,
        config,
      )}
      {renderCategory(
        'energyCalculation:export.categoryHeating',
        selectedHeating,
        insulationPatchedInput,
        heatingBaseResult.energyConsumptionPerSquareMeter,
        heatingBaseResult.yearlyCost,
        insulationBaseResult.energyConsumptionPerSquareMeter,
        config,
      )}
      {renderCategory(
        'energyCalculation:export.categoryHeatingSurface',
        selectedHeatingSurface,
        heatingPatchedInput,
        heatingSurfaceBaseResult.energyConsumptionPerSquareMeter,
        heatingSurfaceBaseResult.yearlyCost,
        insulationBaseResult.energyConsumptionPerSquareMeter,
        config,
      )}
    </View>
  );
}
