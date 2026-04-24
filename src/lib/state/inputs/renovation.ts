import { type Renovation } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import { atom } from 'nanostores';

export const $renovations = atom<Renovation[]>([]);
