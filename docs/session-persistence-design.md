# Session Persistence — Design Document

## Overview

Users can pick up a previous energy calculation session when they return to the app. The auto-save subscriber fires on every input atom change regardless of step. On steps 0–1 it only updates `DetMeta` (building id + step); on steps 2–7 it also writes the full `SavedSession` blob. Sessions are keyed per building using individual localStorage entries. The resume prompt only appears when `DetMeta.step >= Step.GeneralData (2)`. The Cesium camera fly-to happens after the prompt is accepted, once the viewer is ready.

---

## localStorage Layout

Instead of one large blob, two separate key patterns are used:

| Key | Contents |
|---|---|
| `"det_meta"` | `{ lastActiveBuildingId: string \| null, step: Step \| null }` |
| `"{buildingId}_det_building_data"` | `SavedSession` (see below) |

This keeps per-building data isolated. Reading one building's session doesn't require parsing any other building's data.

---

## Data Model

```ts
type SavedSession = {
  schemaVersion: number;   // integer constant in session module — mismatch → discard + toast
  coreVersion: string;     // e.g. "0.7.3" — mismatch → discard + toast
  step: Step;              // Step.GeneralData (2) … Step.Result (7)
  building: BuildingState; // { id, properties } — enough to restore $building
  cameraLon: number;       // radians, from Map3D click handler
  cameraLat: number;
  generalInput: Partial<DETGeneralInput>;
  heatInput: Partial<DETHeatInput>;
  roofInput: Partial<DETRoofInput>;
  roofWindowsInput: Partial<DETRoofWindowsInput>;
  exteriorWallWindowsInput: Partial<DETExteriorWallWindowsInput>;
  topFloorInput: Partial<DETTopFloorInput>;
  outerWallInput: Partial<DETOuterWallInput>;
  bottomFloorInput: Partial<DETBottomFloorInput>;
  electricityInput: Partial<DETElectricityInput>;
  insulationRenovations: Renovation[];
  heatingSurfaceRenovations: Renovation[];
  heatingRenovations: Renovation[];
};

type DetMeta = {
  lastActiveBuildingId: string | null;
  step: Step | null;  // null when no active session; used to gate the resume prompt
};
```

**Schema version**: a manually maintained integer constant in `src/lib/state/session/index.ts` (start at `1`). Bump it whenever `SavedSession`'s shape changes in a breaking way.  
**Core version**: injected at build time via `import.meta.env.PUBLIC_CORE_VERSION` from `astro.config.mjs` (read from `package.json`).

---

## Session Module API (`src/lib/state/session/index.ts`)

```ts
// Read
export function getSession(buildingId: string): SavedSession | null
export function getLastActiveSession(): SavedSession | null   // reads det_meta + building entry

// Write
export function saveSession(): void         // reads all atoms + $cameraPosition, writes to localStorage
export function loadSession(buildingId: string): void         // writes all input atoms + $building + $step
export function clearSession(buildingId: string): void
export function clearLastActive(): void     // sets det_meta.lastActiveBuildingId = null

// Non-persisted helper atom (set by Map3D, read by saveSession)
export const $cameraPosition = atom<{ lon: number; lat: number } | null>(null);

// Deferred fly-to (set on restore before viewer exists)
export const $pendingFlyTo = atom<{ lon: number; lat: number } | null>(null);
```

`saveSession()` has no arguments. It reads `$building`, `$step`, all input atoms, and `$cameraPosition` directly. It always writes `DetMeta` (`lastActiveBuildingId` + `step`). It only writes the full `SavedSession` blob if `$step.get() >= Step.GeneralData` — this guard is inside the function, not at call sites.

---

## Auto-Save on Field Change

Subscriptions are set up once at app init (`src/lib/state/session/auto-save.ts`):

```ts
// Subscribe to every input atom + renovation atoms
// On any change, saveSession() always writes DetMeta; only writes the full blob from step 2+
for (const store of ALL_INPUT_STORES) {
  store.subscribe(() => saveSession());
}
```

**Behaviour on building selection (step 1):**  
When `setBuilding()` fires, the `atoms.ts` subscriber resets all inputs to `{}`. This triggers the auto-save subscriptions — `saveSession()` writes `DetMeta` (updating `lastActiveBuildingId` and `step = 1`) but skips the full session blob because the step is still `Step.Building (1)`. Then `loadSession()` is called to restore any previously saved input values. Only after the user advances to step 2 does the full blob start being written.

---

## State Loading on Building Selection

The existing `$building` subscriber in `atoms.ts` is the right place for load-or-reset logic. It already has every input atom in scope:

```ts
// atoms.ts
$building.subscribe((building) => {
  if (building === null) return;
  const session = getSession(building.id);   // reads localStorage only — no atom imports
  if (session) {
    $generalInputState.set(session.generalInput);
    $heatInputState.set(session.heatInput);
    // ... all input atoms
    $selectedInsulationRenovations.set(session.insulationRenovations);
    // ...
  } else {
    $generalInputState.set({});
    $heatInputState.set({});
    // ... reset all
  }
});
```

Either load **or** reset — never both. `Map3D` only calls `setBuilding(feature)` and `$cameraPosition.set(...)`. No separate `checkAndLoadSession` call needed anywhere.

`BuildingWindow` opens and `CurrentStatsReduced` reflects the restored values immediately.

### Avoiding circular imports

`saveSession()` reads atom values (imports `atoms.ts`). `atoms.ts` now calls session functions. To avoid a circular dependency, the session module is split:

| Module | Imports | Exports |
|---|---|---|
| `session/storage.ts` | nothing from this repo | `getSession`, `clearSession`, `saveRawSession`, `getMeta`, `setMeta` — pure localStorage I/O |
| `session/index.ts` | `atoms.ts` + `session/storage.ts` | `saveSession()`, `loadSession()` (for restore-from-Welcome flow) |

`atoms.ts` only imports from `session/storage.ts` → no cycle.

---

## Flows

### A. First-ever open / no session
Normal flow. No change to existing behaviour.

---

### B. Re-open — last session was step 2–7

```
App loads (step 0: Welcome)
  └─ getLastActiveSession() → session found, versions match
  └─ SessionResumeDialog shown on Welcome screen
       ├─ "Continue"
       │    └─ loadSession(id)         ← $building.set → inputs cleared → inputs restored
       │    └─ setStep(session.step)
       │    └─ $pendingFlyTo.set({ lon, lat })
       │         └─ [later, once MapIsland viewer is ready]
       │              └─ viewer.camera.flyToBoundingSphere(...)
       │              └─ $pendingFlyTo.set(null)
       └─ "Dismiss"
            └─ clearLastActive()       ← per-building data stays intact
```

Version mismatch on load: discard the session (`clearSession(id)` + `clearLastActive()`), show a toast "Deine letzte Sitzung konnte nicht wiederhergestellt werden (App wurde aktualisiert)."

---

### C. Building selection — session exists

```
User clicks building on map  (already described above in State Loading)
  └─ BuildingWindow opens with SessionBuildingPrompt
       ├─ "Continue from [step name]"
       │    └─ setStep(session.step)   ← inputs already loaded, camera already positioned
       └─ "Start over"  →  confirmation dialog
            ├─ Confirmed
            │    └─ clearSession(id)
            │    └─ all input atoms → {}
            │    └─ setStep(Step.GeneralData)
            └─ Cancelled  →  SessionBuildingPrompt stays open
```

---

### D. Re-open — last session was step 0–1
`DetMeta.step` is `null`, `0`, or `1` — below the threshold. No prompt. Normal app load.

---

### E. User navigates back to map mid-wizard
Back navigation from step 2 to step 1 (or Welcome):
- `clearLastActive()` is called
- Per-building session data stays in localStorage
- If user re-selects the same building → flow C applies

---

## `clearLastActive` call sites

`clearLastActive()` is called whenever the user intentionally exits the wizard back to the map or welcome:
- `ButtonBar` "Back" when current step is `Step.GeneralData (2)` (going back to the map)
- Any explicit "back to map" navigation action

Step-advance and all other back-navigation just call `saveSession()` normally (the step guard in `saveSession` handles writing the correct step value).

---

## UI Components

### `SessionResumeDialog`
- Rendered in the Welcome page / map overlay, triggered on app load
- Shows when `DetMeta.step >= Step.GeneralData (2)` and `getLastActiveSession()` returns a valid session
- Copy: "Du hast eine offene Sitzung. Weiter machen?" (or result variant: "Du hast Ergebnisse aus einer früheren Sitzung. Anzeigen?")
- Actions: "Weiter machen" | "Abbrechen"

### `SessionBuildingPrompt`
- Replaces `BuildingWindowContent` inside `BuildingWindow` when a session exists for the selected building
- Shows `CurrentStatsReduced` (stats already reflect restored values)
- Shows the saved step name: "Weiter bei: Heizung"
- Actions: "Weiter machen" | "Neu starten" (→ confirmation dialog)

### `StartOverConfirmDialog`
- Simple confirmation before `clearSession`
- "Bist du sicher? Alle gespeicherten Daten für dieses Gebäude werden gelöscht."
- Actions: "Ja, neu starten" | "Abbrechen"

---

## Camera Fly-To on Restore

`Map3D.tsx` already picks the clicked position and flies to it. We extend this to also write to `$cameraPosition`:

```ts
// in Map3D onClick, after pickPosition:
$cameraPosition.set({ lon: cartographic.longitude, lat: cartographic.latitude });
```

On restore, `$pendingFlyTo` is set by `loadSession`. `MapIsland` watches it:

```ts
useEffect(() => {
  if (!viewer || !pendingFlyTo) return;
  const position = Cesium.Cartesian3.fromRadians(pendingFlyTo.lon, pendingFlyTo.lat, 0);
  viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, 50), {
    duration: 1.5,
    offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-40), 300),
  });
  $pendingFlyTo.set(null);
}, [viewer, pendingFlyTo]);
```

---

## Files to Create / Modify

### New
| File | Purpose |
|---|---|
| `src/lib/state/session/index.ts` | Data model, constants, all session functions, `$cameraPosition`, `$pendingFlyTo` |
| `src/lib/state/session/auto-save.ts` | Sets up input atom subscriptions that call `saveSession()` |
| `src/feature/map/SessionResumeDialog.tsx` | Proactive re-open prompt (Welcome screen) |
| `src/feature/map/SessionBuildingPrompt.tsx` | In-`BuildingWindow` "Continue / Start over" UI |
| `src/feature/map/StartOverConfirmDialog.tsx` | Confirmation before clearing session |

### Modified
| File | Change |
|---|---|
| `src/feature/map/Map3D.tsx` | Write `$cameraPosition` on building click |
| `src/feature/map/MapIsland.tsx` | Watch `$pendingFlyTo`, execute fly-to; mount `SessionResumeDialog` |
| `src/feature/map/BuildingWindow.tsx` | Render `SessionBuildingPrompt` when session exists for selected building |
| `src/lib/state/building/index.ts` | Call `checkAndLoadSession` after `setBuilding` (or keep in Map3D) |
| `src/feature/energyCalculation/ButtonBar.tsx` | Call `clearLastActive()` on back from step 2; `saveSession()` is handled by auto-save |
| `astro.config.mjs` | Inject `PUBLIC_CORE_VERSION` from `package.json` |
| `public/locales/de/map.json` + `en/map.json` | New keys for all session prompt copy |

---

## Open Decisions

1. **"Start over" confirmation**: included as `StartOverConfirmDialog` — action is destructive and non-recoverable.

2. **Version mismatch UX**: show a toast, then treat as fresh session.

3. **Session expiry**: no TTL or max-count planned. Multiple building sessions accumulate in localStorage indefinitely. Revisit if storage pressure becomes an issue.

4. **Where to call `checkAndLoadSession`**: either in `Map3D.tsx` (co-located with `setBuilding`) or inside `setBuilding` itself in `building/index.ts`. Recommendation: keep it in `Map3D.tsx` to avoid importing session logic into the building state module — keeps the dependency direction clean.
