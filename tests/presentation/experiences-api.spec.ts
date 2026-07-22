import { describe, it, expect } from 'vitest';
import { POST as createHandler } from '../../src/app/api/v1/experiences/route';
import { GET as getHandler } from '../../src/app/api/v1/experiences/[id]/route';

describe('Experiences REST API Controllers', () => {
  it('should return 400 Bad Request on POST /api/v1/experiences with invalid payload', async () => {
    const req = new Request('http://localhost:3000/api/v1/experiences', {
      method: 'POST',
      body: JSON.stringify({ title: '' }),
    });

    const res = await createHandler(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.code).toBe('VALIDATION_ERROR');
  });

  it('should return 404 Not Found on GET /api/v1/experiences/[id] for missing ID', async () => {
    const req = new Request('http://localhost:3000/api/v1/experiences/non-existent-id', {
      method: 'GET',
    });

    const res = await getHandler(req, { params: Promise.resolve({ id: 'non-existent-id' }) });
    expect(res.status).toBe(404);
  });
});
