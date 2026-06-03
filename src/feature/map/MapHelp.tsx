import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Hand, MousePointerClick, Move, RotateCcw, ZoomIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('map');
  const rows = [
    {
      icon: <MousePointerClick className="size-5 shrink-0" />,
      label: t('mapHelp.chooseBuilding'),
      action: t('mapHelp.chooseBuildingExplain'),
    },
    {
      icon: <Move className="size-5 shrink-0" />,
      label: t('mapHelp.moveMap'),
      action: t('mapHelp.moveMapExplain'),
    },
    {
      icon: <RotateCcw className="size-5 shrink-0" />,
      label: t('mapHelp.tiltView'),
      action: t('mapHelp.tiltViewExplain'),
    },
    {
      icon: <ZoomIn className="size-5 shrink-0" />,
      label: t('mapHelp.zoom'),
      action: t('mapHelp.zoomExplain'),
    },
  ];
  return <HelpRows rows={rows} />;
}

function MobileHelpContent() {
  const { t } = useTranslation('map');
  const rows = [
    {
      icon: <Hand className="size-5 shrink-0" />,
      label: t('mapHelp.chooseBuilding'),
      action: t('mapHelp.chooseBuildingMobileExplain'),
    },
    {
      icon: <Move className="size-5 shrink-0" />,
      label: t('mapHelp.moveMap'),
      action: t('mapHelp.moveMapMobileExplain'),
    },
    {
      icon: <RotateCcw className="size-5 shrink-0" />,
      label: t('mapHelp.tiltView'),
      action: t('mapHelp.tiltViewMobileExplain'),
    },
    {
      icon: <ZoomIn className="size-5 shrink-0" />,
      label: t('mapHelp.zoom'),
      action: t('mapHelp.zoomMobileExplain'),
    },
  ];
  return <HelpRows rows={rows} />;
}

function HelpContent({ isMobile }: { isMobile: boolean }) {
  return isMobile ? <MobileHelpContent /> : <DesktopHelpContent />;
}

export function MapHelp() {
  const { t } = useTranslation('map');
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
          aria-label={t('mapHelp.ariaLabelButton')}
        >
          <span className="text-xl leading-none font-bold">?</span>
        </button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('mapHelp.mapControls')}</DialogTitle>
          </DialogHeader>
          <HelpContent isMobile={isMobile} />
        </DialogContent>
      </Dialog>
    </>
  );
}
