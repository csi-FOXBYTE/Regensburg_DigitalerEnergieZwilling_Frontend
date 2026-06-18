import {
  hasAtticField,
  isAtticHeatedField,
} from '@/lib/state/inputs/top-floor';
import { useStore } from '@nanostores/react';
import type { ParseKeys } from 'i18next';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/button';
import { $step, Step } from '../../lib/state/ui';
import CurrentStats from './CurrentStats';

export const OUTER_SECTIONS = [
  'roof',
  'roofWindows',
  'topFloor',
  'outerWall',
  'windows',
  'bottomFloor',
] as const;

export type OuterSection = (typeof OUTER_SECTIONS)[number];

const OUTER_SECTION_LABELS: Record<OuterSection, ParseKeys<'energyCalculation'>> =
  {
    roof: 'outerParts.roof.roof',
    roofWindows: 'outerParts.roofWindows.roofWindows',
    topFloor: 'outerParts.topFloor.topFloor',
    outerWall: 'outerParts.outerWall.outerWall',
    windows: 'outerParts.windows.windows',
    bottomFloor: 'outerParts.bottomFloor.bottomFloor',
  };

const sectionEl = (section: OuterSection) =>
  document.querySelector(`[data-outer-section="${section}"]`);

export default function StickyStats() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const [height, setHeight] = useState(0);
  const [active, setActive] = useState<OuterSection>('roof');

  const step = useStore($step);
  const { t } = useTranslation('energyCalculation');

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

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    const update = () => {
      const rect = wrapper.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;

      const h = inner.offsetHeight;
      setHeight(h);
      document.documentElement.style.setProperty(
        '--sticky-stats-height',
        `${h}px`,
      );
      setStuck(rect.top <= 0);

      const lineY = h + 16;
      let current: OuterSection | undefined;
      let last: OuterSection | undefined;
      for (const section of OUTER_SECTIONS) {
        const el = sectionEl(section);
        if (!el) continue;
        if (current === undefined) current = section;
        last = section;
        if (el.getBoundingClientRect().top <= lineY) current = section;
      }
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom && last) current = last;
      if (current) setActive(current);
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(wrapper);
    observer.observe(inner);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ height: stuck ? height : undefined }}>
      <div
        ref={innerRef}
        className={`bg-background z-40 py-3 ${
          stuck
            ? 'fixed top-0 right-0 left-0 px-gutter shadow-[0_6px_6px_-4px_rgba(0,0,0,0.08)]'
            : ''
        }`}
      >
        <div className={stuck ? 'mx-auto w-full max-w-content' : ''}>
          <CurrentStats />
          {visibleSections.length > 0 && step === Step.OuterParts && (
            <div className="hidden min-w-0 gap-2 overflow-x-auto pt-7 md:flex">
              {visibleSections.map((section) => (
                <Button
                  key={section}
                  type="button"
                  variant={active === section ? 'primary' : 'secondary'}
                  onClick={() =>
                    sectionEl(section)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    })
                  }
                >
                  {t(OUTER_SECTION_LABELS[section])}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
