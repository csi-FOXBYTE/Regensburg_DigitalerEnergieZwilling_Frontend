import { applyRenovation } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { useStore } from '@nanostores/react';
import { useMemo } from 'react';
import { Typography } from '@/components/ui/typography';
import { $config } from '@/lib/state/calculation-config';
import { $calculationInput } from '@/lib/state/computed/calculation-input';
import { $currentEnergyState } from '@/lib/state/computed/current-energy-state';
import {
  $heatingRenovations,
  $heatingSurfaceRenovations,
  $insulationRenovations,
} from '@/lib/state/computed/renovation-options';
import {
  $selectedHeatingRenovations,
  $selectedHeatingSurfaceRenovations,
  $selectedInsulationRenovations,
} from '@/lib/state/inputs/renovation';
import { RenovationMultiSelectTable } from './RenovationMultiSelectTable';
import { RenovationSingleSelectTable } from './RenovationSingleSelectTable';

export default function RenovationStepForm() {
  const config = useStore($config);
  const rawBaseInput = useStore($calculationInput);
  const currentState = useStore($currentEnergyState);
  const baseInput = useMemo(
    () => ({ ...rawBaseInput, preRenovationValues: currentState.preRenovationValues }),
    [rawBaseInput, currentState.preRenovationValues],
  );

  const insulationRenovations = useStore($insulationRenovations);
  const heatingSurfaceRenovations = useStore($heatingSurfaceRenovations);
  const heatingRenovations = useStore($heatingRenovations);

  const selectedInsulation = useStore($selectedInsulationRenovations);
  const selectedHeatingSurface = useStore($selectedHeatingSurfaceRenovations);
  const selectedHeating = useStore($selectedHeatingRenovations);

  const insulationPatchedInput = useMemo(
    () => selectedInsulation.length > 0 ? applyRenovation(baseInput, selectedInsulation) : baseInput,
    [baseInput, selectedInsulation],
  );

  const heatingSurfacePatchedInput = useMemo(
    () => selectedHeatingSurface.length > 0 ? applyRenovation(insulationPatchedInput, selectedHeatingSurface) : insulationPatchedInput,
    [insulationPatchedInput, selectedHeatingSurface],
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Typography variant="h4" className="mb-2">Dämmung</Typography>
        <RenovationMultiSelectTable
          renovations={insulationRenovations}
          value={selectedInsulation}
          onSelectionChange={(v) => $selectedInsulationRenovations.set(v)}
          baseInput={baseInput}
          config={config}
        />
      </div>
      {heatingSurfaceRenovations.length > 0 && (
        <div>
          <Typography variant="h4" className="mb-2">Heizungsfläche</Typography>
          <RenovationSingleSelectTable
            renovations={heatingSurfaceRenovations}
            value={selectedHeatingSurface}
            onSelectionChange={(v) => $selectedHeatingSurfaceRenovations.set(v)}
            baseInput={insulationPatchedInput}
            config={config}
          />
        </div>
      )}
      {heatingRenovations.length > 0 && (
        <div>
          <Typography variant="h4" className="mb-2">Heizung</Typography>
          <RenovationSingleSelectTable
            renovations={heatingRenovations}
            value={selectedHeating}
            onSelectionChange={(v) => $selectedHeatingRenovations.set(v)}
            baseInput={heatingSurfacePatchedInput}
            config={config}
          />
        </div>
      )}
    </div>
  );
}
