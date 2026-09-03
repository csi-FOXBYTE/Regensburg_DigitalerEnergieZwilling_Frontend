import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { $building } from '@/lib/state/building';
import { useStore } from '@nanostores/react';
import { Link, Settings } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const BUILDING_KEY_PREFIX = 'det_building_data_';
const META_KEY = 'det_meta';

function getBuildingIds(): string[] {
  return Object.keys(localStorage)
    .filter((k) => k.startsWith(BUILDING_KEY_PREFIX))
    .map((k) => k.slice(BUILDING_KEY_PREFIX.length));
}

function clearBuildingData() {
  const ids = getBuildingIds();
  ids.forEach((id) => localStorage.removeItem(`${BUILDING_KEY_PREFIX}${id}`));
  localStorage.removeItem(META_KEY);
  console.log('[dev] cleared building data for:', ids);
}

function logBuildings() {
  const ids = getBuildingIds();
  if (ids.length === 0) {
    console.log('[dev] no building sessions in localStorage');
    return;
  }
  console.log('[dev] buildings with saved sessions:', ids);
}

async function copyExternalBuildingLink(
  building: NonNullable<ReturnType<typeof $building.get>>,
) {
  const url = new URL('/', window.location.origin);
  url.hash = new URLSearchParams({
    buildingId: building.id,
    lat: String(building.coordinates.lat),
    lon: String(building.coordinates.lon),
  }).toString();

  try {
    await navigator.clipboard.writeText(url.toString());
    toast.success('External building link copied');
  } catch {
    toast.error('Could not copy external building link');
  }
}

export default function DevPanel() {
  const [open, setOpen] = useState(false);
  const building = useStore($building);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open developer panel"
        className="rounded-floating-control fixed bottom-4 left-4 z-50 flex size-10 items-center justify-center bg-neutral-800 text-white shadow-lg hover:bg-neutral-700"
      >
        <Settings className="size-5" aria-hidden="true" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dev Panel</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Button variant="secondary" onClick={clearBuildingData}>
              Clear building data
            </Button>
            <Button variant="secondary" onClick={logBuildings}>
              Log buildings with data
            </Button>
            {building && (
              <Button
                variant="secondary"
                onClick={() => void copyExternalBuildingLink(building)}
              >
                <Link aria-hidden="true" />
                Copy external building link
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
