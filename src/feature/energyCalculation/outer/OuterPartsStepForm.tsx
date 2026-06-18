import { FieldGroup } from '@/components/ui/field';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  hasAtticField,
  isAtticHeatedField,
} from '@/lib/state/inputs/top-floor';
import { useStore } from '@nanostores/react';
import { OUTER_SECTIONS } from '../StickyStats';
import BottomFloorPaper from './BottomFloorPaper';
import OuterWallPaper from './OuterWallPaper';
import RoofPaper from './RoofPaper';
import RoofWindowsPaper from './RoofWindowsPaper';
import TopFloorPaper from './TopFloorPaper';
import WindowsPaper from './WindowsPaper';

export default function OuterPartsStepForm() {
  const hasAtticValue = useStore(hasAtticField.$store);
  const hasAtticPlaceholder = useStore(hasAtticField.$placeholder);
  const isAtticHeatedValue = useStore(isAtticHeatedField.$store);
  const isAtticHeatedPlaceholder = useStore(isAtticHeatedField.$placeholder);
  const showTopFloor =
    !!(hasAtticValue ?? hasAtticPlaceholder) &&
    !(isAtticHeatedValue ?? isAtticHeatedPlaceholder);

  const visibleSections = OUTER_SECTIONS.filter((s) => {
    if (s === 'topFloor') return showTopFloor;
    if (s === 'roofWindows') return !showTopFloor;
    return true;
  });

  return (
    <TooltipProvider>
      <FieldGroup style={{marginTop: "-20px"}}>
        <div className="flex flex-col gap-6">
          {visibleSections.map((section) => (
            <div
              key={section}
              data-outer-section={section}
              style={{
                scrollMarginTop: 'calc(var(--sticky-stats-height, 0px) + 8px)',
              }}
            >
              {section === 'roof' && <RoofPaper />}
              {section === 'roofWindows' && <RoofWindowsPaper />}
              {section === 'topFloor' && <TopFloorPaper />}
              {section === 'outerWall' && <OuterWallPaper />}
              {section === 'windows' && <WindowsPaper />}
              {section === 'bottomFloor' && <BottomFloorPaper />}
            </div>
          ))}
        </div>
      </FieldGroup>
    </TooltipProvider>
  );
}
