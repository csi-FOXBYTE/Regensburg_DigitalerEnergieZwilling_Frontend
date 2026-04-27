import { useStore } from '@nanostores/react';
import { Info, X } from 'lucide-react';
import { useCallback, useRef } from 'react';
import Draggable from 'react-draggable';
import { useTranslation } from 'react-i18next';
import ArrowIcon from '../../components/ArrowIcon';
import { Button } from '../../components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '../../components/ui/drawer';
import { Paper } from '../../components/ui/paper';
import { Typography } from '../../components/ui/typography';
import useIsMobile from '../../lib/useIsMobile';
import { cn } from '../../lib/utils';
import { setStep, Step } from '../../lib/state/ui/progress';
import { $building, unselectBuilding } from '../../lib/state/building';
import { CurrentStatsReduced } from '../energyCalculation/CurrentStats';

function BuildingWindowContent({ onContinue }: { onContinue: () => void }) {
  const { t } = useTranslation('map');

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto border-b border-neutral-200 px-6 py-3">
        <CurrentStatsReduced />
      </div>
      <div className="shrink-0 px-6 py-3">
        <Button onClick={onContinue} className="flex w-full items-center gap-2">
          {t('buildingWindow.continueButton')}
          <ArrowIcon />
        </Button>
        <div className="mt-2 flex items-center gap-1">
          <Info className="size-3 shrink-0 text-muted-foreground" />
          <Typography variant="verySmall">{t('buildingWindow.processingTime')}</Typography>
        </div>
      </div>
    </>
  );
}

export default function BuildingWindow() {
  const nodeRef = useRef<HTMLDivElement>(null);
  const selectedBuilding = useStore($building);
  const isMobile = useIsMobile();
  const { t } = useTranslation('map');

  const gotoGeneralDataStep = useCallback(() => {
    setStep(Step.GeneralData);
  }, []);

  const isOpen = !!selectedBuilding;

  if (isMobile) {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={(open) => !open && unselectBuilding()}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{t('buildingWindow.title')}</DrawerTitle>
            <Typography variant="muted">{t('buildingWindow.subtitle')}</Typography>
          </DrawerHeader>
          <BuildingWindowContent onContinue={gotoGeneralDataStep} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Draggable nodeRef={nodeRef} bounds="parent" handle=".drag-handle">
      <Paper
        ref={nodeRef}
        variant="outlined"
        className={cn(
          'absolute top-4 right-20 z-20 hidden max-h-[calc(100%-2rem)] w-[calc(100vw-120px)] max-w-210 min-w-120 flex-col',
          isOpen ? 'flex' : null,
        )}
      >
        <div className="drag-handle flex shrink-0 cursor-move items-start border-b border-neutral-200 px-6 pt-6 pb-3 select-none">
          <div className="grow">
            <Typography variant="h2">{t('buildingWindow.title')}</Typography>
            <Typography variant="muted">{t('buildingWindow.subtitle')}</Typography>
          </div>
          <Button variant="ghost" size="icon" onClick={unselectBuilding}>
            <X />
          </Button>
        </div>
        <BuildingWindowContent onContinue={gotoGeneralDataStep} />
      </Paper>
    </Draggable>
  );
}
