import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import { useState } from 'react';

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

export default function DevPanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-50 flex size-10 items-center justify-center rounded-full bg-neutral-800 text-white shadow-lg hover:bg-neutral-700"
      >
        <Settings className="size-5" />
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
