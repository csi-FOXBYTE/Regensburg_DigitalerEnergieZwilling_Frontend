import {
  type RangeKey,
  type Ranges,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import type { TFunction } from 'i18next';

export type RangeBandOption = {
  value: RangeKey;
  label: string;
};

export function formatRangeLabel(
  range: { from?: number; to?: number },
  t: TFunction<'common'>,
): string {
  if (range.from != null && range.to != null) return t('yearRange.between', { from: range.from, to: range.to });
  if (range.to != null) return t('yearRange.upTo', { year: range.to });
  if (range.from != null) return t('yearRange.from', { year: range.from });
  return '–';
}

function defaultFormatLabel(range: { from?: number; to?: number }): string {
  if (range.from != null && range.to != null)
    return `${range.from} – ${range.to}`;
  if (range.to != null) return `up to ${range.to}`;
  if (range.from != null) return `from ${range.from}`;
  return '–';
}

export function rangesToOptions(
  ranges: Ranges,
  formatLabel: (range: {
    from?: number;
    to?: number;
  }) => string = defaultFormatLabel,
): RangeBandOption[] {
  return (ranges as { from?: number; to?: number }[]).map((range) => ({
    value: { from: range.from, to: range.to },
    label: formatLabel(range),
  }));
}

export function rangeKeyEquals(a: RangeKey, b: RangeKey): boolean {
  return a.from === b.from && a.to === b.to;
}
