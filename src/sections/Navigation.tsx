import { useState, useEffect } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Relationships', href: '#relationships' },
    { label: 'Emotions', href: '#emotions' },
    { label: 'Create', href: '#create' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.4s ease',
        borderBottom: scrolled ? '1px solid var(--grey)' : '1px solid transparent',
      }}
    >
      <div
        style={{
          maxWidth: '1728px',
          margin: '0 auto',
          padding: '0 20px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Wordmark */}
        <a
          href="#"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '24px',
            fontWeight: 700,
            color: scrolled ? 'var(--primary)' : 'var(--white)',
            textDecoration: 'none',
            transition: 'color 0.4s ease',
          }}
        >
          Momenta
        </a>

        {/* Center Links - hidden on mobile */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'center',
          }}
          className="hidden md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '16px',
                fontWeight: 500,
                color: scrolled ? 'var(--primary)' : 'var(--white)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                backgroundImage: 'linear-gradient(currentColor, currentColor)',
                backgroundSize: '0% 1px',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left bottom',
                paddingBottom: '2px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundSize = '100% 1px';
                (e.currentTarget as HTMLElement).style.color = 'var(--secondary)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundSize = '0% 1px';
                (e.currentTarget as HTMLElement).style.color = scrolled ? 'var(--primary)' : 'var(--white)';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#create"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--white)',
            background: 'var(--secondary)',
            borderRadius: '999px',
            padding: '12px 28px',
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
          Start a moment
        </a>
      </div>
    </nav>
  );
}
