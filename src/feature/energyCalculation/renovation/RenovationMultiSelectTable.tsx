import {
  applyRenovation,
  calculate,
  type DETConfig,
  type DETInput,
  type Renovation,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { getCoreRowModel, useReactTable, type RowSelectionState } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoTooltipButton } from '../InfoButton';
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
  const { t } = useTranslation('energyCalculation');
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
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse border border-neutral-200 text-sm">
      <thead>
        <tr className="bg-neutral-150">
          <th className="w-8" />
          <th className="px-4 py-3 font-medium">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-left">{t('renovation.table.measure')}</span>
              <span className="text-left whitespace-nowrap sm:text-right">{t('renovation.table.savings')}</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => {
          const tooltipText = (t as (key: string, opts: object) => string)(`renovation.tooltips.${row.id}`, { defaultValue: '' });
          return (
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
              recommended={row.original.recommended}
              info={tooltipText ? <InfoTooltipButton content={tooltipText} /> : undefined}
            />
          );
        })}
      </tbody>
      {renovations.length > 1 && (
        <tfoot>
          <tr className="border-t border-neutral-200 bg-neutral-150 text-base">
            <td />
            <td className="px-4 py-4 font-medium">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span>{t('renovation.table.total')}</span>
                <span className={`whitespace-nowrap sm:text-right ${savingsColorClass}`}>
                  {selectedSavings.toLocaleString('de-DE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    signDisplay: 'always',
                  })}{' '}
                  €/a
                </span>
              </div>
            </td>
          </tr>
        </tfoot>
      )}
      </table>
    </div>
  );
}
