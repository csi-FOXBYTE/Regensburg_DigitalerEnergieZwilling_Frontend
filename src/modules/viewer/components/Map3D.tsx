import {
  Viewer,
  Cesium3DTileset,
  ImageryLayer,
} from "resium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import * as Cesium from "cesium";
import { lazy, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Search, Navigation, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useDebouncedValue } from "../utils/debouncedValue";
import { AnimatePresence, motion } from "motion/react";

const MiniMap = lazy(() => import("./Minimap"));

const terrainProvider = Cesium.CesiumTerrainProvider.fromUrl(
  "https://fhhvrshare.blob.core.windows.net/regensburg/terrain",
  {},
);

const openStreetMapImagerProvider = new Cesium.UrlTemplateImageryProvider({
  url: "https://intergeo38.bayernwolke.de/betty/g_topopluslight/{z}/{x}/{y}",
  credit:
    "Map tiles by CartoDB, under CC BY 3.0. Data by OpenStreetMap, under ODbL.",
});
const style = new Cesium.Cesium3DTileStyle({
  color: {
    conditions: [["true", "color('white')"]],
  },
});

function AdressSearch({
  onAdressFound,
}: {
  onAdressFound: (lat: string, lon: string) => void;
}) {
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebouncedValue(search) ?? "";

  const { data = [] } = useQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: async () => {
      if (debouncedSearch === "") return [];

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${debouncedSearch},Regensburg&format=json`,
      );

      const json = await response.json();

      return json as {
        place_id: string;
        licence: string;
        name: string;
        display_name: string;
        lat: string;
        lon: string;
      }[];
    },
  });

  return (
    <div
      className={`absolute top-2 md:top-4 left-2 md:left-4 right-2 md:right-4 z-10 max-w-full md:max-w-md transition-all duration-300`}
    >
      <form
        className="relative"
        role="search"
        aria-label="Gebäudeadresse suchen"
        onSubmit={(e) => e.preventDefault()}
      >
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400"
          aria-hidden="true"
        />
        <input
          type="text"
          onChange={(event) => setSearch(event.target.value)}
          value={search}
          placeholder="Adresse suchen in Regensburg..."
          className="w-full pl-9 md:pl-10 pr-10 md:pr-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg border border-gray-300 bg-white shadow-lg focus:ring-2 focus:ring-[#D9291C] focus:border-[#D9291C] focus:outline-none outline-offset-2"
          aria-label="Adresse eingeben"
        />
      </form>
      {data.length > 0
        ? data.map((d) => (
            <div
              className="w-full pl-9 md:pl-10 pr-10 md:pr-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 bg-white shadow-lg focus:ring-2 focus:ring-[#D9291C] focus:border-[#D9291C] focus:outline-none outline-offset-2"
              key={d.place_id}
              onClick={() => onAdressFound(d.lat, d.lon)}
            >
              {d.display_name}
            </div>
          ))
        : null}
    </div>
  );
}

export function Map3D() {
  const [viewerRef, setViewerRef] = useState<Cesium.Viewer | null>(null);

  const [loading, setLoading] = useState(true);

  return (
    <Viewer
      ref={(ref) => {
        if (!ref?.cesiumElement) return;

        ref.cesiumElement.scene.globe.depthTestAgainstTerrain = true;

        setViewerRef(ref.cesiumElement);

        ref.cesiumElement.scene.camera.setView({
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

        const ambientOcclusion =
          ref.cesiumElement.scene.postProcessStages.ambientOcclusion;
        ambientOcclusion.enabled = true;

        ref.cesiumElement.camera.frustum.near = 1.0; // very important for ao to work correctly

        ambientOcclusion.uniforms.intensity = 3.0;
        ambientOcclusion.uniforms.bias = 0.1;
        ambientOcclusion.uniforms.lengthCap = 0.26;
        ambientOcclusion.uniforms.stepCount = 8;
        ambientOcclusion.uniforms.directionCount = 16;

        ref.cesiumElement.scene.globe.baseColor = Cesium.Color.WHITE;

        ref.cesiumElement.scene.globe.showGroundAtmosphere = false;
      }}
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
      full={true}
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
      <AdressSearch
        onAdressFound={(lat, lon) => {
          if (!viewerRef) return;

          viewerRef.camera.flyTo({
            easingFunction: Cesium.EasingFunction.LINEAR_NONE,
            duration: 0.2,
            destination: Cesium.Cartesian3.fromDegrees(
              parseFloat(lon),
              parseFloat(lat),
              viewerRef.camera.positionCartographic
                .height,
            ),
          });
        }}
      />
      <nav
        className="absolute top-20 right-4 z-10 flex flex-col space-y-2"
        aria-label="Kartensteuerung"
      >
        <button
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D9291C] focus:ring-offset-2 border border-gray-300 transition-all"
          title="Zoom In"
          aria-label="Hineinzoomen"
          onClick={() =>
            console.log(viewerRef?.scene.camera)
          }
        >
          <ZoomIn className="w-5 h-5 text-gray-700" aria-hidden="true" />
        </button>
        <button
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D9291C] focus:ring-offset-2 border border-gray-300 transition-all"
          title="Zoom Out"
          aria-label="Herauszoomen"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" aria-hidden="true" />
        </button>
        <button
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D9291C] focus:ring-offset-2 border border-gray-300 transition-all"
          title="Rotate"
          aria-label="Karte um 45 Grad drehen"
        >
          <Navigation className="w-5 h-5 text-gray-700" aria-hidden="true" />
        </button>
        <button
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D9291C] focus:ring-offset-2 border border-gray-300 transition-all"
          title="Toggle 3D View"
        >
          <Maximize2 className="w-5 h-5 text-gray-700" aria-hidden="true" />
        </button>
      </nav>
      <ImageryLayer imageryProvider={openStreetMapImagerProvider} />
      <Cesium3DTileset
        onAllTilesLoad={() => setLoading(false)}
        onReady={(tileset) => {
          tileset.style = style;

          tileset.imageBasedLighting.imageBasedLightingFactor.x = 2;
          tileset.imageBasedLighting.imageBasedLightingFactor.y = 2;
        }}
        onClick={(m, t) => {
          const attribs: Record<string, unknown> = {};

          for (const key of t.getPropertyIds()) {
            attribs[key] = t.getProperty(key);
          }

          t.tileset.style = new Cesium.Cesium3DTileStyle({
            edgeColor: "color('black')",
            edgeWidth: 2.0,
            color: {
              conditions: [
                ["${id} === '" + attribs["id"] + "'", "color('yellow')"],
                ["true", "color('green')"],
              ],
            },
          });

          viewerRef?.scene.requestRender();
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
  );
}
