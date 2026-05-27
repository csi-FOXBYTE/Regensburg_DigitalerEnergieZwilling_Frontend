import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Hand, MousePointerClick, Move, RotateCcw, ZoomIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import useIsMobile from '../../lib/useIsMobile';

const STORAGE_KEY = 'map-help-seen';

function HelpRows({
  rows,
}: {
  rows: { icon: React.ReactNode; label: string; action: string }[];
}) {
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

function DesktopHelpContent() {
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
  return <HelpRows rows={rows} />;
}

function MobileHelpContent() {
  const rows = [
    {
      icon: <Hand className="size-5 shrink-0" />,
      label: 'Gebäude auswählen',
      action: 'Auf ein Gebäude tippen',
    },
    {
      icon: <Move className="size-5 shrink-0" />,
      label: 'Karte bewegen',
      action: 'Mit einem Finger wischen',
    },
    {
      icon: <RotateCcw className="size-5 shrink-0" />,
      label: 'Ansicht neigen & drehen',
      action: 'Mit zwei Fingern ziehen',
    },
    {
      icon: <ZoomIn className="size-5 shrink-0" />,
      label: 'Zoom',
      action: 'Zwei Finger spreizen oder zusammenziehen',
    },
  ];
  return <HelpRows rows={rows} />;
}

function HelpContent({ isMobile }: { isMobile: boolean }) {
  return isMobile ? <MobileHelpContent /> : <DesktopHelpContent />;
}

export function MapHelp() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

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
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-800 hover:bg-neutral-100 focus-visible:outline-none"
          aria-label="Kartenbedienung anzeigen"
        >
          <span className="text-xl leading-none font-bold">?</span>
        </button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kartenbedienung</DialogTitle>
          </DialogHeader>
          <HelpContent isMobile={isMobile} />
        </DialogContent>
      </Dialog>
    </>
  );
}
