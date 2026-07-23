import { useState } from 'react';
import { Heart, Users, Home, User, BookOpen, Briefcase } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { CreateExperienceModal } from '../components/CreateExperienceModal';

const categories = [
  { icon: Heart, label: 'Partner' },
  { icon: Users, label: 'Friend' },
  { icon: Home, label: 'Parent' },
  { icon: User, label: 'Sibling' },
  { icon: BookOpen, label: 'Teacher' },
  { icon: Briefcase, label: 'Colleague' },
];

export default function CreateMoment() {
  const leftRef = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.6, stagger: 0.08 });
  const rightRef = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.6, stagger: 0.08 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('PARTNER');

  return (
    <section
      id="create"
      style={{
        background: 'var(--nonary)',
        padding: '120px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '80px',
          alignItems: 'center',
        }}
        className="responsive-grid-create"
      >
        {/* Left Column */}
        <div ref={leftRef}>
          <span
            data-reveal
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '16px',
              fontWeight: 500,
              textTransform: 'uppercase',
              color: 'var(--primary)',
              display: 'block',
              marginBottom: '16px',
              letterSpacing: '0.05em',
            }}
          >
            Simple and sincere
          </span>
          <h2
            data-reveal
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(32px, 5vw, 62px)',
              fontWeight: 400,
              color: 'var(--primary)',
              lineHeight: 1.1,
              marginBottom: '24px',
            }}
          >
            Create in minutes. Lasts a lifetime.
          </h2>
          <p
            data-reveal
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '18px',
              fontWeight: 400,
              color: 'rgba(0,0,0,0.7)',
              lineHeight: 1.6,
              marginBottom: '40px',
              maxWidth: '480px',
            }}
          >
            Choose your relationship. Pick an emotion. Write your message. We'll craft a one-of-a-kind experience you can share with a single link.
          </p>
          <button
            data-reveal
            onClick={() => {
              setSelectedCategory('PARTNER');
              setIsModalOpen(true);
            }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--white)',
              background: 'var(--secondary)',
              borderRadius: '999px',
              padding: '14px 32px',
              border: 'none',
              cursor: 'pointer',
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
            Start creating
          </button>
        </div>

        {/* Right Column - Category Cards */}
        <div
          ref={rightRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.label}
                data-reveal
                onClick={() => {
                  setSelectedCategory(cat.label.toUpperCase());
                  setIsModalOpen(true);
                }}
                style={{
                  background: 'var(--white)',
                  borderRadius: '20px',
                  padding: '24px',
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                }}
              >
                <Icon
                  size={28}
                  style={{
                    color: 'var(--primary)',
                    margin: '0 auto 12px',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '16px',
                    fontWeight: 500,
                    color: 'var(--quaternary)',
                  }}
                >
                  {cat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <CreateExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialRelationship={selectedCategory}
      />
    </section>
  );
}
