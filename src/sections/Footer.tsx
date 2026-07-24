import { Camera, Share2, Globe, Tv, Heart } from 'lucide-react';

const linkColumns = [
  ['How it works', 'Relationships', 'Emotions', 'Pricing'],
  ['About', 'Blog', 'Careers', 'Press'],
  ['Help Center', 'Privacy', 'Terms', 'Contact'],
];

const socialIcons = [
  { icon: Camera, label: 'Instagram' },
  { icon: Share2, label: 'Twitter' },
  { icon: Globe, label: 'Website' },
  { icon: Tv, label: 'Youtube' },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: 'url(/footer-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        minHeight: '420px',
        padding: '80px 20px 40px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Footer Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '40px',
          }}
          className="responsive-grid-footer"
        >
          {/* Left Column */}
          <div>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '32px',
                fontWeight: 700,
                color: 'var(--primary)',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Momenta
            </span>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '16px',
                color: 'var(--quaternary)',
                marginBottom: '24px',
              }}
            >
              Your feelings, on a page.
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {socialIcons.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--primary)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--white)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {linkColumns.map((column, colIndex) => (
            <div key={colIndex}>
              {column.map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '16px',
                    fontWeight: 400,
                    color: 'var(--quaternary)',
                    textDecoration: 'none',
                    display: 'block',
                    marginBottom: '12px',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--secondary)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--quaternary)';
                  }}
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--grey)',
            paddingTop: '24px',
            marginTop: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              color: 'var(--quaternary)',
            }}
          >
            &copy; 2025 Momenta. All rights reserved.
          </span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              color: 'var(--quaternary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Made with <Heart size={14} style={{ color: 'var(--secondary)', fill: 'var(--secondary)' }} /> love
          </span>
        </div>
      </div>
    </footer>
  );
}
