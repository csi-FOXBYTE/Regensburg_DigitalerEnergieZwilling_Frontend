import { atom } from 'nanostores';

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

export const $step = atom<Step>(Step.GeneralData);

export function setStep(step: Step) {
  $step.set(step);
}
