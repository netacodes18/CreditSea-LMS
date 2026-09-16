// One key per logical payment attempt, reused across retries (e.g. after a dropped response or
// a network error) so a resend can't record the same payment twice — matches the server's
// Idempotency-Key middleware (server/src/middlewares/idempotency.ts).
export function createIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for browsers without crypto.randomUUID (non-secure contexts, very old browsers)
  return `idem-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
