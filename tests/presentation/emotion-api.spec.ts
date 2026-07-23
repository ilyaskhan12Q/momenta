import { describe, it, expect } from 'vitest';
import { POST } from '../../src/app/api/v1/experiences/[id]/emotion/route';
import { NextRequest } from 'next/server';

describe('Emotion API Controller POST /api/v1/experiences/[id]/emotion', () => {
  it('should process emotion pipeline for valid experience request and return 200 with ExperiencePresentationContract', async () => {
    const req = new NextRequest('http://localhost:3000/api/v1/experiences/exp-123/emotion', {
      method: 'POST',
      body: JSON.stringify({
        senderId: 'user-456',
        relationship: 'PARTNER',
        occasion: 'ANNIVERSARY',
        textBeats: ['I love you so much and treasure every single moment with you.', 'Happy 5th Anniversary!'],
      }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'exp-123' }) });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.data.pipeline.engineVersion).toBe('1.0.0');
    expect(json.data.emotionProfile.primaryEmotion).toBe('DEEP_ROMANCE');
    expect(json.data.colors.background).toBeDefined();
  });

  it('should return 400 validation error if textBeats is missing or empty', async () => {
    const req = new NextRequest('http://localhost:3000/api/v1/experiences/exp-123/emotion', {
      method: 'POST',
      body: JSON.stringify({
        senderId: 'user-456',
        relationship: 'PARTNER',
        occasion: 'ANNIVERSARY',
        textBeats: [],
      }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'exp-123' }) });
    expect(res.status).toBe(400);
  });
});
