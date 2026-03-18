import { persistentAtom } from '@nanostores/persistent'

export enum Step {
  Welcome = 0,
  Building = 1,
  GeneralData = 2,
  OuterParts = 3,
  Heat = 4,
  Electricity = 5,
  Renovation = 6,
  Result = 7
}

export const $step = persistentAtom("editorStep", Step.Building, {
  encode: JSON.stringify,
  decode: JSON.parse
});

export function setStep(step: Step) {
  $step.set(step);
}
