import {
  hasAtticField,
  isAtticHeatedField,
} from '@/lib/state/inputs/top-floor';
import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/button';

const SECTION_IDS = [
  'roof',
  'roofWindows',
  'topFloor',
  'outerWall',
  'windows',
  'bottomFloor',
] as const;

type SectionId = (typeof SECTION_IDS)[number];

export default function OuterSectionNav() {
  const [active, setActive] = useState<SectionId | null>(null);
  const { t } = useTranslation('energyCalculation');

  const hasAtticValue = useStore(hasAtticField.$store);
  const hasAtticPlaceholder = useStore(hasAtticField.$placeholder);
  const isAtticHeatedValue = useStore(isAtticHeatedField.$store);
  const isAtticHeatedPlaceholder = useStore(isAtticHeatedField.$placeholder);

  const showTopFloor =
    !!(hasAtticValue ?? hasAtticPlaceholder) &&
    !(isAtticHeatedValue ?? isAtticHeatedPlaceholder);

  useEffect(() => {
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const last = [...SECTION_IDS].reverse().find((s) => visible.has(s));
        if (last) setActive(last);
      },
      { threshold: 0, rootMargin: '0px 0px -50% 0px' },
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [
    hasAtticValue,
    hasAtticPlaceholder,
    isAtticHeatedValue,
    isAtticHeatedPlaceholder,
  ]);

  const scrollTo = (id: SectionId) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const isActive = (id: SectionId) => active === id;
  // Draw the border using box-shadow, because using "border" leads to render issues where the borders don't survive repaint
  // when scrolling up, the upper border disappears, appears again when hovering the button
  const borderFix =
    'border-transparent hover:border-transparent shadow-[inset_0_0_0_1px_var(--color-primary)] hover:shadow-[inset_0_0_0_1px_var(--color-primary-hover)]';

  return (
    <div className="hidden min-w-0 transform-gpu gap-2 overflow-x-auto backface-hidden md:flex">
      <Button
        type="button"
        className={borderFix}
        variant={isActive('roof') ? 'primary' : 'secondary'}
        onClick={() => scrollTo('roof')}
      >
        {t('outerParts.roof.roof')}
      </Button>
      {showTopFloor ? (
        <Button
          type="button"
          className={borderFix}
          variant={isActive('topFloor') ? 'primary' : 'secondary'}
          onClick={() => scrollTo('topFloor')}
        >
          {t('outerParts.topFloor.topFloor')}
        </Button>
      ) : (
        <Button
          type="button"
          className={borderFix}
          variant={isActive('roofWindows') ? 'primary' : 'secondary'}
          onClick={() => scrollTo('roofWindows')}
        >
          {t('outerParts.roofWindows.roofWindows')}
        </Button>
      )}
      <Button
        type="button"
        className={borderFix}
        variant={isActive('outerWall') ? 'primary' : 'secondary'}
        onClick={() => scrollTo('outerWall')}
      >
        {t('outerParts.outerWall.outerWall')}
      </Button>
      <Button
        type="button"
        className={borderFix}
        variant={isActive('windows') ? 'primary' : 'secondary'}
        onClick={() => scrollTo('windows')}
      >
        {t('outerParts.windows.windows')}
      </Button>
      <Button
        type="button"
        className={borderFix}
        variant={isActive('bottomFloor') ? 'primary' : 'secondary'}
        onClick={() => scrollTo('bottomFloor')}
      >
        {t('outerParts.bottomFloor.bottomFloor')}
      </Button>
    </div>
  );
}
