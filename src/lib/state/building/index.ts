import {
  adaptBuildingFeature,
  addressEntries,
} from '@/config/adapters/buildingFeature';
import type { Cesium3DTileFeature } from 'cesium';
import { atom } from 'nanostores';

export { addressEntries };

export type DigitalEnergyTwin = {
  volume: number | undefined;
  groundArea: number | undefined;
  upperFloorArea: number | undefined;
  grossExternalWallArea: number | undefined;
  roofArea: number | undefined;
  roofPitchDegrees: number | undefined;
  height: number | undefined;
  envelopeArea: number | undefined;
  adjacentWallArea: number | undefined;
  constructionYear: number | undefined;
  geothermalEnergyAvailable: boolean | undefined;
};

export type BuildingAddress = {
  street: string;
  postcode?: string;
  city: string;
};

export type BuildingProperties = {
  measuredHeight: number | undefined;
  lowestEave: number | undefined;
  groundHeight: number | undefined;
  roofHeight: number | undefined;
  isFlatRoof: boolean | undefined;
  digitalEnergyTwin: DigitalEnergyTwin;
  address: BuildingAddress | undefined;
};

export type BuildingFeatureSource = {
  getProperty(name: string): unknown;
};

export type AdaptedBuildingFeature = {
  id: string | undefined;
  isValidBuilding: boolean;
  properties: BuildingProperties;
};

export type BuildingFeatureAdapter = (
  feature: BuildingFeatureSource,
) => AdaptedBuildingFeature;

export type BuildingCoordinates = {
  lon: number;
  lat: number;
};

export type BuildingState = {
  id: string;
  properties: BuildingProperties;
  coordinates: BuildingCoordinates;
};

export const $building = atom<BuildingState | null>(null);

export function setBuilding(
  feature: Cesium3DTileFeature,
  coordinates: BuildingCoordinates,
  streetOverride?: string,
) {
  const adapted = adaptBuildingFeature(feature);
  if (!adapted.isValidBuilding || !adapted.id) return;

  const address = adapted.properties.address;
  const properties =
    streetOverride && address
      ? {
          ...adapted.properties,
          address: { ...address, street: streetOverride },
        }
      : adapted.properties;

  $building.set({
    id: adapted.id,
    coordinates,
    properties,
  });
}

export function unselectBuilding() {
  $building.set(null);
}
