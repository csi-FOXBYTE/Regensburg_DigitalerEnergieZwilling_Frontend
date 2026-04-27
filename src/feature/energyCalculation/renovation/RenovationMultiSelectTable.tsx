import {
  applyRenovation,
  calculate,
  type DETConfig,
  type DETInput,
  type Renovation,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { getCoreRowModel, useReactTable, type RowSelectionState } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { RenovationRow } from './RenovationRow';

export type RenovationMultiSelectTableProps = {
  renovations: Renovation[];
  value: Renovation[];
  onSelectionChange: (selected: Renovation[]) => void;
  baseInput: DETInput;
  config: DETConfig;
};

export function RenovationMultiSelectTable({
  renovations,
  value,
  onSelectionChange,
  baseInput,
  config,
}: RenovationMultiSelectTableProps) {
  const rowSelection = useMemo<RowSelectionState>(
    () => Object.fromEntries(value.map((r) => [r.id, true])),
    [value],
  );

  const table = useReactTable({
    data: renovations,
    columns: [],
    state: { rowSelection },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(rowSelection) : updater;
      onSelectionChange(renovations.filter((r) => next[r.id]));
    },
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const baseCost = useMemo(() => calculate(config, baseInput).yearlyCost, [config, baseInput]);

  const savingsMap = useMemo(
    () =>
      Object.fromEntries(
        renovations.map((r) => [
          r.id,
          calculate(config, applyRenovation(baseInput, r)).yearlyCost - baseCost,
        ]),
      ),
    [config, baseInput, renovations, baseCost],
  );

  const selectedSavings = useMemo(() => {
    if (value.length === 0) return 0;
    return calculate(config, applyRenovation(baseInput, value)).yearlyCost - baseCost;
  }, [config, baseInput, value, baseCost]);

  const savingsColorClass =
    selectedSavings < 0
      ? 'text-green-600'
      : selectedSavings > 0
        ? 'text-red-600'
        : 'text-muted-foreground';

  return (
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
            selectionCell={
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={() => row.toggleSelected()}
                className="border-neutral-550"
              />
            }
            label={row.original.label}
            savings={savingsMap[row.id] ?? 0}
          />
        ))}
      </tbody>
      {renovations.length > 1 && (
        <tfoot>
          <tr className="border-t border-neutral-200 bg-neutral-150 text-base">
            <td />
            <td className="px-4 py-4 font-medium">Gesamt</td>
            <td className={`whitespace-nowrap px-4 py-4 text-right font-medium ${savingsColorClass}`}>
              {selectedSavings.toLocaleString('de-DE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                signDisplay: 'always',
              })}{' '}
              €/a
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  );
}
