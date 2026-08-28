import { mapConfig } from '@/config/map';
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

export function isSelectableBuilding(feature: Cesium3DTileFeature): boolean {
  const featureFunction = feature.getProperty('function');
  return String(featureFunction ?? '').startsWith(
    mapConfig.selectableBuildingFunctionPrefix,
  );
}

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

function boolProp(
  feature: Cesium3DTileFeature,
  name: string,
): boolean | undefined {
  const value = feature.getProperty(name);
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return undefined;

  const normalized = value.trim().toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  return undefined;
}

function isFlatRoof(feature: Cesium3DTileFeature): boolean | undefined {
  const roofType = feature.getProperty('roofType');
  return roofType == null ? undefined : String(roofType) === '1000';
}

/** Splits "Berliner Straße 7a,9;Zwickauer Straße 10" into one entry per address. */
export function addressEntries(raw: string): string[] {
  return raw
    .split(';')
    .flatMap((segment) => {
      const trimmed = segment.trim();
      const match = /^(.*)\s+(\d[^\s]*(?:,[^\s]*)*)$/.exec(trimmed);
      if (!match) return trimmed;
      const [, street, houseNumbers] = match;
      return houseNumbers.split(',').map((number) => `${street} ${number}`);
    })
    .filter((entry) => entry.length > 0);
}

function parseAddress(
  feature: Cesium3DTileFeature,
  streetOverride?: string,
): BuildingAddress | undefined {
  const street = feature.getProperty('addresses.0.ThoroughfareName');
  const city = feature.getProperty('addresses.0.Locality');
  if (typeof street !== 'string' || typeof city !== 'string') return undefined;
  const postcode = feature.getProperty('addresses.0.PostalCode');
  return {
    // Never a whole address list: the searched address, else the first entry.
    street: streetOverride ?? addressEntries(street)[0] ?? street,
    postcode: typeof postcode === 'string' ? postcode : undefined,
    city,
  };
}

export function setBuilding(
  feature: Cesium3DTileFeature,
  coordinates: BuildingCoordinates,
  streetOverride?: string,
) {
  if (!isSelectableBuilding(feature)) return;

  console.log(
    '[map] selected feature properties:',
    Object.fromEntries(
      feature.getPropertyIds([]).map((key) => [key, feature.getProperty(key)]),
    ),
  );

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
      isFlatRoof: isFlatRoof(feature),
      address: parseAddress(feature, streetOverride),
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
        geothermalEnergyAvailable: boolProp(
          feature,
          'digitalEnergyTwin.geothermalEnergyAvailable',
        ),
      },
    },
  });
}

export function unselectBuilding() {
  $building.set(null);
}
