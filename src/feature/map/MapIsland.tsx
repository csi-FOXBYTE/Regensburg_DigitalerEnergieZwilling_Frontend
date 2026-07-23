import ClientHydration from '@/components/ClientHydration';
import { requestCamera } from '@/lib/camera-state';
import AddressSearch from './AddressSearch';
import BuildingWindow from './BuildingWindow';
import { Map3D } from './Map3D';
import { MapNav } from './MapNav';

function MapWithControls() {
  return (
    <Map3D>
      <AddressSearch
        onAddressFound={(lat, lon, address) => {
          const result = requestCamera({
            type: 'focus',
            target: {
              latitudeDegrees: Number.parseFloat(lat),
              longitudeDegrees: Number.parseFloat(lon),
            },
            reason: { type: 'address', address },
            accommodateMobileOverlay: true,
          });
          return result !== 'ignored';
        }}
      />
      <MapNav />
      <BuildingWindow />
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
