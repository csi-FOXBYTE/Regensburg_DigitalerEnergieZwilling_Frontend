import ClientHydration from '@/components/ClientHydration';
import { $pendingFlyTo } from '@/lib/state/session';
import { useStore } from '@nanostores/react';
import * as Cesium from 'cesium';
import { useEffect, useState } from 'react';
import { setBuilding } from '../../lib/state/building';
import AddressSearch from './AddressSearch';
import BuildingWindow from './BuildingWindow';
import { Map3D } from './Map3D';
import { MapNav } from './MapNav';

function matchesAddress(
  feature: Cesium.Cesium3DTileFeature,
  address: { street?: string; housenumber?: string },
): boolean {
  const street = address.street;
  const housenumber = address.housenumber;
  if (!street && !housenumber) return false;

  const featureStreet = feature.getProperty('addresses.0.ThoroughfareName');

  const doesAddressMatch =
    featureStreet != null && street + ' ' + housenumber === featureStreet;

  return doesAddressMatch;
}

function MapWithControls() {
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);
  const pendingFlyTo = useStore($pendingFlyTo);

  useEffect(() => {
    if (!viewer || !pendingFlyTo) return;
    const cartographic = new Cesium.Cartographic(
      pendingFlyTo.lon,
      pendingFlyTo.lat,
    );
    const groundHeight = viewer.scene.globe.getHeight(cartographic) ?? 350;
    const position = Cesium.Cartesian3.fromRadians(
      pendingFlyTo.lon,
      pendingFlyTo.lat,
      groundHeight,
    );
    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, 50), {
      duration: 1.5,
      offset: new Cesium.HeadingPitchRange(
        viewer.camera.heading,
        Cesium.Math.toRadians(-40),
        300,
      ),
    });
    $pendingFlyTo.set(null);
  }, [viewer, pendingFlyTo]);

  return (
    <Map3D onViewerReady={setViewer}>
      <AddressSearch
        onAddressFound={(lat, lon, address) => {
          if (!viewer) return;
          const latF = parseFloat(lat);
          const lonF = parseFloat(lon);
          const cartographic = Cesium.Cartographic.fromDegrees(lonF, latF);
          const groundHeight =
            viewer.scene.globe.getHeight(cartographic) ?? 350;
          const position = Cesium.Cartesian3.fromDegrees(
            lonF,
            latF,
            groundHeight,
          );
          const flyRange = 300;
          const pitch = Cesium.Math.toRadians(-40);
          const heading = viewer.camera.heading;

          let flyTarget = position;
          if (window.innerWidth < 768) {
            const frustum = viewer.camera.frustum as Cesium.PerspectiveFrustum;
            const vfov = frustum.fov ?? Cesium.Math.toRadians(60);
            const worldShift = 0.3 * flyRange * Math.tan(vfov / 2);
            const sinP = Math.sin(pitch);
            const cosP = Math.cos(pitch);
            const enuToEcef = Cesium.Transforms.eastNorthUpToFixedFrame(position);
            const shiftEnu = new Cesium.Cartesian4(
              Math.sin(heading) * sinP * worldShift,
              Math.cos(heading) * sinP * worldShift,
              -cosP * worldShift,
              0,
            );
            const shiftEcef4 = Cesium.Matrix4.multiplyByVector(enuToEcef, shiftEnu, new Cesium.Cartesian4());
            flyTarget = Cesium.Cartesian3.add(
              position,
              new Cesium.Cartesian3(shiftEcef4.x, shiftEcef4.y, shiftEcef4.z),
              new Cesium.Cartesian3(),
            );
          }

          viewer.camera.flyToBoundingSphere(
            new Cesium.BoundingSphere(flyTarget, 50),
            {
              duration: 1.5,
              offset: new Cesium.HeadingPitchRange(heading, pitch, flyRange),
              complete: () => {
                viewer.scene.requestRender();
                const screenPos =
                  viewer.scene.cartesianToCanvasCoordinates(position);
                if (!screenPos) return;

                const drilled = viewer.scene
                  .drillPick(screenPos)
                  .filter(
                    (p): p is Cesium.Cesium3DTileFeature =>
                      p instanceof Cesium.Cesium3DTileFeature,
                  );
                if (drilled.length === 0) return;

                const matched =
                  drilled.find((f) => matchesAddress(f, address)) ?? drilled[0];

                setBuilding(matched);
              },
            },
          );
        }}
      />
      <MapNav viewer={viewer} />
      <BuildingWindow />
    </Map3D>
  );
}

export default function MapIsland() {
  return (
    <ClientHydration>
      <MapWithControls />
    </ClientHydration>
  );
}
