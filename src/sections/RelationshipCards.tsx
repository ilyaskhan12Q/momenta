import { useRef, useState } from 'react';
import { useCard3D } from '../hooks/useCard3D';
import { useScrollReveal } from '../hooks/useScrollReveal';

const cards = [
  { front: 'Love', back: 'For the one who makes your heart race' },
  { front: 'Friendship', back: 'For the one who\'s always there' },
  { front: 'Family', back: 'For the ones who shaped you' },
  { front: 'Gratitude', back: 'For those who lifted you up' },
  { front: 'Goodbye', back: 'For moments that deserve closure' },
];

function FlipCard({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false);
  const cardInnerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        ref={cardInnerRef}
        className="relationship-card"
        style={{
          width: '240px',
          height: '320px',
          borderRadius: '24px',
          transformStyle: 'preserve-3d',
          position: 'relative',
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          cursor: 'pointer',
        }}
      >
        {/* Front */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            background: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '38px',
              fontWeight: 400,
              color: 'var(--primary)',
              lineHeight: 1.2,
            }}
          >
            {front}
          </span>
        </div>

        {/* Back */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            background: 'var(--secondary)',
            color: 'white',
            transform: 'rotateY(180deg)',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '24px',
              fontWeight: 400,
              lineHeight: 1.3,
            }}
          >
            {back}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function RelationshipCards() {
  const containerRef = useRef<HTMLElement>(null);
  useCard3D(containerRef);
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.6, stagger: 0.08 });

  return (
    <section
      id="relationships"
      ref={containerRef}
      style={{
        background: 'var(--senary)',
        padding: '120px 20px',
        position: 'relative',
      }}
    >
      {/* Section Header */}
      <div
        ref={headerRef}
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          textAlign: 'center',
          marginBottom: '64px',
        }}
      >
        <span
          data-reveal
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '16px',
            fontWeight: 500,
            textTransform: 'uppercase',
            color: 'var(--quaternary)',
            display: 'block',
            marginBottom: '16px',
            letterSpacing: '0.05em',
          }}
        >
          For every relationship
        </span>
        <h2
          data-reveal
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(42px, 7vw, 92px)',
            fontWeight: 400,
            color: 'var(--quaternary)',
            lineHeight: 1.1,
            marginBottom: '24px',
          }}
        >
          Moments for everyone you love
        </h2>
      </div>

      {/* Card Grid */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '40px',
          maxWidth: '1400px',
          margin: '0 auto 64px',
        }}
      >
        {cards.map((card) => (
          <FlipCard key={card.front} front={card.front} back={card.back} />
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center' }}>
        <a
          href="#create"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--white)',
            background: 'var(--primary)',
            borderRadius: '999px',
            padding: '14px 32px',
            textDecoration: 'none',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'inline-block',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = '0.9';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = '1';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          }}
        >
          Start your moment
        </a>
      </div>
    </section>
  );
}
