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
  adjacentWallArea: number | undefined;
  constructionYear: number | undefined;
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
  digitalEnergyTwin: DigitalEnergyTwin;
  address: BuildingAddress | undefined;
};

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

function sharedWallAreaSum(feature: Cesium3DTileFeature): number | undefined {
  const raw = feature.getProperty('digitalEnergyTwin.adjacentBuildings');
  if (typeof raw !== 'string') return undefined;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return undefined;
    return parsed.reduce((sum, b) => {
      const area =
        typeof b === 'object' &&
        b !== null &&
        typeof (b as Record<string, unknown>).sharedWallArea === 'number'
          ? ((b as Record<string, unknown>).sharedWallArea as number)
          : 0;
      return sum + area;
    }, 0);
  } catch {
    return undefined;
  }
}

function numProp(
  feature: Cesium3DTileFeature,
  name: string,
): number | undefined {
  const value = feature.getProperty(name);
  return typeof value === 'string' ? Number(value) : (value ?? undefined);
}

function parseAddress(
  feature: Cesium3DTileFeature,
): BuildingAddress | undefined {
  const street = feature.getProperty('addresses.0.ThoroughfareName');
  const city = feature.getProperty('addresses.0.Locality');
  if (typeof street !== 'string' || typeof city !== 'string') return undefined;
  const postcode = feature.getProperty('addresses.0.PostalCode');
  return {
    street,
    postcode: typeof postcode === 'string' ? postcode : undefined,
    city,
  };
}

export function setBuilding(
  feature: Cesium3DTileFeature,
  coordinates: BuildingCoordinates,
) {
  const id = feature.getProperty('id');

  if (id == null) return;

  $building.set({
    id: String(id),
    coordinates,
    properties: {
      measuredHeight: numProp(feature, 'measuredHeight'),
      lowestEave: numProp(feature, 'NiedrigsteTraufeDesGebaeudes'),
      groundHeight: numProp(feature, 'HoeheGrund'),
      roofHeight: numProp(feature, 'HoeheDach'),
      address: parseAddress(feature),
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
        adjacentWallArea: sharedWallAreaSum(feature),
        constructionYear: numProp(
          feature,
          'digitalEnergyTwin.constructionYear',
        ),
      },
    },
  });
}

export function unselectBuilding() {
  $building.set(null);
}
