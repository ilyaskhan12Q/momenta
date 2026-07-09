import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  y?: number;
  duration?: number;
  ease?: string;
  stagger?: number;
  start?: string;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.querySelectorAll('[data-reveal]');
    const targets = children.length > 0 ? children : [el];

    gsap.set(targets, { opacity: 0, y: options.y ?? 40 });

    const triggers: ScrollTrigger[] = [];

    targets.forEach((target, i) => {
      const tween = gsap.to(target, {
        opacity: 1,
        y: 0,
        duration: options.duration ?? 0.6,
        ease: options.ease ?? 'power2.out',
        delay: children.length > 0 ? i * (options.stagger ?? 0.08) : 0,
        scrollTrigger: {
          trigger: target,
          start: options.start ?? 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      if (tween.scrollTrigger) {
        triggers.push(tween.scrollTrigger);
      }
    });

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, [options.y, options.duration, options.ease, options.stagger, options.start]);

  return ref;
}
