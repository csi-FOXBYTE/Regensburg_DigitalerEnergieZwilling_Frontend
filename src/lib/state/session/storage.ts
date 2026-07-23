import type { Renovation } from '@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore';
import type { CameraTarget } from '../../camera-state';
import type { BuildingState } from '../building';
import type { InputState } from '../inputs/atoms';
import type { Step } from '../ui/progress';

export type SavedSession = {
  step: Step;
  building: BuildingState;
  cameraTarget?: CameraTarget;
  /** @deprecated Legacy radians retained for recovery-link compatibility. */
  cameraLon: number;
  /** @deprecated Legacy radians retained for recovery-link compatibility. */
  cameraLat: number;
  inputState: InputState;
  insulationRenovations: Renovation[];
  heatingSurfaceRenovations: Renovation[];
  heatingRenovations: Renovation[];
};

export type DetMeta = {
  lastActiveBuildingId: string | null;
  step: Step | null;
};

const META_KEY = 'det_meta';

const buildingKey = (id: string) => `det_building_data_${id}`;

export function getMeta(): DetMeta {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (!raw) return { lastActiveBuildingId: null, step: null };
    return JSON.parse(raw) as DetMeta;
  } catch {
    return { lastActiveBuildingId: null, step: null };
  }
}

export function setMeta(meta: DetMeta): void {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

export function getSession(buildingId: string): SavedSession | null {
  try {
    const raw = localStorage.getItem(buildingKey(buildingId));
    if (!raw) return null;
    return JSON.parse(raw) as SavedSession;
  } catch {
    return null;
  }
}

export function saveRawSession(
  buildingId: string,
  session: SavedSession,
): void {
  localStorage.setItem(buildingKey(buildingId), JSON.stringify(session));
}

export function clearSession(buildingId: string): void {
  localStorage.removeItem(buildingKey(buildingId));
}
