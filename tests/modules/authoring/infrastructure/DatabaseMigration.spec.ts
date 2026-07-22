import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Database Migrations', () => {
  it('should contain valid Phase 02 authoring migration file', () => {
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/20260722_phase02_authoring.sql');
    expect(fs.existsSync(migrationPath)).toBe(true);

    const content = fs.readFileSync(migrationPath, 'utf-8');
    expect(content).toContain('CREATE TABLE IF NOT EXISTS public.experiences');
    expect(content).toContain('CREATE TABLE IF NOT EXISTS public.stories');
    expect(content).toContain('CREATE TABLE IF NOT EXISTS public.scenes');
    expect(content).toContain('idx_experiences_access_token');
  });
});
