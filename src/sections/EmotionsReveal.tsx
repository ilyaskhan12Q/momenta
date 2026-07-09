import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTextDistortion } from '../hooks/useTextDistortion';

gsap.registerPlugin(ScrollTrigger);

export default function EmotionsReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useTextDistortion(true);

  useEffect(() => {
    const section = sectionRef.current;
    const overlay = overlayRef.current;
    if (!section || !overlay) return;

    const tween = gsap.fromTo(
      overlay,
      { clipPath: 'inset(0 0% 0 0)' },
      {
        clipPath: 'inset(0 0 0 100%)',
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end: 'center center',
          scrub: 1,
        },
      }
    );

    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
    };
  }, []);

  return (
    <section
      id="emotions"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        background: 'var(--quaternary)',
        overflow: 'hidden',
        padding: '120px 20px',
      }}
    >
      {/* Light overlay that slides away on scroll */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#f0f4f0',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '860px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <h2
          data-text-distortion
          data-speed="0.5"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(32px, 5vw, 62px)',
            fontWeight: 400,
            color: 'var(--white)',
            lineHeight: 1.1,
            marginBottom: '24px',
          }}
        >
          Love, gratitude, farewell... Every feeling, beautifully expressed.
        </h2>

        <p
          data-text-distortion
          data-speed="0.3"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '18px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.6,
            maxWidth: '500px',
            margin: '0 auto 40px',
          }}
        >
          When words alone aren't enough, Momenta gives them a stage. A quiet, intimate place where emotions breathe.
        </p>

        <a
          href="#create"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--white)',
            background: 'var(--secondary)',
            borderRadius: '999px',
            padding: '14px 32px',
            textDecoration: 'none',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'inline-block',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#ff3d52';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--secondary)';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          }}
        >
          Try it now
        </a>
      </div>
    </section>
  );
}
