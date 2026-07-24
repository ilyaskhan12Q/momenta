import { useScrollReveal } from '../hooks/useScrollReveal';

export default function ContactSection() {
  const contentRef = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.6, stagger: 0.08 });

  return (
    <section
      style={{
        background: 'url(/contact-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '120px 20px',
        position: 'relative',
      }}
    >
      <div
        ref={contentRef}
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h2
          data-reveal
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(42px, 7vw, 92px)',
            fontWeight: 400,
            color: 'var(--primary)',
            lineHeight: 1.1,
            marginBottom: '24px',
          }}
        >
          Ready to say something real?
        </h2>
        <p
          data-reveal
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '20px',
            fontWeight: 400,
            color: 'var(--quaternary)',
            lineHeight: 1.6,
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px',
          }}
        >
          Momenta is here to help you express what matters most. No sign-up required. Just write, share, and feel.
        </p>
        <a
          data-reveal
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
          Create your moment
        </a>
      </div>
    </section>
  );
}
