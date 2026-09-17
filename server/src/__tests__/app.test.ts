import request from 'supertest';
import { createApp } from '../app';

// These hit the real Express app + route wiring, but never reach the database — requireAuth
// rejects before any Mongo call, and /api/health doesn't touch it either. Safe to run without
// a MONGO_URI configured.
const app = createApp();

describe('GET /api/health', () => {
  it('returns 200 without needing a database', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('unknown routes', () => {
  it('returns 404 for a route that does not exist', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
  });
});

describe('protected routes without a token', () => {
  it('rejects /api/borrower/loans with 401', async () => {
    const res = await request(app).get('/api/borrower/loans');
    expect(res.status).toBe(401);
  });

  it('rejects /api/admin/loans with 401', async () => {
    const res = await request(app).get('/api/admin/loans');
    expect(res.status).toBe(401);
  });

  it('rejects /api/collection/loans with 401', async () => {
    const res = await request(app).get('/api/collection/loans');
    expect(res.status).toBe(401);
  });

  it('rejects /api/sales/dashboard with 401', async () => {
    const res = await request(app).get('/api/sales/dashboard');
    expect(res.status).toBe(401);
  });
});
