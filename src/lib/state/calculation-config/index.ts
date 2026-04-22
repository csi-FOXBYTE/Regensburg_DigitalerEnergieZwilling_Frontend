import {
  DEFAULT_CONFIG,
  type DETConfig,
} from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { atom } from 'nanostores';

export const $config = atom<DETConfig>(DEFAULT_CONFIG);
