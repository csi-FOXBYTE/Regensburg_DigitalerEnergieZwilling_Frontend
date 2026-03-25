import { Button } from "@/components/ui/button";
import * as Cesium from "cesium";
import { Maximize2, Navigation, ZoomIn, ZoomOut } from "lucide-react";

type MapNavProps = {
  viewer: Cesium.Viewer | null;
};

export function MapNav({ viewer }: MapNavProps) {
  return (
    <nav
      className="absolute top-20 right-4 z-10 flex flex-col space-y-2"
      aria-label="Kartensteuerung"
    >
      <Button variant="elevated" size="icon" title="Zoom In" aria-label="Hineinzoomen">
        <ZoomIn aria-hidden="true" />
      </Button>
      <Button variant="elevated" size="icon" title="Zoom Out" aria-label="Herauszoomen">
        <ZoomOut aria-hidden="true" />
      </Button>
      <Button variant="elevated" size="icon" title="Rotate" aria-label="Karte um 45 Grad drehen">
        <Navigation aria-hidden="true" />
      </Button>
      <Button variant="elevated" size="icon" title="Toggle 3D View">
        <Maximize2 aria-hidden="true" />
      </Button>
    </nav>
  );
}
