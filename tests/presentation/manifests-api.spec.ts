import { describe, it, expect, vi } from 'vitest';
import { GET } from '../../src/app/api/v1/manifests/[token]/route';
import { NextRequest } from 'next/server';

vi.mock('@/shared/infrastructure/supabase/server', () => ({
  createSupabaseServerClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: {
              manifest_json: {
                manifestVersion: '1.0.0',
                manifestId: 'man-100',
                experienceId: 'exp-100',
                linkToken: 'token12345678901',
                senderDisplayName: 'Alex',
                relationship: 'PARTNER',
                occasion: 'ANNIVERSARY',
                publishedAt: new Date().toISOString(),
                scenes: [{ sequenceOrder: 1, durationMs: 5000, transitionType: 'FADE_SLIDE', textBeat: 'Beat 1' }],
                presentation: { colors: { background: 'hsl(0, 0%, 0%)' } },
                checksum: 'checksum-123',
              },
            },
            error: null,
          }),
        }),
      }),
    }),
  }),
}));

describe('Recipient Public Manifest API GET /api/v1/manifests/[token]', () => {
  it('should return 200 with StoryManifestV1 JSON and CDN cache headers for valid token', async () => {
    const req = new NextRequest('http://localhost:3000/api/v1/manifests/token12345678901');
    const res = await GET(req, { params: Promise.resolve({ token: 'token12345678901' }) });

    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');

    const json = await res.json();
    expect(json.data.manifestVersion).toBe('1.0.0');
    expect(json.data.linkToken).toBe('token12345678901');
  });

  it('should return 404 if token is unknown', async () => {
    const { createSupabaseServerClient } = await import('@/shared/infrastructure/supabase/server');
    (createSupabaseServerClient as any).mockResolvedValueOnce({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      }),
    });

    const req = new NextRequest('http://localhost:3000/api/v1/manifests/unknowntoken');
    const res = await GET(req, { params: Promise.resolve({ token: 'unknowntoken' }) });

    expect(res.status).toBe(404);
  });
});
