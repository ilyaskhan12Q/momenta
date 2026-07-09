import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

export default function CinematicSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const contentRef = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.6 });

  useEffect(() => {
    const section = sectionRef.current;
    const videoEl = videoRef.current;
    if (!section || !videoEl) return;

    const tween = gsap.fromTo(
      videoEl,
      { y: '30%' },
      {
        y: '-30%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );

    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
    };
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '90vh',
        overflow: 'hidden',
        background: '#f0f4f0',
      }}
    >
      {/* Video/Image Background with parallax */}
      <div
        ref={videoRef}
        style={{
          position: 'absolute',
          top: '-30%',
          left: 0,
          width: '100%',
          height: '160%',
          zIndex: 0,
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/cinematic-section-bg.jpg"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          className="hidden md:block"
        >
          <source src="/cinematic-memories.mp4" type="video/mp4" />
        </video>
        <img
          src="/cinematic-section-bg.jpg"
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          className="md:hidden"
        />
      </div>

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.45)',
          zIndex: 1,
        }}
      />

      {/* Text overlay */}
      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '90vh',
          padding: '120px 20px',
          textAlign: 'center',
        }}
      >
        <h2
          data-reveal
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(42px, 7vw, 92px)',
            fontWeight: 400,
            color: 'var(--white)',
            lineHeight: 1.1,
            marginBottom: '24px',
          }}
        >
          Say it with feeling
        </h2>
        <p
          data-reveal
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '22px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '500px',
            lineHeight: 1.6,
            marginBottom: '40px',
          }}
        >
          Birthdays, goodbyes, love letters, apologies. Every emotion deserves its own stage.
        </p>
        <a
          data-reveal
          href="#emotions"
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
          Explore emotions
        </a>
      </div>
    </section>
  );
}
