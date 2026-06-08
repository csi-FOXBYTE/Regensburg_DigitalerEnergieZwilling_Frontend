import { FieldGroup } from '@/components/ui/field';
import { TooltipProvider } from '@/components/ui/tooltip';
import { hasAtticField, isAtticHeatedField } from '@/lib/state/inputs/top-floor';
import { useStore } from '@nanostores/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import BottomFloorPaper from './BottomFloorPaper';
import OuterWallPaper from './OuterWallPaper';
import RoofPaper from './RoofPaper';
import RoofWindowsPaper from './RoofWindowsPaper';
import TopFloorPaper from './TopFloorPaper';
import WindowsPaper from './WindowsPaper';

const SECTIONS = ['roof', 'roofWindows', 'topFloor', 'outerWall', 'windows', 'bottomFloor'] as const;
type Section = typeof SECTIONS[number];

export default function OuterPartsStepForm() {
  const { t } = useTranslation('energyCalculation');
  const hasAtticValue = useStore(hasAtticField.$store);
  const hasAtticPlaceholder = useStore(hasAtticField.$placeholder);
  const isAtticHeatedValue = useStore(isAtticHeatedField.$store);
  const isAtticHeatedPlaceholder = useStore(isAtticHeatedField.$placeholder);
  const showTopFloor = !!(hasAtticValue ?? hasAtticPlaceholder) && !(isAtticHeatedValue ?? isAtticHeatedPlaceholder);

  const visibleSections = SECTIONS.filter((s) => {
    if (s === 'topFloor') return showTopFloor;
    if (s === 'roofWindows') return !showTopFloor;
    return true;
  });

  const [activeSection, setActiveSection] = useState<Section>('roof');
  const sectionRefs = useRef<Record<Section, HTMLDivElement | null>>({
    roof: null,
    roofWindows: null,
    topFloor: null,
    outerWall: null,
    windows: null,
    bottomFloor: null,
  });

  const labels: Record<Section, string> = {
    roof: t('outerParts.roof.roof'),
    roofWindows: t('outerParts.roofWindows.roofWindows'),
    topFloor: t('outerParts.topFloor.topFloor'),
    outerWall: t('outerParts.outerWall.outerWall'),
    windows: t('outerParts.windows.windows'),
    bottomFloor: t('outerParts.bottomFloor.bottomFloor'),
  };

  const scrollTo = (section: Section) => {
    sectionRefs.current[section]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    visibleSections.forEach((section) => {
      const el = sectionRefs.current[section];
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(section); },
        { threshold: 0.3 },
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [showTopFloor]);

  return (
    <TooltipProvider>
      <FieldGroup>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {visibleSections.map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => scrollTo(section)}
              className={cn(
                'shrink-0 cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                activeSection === section
                  ? 'border-primary text-primary'
                  : 'border-neutral-200 text-neutral-550 hover:border-primary hover:text-primary',
              )}
            >
              {labels[section]}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-6">
          {visibleSections.map((section) => (
            <div key={section} ref={(el) => { sectionRefs.current[section] = el; }}>
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
