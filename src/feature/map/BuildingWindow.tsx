import { useStore } from '@nanostores/react';
import { X } from 'lucide-react';
import { useCallback, useRef } from "react";
import Draggable from "react-draggable";
import ArrowIcon from '../../components/ArrowIcon';
import { Button } from '../../components/ui/button';
import { Paper } from '../../components/ui/paper';
import { Typography } from '../../components/ui/typography';
import { cn } from '../../lib/utils';
import { setStep, Step } from '../progressBar/state';
import { $building } from './state';

export default function BuildingWindow() {
  const nodeRef = useRef<HTMLDivElement>(null);

  const selectedBuilding = useStore($building)

  const gotoGeneralDataStep = useCallback(() => {
    setStep(Step.GeneralData);
  }, []);

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      handle=".drag-handle"
    >
      <Paper
        ref={nodeRef}
        variant="outlined"
        className={cn("hidden absolute top-4 right-20 w-[calc(100vw-120px)] max-w-210 flex-col max-h-[calc(100%-2rem)] min-w-120", selectedBuilding ? "flex" : null)}
      >
        <div className="drag-handle cursor-move px-6 pt-6 pb-3 select-none border-b border-neutral-200 shrink-0 flex">
          <Typography variant="h2" className='grow'>First Estimate</Typography>
          <Button variant="ghost" size="icon"><X/></Button>
        </div>
        <div className='flex-1 min-h-0 py-3 px-6 overflow-y-auto border-b border-neutral-200'>

        </div>
        <div className="px-6 py-3 shrink-0">
          <Button onClick={gotoGeneralDataStep} className='w-full flex gap-2 items-center'>
            Continue
            <ArrowIcon/>
          </Button>
        </div>
      </Paper>
    </Draggable>
  );
}
