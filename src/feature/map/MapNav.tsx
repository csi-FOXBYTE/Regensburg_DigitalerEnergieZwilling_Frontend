import { Button } from '@/components/ui/button';
import { panCamera } from '@/lib/camera-helper';
import * as Cesium from 'cesium';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Minus,
  Plus,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type MapNavProps = {
  viewer: Cesium.Viewer | null;
};

export function MapNav({ viewer }: MapNavProps) {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    if (!viewer) return;
    const onPostRender = () =>
      setHeading(Cesium.Math.toDegrees(viewer.camera.heading));
    viewer.scene.postRender.addEventListener(onPostRender);
    return () => {
      viewer.scene.postRender.removeEventListener(onPostRender);
    };
  }, [viewer]);

  const zoom = (direction: 'in' | 'out') => {
    if (!viewer) return;
    const camera = viewer.camera;
    const height = camera.positionCartographic.height;
    const amount = direction === 'in' ? height * 0.3 : -height * 0.3;
    const destination = Cesium.Cartesian3.add(
      camera.position,
      Cesium.Cartesian3.multiplyByScalar(
        camera.direction,
        amount,
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
      duration: 0.3,
    });
  };

  return (
    <div className="absolute top-20 right-4 z-10 flex flex-col items-end gap-2">
      <nav
        className="bg-background grid h-30 w-30 place-items-center rounded-full border border-neutral-200 shadow-lg"
        style={{
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr 1fr',
        }}
        aria-label="Kartensteuerung"
      >
        <Button
          variant="ghost"
          size="icon"
          className="col-start-2 row-start-1 rounded-full"
          onClick={() => panCamera(viewer, 'up')}
          aria-label="Nach oben bewegen"
        >
          <ChevronUp aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="col-start-1 row-start-2 rounded-full"
          onClick={() => panCamera(viewer, 'left')}
          aria-label="Nach links bewegen"
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="col-start-2 row-start-2 rounded-full"
          onClick={() => {
            if (!viewer) return;
            const camera = viewer.camera;
            const canvas = viewer.scene.canvas;
            const ray = camera.getPickRay(
              new Cesium.Cartesian2(
                canvas.clientWidth / 2,
                canvas.clientHeight / 2,
              ),
            );
            if (!ray) return;
            const center = viewer.scene.globe.pick(ray, viewer.scene);
            if (!center) return;
            const range = Cesium.Cartesian3.distance(camera.position, center);
            camera.flyToBoundingSphere(new Cesium.BoundingSphere(center, 0), {
              offset: new Cesium.HeadingPitchRange(0, camera.pitch, range),
              duration: 0.6,
            });
          }}
          aria-label="Nach Norden ausrichten"
        >
          <svg
            className="size-8"
            viewBox="0 0 20 20"
            aria-hidden="true"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
            <polygon points="10,1 13,10 10,8 7,10" className="fill-primary" />
            <polygon
              points="10,19 7,10 10,12 13,10"
              className="fill-neutral-300"
            />
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="col-start-3 row-start-2 rounded-full"
          onClick={() => panCamera(viewer, 'right')}
          aria-label="Nach rechts bewegen"
        >
          <ChevronRight aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="col-start-2 row-start-3 rounded-full"
          onClick={() => panCamera(viewer, 'down')}
          aria-label="Nach unten bewegen"
        >
          <ChevronDown aria-hidden="true" />
        </Button>
      </nav>
      <div className="bg-background flex flex-col rounded-lg border border-neutral-200 shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-b-none"
          onClick={() => zoom('in')}
          aria-label="Hineinzoomen"
        >
          <Plus aria-hidden="true" />
        </Button>
        <hr className="border-neutral-200" />
        <Button
          variant="ghost"
          size="icon"
          className="rounded-t-none"
          onClick={() => zoom('out')}
          aria-label="Herauszoomen"
        >
          <Minus aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
