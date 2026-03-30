import * as Cesium from 'cesium';

export type PanDirection = 'up' | 'down' | 'left' | 'right';

const PAN_FACTOR = 0.5;
const PAN_DURATION = 0.3;

export function panCamera(
  viewer: Cesium.Viewer | null,
  direction: PanDirection,
) {
  if (!viewer) return;
  const camera = viewer.camera;
  const ellipsoid = viewer.scene.globe.ellipsoid;
  const surfaceNormal = ellipsoid.geodeticSurfaceNormal(
    camera.position,
    new Cesium.Cartesian3(),
  );

  const forward = Cesium.Cartesian3.cross(
    camera.right,
    surfaceNormal,
    new Cesium.Cartesian3(),
  );
  Cesium.Cartesian3.normalize(forward, forward);
  const right = Cesium.Cartesian3.cross(
    surfaceNormal,
    forward,
    new Cesium.Cartesian3(),
  );
  Cesium.Cartesian3.normalize(right, right);

  const isForwardBack = direction === 'up' || direction === 'down';
  const axis = isForwardBack ? forward : right;
  const sign = direction === 'down' || direction === 'right' ? 1 : -1;
  const height = camera.positionCartographic.height;
  const panAmount = height * PAN_FACTOR;

  const destination = Cesium.Cartesian3.add(
    camera.position,
    Cesium.Cartesian3.multiplyByScalar(
      axis,
      sign * panAmount,
      new Cesium.Cartesian3(),
    ),
    new Cesium.Cartesian3(),
  );
  camera.flyTo({
    destination,
    orientation: {
      heading: camera.heading,
      pitch: camera.pitch,
      roll: camera.roll,
    },
    duration: PAN_DURATION,
  });
}
