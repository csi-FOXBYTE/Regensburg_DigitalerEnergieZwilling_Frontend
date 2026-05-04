import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { $historyDebug, Step, type HistoryDebugState } from '@/lib/state/ui/progress';
import { cn } from '@/lib/utils';
import { useStore } from '@nanostores/react';
import { Settings } from 'lucide-react';
import { useState } from 'react';

const BUILDING_KEY_PREFIX = 'det_building_data_';
const META_KEY = 'det_meta';

const STEP_LABELS: Record<number, string> = {
  [Step.Welcome]: 'Welcome',
  [Step.Building]: 'Building',
  [Step.GeneralData]: 'General',
  [Step.OuterParts]: 'Outer',
  [Step.Heat]: 'Heat',
  [Step.Electricity]: 'Elec',
  [Step.Renovation]: 'Renov',
  [Step.Result]: 'Result',
};

function HistoryStack({ debug }: { debug: HistoryDebugState }) {
  const { entries, currentIndex } = debug;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-neutral-500">History stack</span>
      <div className="flex flex-wrap gap-1">
        {entries.map((entry, i) => {
          const isCurrent = i === currentIndex;
          const isAhead = i > currentIndex;
          const label = entry === null ? '—' : `${entry}:${STEP_LABELS[entry] ?? '?'}`;
          return (
            <span
              key={i}
              className={cn(
                'rounded px-2 py-0.5 font-mono text-xs',
                isCurrent && 'bg-primary text-white',
                !isCurrent && !isAhead && 'bg-neutral-200 text-neutral-600',
                isAhead && 'bg-neutral-100 text-neutral-400',
              )}
            >
              {label}
            </span>
          );
        })}
      </div>
      <span className="font-mono text-xs text-neutral-400">
        index {currentIndex} / {entries.length - 1} &nbsp;·&nbsp; browser history.length {typeof history !== 'undefined' ? history.length : '?'}
      </span>
    </div>
  );
}

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
  const historyDebug = useStore($historyDebug);

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
          <div className="flex flex-col gap-4">
            <HistoryStack debug={historyDebug} />
            <div className="flex flex-col gap-2">
              <Button variant="secondary" onClick={clearBuildingData}>
                Clear building data
              </Button>
              <Button variant="secondary" onClick={logBuildings}>
                Log buildings with data
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
