import { FieldGroup } from '@/components/ui/field';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  hasAtticField,
  isAtticHeatedField,
} from '@/lib/state/inputs/top-floor';
import { useStore } from '@nanostores/react';
import { ChevronUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button';
import BottomFloorPaper from './BottomFloorPaper';
import OuterWallPaper from './OuterWallPaper';
import RoofPaper from './RoofPaper';
import RoofWindowsPaper from './RoofWindowsPaper';
import TopFloorPaper from './TopFloorPaper';
import WindowsPaper from './WindowsPaper';

const SECTIONS = [
  'roof',
  'roofWindows',
  'topFloor',
  'outerWall',
  'windows',
  'bottomFloor',
] as const;
type Section = (typeof SECTIONS)[number];

export default function OuterPartsStepForm() {
  const { t } = useTranslation('energyCalculation');
  const hasAtticValue = useStore(hasAtticField.$store);
  const hasAtticPlaceholder = useStore(hasAtticField.$placeholder);
  const isAtticHeatedValue = useStore(isAtticHeatedField.$store);
  const isAtticHeatedPlaceholder = useStore(isAtticHeatedField.$placeholder);
  const showTopFloor =
    !!(hasAtticValue ?? hasAtticPlaceholder) &&
    !(isAtticHeatedValue ?? isAtticHeatedPlaceholder);

  const visibleSections = SECTIONS.filter((s) => {
    if (s === 'topFloor') return showTopFloor;
    if (s === 'roofWindows') return !showTopFloor;
    return true;
  });

  const [activeSection, setActiveSection] = useState<Section>('roof');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 200);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    sectionRefs.current[section]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    visibleSections.forEach((section) => {
      const el = sectionRefs.current[section];
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(section);
        },
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
            <Button
              key={section}
              type="button"
              variant={activeSection === section ? 'primary' : 'secondary'}
              onClick={() => scrollTo(section)}
            >
              {labels[section]}
            </Button>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-6">
          {visibleSections.map((section) => (
            <div
              key={section}
              ref={(el) => {
                sectionRefs.current[section] = el;
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
      <Button
        type="button"
        variant="elevated"
        size="icon"
        className={`text-primary hover:text-primary-hover fixed right-6 bottom-6 z-50 h-15 w-15 rounded-full shadow-[0_4px_12px_0px_rgba(0,0,0,0.22)] transition-all duration-300 hover:bg-white hover:shadow-[0_0_12px_4px_rgba(0,0,0,0.15)] ${showScrollTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Nach oben scrollen"
      >
        <ChevronUp aria-hidden="true" strokeWidth={3} />
      </Button>
    </TooltipProvider>
  );
}
