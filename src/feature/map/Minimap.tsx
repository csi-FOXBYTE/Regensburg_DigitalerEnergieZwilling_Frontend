import {
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import type { MapRef } from "react-leaflet/MapContainer";
import "leaflet/dist/leaflet.css";
import * as Cesium from "cesium";

const MiniMap = ({ viewerRef }: { viewerRef: Cesium.Viewer | null }) => {
  const [minimapRef, setMinimapRef] = useState<MapRef | null>(null);

  useEffect(() => {
    if (!viewerRef) return;

    const postRender = viewerRef.scene.postRender;

    if (!postRender) return;

    let rafId = -1;

    const updater = () => {
      const camera = viewerRef.camera;
      if (!camera || !minimapRef) return;

      const center = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
        camera.position,
      );

      if (center) {
        const lat = Cesium.Math.toDegrees(center.latitude);
        const lon = Cesium.Math.toDegrees(center.longitude);

        const zoom = Math.max(8, Math.min(17, Math.round(20 - Math.log2(center.height / 35))));

        minimapRef.setView([lat, lon], zoom, { animate: false });

        const headingDeg = Cesium.Math.toDegrees(camera.heading);
        const container = minimapRef.getContainer();
        container.style.transform = `rotate(${-headingDeg}deg) scale(1.5)`;
        container.style.transformOrigin = "center center";
      }
    };

    const handler = () => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(updater);
    };

    postRender.addEventListener(handler);

    return () => {
      postRender.removeEventListener(handler);
    };
  }, [minimapRef]);

  useLayoutEffect(() => {
    if (!minimapRef) return;

    minimapRef.invalidateSize();
  });

  return (
    <MapContainer
      ref={setMinimapRef}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
      attributionControl={false}
      dragging={false}
      scrollWheelZoom={false}
      zoomSnap={0}
      zoomDelta={0}
      boxZoom={false}
      fadeAnimation={false}
      zoomAnimation={false}
      markerZoomAnimation={false}
      doubleClickZoom={false}
    >
      <TileLayer url="https://intergeo38.bayernwolke.de/betty/g_topopluslight/{z}/{x}/{y}" />
    </MapContainer>
  );
};

export default MiniMap;
