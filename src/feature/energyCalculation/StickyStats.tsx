import { useEffect, useRef, useState } from 'react';
import CurrentStats from './CurrentStats';

export default function StickyStats() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const [height, setHeight] = useState(0);
  const [box, setBox] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    const update = () => {
      const rect = wrapper.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;
      setHeight(inner.offsetHeight);
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
        className={`bg-background z-40 overflow-hidden py-3 ${
          stuck ? 'fixed top-0 shadow-[0_6px_6px_-4px_rgba(0,0,0,0.08)]' : ''
        }`}
        style={stuck ? { left: box.left, width: box.width } : undefined}
      >
        <CurrentStats />
      </div>
    </div>
  );
}
