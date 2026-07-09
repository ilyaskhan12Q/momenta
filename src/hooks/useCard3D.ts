import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useCard3D(containerRef: React.RefObject<HTMLElement | null>) {
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('.relationship-card');
    const triggers: ScrollTrigger[] = [];

    cards.forEach((card, i) => {
      const direction = i % 2 === 0 ? 1 : -1;

      gsap.set(card, { rotationX: 90 * direction, opacity: 0.5 });

      const tween = gsap.to(card, {
        rotationX: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'center center',
          scrub: 1,
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
