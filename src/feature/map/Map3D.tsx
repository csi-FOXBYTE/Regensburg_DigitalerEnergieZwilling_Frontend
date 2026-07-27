import { useStore } from '@nanostores/react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { AnimatePresence, motion } from 'motion/react';
import { type ReactNode, useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cesium3DTileset, ImageryLayer, Viewer } from 'resium';
import { CameraController } from '../../lib/camera';
import {
  type FocusCameraIntent,
  registerCameraOwner,
  requestCamera,
} from '../../lib/camera-state';
import {
  $building,
  isSelectableBuilding,
  setBuilding,
  unselectBuilding,
} from '../../lib/state/building';
import { $step, Step } from '../../lib/state/ui/progress';

const terrainProvider = Cesium.CesiumTerrainProvider.fromUrl(
  'https://fhhvrshare.blob.core.windows.net/regensburg/terrain',
  {},
).catch((error) => {
  console.error('Terrain konnte nicht geladen werden:', error);
  return new Cesium.EllipsoidTerrainProvider();
});

const openStreetMapImagerProvider = new Cesium.UrlTemplateImageryProvider({
  url: 'https://intergeo38.bayernwolke.de/betty/g_topopluslight/{z}/{x}/{y}',
  credit:
    'Map tiles by CartoDB, under CC BY 3.0. Data by OpenStreetMap, under ODbL.',
});

const CESIUM_3D_TILES_URL = 'https://s3.rg.foxbyte.de/det-rg-main/tileset.json';
const SELECTED_FEATURE_COLOR = '#fff200';
const NON_TARGET_FEATURE_COLOR = '#e5e5e5';
const IS_NON_TARGET_FEATURE =
  "!regExp('^31001_1000').test(String(${function}))";

function createTilesetStyle(selectedBuildingId: string | null) {
  const selectedCondition = `\${id} === '${selectedBuildingId}'`;

  return new Cesium.Cesium3DTileStyle({
    color: {
      conditions: selectedBuildingId
        ? [
            [selectedCondition, `color('${SELECTED_FEATURE_COLOR}')`],
            [IS_NON_TARGET_FEATURE, `color('${NON_TARGET_FEATURE_COLOR}')`],
            ['true', "color('white')"],
          ]
        : [
            [IS_NON_TARGET_FEATURE, `color('${NON_TARGET_FEATURE_COLOR}')`],
            ['true', "color('white')"],
          ],
    },
  });
}

type Map3DProps = {
  children?: ReactNode;
};

const LOAD_TIMEOUT_MS = 20000;

function formatAddress(address: {
  street?: string;
  housenumber?: string;
}): string {
  return `${address.street ?? ''} ${address.housenumber ?? ''}`.trim();
}

function matchesAddress(
  feature: Cesium.Cesium3DTileFeature,
  address: { street?: string; housenumber?: string },
): boolean {
  if (!address.street && !address.housenumber) return false;
  const featureStreet = feature.getProperty('addresses.0.ThoroughfareName');
  if (typeof featureStreet !== 'string') return false;
  // Corner buildings list several addresses, so compare against each of them.
  return addressEntries(featureStreet).includes(formatAddress(address));
}

function selectAddressFeature(
  viewer: Cesium.Viewer,
  intent: FocusCameraIntent,
) {
  if (intent.reason.type !== 'address') return;
  const address = intent.reason.address;

  const cartographic = Cesium.Cartographic.fromDegrees(
    intent.target.longitudeDegrees,
    intent.target.latitudeDegrees,
  );
  const groundHeight = viewer.scene.globe.getHeight(cartographic) ?? 350;
  const position = Cesium.Cartesian3.fromDegrees(
    intent.target.longitudeDegrees,
    intent.target.latitudeDegrees,
    groundHeight,
  );

  viewer.scene.requestRender();
  const screenPosition = viewer.scene.cartesianToCanvasCoordinates(position);
  if (!screenPosition) return;

  const drilled = viewer.scene
    .drillPick(screenPosition)
    .filter(
      (picked): picked is Cesium.Cesium3DTileFeature =>
        picked instanceof Cesium.Cesium3DTileFeature &&
        isSelectableBuilding(picked),
    );
  if (drilled.length === 0) return;

  const matched =
    drilled.find((feature) => matchesAddress(feature, address)) ?? drilled[0];

  setBuilding(
    matched,
    {
      lon: intent.target.longitudeDegrees,
      lat: intent.target.latitudeDegrees,
    },
    // Keep exactly the picked address, even if the building carries several.
    formatAddress(address) || undefined,
  );
}

export function Map3D({ children }: Map3DProps) {
  const { t } = useTranslation('map');
  const currentStep = useStore($step);
  const building = useStore($building);
  const [viewerRef, setViewerRef] = useState<Cesium.Viewer | null>(null);
  const [tilesetRef, setTilesetRef] = useState<Cesium.Cesium3DTileset | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setLoadFailed(true), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [loading]);

  const selectedBuildingId = building?.id ?? null;

  useEffect(() => {
    if (!tilesetRef) return;
    tilesetRef.style = createTilesetStyle(selectedBuildingId);
    viewerRef?.scene.requestRender();
  }, [selectedBuildingId, tilesetRef, viewerRef]);

  useEffect(() => {
    if (!viewerRef || building) return;
    requestCamera({ type: 'resetTransform' });
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

    const ambientOcclusion = viewerRef.scene.postProcessStages.ambientOcclusion;
    ambientOcclusion.enabled = true;
    ambientOcclusion.uniforms.intensity = 3.0;
    ambientOcclusion.uniforms.bias = 0.1;
    ambientOcclusion.uniforms.lengthCap = 0.26;
    ambientOcclusion.uniforms.stepCount = 8;
    ambientOcclusion.uniforms.directionCount = 16;

    viewerRef.scene.globe.baseColor = Cesium.Color.WHITE;
    viewerRef.scene.globe.showGroundAtmosphere = false;

    const cameraController = new CameraController(viewerRef, {
      onFocusComplete: (intent) => selectAddressFeature(viewerRef, intent),
    });
    return registerCameraOwner(cameraController);
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
          onAllTilesLoad={() => {
            setLoading(false);
            setLoadFailed(false);
          }}
          onReady={(tileset) => {
            setTilesetRef(tileset);
            tileset.colorBlendMode = Cesium.Cesium3DTileColorBlendMode.REPLACE;
            tileset.colorBlendAmount = 1.0;
            tileset.style = createTilesetStyle(selectedBuildingId);
            tileset.imageBasedLighting.imageBasedLightingFactor.x = 2;
            tileset.imageBasedLighting.imageBasedLightingFactor.y = 2;
          }}
          onClick={(movement, feature) => {
            if (!feature || !viewerRef || !movement.position) return;
            const tileFeature = feature as Cesium.Cesium3DTileFeature;
            if (!isSelectableBuilding(tileFeature)) return;

            const picked = viewerRef.scene.pickPosition(movement.position);
            if (!Cesium.defined(picked)) return;

            const cartographic = Cesium.Cartographic.fromCartesian(picked);
            const target = {
              longitudeDegrees: Cesium.Math.toDegrees(cartographic.longitude),
              latitudeDegrees: Cesium.Math.toDegrees(cartographic.latitude),
            };
            const result = requestCamera({
              type: 'focus',
              target,
              reason: { type: 'building' },
              accommodateMobileOverlay: true,
            });
            if (result === 'ignored') return;

            setBuilding(tileFeature, {
              lon: target.longitudeDegrees,
              lat: target.latitudeDegrees,
            });
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
              {loadFailed ? (
                <div className="flex max-w-sm flex-col items-center gap-3 px-6 text-center">
                  <p className="text-lg font-semibold">
                    {t('map.loadErrorTitle')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t('map.loadErrorMessage')}
                  </p>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-1 bg-[#e30613] px-4 py-2 text-sm font-semibold text-white hover:bg-[#8b2412]"
                  >
                    {t('map.retry')}
                  </button>
                </div>
              ) : (
                <div>{t('map.loading')}</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Viewer>
    </div>
  );
}
