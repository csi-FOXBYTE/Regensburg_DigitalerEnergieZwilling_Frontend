import { useStore } from '@nanostores/react';
import { X } from 'lucide-react';
import { useCallback, useRef } from 'react';
import Draggable from 'react-draggable';
import ArrowIcon from '../../components/ArrowIcon';
import { Button } from '../../components/ui/button';
import { Paper } from '../../components/ui/paper';
import { Typography } from '../../components/ui/typography';
import { cn } from '../../lib/utils';
import { setStep, Step } from '../progressBar/state';
import { $building } from './state';

export default function BuildingWindow() {
  const nodeRef = useRef<HTMLDivElement>(null);

  const selectedBuilding = useStore($building);

  const gotoGeneralDataStep = useCallback(() => {
    setStep(Step.GeneralData);
  }, []);

  return (
    <Draggable nodeRef={nodeRef} bounds="parent" handle=".drag-handle">
      <Paper
        ref={nodeRef}
        variant="outlined"
        className={cn(
          'absolute top-4 right-20 hidden max-h-[calc(100%-2rem)] w-[calc(100vw-120px)] max-w-210 min-w-120 flex-col',
          selectedBuilding ? 'flex' : null,
        )}
      >
        <div className="drag-handle flex shrink-0 cursor-move border-b border-neutral-200 px-6 pt-6 pb-3 select-none">
          <Typography variant="h2" className="grow">
            First Estimate
          </Typography>
          <Button variant="ghost" size="icon">
            <X />
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto border-b border-neutral-200 px-6 py-3"></div>
        <div className="shrink-0 px-6 py-3">
          <Button
            onClick={gotoGeneralDataStep}
            className="flex w-full items-center gap-2"
          >
            Continue
            <ArrowIcon />
          </Button>
        </div>
      </Paper>
    </Draggable>
  );
}
