import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '../../src/app/api/health/route';
import { middleware, config } from '../../src/middleware';
import { NextRequest, NextResponse } from 'next/server';

const mockUrl = 'https://example.supabase.co';
const mockAnonKey = 'mock-anon-key-12345';

describe('Health API Route Controller', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return status 200 and healthy JSON schema', async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject({
      status: 'HEALTHY',
      version: '1.0.0',
      environment: expect.any(String),
    });
    expect(typeof body.timestamp).toBe('string');
    expect(new Date(body.timestamp).getTime()).not.toBeNaN();
  });
});

describe('Root Next.js Middleware', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_SUPABASE_URL = mockUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = mockAnonKey;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should export middleware function and matcher config', () => {
    expect(typeof middleware).toBe('function');
    expect(config).toBeDefined();
    expect(config.matcher).toBeDefined();
    expect(Array.isArray(config.matcher)).toBe(true);
  });

  it('should invoke updateSession and return a NextResponse', async () => {
    const request = new NextRequest(new URL('https://example.com/dashboard'));
    const response = await middleware(request);
    expect(response).toBeInstanceOf(NextResponse);
  });
});
