import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSupabaseBrowserClient } from '../../../src/shared/infrastructure/supabase/client';
import { createSupabaseServerClient } from '../../../src/shared/infrastructure/supabase/server';
import { updateSession } from '../../../src/shared/infrastructure/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

describe('Supabase Client Factories & Persistence Setup', () => {
  const originalEnv = { ...process.env };
  const mockUrl = 'https://example.supabase.co';
  const mockAnonKey = 'mock-anon-key-12345';

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('createSupabaseBrowserClient', () => {
    it('should be exported as a function', () => {
      expect(typeof createSupabaseBrowserClient).toBe('function');
    });

    it('should create a browser client when valid params are provided', () => {
      const client = createSupabaseBrowserClient(mockUrl, mockAnonKey);
      expect(client).toBeDefined();
      expect(client.auth).toBeDefined();
    });

    it('should fallback to process.env variables when params are omitted', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = mockUrl;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = mockAnonKey;

      const client = createSupabaseBrowserClient();
      expect(client).toBeDefined();
      expect(client.auth).toBeDefined();
    });

    it('should throw an error if environment variables or params are missing', () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      expect(() => createSupabaseBrowserClient()).toThrow('Missing Supabase environment variables');
    });
  });

  describe('createSupabaseServerClient', () => {
    it('should be exported as a function', () => {
      expect(typeof createSupabaseServerClient).toBe('function');
    });

    it('should create a server client when valid params are provided', async () => {
      const { cookies } = await import('next/headers');
      vi.mocked(cookies).mockResolvedValue({
        getAll: vi.fn().mockReturnValue([]),
        set: vi.fn(),
      } as any);

      const client = await createSupabaseServerClient(mockUrl, mockAnonKey);
      expect(client).toBeDefined();
      expect(client.auth).toBeDefined();
    });

    it('should fallback to process.env variables when params are omitted', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = mockUrl;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = mockAnonKey;

      const { cookies } = await import('next/headers');
      vi.mocked(cookies).mockResolvedValue({
        getAll: vi.fn().mockReturnValue([]),
        set: vi.fn(),
      } as any);

      const client = await createSupabaseServerClient();
      expect(client).toBeDefined();
      expect(client.auth).toBeDefined();
    });

    it('should throw an error if environment variables or params are missing', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      await expect(createSupabaseServerClient()).rejects.toThrow('Missing Supabase environment variables');
    });
  });

  describe('updateSession middleware', () => {
    it('should be exported as a function', () => {
      expect(typeof updateSession).toBe('function');
    });

    it('should process session updates and return a NextResponse', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = mockUrl;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = mockAnonKey;

      const request = new NextRequest(new URL('https://example.com/dashboard'), {
        headers: new Headers(),
      });

      const response = await updateSession(request, mockUrl, mockAnonKey);
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should throw an error if environment variables are missing', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const request = new NextRequest(new URL('https://example.com/dashboard'));

      await expect(updateSession(request)).rejects.toThrow('Missing Supabase environment variables');
    });
  });
});
