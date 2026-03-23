import { atom } from "nanostores";

export type BuildingState = {
  id: string;
}

export const $building = atom<BuildingState | null>(null);

export function setBuilding(building: BuildingState) {
  $building.set(building);
}

export function unselectBuilding() {
  $building.set(null);
}