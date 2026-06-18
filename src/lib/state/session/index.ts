import { atom } from 'nanostores';
import { $building } from '../building';
import {
  $inputState,
  $selectedHeatingRenovations,
  $selectedHeatingSurfaceRenovations,
  $selectedInsulationRenovations,
} from '../inputs/atoms';
import { $step, navigateToStep, setStep, Step } from '../ui/progress';
import { getMeta, getSession, saveRawSession, setMeta, type SavedSession } from './storage';

export { clearSession, getSession } from './storage';
export type { DetMeta, SavedSession } from './storage';

export const $cameraPosition = atom<{ lon: number; lat: number } | null>(null);
export const $pendingFlyTo = atom<{ lon: number; lat: number } | null>(null);

// Set when a session was injected via a recovery link (?restore=…) so the
// resume dialog doesn't additionally prompt for the very session we just loaded.
let restoredFromLink = false;
export function markRestoredFromLink(): void {
  restoredFromLink = true;
}
export function wasRestoredFromLink(): boolean {
  return restoredFromLink;
}

export function saveSession(): void {
  const building = $building.get();
  const step = $step.get();

  if (!building && step === Step.Welcome) return;

  console.log('[session] saveSession — step:', step, 'building:', building?.id ?? null);
  setMeta({ lastActiveBuildingId: building?.id ?? null, step });

  if (step < Step.GeneralData || !building) {
    console.log('[session] saveSession — meta only (step < GeneralData or no building)');
    return;
  }

  const inputs = $inputState.get();

  console.log('[session] saveSession — writing full blob for', building.id);
  saveRawSession(building.id, {
    step,
    building,
    cameraLon: $cameraPosition.get()?.lon ?? 0,
    cameraLat: $cameraPosition.get()?.lat ?? 0,
    inputState: inputs,
    insulationRenovations: $selectedInsulationRenovations.get(),
    heatingSurfaceRenovations: $selectedHeatingSurfaceRenovations.get(),
    heatingRenovations: $selectedHeatingRenovations.get(),
  });
}

export function loadSession(buildingId: string): void {
  console.log('[session] loadSession —', buildingId);
  const session = getSession(buildingId);
  if (!session) {
    console.log('[session] loadSession — no session found');
    return;
  }
  loadSessionFromData(session);
}

export function loadSessionFromData(session: SavedSession): void {
  console.log('[session] loadSessionFromData — step:', session.step);
  saveRawSession(session.building.id, session);
  setMeta({ lastActiveBuildingId: session.building.id, step: session.step });
  $building.set(session.building);
  navigateToStep(session.step);
  $pendingFlyTo.set({ lon: session.cameraLon, lat: session.cameraLat });
}

export function getLastActiveSession() {
  const meta = getMeta();
  console.log('[session] getLastActiveSession — meta:', meta);
  if (!meta.lastActiveBuildingId || meta.step === null || meta.step < Step.GeneralData) {
    console.log('[session] getLastActiveSession — no resumable session');
    return null;
  }
  const session = getSession(meta.lastActiveBuildingId);
  if (!session) {
    console.log('[session] getLastActiveSession — blob missing, clearing stale meta');
    setMeta({ lastActiveBuildingId: null, step: null });
    return null;
  }
  console.log('[session] getLastActiveSession — found');
  return session;
}

export function clearLastActive(): void {
  console.log('[session] clearLastActive');
  setMeta({ lastActiveBuildingId: null, step: null });
}
