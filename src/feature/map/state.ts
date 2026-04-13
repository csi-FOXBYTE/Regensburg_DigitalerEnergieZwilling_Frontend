import type { Cesium3DTileFeature } from 'cesium';
import { atom } from 'nanostores';

export type DigitalEnergyTwin = {
  volume: number | undefined;
  groundArea: number | undefined;
  upperFloorArea: number | undefined;
  grossExternalWallArea: number | undefined;
  roofArea: number | undefined;
  roofPitchDegrees: number | undefined;
  height: number | undefined;
  envelopeArea: number | undefined;
};

export type BuildingProperties = {
  measuredHeight: number | undefined;
  lowestEave: number | undefined;
  groundHeight: number | undefined;
  roofHeight: number | undefined;
  digitalEnergyTwin: DigitalEnergyTwin;
};

export type BuildingState = {
  id: string;
  properties: BuildingProperties;
};

export const $building = atom<BuildingState | null>(null);

function numProp(
  feature: Cesium3DTileFeature,
  name: string,
): number | undefined {
  const value = feature.getProperty(name);
  return typeof value === 'string' ? Number(value) : (value ?? undefined);
}

export function setBuilding(feature: Cesium3DTileFeature) {
  const id = feature.getProperty('id');
  if (id == null) return;

  $building.set({
    id: String(id),
    properties: {
      measuredHeight: numProp(feature, 'measuredHeight'),
      lowestEave: numProp(feature, 'NiedrigsteTraufeDesGebaeudes'),
      groundHeight: numProp(feature, 'HoeheGrund'),
      roofHeight: numProp(feature, 'HoeheDach'),
      digitalEnergyTwin: {
        volume: numProp(feature, 'digitalEnergyTwin.volume'),
        groundArea: numProp(feature, 'digitalEnergyTwin.groundArea'),
        upperFloorArea: numProp(feature, 'digitalEnergyTwin.upperFloorArea'),
        grossExternalWallArea: numProp(
          feature,
          'digitalEnergyTwin.grossExternalWallArea',
        ),
        roofArea: numProp(feature, 'digitalEnergyTwin.roofArea'),
        roofPitchDegrees: numProp(
          feature,
          'digitalEnergyTwin.roofPitchDegrees',
        ),
        height: numProp(feature, 'digitalEnergyTwin.height'),
        envelopeArea: numProp(feature, 'digitalEnergyTwin.envelopeArea'),
      },
    },
  });
}

export function unselectBuilding() {
  $building.set(null);
}
