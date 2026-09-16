// one key per payment attempt, reused on retry so a resend can't double-pay
export function createIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // fallback for older browsers
  return `idem-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
