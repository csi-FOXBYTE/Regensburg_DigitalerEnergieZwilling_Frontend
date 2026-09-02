import assert from 'node:assert/strict';
import test from 'node:test';
import { adaptBuildingFeature } from '../src/config/adapters/buildingFeature';
import type { BuildingFeatureSource } from '../src/lib/state/building';

function feature(properties: Record<string, unknown>): BuildingFeatureSource {
  return {
    getProperty: (name) => properties[name],
  };
}

test('adapts the municipality 3D Tiles schema to the building contract', () => {
  const adapted = adaptBuildingFeature(
    feature({
      id: 42,
      function: '31001_1000_foo',
      roofType: '1000',
      measuredHeight: '8.5',
      NiedrigsteTraufeDesGebaeudes: 6,
      HoeheGrund: '340.2',
      HoeheDach: 348.7,
      'addresses.0.ThoroughfareName':
        'Berliner Straße 7a,9;Zwickauer Straße 10',
      'addresses.0.Locality': 'Regensburg',
      'addresses.0.PostalCode': '93055',
      'digitalEnergyTwin.volume': '900',
      'digitalEnergyTwin.groundArea': 120,
      'digitalEnergyTwin.upperFloorArea': '240',
      'digitalEnergyTwin.grossExternalWallArea': 300,
      'digitalEnergyTwin.roofArea': '140',
      'digitalEnergyTwin.roofPitchDegrees': 0,
      'digitalEnergyTwin.height': '8.5',
      'digitalEnergyTwin.envelopeArea': 560,
      'digitalEnergyTwin.adjacentBuildings': JSON.stringify([
        { sharedWallArea: 20 },
        { sharedWallArea: 15.5 },
        { ignored: true },
      ]),
      'digitalEnergyTwin.constructionYear': '1984',
      'digitalEnergyTwin.geothermalEnergyAvailable': 'TRUE',
    }),
  );

  assert.deepEqual(adapted, {
    id: '42',
    isValidBuilding: true,
    properties: {
      measuredHeight: 8.5,
      lowestEave: 6,
      groundHeight: 340.2,
      roofHeight: 348.7,
      isFlatRoof: true,
      address: {
        street: 'Berliner Straße 7a',
        postcode: '93055',
        city: 'Regensburg',
      },
      digitalEnergyTwin: {
        volume: 900,
        groundArea: 120,
        upperFloorArea: 240,
        grossExternalWallArea: 300,
        roofArea: 140,
        roofPitchDegrees: 0,
        height: 8.5,
        envelopeArea: 560,
        adjacentWallArea: 35.5,
        constructionYear: 1984,
        geothermalEnergyAvailable: true,
      },
    },
  });
});

test('marks non-target features invalid and tolerates missing metadata', () => {
  const adapted = adaptBuildingFeature(
    feature({
      id: 'other-1',
      function: 'garage',
      measuredHeight: 'not a number',
      'digitalEnergyTwin.adjacentBuildings': 'invalid JSON',
      'digitalEnergyTwin.geothermalEnergyAvailable': 'unknown',
    }),
  );

  assert.equal(adapted.id, 'other-1');
  assert.equal(adapted.isValidBuilding, false);
  assert.deepEqual(adapted.properties, {
    measuredHeight: undefined,
    lowestEave: undefined,
    groundHeight: undefined,
    roofHeight: undefined,
    isFlatRoof: undefined,
    address: undefined,
    digitalEnergyTwin: {
      volume: undefined,
      groundArea: undefined,
      upperFloorArea: undefined,
      grossExternalWallArea: undefined,
      roofArea: undefined,
      roofPitchDegrees: undefined,
      height: undefined,
      envelopeArea: undefined,
      adjacentWallArea: undefined,
      constructionYear: undefined,
      geothermalEnergyAvailable: undefined,
    },
  });
});
