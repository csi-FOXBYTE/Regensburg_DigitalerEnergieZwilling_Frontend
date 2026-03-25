import ClientHydration from "@/components/ClientHydration";
import * as Cesium from "cesium";
import { useState } from "react";
import AddressSearch from "./AddressSearch";
import BuildingWindow from './BuildingWindow';
import { Map3D } from "./Map3D";
import { MapNav } from "./MapNav";

function MapWithControls() {
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);

  return (
    <Map3D onViewerReady={setViewer}>
      <AddressSearch
        onAddressFound={(lat, lon) => {
          if (!viewer) return;
          viewer.camera.flyTo({
            easingFunction: Cesium.EasingFunction.LINEAR_NONE,
            duration: 0.2,
            destination: Cesium.Cartesian3.fromDegrees(
              parseFloat(lon),
              parseFloat(lat),
              viewer.camera.positionCartographic.height
            ),
          });
        }}
      />
      <MapNav viewer={viewer} />
      <BuildingWindow/>
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
