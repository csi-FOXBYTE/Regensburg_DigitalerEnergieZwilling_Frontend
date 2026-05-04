import { atom } from 'nanostores';

export enum Step {
  Welcome = 0,
  Building = 1,
  GeneralData = 2,
  OuterParts = 3,
  Heat = 4,
  Electricity = 5,
  Renovation = 6,
  Result = 7,
}

export const $step = atom<Step>(Step.Welcome);

export function setStep(step: Step) {
  $step.set(step);
}

export function navigateToStep(target: Step) {
  const current = $step.get();
  if (target === current) return;

  if (target > current) {
    setStep(target);
    for (let s = current + 1; s <= target; s++) {
      history.pushState({ step: s }, '');
      recordHistoryPush(s);
    }
  } else {
    // Don't setStep here — let popstate handle it so the handler can
    // read the pre-navigation step and kill forward history when crossing step < 2.
    history.go(target - current);
  }
}

// --- History debug tracking (used by DevPanel) ---

export type HistoryDebugState = {
  entries: (Step | null)[];
  currentIndex: number;
};

export const $historyDebug = atom<HistoryDebugState>({
  entries: [null],
  currentIndex: 0,
});

export function recordHistoryPush(step: Step): void {
  const { entries, currentIndex } = $historyDebug.get();
  const trimmed = entries.slice(0, currentIndex + 1);
  $historyDebug.set({ entries: [...trimmed, step], currentIndex: trimmed.length });
}

export function recordHistoryNav(step: Step | null): void {
  const { entries, currentIndex } = $historyDebug.get();
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (entries[i] === step) {
      $historyDebug.set({ entries, currentIndex: i });
      return;
    }
  }
  for (let i = currentIndex + 1; i < entries.length; i++) {
    if (entries[i] === step) {
      $historyDebug.set({ entries, currentIndex: i });
      return;
    }
  }
}
