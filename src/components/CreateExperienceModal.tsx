'use client';

import React, { useState } from 'react';

export interface CreateExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRelationship?: string;
}

export const CreateExperienceModal: React.FC<CreateExperienceModalProps> = ({
  isOpen,
  onClose,
  initialRelationship = 'PARTNER',
}) => {
  const [senderName, setSenderName] = useState('');
  const [relationship, setRelationship] = useState(initialRelationship);
  const [occasion, setOccasion] = useState('ANNIVERSARY');
  const [scene1, setScene1] = useState('');
  const [scene2, setScene2] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let token = '';

      // Try server API first
      try {
        const expRes = await fetch('/api/v1/experiences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            senderId: 'user-demo',
            title: `${senderName || 'Anonymous'}'s ${occasion} Moment`,
            relationship,
            occasion,
          }),
        });

        if (expRes.ok) {
          const expData = await expRes.json();
          const experienceId = expData.data.id;

          const scenesToAppend = [
            { sequenceOrder: 1, durationMs: 6000, transition: 'FADE_SLIDE', beats: [scene1 || 'Every memory with you shines brighter than stars.'] },
            { sequenceOrder: 2, durationMs: 6000, transition: 'FADE_SLIDE', beats: [scene2 || 'Here is to a lifetime of shared moments and endless love.'] },
          ];

          for (const scene of scenesToAppend) {
            await fetch(`/api/v1/experiences/${experienceId}/scenes`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(scene),
            });
          }

          const pubRes = await fetch(`/api/v1/experiences/${experienceId}/publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senderId: 'user-demo', senderDisplayName: senderName || 'Anonymous' }),
          });

          if (pubRes.ok) {
            const pubData = await pubRes.json();
            token = pubData.data.accessToken?.value || pubData.data.accessToken;
          }
        }
      } catch {
        // Server endpoint unavailable, fallback to local engine
      }

      // Fallback to local client engine if token not obtained from server
      if (!token) {
        const { localExperienceService } = await import('../modules/story-manifest/infrastructure/client/LocalExperienceService');
        const expId = localExperienceService.createDraft('user-demo', `${senderName || 'Anonymous'}'s ${occasion} Moment`, relationship, occasion);
        localExperienceService.appendScene(expId, 1, 6000, 'FADE_SLIDE', [scene1 || 'Every memory with you shines brighter than stars.']);
        localExperienceService.appendScene(expId, 2, 6000, 'FADE_SLIDE', [scene2 || 'Here is to a lifetime of shared moments and endless love.']);
        const manifest = await localExperienceService.publish(expId, senderName || 'Anonymous');
        token = manifest.linkToken;
      }

      const fullUrl = `${window.location.origin}/experience/${token}`;
      setGeneratedLink(fullUrl);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(12px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#0d111a',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '24px',
          padding: '36px',
          maxWidth: '540px',
          width: '100%',
          color: '#fff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          fontFamily: "'DM Sans', sans-serif",
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '24px',
            cursor: 'pointer',
          }}
        >
          ×
        </button>

        {!generatedLink ? (
          <form onSubmit={handlePublish}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', marginBottom: '8px' }}>
              Create Your Momenta Experience
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
              Synthesize dynamic WebGL background shaders, audio soundscapes, and cinematic text beats.
            </p>

            {error && (
              <div style={{ background: '#7f1d1d', color: '#fca5a5', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Your Name</label>
              <input
                type="text"
                placeholder="e.g. Alex"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Relationship</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff' }}
                >
                  <option value="PARTNER">Partner</option>
                  <option value="FRIEND">Friend</option>
                  <option value="PARENT">Parent</option>
                  <option value="SIBLING">Sibling</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="COLLEAGUE">Colleague</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Occasion</label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff' }}
                >
                  <option value="ANNIVERSARY">Anniversary</option>
                  <option value="BIRTHDAY">Birthday</option>
                  <option value="APOLOGY">Apology</option>
                  <option value="GRATITUDE">Gratitude</option>
                  <option value="JUST_BECAUSE">Just Because</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Scene 1 Beat Text</label>
              <textarea
                rows={2}
                placeholder="e.g. Every memory with you shines brighter than stars."
                value={scene1}
                onChange={(e) => setScene1(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Scene 2 Beat Text</label>
              <textarea
                rows={2}
                placeholder="e.g. Here is to a lifetime of shared moments and endless love."
                value={scene2}
                onChange={(e) => setScene2(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '999px',
                background: loading ? '#64748b' : '#ff3d52',
                color: '#fff',
                fontWeight: 700,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
              }}
            >
              {loading ? 'Synthesizing Emotion Engine...' : 'Publish Experience & Get Link'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', marginBottom: '8px' }}>
              Experience Published!
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
              Your one-of-a-kind dynamic WebGL experience is compiled and ready to share.
            </p>

            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '24px', wordBreak: 'break-all' }}>
              <code style={{ color: '#38bdf8', fontSize: '14px' }}>{generatedLink}</code>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedLink);
                  alert('Link copied to clipboard!');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#334155',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Copy Link
              </button>
              <a
                href={generatedLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#ff3d52',
                  color: '#fff',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Open Recipient Experience ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
