import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useHorizontalBands(containerRef: React.RefObject<HTMLElement | null>) {
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const bands = container.querySelectorAll<HTMLElement>('.text-band');
    const triggers: ScrollTrigger[] = [];

    bands.forEach((band, i) => {
      const isOdd = i % 2 !== 0;
      const xStart = isOdd ? '-50%' : '0%';
      const xEnd = isOdd ? '0%' : '-50%';

      gsap.set(band, { x: xStart });

      const tween = gsap.to(band, {
        x: xEnd,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      if (tween.scrollTrigger) {
        triggers.push(tween.scrollTrigger);
      }
    });

    triggersRef.current = triggers;

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, [containerRef]);
}
