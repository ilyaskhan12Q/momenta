import { useRef, useEffect, useState } from 'react';
import { useStarField } from '../hooks/useStarField';
import { useChromaticScroll } from '../hooks/useChromaticScroll';

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useStarField(canvasRef, { isMobile });
  useChromaticScroll(true);

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 50%, #100030 0%, #000000 100%)',
      }}
    >
      {/* StarField Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />

      {/* Boy Illustration */}
      {!isMobile && (
        <img
          src="/hero-boy.png"
          alt=""
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '40vw',
            maxWidth: '600px',
            zIndex: 2,
            pointerEvents: 'none',
            opacity: 0.85,
          }}
        />
      )}

      {/* Girl Illustration */}
      {!isMobile && (
        <img
          src="/hero-girl.png"
          alt=""
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '40vw',
            maxWidth: '600px',
            zIndex: 2,
            pointerEvents: 'none',
            opacity: 0.85,
          }}
        />
      )}

      {/* Hero Text Block */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          maxWidth: '860px',
          margin: '0 auto',
          padding: '0 20px',
          textAlign: 'center',
        }}
      >
        {/* Top Label */}
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '16px',
            fontWeight: 500,
            color: 'var(--white)',
            opacity: 0.8,
            letterSpacing: '0.05em',
            marginBottom: '24px',
          }}
        >
          Turn feelings into moments
        </span>

        {/* Headline with chromatic aberration */}
        <h1
          data-distortion=""
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: 'clamp(48px, 10vw, 130px)',
            fontWeight: 400,
            color: 'var(--white)',
            textShadow: '0 0 60px rgba(16,53,156,0.3)',
            lineHeight: 1.1,
            marginBottom: '24px',
          }}
        >
          Your feelings, on a page.
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '18px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '480px',
            lineHeight: 1.6,
            marginBottom: '40px',
          }}
        >
          A one-time link. A cinematic experience. Say what matters, beautifully.
        </p>

        {/* CTA Button */}
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
          Create a moment
        </a>

        {/* Atmospheric text */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontStyle: 'italic',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.4)',
            marginTop: '24px',
          }}
        >
          Some things deserve more than a text message.
        </p>
      </div>
    </section>
  );
}
