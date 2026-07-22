import { describe, it, expect } from 'vitest';
import { parseEnv, envSchema } from '@/shared/config/env';
import { SYSTEM_CONSTANTS } from '@/shared/config/constants';

describe('Environment Configuration', () => {
  describe('envSchema / parseEnv', () => {
    it('validates a valid environment object with defaults', () => {
      const validInput = {
        NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key-12345',
      };

      const result = parseEnv(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.NEXT_PUBLIC_SUPABASE_URL).toBe('https://example.supabase.co');
        expect(result.data.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe('anon-key-12345');
        expect(result.data.LOG_LEVEL).toBe('info');
        expect(result.data.NODE_ENV).toBe('development');
        expect(result.data.SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
      }
    });

    it('accepts optional SUPABASE_SERVICE_ROLE_KEY and custom enum values', () => {
      const validInput = {
        NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key-12345',
        SUPABASE_SERVICE_ROLE_KEY: 'service-role-key-67890',
        LOG_LEVEL: 'debug',
        NODE_ENV: 'production',
      };

      const result = parseEnv(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.SUPABASE_SERVICE_ROLE_KEY).toBe('service-role-key-67890');
        expect(result.data.LOG_LEVEL).toBe('debug');
        expect(result.data.NODE_ENV).toBe('production');
      }
    });

    it('fails validation when NEXT_PUBLIC_SUPABASE_URL is missing or invalid URL', () => {
      const missingUrl = {
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key-12345',
      };
      const invalidUrl = {
        NEXT_PUBLIC_SUPABASE_URL: 'not-a-url',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key-12345',
      };

      expect(parseEnv(missingUrl).success).toBe(false);
      expect(parseEnv(invalidUrl).success).toBe(false);
    });

    it('fails validation when NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or empty', () => {
      const missingAnonKey = {
        NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      };
      const emptyAnonKey = {
        NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
      };

      expect(parseEnv(missingAnonKey).success).toBe(false);
      expect(parseEnv(emptyAnonKey).success).toBe(false);
    });

    it('fails validation on invalid LOG_LEVEL or NODE_ENV enum values', () => {
      const invalidEnvs = {
        NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key-12345',
        LOG_LEVEL: 'verbose',
        NODE_ENV: 'staging',
      };

      const result = parseEnv(invalidEnvs);
      expect(result.success).toBe(false);
    });
  });

  describe('SYSTEM_CONSTANTS', () => {
    it('defines expected system constants', () => {
      expect(SYSTEM_CONSTANTS.APP_NAME).toBe('Momenta');
      expect(SYSTEM_CONSTANTS.DEFAULT_TOKEN_EXPIRATION_SECONDS).toBe(3600);
      expect(SYSTEM_CONSTANTS.MAX_MESSAGE_BEATS).toBe(10);
      expect(SYSTEM_CONSTANTS.MAX_USER_DRAFTS).toBe(5);
    });
  });
});
