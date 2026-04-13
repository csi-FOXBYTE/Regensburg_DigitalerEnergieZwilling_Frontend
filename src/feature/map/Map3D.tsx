import { useStore } from '@nanostores/react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { AnimatePresence, motion } from 'motion/react';
import { type ReactNode, useEffect, useLayoutEffect, useState } from 'react';
import { Cesium3DTileset, ImageryLayer, Viewer } from 'resium';
import { $step, Step } from '../progressBar/state';
import { $building, setBuilding, unselectBuilding } from './state';

const terrainProvider = Cesium.CesiumTerrainProvider.fromUrl(
  'https://fhhvrshare.blob.core.windows.net/regensburg/terrain',
  {},
);

const openStreetMapImagerProvider = new Cesium.UrlTemplateImageryProvider({
  url: 'https://intergeo38.bayernwolke.de/betty/g_topopluslight/{z}/{x}/{y}',
  credit:
    'Map tiles by CartoDB, under CC BY 3.0. Data by OpenStreetMap, under ODbL.',
});

const CESIUM_3D_TILES_URL =
  'https://fhhvrshare.blob.core.windows.net/regensburg/tiles/tileset.json';

function createTilesetStyle(selectedBuildingId: string | null) {
  return new Cesium.Cesium3DTileStyle({
    color: {
      conditions: selectedBuildingId
        ? [
            [`\${id} === '${selectedBuildingId}'`, "color('yellow')"],
            ['true', "color('white')"],
          ]
        : [['true', "color('white')"]],
    },
    edgeColor: "color('black')",
    edgeWidth: selectedBuildingId ? 1.0 : 0.0,
  });
}

type Map3DProps = {
  children?: ReactNode;
  onViewerReady?: (viewer: Cesium.Viewer) => void;
};

export function Map3D({ children, onViewerReady }: Map3DProps) {
  const currentStep = useStore($step);
  const building = useStore($building);
  const [viewerRef, setViewerRef] = useState<Cesium.Viewer | null>(null);
  const [tilesetRef, setTilesetRef] = useState<Cesium.Cesium3DTileset | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const selectedBuildingId = building ? building.id : null;

  useEffect(() => {
    if (!tilesetRef) return;
    tilesetRef.style = createTilesetStyle(selectedBuildingId);
    viewerRef?.scene.requestRender();
  }, [selectedBuildingId, tilesetRef, viewerRef]);

  useEffect(() => {
    if (!viewerRef || building) return;
    viewerRef.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    viewerRef.scene.requestRender();
  }, [building, viewerRef]);

  useEffect(() => {
    if (!viewerRef) return;
    const handler = new Cesium.ScreenSpaceEventHandler(viewerRef.scene.canvas);
    handler.setInputAction(
      (click: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const picked = viewerRef.scene.pick(click.position);
        if (!picked) unselectBuilding();
      },
      Cesium.ScreenSpaceEventType.LEFT_CLICK,
    );
    return () => handler.destroy();
  }, [viewerRef]);

  useLayoutEffect(() => {
    if (!viewerRef) return;

    viewerRef.scene.globe.depthTestAgainstTerrain = true;
    viewerRef.scene.camera.setView({
      destination: new Cesium.Cartesian3(
        4097950.7166549894,
        878003.5980000327,
        4792511.434740864,
      ),
      orientation: new Cesium.HeadingPitchRoll(
        2.1531010795079872,
        -0.32218730172914567,
        6.283182266155325,
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
    viewerRef.scene.screenSpaceCameraController.zoomEventTypes = [
      Cesium.CameraEventType.WHEEL,
      Cesium.CameraEventType.PINCH,
    ];
    viewerRef.scene.screenSpaceCameraController.zoomFactor = 3;
  }, [viewerRef]);

  const isInteractiveStep = currentStep === Step.Building;
  return (
    <div
      className={`absolute top-(--header-height) left-0 h-(--content-height) w-full ${isInteractiveStep ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <Viewer
        ref={(ref) => {
          if (!ref?.cesiumElement) return;
          setViewerRef(ref.cesiumElement);
          onViewerReady?.(ref.cesiumElement);
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
        {isInteractiveStep && children}
        <ImageryLayer imageryProvider={openStreetMapImagerProvider} />
        <Cesium3DTileset
          onAllTilesLoad={() => setLoading(false)}
          onReady={(tileset) => {
            setTilesetRef(tileset);
            tileset.style = createTilesetStyle(selectedBuildingId);
            tileset.imageBasedLighting.imageBasedLightingFactor.x = 2;
            tileset.imageBasedLighting.imageBasedLightingFactor.y = 2;
          }}
          onClick={(movement, feature) => {
            if (!feature || !viewerRef || !movement.position) return;
            const tileFeature = feature as Cesium.Cesium3DTileFeature;
            setBuilding(tileFeature);

            const picked = viewerRef.scene.pickPosition(movement.position);
            if (!Cesium.defined(picked)) return;

            const cartographic = Cesium.Cartographic.fromCartesian(picked);
            const groundHeight =
              viewerRef.scene.globe.getHeight(cartographic) ?? 0;
            const position = Cesium.Cartesian3.fromRadians(
              cartographic.longitude,
              cartographic.latitude,
              groundHeight,
            );

            viewerRef.camera.flyToBoundingSphere(
              new Cesium.BoundingSphere(position, 50),
              {
                duration: 1.5,
                offset: new Cesium.HeadingPitchRange(
                  viewerRef.camera.heading,
                  Cesium.Math.toRadians(-40),
                  300,
                ),
                complete: () => {
                  viewerRef.scene.requestRender();
                },
              },
            );
            feature.primitive.boundingSphere;
          }}
          url={CESIUM_3D_TILES_URL}
        />
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-white/95 backdrop-blur-md"
            >
              <div>Lade Anwendung...</div>
            </motion.div>
          )}
        </AnimatePresence>
      </Viewer>
    </div>
  );
}
