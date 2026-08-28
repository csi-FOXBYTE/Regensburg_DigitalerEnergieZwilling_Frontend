import { mapConfig } from '@/config/map';
import { useStore } from '@nanostores/react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { AnimatePresence, motion } from 'motion/react';
import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Cesium3DTileset, ImageryLayer, Viewer } from 'resium';
import { CameraController } from '../../lib/camera';
import { getMapResources } from '../../lib/api/public';
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

const baseImageryProvider = new Cesium.UrlTemplateImageryProvider({
  url: mapConfig.baseLayer.urlTemplate,
  credit: mapConfig.baseLayer.credit,
});

const SELECTED_FEATURE_COLOR = '#fff200';
const NON_TARGET_FEATURE_COLOR = '#e5e5e5';
const IS_NON_TARGET_FEATURE = `!regExp('^${mapConfig.selectableBuildingFunctionPrefix}').test(String(\${function}))`;

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
const ADDRESS_SELECTION_BOX_HALF_SIZE_METERS = 100;
const ADDRESS_SELECTION_TIMEOUT_MS = 5000;

function formatAddress(address: {
  street?: string;
  housenumber?: string;
}): string {
  return `${address.street ?? ''} ${address.housenumber ?? ''}`.trim();
}

function selectFeatureForAddress(
  feature: Cesium.Cesium3DTileFeature,
  intent: FocusCameraIntent,
) {
  if (intent.reason.type !== 'address') return;
  setBuilding(
    feature,
    {
      lon: intent.target.longitudeDegrees,
      lat: intent.target.latitudeDegrees,
    },
    // Keep exactly the searched address when a building carries several.
    formatAddress(intent.reason.address) || undefined,
  );
}

function selectAddressFeatureByDrillPick(
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

  const matched = drilled.find(
    (feature) => String(feature.getProperty('id')) === address.buildingId,
  );
  selectFeatureForAddress(matched ?? drilled[0], intent);
}

function createAddressSelectionBox(
  viewer: Cesium.Viewer,
  intent: FocusCameraIntent,
): Cesium.OrientedBoundingBox {
  const cartographic = Cesium.Cartographic.fromDegrees(
    intent.target.longitudeDegrees,
    intent.target.latitudeDegrees,
  );
  const groundHeight = viewer.scene.globe.getHeight(cartographic) ?? 350;
  const center = Cesium.Cartesian3.fromDegrees(
    intent.target.longitudeDegrees,
    intent.target.latitudeDegrees,
    groundHeight,
  );
  const transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
  const rotation = Cesium.Matrix4.getMatrix3(transform, new Cesium.Matrix3());
  const halfAxes = Cesium.Matrix3.multiplyByScale(
    rotation,
    new Cesium.Cartesian3(
      ADDRESS_SELECTION_BOX_HALF_SIZE_METERS,
      ADDRESS_SELECTION_BOX_HALF_SIZE_METERS,
      ADDRESS_SELECTION_BOX_HALF_SIZE_METERS,
    ),
    new Cesium.Matrix3(),
  );
  return new Cesium.OrientedBoundingBox(center, halfAxes);
}

function tileIntersectsAddressSelectionBox(
  tile: Cesium.Cesium3DTile,
  box: Cesium.OrientedBoundingBox,
): boolean {
  return (
    Cesium.OrientedBoundingBox.distanceSquaredTo(
      box,
      tile.boundingSphere.center,
    ) <=
    tile.boundingSphere.radius * tile.boundingSphere.radius
  );
}

function findFeatureById(
  content: Cesium.Cesium3DTileContent,
  buildingId: string,
): Cesium.Cesium3DTileFeature | undefined {
  for (let i = 0; i < content.featuresLength; i++) {
    const feature = content.getFeature(i);
    if (String(feature.getProperty('id')) === buildingId) return feature;
  }

  for (const innerContent of content.innerContents ?? []) {
    const feature = findFeatureById(
      innerContent as Cesium.Cesium3DTileContent,
      buildingId,
    );
    if (feature) return feature;
  }
}

type PendingAddressSelection = {
  viewer: Cesium.Viewer;
  intent: FocusCameraIntent;
  searchBox: Cesium.OrientedBoundingBox;
  scannedTiles: Set<Cesium.Cesium3DTile>;
  timeoutId: number;
};

class AddressFeatureSelector {
  private pending: PendingAddressSelection | undefined;

  start(viewer: Cesium.Viewer, intent: FocusCameraIntent) {
    if (intent.reason.type !== 'address') return;
    this.cancel();
    const timeoutId = window.setTimeout(
      () => this.finishWithDrillPick(),
      ADDRESS_SELECTION_TIMEOUT_MS,
    );
    this.pending = {
      viewer,
      intent,
      searchBox: createAddressSelectionBox(viewer, intent),
      scannedTiles: new Set(),
      timeoutId,
    };
    viewer.scene.requestRender();
  }

  inspectVisibleTile(tile: Cesium.Cesium3DTile) {
    const pending = this.pending;
    if (!pending || pending.scannedTiles.has(tile)) return;
    pending.scannedTiles.add(tile);
    if (!tileIntersectsAddressSelectionBox(tile, pending.searchBox)) return;

    if (pending.intent.reason.type !== 'address') return;
    const feature = findFeatureById(
      tile.content,
      pending.intent.reason.address.buildingId,
    );
    if (!feature || !isSelectableBuilding(feature)) return;

    const { intent } = pending;
    this.cancel();
    selectFeatureForAddress(feature, intent);
  }

  finishWithDrillPick() {
    const pending = this.pending;
    if (!pending) return;
    this.cancel();
    selectAddressFeatureByDrillPick(pending.viewer, pending.intent);
  }

  cancel() {
    if (!this.pending) return;
    window.clearTimeout(this.pending.timeoutId);
    this.pending = undefined;
  }
}

export function Map3D({ children }: Map3DProps) {
  const { t } = useTranslation('map');
  const currentStep = useStore($step);
  const building = useStore($building);
  const [viewerRef, setViewerRef] = useState<Cesium.Viewer | null>(null);
  const [tilesetRef, setTilesetRef] = useState<Cesium.Cesium3DTileset | null>(
    null,
  );
  const addressFeatureSelectorRef = useRef(new AddressFeatureSelector());
  const [terrainProvider, setTerrainProvider] =
    useState<Cesium.TerrainProvider | null>(null);
  const [tilesetUrl, setTilesetUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void getMapResources()
      .then(async (resources) => {
        if (cancelled) return;
        setTilesetUrl(
          new URL('tileset.json', resources.tilesBaseUrl).toString(),
        );

        try {
          const provider = await Cesium.CesiumTerrainProvider.fromUrl(
            resources.terrainBaseUrl,
          );
          if (!cancelled) setTerrainProvider(provider);
        } catch (error) {
          console.error('Terrain konnte nicht geladen werden:', error);
          if (!cancelled) {
            setTerrainProvider(new Cesium.EllipsoidTerrainProvider());
          }
        }
      })
      .catch((error) => {
        console.error('Kartenressourcen konnten nicht geladen werden:', error);
        if (!cancelled) setLoadFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setLoadFailed(true), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => () => addressFeatureSelectorRef.current.cancel(), []);

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
      onFocusComplete: (intent) =>
        addressFeatureSelectorRef.current.start(viewerRef, intent),
    });
    return registerCameraOwner(cameraController);
  }, [viewerRef]);

  const isInteractiveStep = currentStep === Step.Building;
  return (
    <div
      role="region"
      aria-label={t('map.stepTitle')}
      aria-hidden={!isInteractiveStep}
      className={`absolute top-(--header-height) left-0 h-(--content-height) w-full ${isInteractiveStep ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {isInteractiveStep && <h1 className="sr-only">{t('map.stepTitle')}</h1>}
      {terrainProvider && (
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
          <ImageryLayer imageryProvider={baseImageryProvider} />
          {tilesetUrl && (
            <Cesium3DTileset
              onAllTilesLoad={() => {
                setLoading(false);
                setLoadFailed(false);
                addressFeatureSelectorRef.current.finishWithDrillPick();
              }}
              onTileVisible={(tile) =>
                addressFeatureSelectorRef.current.inspectVisibleTile(tile)
              }
              onReady={(tileset) => {
                setTilesetRef(tileset);
                tileset.colorBlendMode =
                  Cesium.Cesium3DTileColorBlendMode.REPLACE;
                tileset.colorBlendAmount = 1.0;
                tileset.style = createTilesetStyle(selectedBuildingId);
                tileset.imageBasedLighting.imageBasedLightingFactor.x = 2;
                tileset.imageBasedLighting.imageBasedLightingFactor.y = 2;
              }}
              onClick={(movement, feature) => {
                if (!feature || !viewerRef || !movement.position) return;
                addressFeatureSelectorRef.current.cancel();
                const tileFeature = feature as Cesium.Cesium3DTileFeature;
                if (!isSelectableBuilding(tileFeature)) return;

                const picked = viewerRef.scene.pickPosition(movement.position);
                if (!Cesium.defined(picked)) return;

                const cartographic = Cesium.Cartographic.fromCartesian(picked);
                const target = {
                  longitudeDegrees: Cesium.Math.toDegrees(
                    cartographic.longitude,
                  ),
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
              url={tilesetUrl}
            />
          )}
        </Viewer>
      )}
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
              <div
                className="flex max-w-sm flex-col items-center gap-3 px-6 text-center"
                role="alert"
              >
                <h2 className="text-lg font-semibold">
                  {t('map.loadErrorTitle')}
                </h2>
                <p className="text-sm text-gray-600">
                  {t('map.loadErrorMessage')}
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="bg-primary text-primary-foreground hover:bg-primary-hover mt-1 px-4 py-2 text-sm font-semibold"
                >
                  {t('map.retry')}
                </button>
              </div>
            ) : (
              <div role="status" aria-live="polite">
                {t('map.loading')}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
