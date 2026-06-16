import { FieldGroup } from '@/components/ui/field';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  hasAtticField,
  isAtticHeatedField,
} from '@/lib/state/inputs/top-floor';
import { useStore } from '@nanostores/react';
import { useEffect, useRef } from 'react';
import { $step, Step } from '@/lib/state/ui/progress';
import {
  $outerNavActive,
  $outerNavScrollRequest,
  $outerNavVisible,
  OUTER_SECTIONS,
  type OuterSection,
} from '../outerPartsNav';
import { $stickyStatsHeight } from '../stickyStatsHeight';
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

  const stickyStatsHeight = useStore($stickyStatsHeight);

  const visibleSections = OUTER_SECTIONS.filter((s) => {
    if (s === 'topFloor') return showTopFloor;
    if (s === 'roofWindows') return !showTopFloor;
    return true;
  });

  const sectionRefs = useRef<Record<OuterSection, HTMLDivElement | null>>({
    roof: null,
    roofWindows: null,
    topFloor: null,
    outerWall: null,
    windows: null,
    bottomFloor: null,
  });

  // Publish visible sections when on OuterParts step, clear otherwise
  useEffect(() => {
    return $step.subscribe((step) => {
      $outerNavVisible.set(step === Step.OuterParts ? [...visibleSections] : []);
    });
  }, [showTopFloor]);

  // Handle scroll requests from nav buttons
  useEffect(() => {
    return $outerNavScrollRequest.subscribe((section) => {
      if (!section) return;
      sectionRefs.current[section]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setTimeout(() => $outerNavScrollRequest.set(null), 0);
    });
  }, []);

  // Track active section and publish it
  useEffect(() => {
    const onScroll = () => {
      const lineY = $stickyStatsHeight.get() + 16;
      let current: OuterSection | undefined;
      let last: OuterSection | undefined;
      for (const section of OUTER_SECTIONS) {
        const el = sectionRefs.current[section];
        if (!el) continue;
        if (current === undefined) current = section;
        last = section;
        if (el.getBoundingClientRect().top <= lineY) current = section;
      }
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom && last) current = last;
      if (current) $outerNavActive.set(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showTopFloor]);

  return (
    <TooltipProvider>
      <FieldGroup>
        <div className="flex flex-col gap-6">
          {visibleSections.map((section) => (
            <div
              key={section}
              ref={(el) => {
                sectionRefs.current[section] = el;
              }}
              style={{ scrollMarginTop: stickyStatsHeight + 8 }}
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
