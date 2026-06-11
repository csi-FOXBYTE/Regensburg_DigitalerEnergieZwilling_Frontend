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
import CurrentStats from '../CurrentStats';
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

  const wrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [box, setBox] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const header = headerRef.current;
    if (!wrapper || !header) return;

    const update = () => {
      const rect = wrapper.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;
      setHeaderHeight(header.offsetHeight);
      setBox({ left: rect.left, width: rect.width });
      setStuck(rect.top <= 0);
      setShowScrollTop(window.scrollY > 200);
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(wrapper);
    observer.observe(header);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
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
    const onScroll = () => {
      const lineY = headerHeight + 16;
      let current: Section | undefined;
      let last: Section | undefined;
      for (const section of SECTIONS) {
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
      if (current) setActiveSection(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showTopFloor, headerHeight]);

  return (
    <TooltipProvider>
      <div
        ref={wrapperRef}
        style={{ height: stuck ? headerHeight : undefined }}
      >
        <div
          ref={headerRef}
          className={`bg-background z-40 flex flex-col gap-6 overflow-hidden py-3 ${
            stuck ? 'fixed top-0 shadow-[0_6px_6px_-4px_rgba(0,0,0,0.08)]' : ''
          }`}
          style={stuck ? { left: box.left, width: box.width } : undefined}
        >
          <CurrentStats />
          <div className="hidden min-w-0 gap-2 overflow-x-auto p-3 pb-1 md:flex">
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
        </div>
      </div>
      <FieldGroup>
        <div className="flex flex-col gap-6">
          {visibleSections.map((section) => (
            <div
              key={section}
              ref={(el) => {
                sectionRefs.current[section] = el;
              }}
              style={{ scrollMarginTop: headerHeight + 8 }}
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
