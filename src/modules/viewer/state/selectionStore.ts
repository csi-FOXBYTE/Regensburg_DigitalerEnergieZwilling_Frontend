import { useSyncExternalStore } from "react";
import { STEP } from "../types";

type State = {
  selectedBuildingId: string | null;
  currentStep: STEP;
};

const state: State = {
  selectedBuildingId: null,
  currentStep: STEP.building,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function setSelectedBuildingId(id: string | null) {
  if (state.selectedBuildingId === id) return;
  state.selectedBuildingId = id;
  emit();
}

export function setViewerStep(step: STEP) {
  if (state.currentStep === step) return;
  state.currentStep = step;
  emit();
}

export function useSelectedBuildingId() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return [snapshot.selectedBuildingId, setSelectedBuildingId] as const;
}

export function useViewerStep() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return snapshot.currentStep;
}
