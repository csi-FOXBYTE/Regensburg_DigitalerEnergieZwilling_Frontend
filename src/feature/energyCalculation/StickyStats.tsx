import { useStore } from '@nanostores/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/button';
import CurrentStats from './CurrentStats';
import {
  $outerNavActive,
  $outerNavScrollRequest,
  $outerNavVisible,
  type OuterSection,
} from './outerPartsNav';
import { $stickyStatsHeight } from './stickyStatsHeight';

const OUTER_SECTION_LABELS: Record<OuterSection, string> = {
  roof: 'outerParts.roof.roof',
  roofWindows: 'outerParts.roofWindows.roofWindows',
  topFloor: 'outerParts.topFloor.topFloor',
  outerWall: 'outerParts.outerWall.outerWall',
  windows: 'outerParts.windows.windows',
  bottomFloor: 'outerParts.bottomFloor.bottomFloor',
};

export default function StickyStats() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const [height, setHeight] = useState(0);
  const [box, setBox] = useState({ left: 0, width: 0 });

  const outerNavVisible = useStore($outerNavVisible);
  const outerNavActive = useStore($outerNavActive);
  const { t } = useTranslation('energyCalculation');

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    const update = () => {
      const rect = wrapper.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;
      setHeight(inner.offsetHeight);
      $stickyStatsHeight.set(inner.offsetHeight);
      setBox({ left: rect.left, width: rect.width });
      setStuck(rect.top <= 0);
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
        className={`bg-background z-40 overflow-hidden py-3 px-1 ${
          stuck ? 'fixed top-0 shadow-[0_6px_6px_-4px_rgba(0,0,0,0.08)]' : ''
        }`}
        style={stuck ? { left: box.left, width: box.width } : undefined}
      >
        <CurrentStats />
        {outerNavVisible.length > 0 && (
          <div className="hidden min-w-0 gap-2 overflow-x-auto pt-7 md:flex">
            {outerNavVisible.map((section) => (
              <Button
                key={section}
                type="button"
                variant={outerNavActive === section ? 'primary' : 'secondary'}
                onClick={() => $outerNavScrollRequest.set(section)}
              >
                {t(OUTER_SECTION_LABELS[section] as any)}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
