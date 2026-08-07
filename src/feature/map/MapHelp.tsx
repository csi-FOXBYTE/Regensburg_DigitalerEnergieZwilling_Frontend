import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { $cameraStatus, type CameraMode } from '@/lib/camera-state';
import { useStore } from '@nanostores/react';
import type { TFunction } from 'i18next';
import {
  Box,
  Hand,
  Map as MapIcon,
  MousePointerClick,
  Move,
  RotateCcw,
  ZoomIn,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

function modeHelpRow(mode: CameraMode, t: TFunction<'map'>) {
  return {
    icon:
      mode === 'perspective' ? (
        <Box className="size-5 shrink-0" />
      ) : (
        <MapIcon className="size-5 shrink-0" />
      ),
    label: t('mapHelp.viewMode'),
    action: t(
      mode === 'perspective'
        ? 'mapHelp.viewModePerspectiveExplain'
        : 'mapHelp.viewModeTopDownExplain',
    ),
  };
}

function DesktopHelpContent({ mode }: { mode: CameraMode }) {
  const { t } = useTranslation('map');
  const rows = [
    modeHelpRow(mode, t),
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
    ...(mode === 'perspective'
      ? [
          {
            icon: <RotateCcw className="size-5 shrink-0" />,
            label: t('mapHelp.tiltView'),
            action: t('mapHelp.tiltViewExplain'),
          },
        ]
      : []),
    {
      icon: <ZoomIn className="size-5 shrink-0" />,
      label: t('mapHelp.zoom'),
      action: t('mapHelp.zoomExplain'),
    },
  ];
  return <HelpRows rows={rows} />;
}

function MobileHelpContent({ mode }: { mode: CameraMode }) {
  const { t } = useTranslation('map');
  const rows = [
    modeHelpRow(mode, t),
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
    ...(mode === 'perspective'
      ? [
          {
            icon: <RotateCcw className="size-5 shrink-0" />,
            label: t('mapHelp.tiltView'),
            action: t('mapHelp.tiltViewMobileExplain'),
          },
        ]
      : []),
    {
      icon: <ZoomIn className="size-5 shrink-0" />,
      label: t('mapHelp.zoom'),
      action: t('mapHelp.zoomMobileExplain'),
    },
  ];
  return <HelpRows rows={rows} />;
}

function HelpContent({
  isMobile,
  mode,
}: {
  isMobile: boolean;
  mode: CameraMode;
}) {
  return isMobile ? (
    <MobileHelpContent mode={mode} />
  ) : (
    <DesktopHelpContent mode={mode} />
  );
}

export function MapHelp() {
  const { t } = useTranslation('map');
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cameraStatus = useStore($cameraStatus);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.matchMedia('(pointer: coarse)').matches);
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, '1');
      setOpen(true);
    }
  }, []);

  return (
    <>
      {mounted && (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white hover:bg-neutral-100"
          onClick={() => setOpen(true)}
          aria-label={t('mapHelp.ariaLabelButton')}
        >
          <span className="text-xl leading-none font-bold">?</span>
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('mapHelp.mapControls')}</DialogTitle>
          </DialogHeader>
          <HelpContent isMobile={isMobile} mode={cameraStatus.mode} />
        </DialogContent>
      </Dialog>
    </>
  );
}
