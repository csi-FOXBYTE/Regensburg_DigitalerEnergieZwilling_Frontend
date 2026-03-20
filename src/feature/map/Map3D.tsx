import { Button } from "@/components/ui/button";
import { useStore } from '@nanostores/react';
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { Maximize2, Navigation, ZoomIn, ZoomOut } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { lazy, useEffect, useLayoutEffect, useState } from "react";
import { Cesium3DTileset, ImageryLayer, Viewer } from "resium";
import { $step, Step } from "../progressBar/state";
import AddressSearch from './AddressSearch';
import { $building, setBuilding } from "./state";

const MiniMap = lazy(() => import("./Minimap"));

const terrainProvider = Cesium.CesiumTerrainProvider.fromUrl(
  "https://fhhvrshare.blob.core.windows.net/regensburg/terrain",
  {}
);

const openStreetMapImagerProvider = new Cesium.UrlTemplateImageryProvider({
  url: "https://intergeo38.bayernwolke.de/betty/g_topopluslight/{z}/{x}/{y}",
  credit:
    "Map tiles by CartoDB, under CC BY 3.0. Data by OpenStreetMap, under ODbL.",
});

function createTilesetStyle(selectedBuildingId: string | null) {
  return new Cesium.Cesium3DTileStyle({
    color: {
      conditions: selectedBuildingId
        ? [[`\${id} === '${selectedBuildingId}'`, "color('yellow')"], ["true", "color('white')"]]
        : [["true", "color('white')"]],
    },
    edgeColor: "color('black')",
    edgeWidth: selectedBuildingId ? 1.0 : 0.0,
  });
}



export function Map3D() {
  const currentStep = useStore($step);
  const building = useStore($building);
  const [viewerRef, setViewerRef] = useState<Cesium.Viewer | null>(null);
  const [tilesetRef, setTilesetRef] = useState<Cesium.Cesium3DTileset | null>(null);
  const [loading, setLoading] = useState(true);

  const selectedBuildingId = building ? building.id : null;

  useEffect(() => {
    if (!tilesetRef) return;
    tilesetRef.style = createTilesetStyle(selectedBuildingId);
    viewerRef?.scene.requestRender();
  }, [selectedBuildingId, tilesetRef, viewerRef]);

  useLayoutEffect(() => {
    if (!viewerRef) return;

    viewerRef.scene.globe.depthTestAgainstTerrain = true;
    viewerRef.scene.camera.setView({
      destination: new Cesium.Cartesian3(
        4097950.7166549894,
        878003.5980000327,
        4792511.434740864
      ),
      orientation: new Cesium.HeadingPitchRoll(
        2.1531010795079872,
        -0.32218730172914567,
        6.283182266155325
      ),
    });

    const ambientOcclusion = viewerRef.scene.postProcessStages.ambientOcclusion;
    ambientOcclusion.enabled = true;
    viewerRef.camera.frustum.near = 1.0;
    ambientOcclusion.uniforms.intensity = 3.0;
    ambientOcclusion.uniforms.bias = 0.1;
    ambientOcclusion.uniforms.lengthCap = 0.26;
    ambientOcclusion.uniforms.stepCount = 8;
    ambientOcclusion.uniforms.directionCount = 16;

    viewerRef.scene.globe.baseColor = Cesium.Color.WHITE;
    viewerRef.scene.globe.showGroundAtmosphere = false;
  }, [viewerRef]);

  const isInteractiveStep = currentStep === Step.Building;

  return (
    <div
      className={`relative w-full h-full ${isInteractiveStep ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <Viewer
        ref={(ref) => {
          if (!ref?.cesiumElement) return;
          setViewerRef(ref.cesiumElement);
        }}
        className="h-full"
        geocoder={false}
        baseLayer={false}
        animation={false}
        requestRenderMode={true}
        baseLayerPicker={false}
        projectionPicker={false}
        homeButton={false}
        infoBox={false}
        vrButton={false}
        timeline={false}
        navigationHelpButton={false}
        fullscreenButton={false}
        scene3DOnly={true}
        terrainProvider={terrainProvider}
      >
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            width: "200px",
            height: "200px",
            zIndex: "100",
            border: "2px solid white",
            overflow: "hidden",
          }}
        >
          <MiniMap viewerRef={viewerRef} />
        </div>
        {isInteractiveStep && (
          <>
            <AddressSearch
              onAddressFound={(lat, lon) => {
                if (!viewerRef) return;

                viewerRef.camera.flyTo({
                  easingFunction: Cesium.EasingFunction.LINEAR_NONE,
                  duration: 0.2,
                  destination: Cesium.Cartesian3.fromDegrees(
                    parseFloat(lon),
                    parseFloat(lat),
                    viewerRef.camera.positionCartographic.height
                  ),
                });
              }}
            />
            <nav
              className="absolute top-20 right-4 z-10 flex flex-col space-y-2"
              aria-label="Kartensteuerung"
            >
              <Button
                variant="map"
                size="icon"
                title="Zoom In"
                aria-label="Hineinzoomen"
              >
                <ZoomIn aria-hidden="true" />
              </Button>
              <Button
                variant="map"
                size="icon"
                title="Zoom Out"
                aria-label="Herauszoomen"
              >
                <ZoomOut aria-hidden="true" />
              </Button>
              <Button
                variant="map"
                size="icon"
                title="Rotate"
                aria-label="Karte um 45 Grad drehen"
              >
                <Navigation aria-hidden="true" />
              </Button>
              <Button
                variant="map"
                size="icon"
                title="Toggle 3D View"
              >
                <Maximize2 aria-hidden="true" />
              </Button>
            </nav>
          </>
        )}
        <ImageryLayer imageryProvider={openStreetMapImagerProvider} />
        <Cesium3DTileset
          onAllTilesLoad={() => setLoading(false)}
          onReady={(tileset) => {
            setTilesetRef(tileset);
            tileset.style = createTilesetStyle(selectedBuildingId);
            tileset.imageBasedLighting.imageBasedLightingFactor.x = 2;
            tileset.imageBasedLighting.imageBasedLightingFactor.y = 2;
          }}
          onClick={(_, feature) => {
            if (!feature) return;
            const rawId = feature.getProperty("id");
            if (rawId === undefined || rawId === null) return;
            setBuilding({id: String(rawId)});
          }}
          url="https://fhhvrshare.blob.core.windows.net/regensburg/tiles/tileset.json"
        />
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md"
            >
              <div>Lade Anwendung...</div>
            </motion.div>
          )}
        </AnimatePresence>
      </Viewer>
    </div>
  );
}
