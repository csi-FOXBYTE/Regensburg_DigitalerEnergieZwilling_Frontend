import {
  applyRenovation,
  calculate,
  type DETConfig,
  type DETInput,
  type Renovation,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RenovationRow } from './RenovationRow';

export type RenovationSingleSelectTableProps = {
  renovations: Renovation[];
  value: Renovation[];
  onSelectionChange: (selected: Renovation[]) => void;
  baseInput: DETInput;
  config: DETConfig;
};

const NONE = '__none__';

export function RenovationSingleSelectTable({
  renovations,
  value,
  onSelectionChange,
  baseInput,
  config,
}: RenovationSingleSelectTableProps) {
  const selectedId = value.length > 0 ? value[0].id : NONE;

  const table = useReactTable({
    data: renovations,
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const handleChange = (id: string) => {
    onSelectionChange(id === NONE ? [] : renovations.filter((r) => r.id === id));
  };

  const baseCost = useMemo(() => calculate(config, baseInput).yearlyCost, [config, baseInput]);

  const savingsMap = useMemo(
    () =>
      Object.fromEntries(
        renovations.map((r) => [
          r.id,
          baseCost - calculate(config, applyRenovation(baseInput, r)).yearlyCost,
        ]),
      ),
    [config, baseInput, renovations, baseCost],
  );

  return (
    <RadioGroup value={selectedId} onValueChange={handleChange}>
      <table className="w-full border-collapse border border-neutral-200 text-sm">
        <thead>
          <tr className="bg-neutral-150">
            <th className="w-8" />
            <th className="px-4 py-3 text-left font-medium">Maßnahme</th>
            <th className="w-px whitespace-nowrap px-4 py-3 text-right font-medium">Sparpotential</th>
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <RenovationRow
              key={row.id}
              selectionCell={<RadioGroupItem value={row.id} />}
              label={row.original.label}
              savings={savingsMap[row.id] ?? 0}
            />
          ))}
          <RenovationRow
            selectionCell={<RadioGroupItem value={NONE} />}
            label="Keine Maßnahme"
            savings={0}
          />
        </tbody>
      </table>
    </RadioGroup>
  );
}
