import { atom } from 'nanostores';

export const OUTER_SECTIONS = [
  'roof',
  'roofWindows',
  'topFloor',
  'outerWall',
  'windows',
  'bottomFloor',
] as const;

export type OuterSection = (typeof OUTER_SECTIONS)[number];

export const $outerNavVisible = atom<OuterSection[]>([]);
export const $outerNavActive = atom<OuterSection>('roof');
export const $outerNavScrollRequest = atom<OuterSection | null>(null);
