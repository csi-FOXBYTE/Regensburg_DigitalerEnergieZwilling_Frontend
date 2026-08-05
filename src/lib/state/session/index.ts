import {
  type CameraTarget,
  getCameraTarget,
  requestCamera,
} from '../../camera-state';
import { $building } from '../building';
import {
  $inputState,
  $selectedHeatingRenovations,
  $selectedHeatingSurfaceRenovations,
  $selectedInsulationRenovations,
} from '../inputs/atoms';
import {
  $maxStepReached,
  $step,
  navigateToStep,
  setStep,
  Step,
} from '../ui/progress';
import {
  getMeta,
  getSession,
  saveRawSession,
  setMeta,
  type SavedSession,
} from './storage';

export { clearSession, getSession } from './storage';
export type { DetMeta, SavedSession } from './storage';

const REGENSBURG_BOUNDS = {
  west: 11.5,
  south: 48.5,
  east: 13,
  north: 49.5,
};

function isRegensburgTarget(value: unknown): value is CameraTarget {
  if (!value || typeof value !== 'object') return false;
  const target = value as Partial<CameraTarget>;
  return (
    Number.isFinite(target.longitudeDegrees) &&
    Number.isFinite(target.latitudeDegrees) &&
    target.longitudeDegrees! >= REGENSBURG_BOUNDS.west &&
    target.longitudeDegrees! <= REGENSBURG_BOUNDS.east &&
    target.latitudeDegrees! >= REGENSBURG_BOUNDS.south &&
    target.latitudeDegrees! <= REGENSBURG_BOUNDS.north
  );
}

function resolveSessionCameraTarget(
  session: SavedSession,
): CameraTarget | null {
  if (isRegensburgTarget(session.cameraTarget)) {
    return session.cameraTarget;
  }

  if (
    Number.isFinite(session.cameraLon) &&
    Number.isFinite(session.cameraLat)
  ) {
    const legacyTarget = {
      longitudeDegrees: (session.cameraLon * 180) / Math.PI,
      latitudeDegrees: (session.cameraLat * 180) / Math.PI,
    };
    if (isRegensburgTarget(legacyTarget)) return legacyTarget;
  }

  const buildingTarget = {
    longitudeDegrees: session.building.coordinates.lon,
    latitudeDegrees: session.building.coordinates.lat,
  };
  return isRegensburgTarget(buildingTarget) ? buildingTarget : null;
}

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

  console.log(
    '[session] saveSession — step:',
    step,
    'building:',
    building?.id ?? null,
  );
  setMeta({ lastActiveBuildingId: building?.id ?? null, step });

  if (step < Step.GeneralData || !building) {
    console.log(
      '[session] saveSession — meta only (step < GeneralData or no building)',
    );
    return;
  }

  const inputs = $inputState.get();
  const target = getCameraTarget() ?? {
    longitudeDegrees: building.coordinates.lon,
    latitudeDegrees: building.coordinates.lat,
  };

  console.log('[session] saveSession — writing full blob for', building.id);
  saveRawSession(building.id, {
    step,
    maxStepReached: $maxStepReached.get(),
    building,
    cameraTarget: target,
    cameraLon: (target.longitudeDegrees * Math.PI) / 180,
    cameraLat: (target.latitudeDegrees * Math.PI) / 180,
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
  const target = resolveSessionCameraTarget(session);
  const migratedSession = {
    ...session,
    maxStepReached: Math.max(
      session.step,
      session.maxStepReached ?? session.step,
    ) as Step,
    ...(target
      ? {
          cameraTarget: target,
          cameraLon: (target.longitudeDegrees * Math.PI) / 180,
          cameraLat: (target.latitudeDegrees * Math.PI) / 180,
        }
      : {}),
  };
  saveRawSession(session.building.id, migratedSession);
  setMeta({ lastActiveBuildingId: session.building.id, step: session.step });
  $building.set(session.building);
  navigateToStep(session.step);
  if (target) {
    requestCamera({
      type: 'focus',
      target,
      reason: { type: 'sessionRestore' },
    });
  }
}

export function getLastActiveSession() {
  const meta = getMeta();
  console.log('[session] getLastActiveSession — meta:', meta);
  if (
    !meta.lastActiveBuildingId ||
    meta.step === null ||
    meta.step < Step.GeneralData
  ) {
    console.log('[session] getLastActiveSession — no resumable session');
    return null;
  }
  const session = getSession(meta.lastActiveBuildingId);
  if (!session) {
    console.log(
      '[session] getLastActiveSession — blob missing, clearing stale meta',
    );
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
