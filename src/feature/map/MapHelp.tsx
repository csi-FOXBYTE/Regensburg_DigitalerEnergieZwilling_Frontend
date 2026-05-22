import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MousePointerClick, Move, RotateCcw, ZoomIn } from 'lucide-react';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'map-help-seen';

function HelpContent() {
  const rows = [
    {
      icon: <MousePointerClick className="size-5 shrink-0" />,
      label: 'Gebäude auswählen',
      action: 'Linksklick auf ein Gebäude',
    },
    {
      icon: <Move className="size-5 shrink-0" />,
      label: 'Karte bewegen',
      action: 'Linke Maustaste halten & ziehen',
    },
    {
      icon: <RotateCcw className="size-5 shrink-0" />,
      label: 'Ansicht neigen & drehen',
      action: 'Mittlere Maustaste halten & ziehen',
    },
    {
      icon: <ZoomIn className="size-5 shrink-0" />,
      label: 'Zoom',
      action: 'Mausrad oder +/– Schaltflächen',
    },
  ];

  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row) => (
        <li key={row.label} className="flex items-start gap-3">
          <span className="text-muted-foreground mt-0.5">{row.icon}</span>
          <div>
            <p className="text-sm font-medium">{row.label}</p>
            <p className="text-muted-foreground text-sm">{row.action}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function MapHelp() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, '1');
      setOpen(true);
    }
  }, []);

  return (
    <>
      {mounted && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-lg hover:bg-neutral-800 focus-visible:outline-none"
          aria-label="Kartenbedienung anzeigen"
        >
          <span className="text-sm leading-none font-bold">?</span>
        </button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kartenbedienung</DialogTitle>
          </DialogHeader>
          <HelpContent />
        </DialogContent>
      </Dialog>
    </>
  );
}
