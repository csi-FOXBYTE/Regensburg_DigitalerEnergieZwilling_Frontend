import ClientHydration from '@/components/ClientHydration';
import { $pendingFlyTo } from '@/lib/state/session';
import { useStore } from '@nanostores/react';
import * as Cesium from 'cesium';
import { setBuilding } from '../../lib/state/building';
import { useEffect, useState } from 'react';
import AddressSearch from './AddressSearch';
import BuildingWindow from './BuildingWindow';
import { Map3D } from './Map3D';
import { MapNav } from './MapNav';

function MapWithControls() {
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);
  const pendingFlyTo = useStore($pendingFlyTo);

  useEffect(() => {
    if (!viewer || !pendingFlyTo) return;
    const position = Cesium.Cartesian3.fromRadians(
      pendingFlyTo.lon,
      pendingFlyTo.lat,
      0,
    );
    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, 50), {
      duration: 1.5,
      offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-40), 300),
    });
    $pendingFlyTo.set(null);
  }, [viewer, pendingFlyTo]);

  return (
    <Map3D onViewerReady={setViewer}>
      <AddressSearch
        onAddressFound={(lat, lon) => {
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
          viewer.camera.flyToBoundingSphere(
            new Cesium.BoundingSphere(position, 50),
            {
              duration: 1.5,
              offset: new Cesium.HeadingPitchRange(
                viewer.camera.heading,
                Cesium.Math.toRadians(-40),
                300,
              ),
              complete: () => {
                viewer.scene.requestRender();
                const screenPos = viewer.scene.cartesianToCanvasCoordinates(position);
                if (!screenPos) return;
                const picked = viewer.scene.pick(screenPos);
                if (picked instanceof Cesium.Cesium3DTileFeature) {
                  setBuilding(picked);
                }
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
