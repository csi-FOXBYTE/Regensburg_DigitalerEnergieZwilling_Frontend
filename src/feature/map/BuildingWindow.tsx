import { useStore } from '@nanostores/react';
import { X } from 'lucide-react';
import { useCallback, useRef } from 'react';
import Draggable from 'react-draggable';
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
import { setStep, Step } from '../progressBar/state';
import { $building, unselectBuilding } from './state';

function BuildingWindowContent({ onContinue }: { onContinue: () => void }) {
  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto border-b border-neutral-200 px-6 py-3"></div>
      <div className="shrink-0 px-6 py-3">
        <Button onClick={onContinue} className="flex w-full items-center gap-2">
          Continue
          <ArrowIcon />
        </Button>
      </div>
    </>
  );
}

export default function BuildingWindow() {
  const nodeRef = useRef<HTMLDivElement>(null);
  const selectedBuilding = useStore($building);
  const isMobile = useIsMobile();

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
            <DrawerTitle>First Estimate</DrawerTitle>
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
          'absolute top-4 right-20 hidden max-h-[calc(100%-2rem)] w-[calc(100vw-120px)] max-w-210 min-w-120 flex-col',
          isOpen ? 'flex' : null,
        )}
      >
        <div className="drag-handle flex shrink-0 cursor-move border-b border-neutral-200 px-6 pt-6 pb-3 select-none">
          <Typography variant="h2" className="grow">
            First Estimate
          </Typography>
          <Button variant="ghost" size="icon" onClick={unselectBuilding}>
            <X />
          </Button>
        </div>
        <BuildingWindowContent onContinue={gotoGeneralDataStep} />
      </Paper>
    </Draggable>
  );
}
