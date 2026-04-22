import {
  type DETConfig,
  type Ranges,
  type Selection,
  type SelectionFilter,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import type { ReadableAtom } from 'nanostores';
import { computed } from 'nanostores';
import { $config } from './state/calculation-config';
import { rangesToOptions, type RangeBandOption } from './yearHelper/rangeBandOptions';

type FilterConfig<T, K> = {
  $store: ReadableAtom<T>;
  getKey: (state: T) => K | undefined | null;
  getFilter: (config: DETConfig) => SelectionFilter<K>;
};

type RangeBandStoreOptions<T> =
  | {
      getRanges: (config: DETConfig) => Ranges;
      formatLabel?: (range: { from?: number; to?: number }) => string;
    }
  | {
      $store: ReadableAtom<T>;
      getRanges: (config: DETConfig, state: T) => Ranges;
      formatLabel?: (range: { from?: number; to?: number }) => string;
    };

export function makeRangeBandStore<T = never>(
  options: RangeBandStoreOptions<T>,
): ReadableAtom<RangeBandOption[]> {
  if ('$store' in options) {
    return computed([$config, options.$store], (config, state) =>
      rangesToOptions(options.getRanges(config, state), options.formatLabel),
    );
  }
  return computed($config, (config) =>
    rangesToOptions(options.getRanges(config), options.formatLabel),
  );
}

export function makeSelectionStore<T, K = string>(
  getOptions: (config: DETConfig) => Selection[],
  filter?: FilterConfig<T, K>,
): ReadableAtom<Selection[]> {
  if (!filter) {
    return computed($config, (config) => getOptions(config));
  }

  return computed([$config, filter.$store], (config, state) => {
    const options = getOptions(config);
    const key = filter.getKey(state);
    if (key == null) return options;
    const entry = filter.getFilter(config).find((f) => f.key === key);
    return entry
      ? options.filter((o) => entry.allowedValues.includes(o.value))
      : options;
  });
}
