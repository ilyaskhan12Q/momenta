import { useRef } from 'react';
import { useHorizontalBands } from '../hooks/useHorizontalBands';

const bands = [
  {
    text: 'LOVE \u2022 GRATITUDE \u2022 APOLOGY \u2022 GOODBYE \u2022 CELEBRATION \u2022 ',
    color: 'var(--secondary)',
  },
  {
    text: 'YOUR FEELINGS \u2022 ON A PAGE \u2022 ONE LINK \u2022 ONE MOMENT \u2022 FOREVER \u2022 ',
    color: 'var(--nonary)',
  },
  {
    text: 'BIRTHDAYS \u2022 MEMORIES \u2022 FAREWELLS \u2022 CONFESSIONS \u2022 DREAMS \u2022 ',
    color: 'var(--tertiary)',
  },
];

export default function TextBands() {
  const containerRef = useRef<HTMLElement>(null);
  useHorizontalBands(containerRef);

  return (
    <section
      ref={containerRef}
      style={{
        background: 'var(--white)',
        padding: '100px 0',
        overflow: 'hidden',
      }}
    >
      {bands.map((band, i) => (
        <div
          key={i}
          style={{
            overflow: 'hidden',
            height: '110px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            className="text-band"
            style={{
              display: 'flex',
              whiteSpace: 'nowrap',
              willChange: 'transform',
            }}
          >
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(48px, 6vw, 80px)',
                fontWeight: 700,
                color: band.color,
                lineHeight: 1.1,
                paddingRight: '0.3em',
                flexShrink: 0,
              }}
            >
              {band.text}
            </span>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(48px, 6vw, 80px)',
                fontWeight: 700,
                color: band.color,
                lineHeight: 1.1,
                paddingRight: '0.3em',
                flexShrink: 0,
              }}
            >
              {band.text}
            </span>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(48px, 6vw, 80px)',
                fontWeight: 700,
                color: band.color,
                lineHeight: 1.1,
                paddingRight: '0.3em',
                flexShrink: 0,
              }}
            >
              {band.text}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
