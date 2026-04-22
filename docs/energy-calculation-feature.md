# Energy Calculation Feature — Architecture Reference

This document is intended to quickly orient an AI coding assistant on the structure, data flow, and conventions of the `energyCalculation` feature.

---

## Directory Layout

```
src/feature/energyCalculation/
├── EnergyCalculationField.tsx   # Shared wrapper: label + reset button
├── EnergyNumberInput.tsx        # Number input field
├── EnergySelectInput.tsx        # Select/dropdown input (3 variants)
├── EnergyBooleanInput.tsx       # Yes/No radio input
├── ButtonBar.tsx                # Back/Continue navigation
├── CurrentStats.tsx             # Live stats cards (4 KPIs)
├── general/
│   ├── GeneralDataStep.astro
│   └── GeneralDataStepForm.tsx
├── electricity/
│   ├── ElectricityStep.astro
│   └── ElectricityStepForm.tsx
├── heat/
│   ├── HeatStep.astro
│   └── HeatStepForm.tsx
└── outer/
    ├── OuterPartsStep.astro
    ├── OuterPartsStepForm.tsx
    ├── RoofPaper.tsx
    ├── RoofWindowsPaper.tsx
    ├── TopFloorPaper.tsx
    ├── OuterWallPaper.tsx
    ├── WindowsPaper.tsx
    └── BottomFloorPaper.tsx

src/lib/
├── field-store.ts               # FieldStore<T> pattern
├── selection-store.ts           # SelectionStore / RangeBandStore helpers
└── state/
    ├── building/index.ts        # Selected 3D building atom
    ├── calculation-config/index.ts  # $config atom (dropdown options)
    ├── inputs/
    │   ├── atoms.ts             # 8 raw Partial<DET*Input> atoms
    │   ├── general.ts           # Field stores for general step
    │   ├── heat.ts              # Field stores for heat step
    │   ├── roof.ts
    │   ├── roof-windows.ts
    │   ├── outer-wall.ts
    │   ├── exterior-wall-windows.ts
    │   ├── top-floor.ts
    │   ├── bottom-floor.ts
    │   └── index.ts
    ├── computed/
    │   ├── lod2-input.ts        # Geometry → input shape
    │   ├── calculation-input.ts # Merges all inputs → DETInput
    │   ├── current-energy-state.ts  # Calls calculate(), emits KPIs
    │   ├── resolved-input.ts    # Extracts per-section resolved values
    │   └── index.ts
    └── ui/
        └── progress.ts          # $step atom (Step enum 0-7)
```

---

## Step Routing

Steps are encoded as an enum in `src/lib/state/ui/progress.ts`:

```ts
enum Step {
  Welcome      = 0,
  Building     = 1,
  GeneralData  = 2,
  OuterParts   = 3,
  Heat         = 4,
  Electricity  = 5,
  Renovation   = 6,
  Result       = 7,
}
```

`$step` is a nanostore atom. `ButtonBar` reads it to increment/decrement. The Astro layout (`EnergyCalculationPage.astro`) uses a `data-step-gate` attribute to show/hide content based on the current step.

---

## State Flow

```
3D Scene (Cesium feature)
        │  setBuilding(feature)
        ▼
   $building  ──────────────────────────────────────┐
        │                                           │
        ▼                                           ▼
  $lod2Input (computed)                  [used as fallback geometry]
  (geometry → input shape)
        │
        ▼
  $calculationInput (computed)
  ┌────────────────────────────────────────────────────────┐
  │  merges (lowest → highest priority):                  │
  │    LOD2 geometry  <  user input atoms  <  hard defaults│
  └──────────────────────────────┬─────────────────────────┘
                                 │
                                 ▼
                    calculate($config, $calculationInput)
                    (external core library)
                                 │
                                 ▼
                       $currentEnergyState
                       ┌─────────────────────────────────┐
                       │ energyConsumptionPerSquareMeter  │
                       │ energyEfficiencyClass            │
                       │ yearlyCost                       │
                       │ co2Emissions                     │
                       │ resolvedInput  ◄── full resolved │
                       └────────┬────────────────────────┘
                                │
                                ▼
                  $resolvedGeneralInput, $resolvedHeatInput,
                  $resolvedRoofInput, ... (8 total)
                  (become $placeholder in each FieldStore)
```

User edits in forms flow **up** into the raw atoms (`$generalInputState`, `$heatInputState`, etc.) via `FieldStore.setValue()`. The computed chain re-runs automatically because nanostores tracks dependencies.

---

## FieldStore Pattern (`src/lib/field-store.ts`)

Every individual input field is backed by a `FieldStore<T>`:

```ts
const myField = makeFieldStore({
  store: $generalInputState,         // atom to write into
  getValue: (s) => s.fieldName,      // how to read the field
  setValue: (draft, v) => {          // immer draft mutation
    draft.fieldName = v;
  },
  placeholderStore: $resolvedGeneralInput, // provides grey placeholder
  resettable: true,
});
```

**Key properties available on a FieldStore:**

| Property | Type | Description |
|---|---|---|
| `$store` | `ReadableAtom<T \| undefined>` | Current user value |
| `$placeholder` | `ReadableAtom<T \| undefined>` | Resolved/calculated default |
| `setValue(v)` | function | Write new value via immer |
| `reset()` | function | Set value back to `undefined` |
| `resettable` | boolean | Whether a reset button is shown |

The `reset()` call sets the field to `undefined`, which causes the computed chain to fall back to the LOD2 geometry or the calculation result placeholder.

---

## SelectionStore & RangeBandStore (`src/lib/selection-store.ts`)

Used for dropdown options.

- **`makeSelectionStore(configKey, filterFn?)`** — creates a readable atom of `{ value, label }[]` derived from `$config`. An optional `filterFn` (which can itself read other atoms) enables dependent dropdowns (e.g., heating system types filtered by energy carrier).
- **`makeRangeBandStore(configKey)`** — same but for year-range objects; handles custom equality for `RangeKey`.

---

## Input Components

### `EnergyCalculationField.tsx`

Wrapper used by all three input types. Renders label (i18n key), optional info tooltip, and a reset button (shown only if `field.resettable && field.$store !== undefined`).

### `EnergyNumberInput.tsx`

```tsx
<EnergyNumberInput
  field={someFieldStore}         // FieldStore<number | undefined>
  labelKey="translation.key"
  suffix=" m²"
  decimalScale={1}
/>
```

Placeholder text is the resolved value formatted with suffix. Calls `field.setValue()` on change.

### `EnergySelectInput.tsx`

Three usage variants depending on the options source:

```tsx
// 1. Static options array
<EnergySelectInput field={f} options={[{ value: 'A', label: 'Option A' }]} />

// 2. SelectionStore (filtered/translated from $config)
<EnergySelectInput field={f} selectionStore={heatingSystemTypeOptions} />

// 3. RangeBandStore (year ranges)
<EnergySelectInput field={f} rangeBandStore={buildingYearOptions} />
```

Auto-selects when only one option is available. Clears the value if the current selection disappears from the option list (e.g., after a dependent filter changes).

### `EnergyBooleanInput.tsx`

```tsx
<EnergyBooleanInput field={someFieldStore} labelKey="translation.key" />
```

Renders two radio buttons (Yes / No). When value is `undefined` but a placeholder exists, a subtle dot indicates the calculated default.

---

## Step Forms

### Pattern

Each step is an Astro page (`*Step.astro`) that imports a React form (`*StepForm.tsx`):

```astro
<EnergyCalculationPage step={3}>
  <Typography variant="h2">{t('title')}</Typography>
  <CurrentStats client:load />
  <OuterPartsStepForm client:visible />
  <ButtonBar client:load />
</EnergyCalculationPage>
```

- `client:load` — hydrated immediately (ButtonBar, CurrentStats need it for interactivity)
- `client:visible` — hydrated when scrolled into view (lazy, used for heavy forms)

### GeneralDataStepForm

4 fields in a 2-column grid:

| Field | Type | Resettable |
|---|---|---|
| `buildingYearField` | RangeBand | yes |
| `buildingTypeField` | Selection (SINGLE_FAMILY / MULTI_FAMILY) | yes |
| `numberOfStoriesField` | Number (integer) | no |
| `livingAreaField` | Number (1 decimal, m²) | no |

### HeatStepForm

4 fields in a 2-column grid:

| Field | Type | Notes |
|---|---|---|
| `heatingSystemConstructionYearField` | RangeBand | resettable |
| `primaryEnergyCarrierField` | Selection | resettable |
| `heatingSystemTypeField` | Selection | filtered by carrier |
| `heatingSurfaceTypeField` | Selection | resettable |

### ElectricityStepForm

Currently a placeholder — structure exists, no fields implemented yet.

### OuterPartsStepForm

Composed of 6 "Paper" sub-sections stacked vertically:

1. **RoofPaper** — year, area, constructionType; hasAttic, isAtticHeated; insulation fields
2. **RoofWindowsPaper** — year, area, windowType, uValue
3. **TopFloorPaper** — rendered only when `hasAttic && !isAtticHeated`; year, area, topFloorType + insulation
4. **OuterWallPaper** — year, area, constructionType + insulation
5. **WindowsPaper** — year, area, windowType, uValue (exterior wall windows)
6. **BottomFloorPaper** — context-aware labels based on `hasBasement` + `isBasementHeated`

Conditional visibility inside papers follows the pattern: render the field only if the controlling boolean field store value (or its placeholder) is truthy.

---

## Adding a New Field — Checklist

1. **Extend the input type** in the energy calculation core types if needed.
2. **Add the atom update** in the relevant `src/lib/state/inputs/*.ts` file using `makeFieldStore(...)`.
3. **Export** the new field store (and any associated options store) from that file.
4. **Add to the raw atom shape** in `src/lib/state/inputs/atoms.ts` if the field is new.
5. **Wire placeholder**: if the core `calculate()` already resolves this field, add it to `src/lib/state/computed/resolved-input.ts`.
6. **Render** in the appropriate `*StepForm.tsx` or `*Paper.tsx` using `<EnergyNumberInput>`, `<EnergySelectInput>`, or `<EnergyBooleanInput>`.
7. **Translate**: add the label key to `public/locales/de/energyCalculation.json` and `public/locales/en/energyCalculation.json`.

---

## Key External Dependency

The calculation engine is `@csi-foxbyte/regensburg_digitalerenergiezwilling_energycalculationcore`. It exports:
- `calculate(config: DETConfig, input: DETInput): DETResult`
- Type definitions: `DETInput`, `DETConfig`, `DETResult`, and sub-types per section

`$config` is loaded once and stored in `src/lib/state/calculation-config/index.ts`. It drives all dropdown option lists.
