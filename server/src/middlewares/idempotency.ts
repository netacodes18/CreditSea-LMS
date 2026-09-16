import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { IdempotencyKey, IdempotencyStatus } from '../models/IdempotencyKey';

const HEADER = 'idempotency-key';
const MAX_KEY_LENGTH = 128;

// Recursively sorts object keys so the same logical payload always serializes identically
// regardless of insertion order (JSON.stringify's own replacer-array form only filters keys,
// it doesn't sort them — a plain JSON.stringify(obj, Object.keys(obj).sort()) is a no-op here).
const stableStringify = (value: unknown): string => {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }
  if (value !== null && typeof value === 'object') {
    const keys = Object.keys(value as Record<string, unknown>).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify((value as Record<string, unknown>)[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
};

const hashRequest = (req: Request): string => {
  const payload = stableStringify({ params: req.params, body: req.body });
  return crypto.createHash('sha256').update(`${req.method} ${req.originalUrl}\n${payload}`).digest('hex');
};

/**
 * Deduplicates a financial mutation by an `Idempotency-Key` request header, the pattern used by
 * payment processors (Stripe, Razorpay) for exactly this reason: a client retry after a dropped
 * response, or a double-tap on a slow connection, must not record the same payment twice.
 *
 * - No header -> passes through unchanged (the endpoint's own guards, e.g. the unique UTR index,
 *   are still the backstop).
 * - New key -> claimed atomically via a unique index, the real handler runs, and the response is
 *   cached against the key on success/expected-failure so a retry replays it instead of reprocessing.
 * - Same key + same request body, already completed -> replays the stored response (same status,
 *   same body) without touching the database again.
 * - Same key + different request body -> 422, refuses to reuse a key across two distinct payments.
 * - Same key, still processing (a genuine concurrent duplicate) -> 409.
 * - A key from a different user -> 403 (defense in depth; UUID collision is not realistically
 *   how this would happen, but a key must never let one user read another's cached response).
 * - Handler ends in a 5xx -> the claim is deleted so a real retry can go through cleanly instead
 *   of being stuck replaying a server error forever.
 */
export const idempotency = (endpoint: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const rawKey = req.header(HEADER);
    if (!rawKey) {
      next();
      return;
    }

    const key = rawKey.trim();
    if (!key || key.length > MAX_KEY_LENGTH) {
      res.status(400).json({ success: false, message: `${HEADER} header must be 1-${MAX_KEY_LENGTH} characters.` });
      return;
    }

    const userId = req.user!.id;
    const requestHash = hashRequest(req);

    try {
      await IdempotencyKey.create({ key, userId, endpoint, requestHash, status: IdempotencyStatus.PROCESSING });
    } catch (error: any) {
      if (error.code !== 11000) {
        res.status(500).json({ success: false, message: 'Failed to process idempotency key.' });
        return;
      }

      const existing = await IdempotencyKey.findOne({ key });
      if (!existing || String(existing.userId) !== String(userId)) {
        res.status(403).json({ success: false, message: 'Invalid idempotency key.' });
        return;
      }
      if (existing.requestHash !== requestHash) {
        res.status(422).json({ success: false, message: 'This Idempotency-Key was already used for a different request.' });
        return;
      }
      if (existing.status === IdempotencyStatus.PROCESSING) {
        res.status(409).json({ success: false, message: 'A request with this Idempotency-Key is already being processed.' });
        return;
      }
      // COMPLETED with a matching payload: replay the original result instead of reprocessing.
      res.status(existing.responseStatus || 200).json(existing.responseBody);
      return;
    }

    // Intercept the eventual response so it can be cached (or the claim dropped on a server error).
    const originalJson = res.json.bind(res);
    res.json = ((body: unknown) => {
      const status = res.statusCode;
      const settle = status >= 500
        ? IdempotencyKey.deleteOne({ key })
        : IdempotencyKey.updateOne({ key }, { status: IdempotencyStatus.COMPLETED, responseStatus: status, responseBody: body });
      settle.catch((err) => console.error('idempotency settle error', err));
      return originalJson(body);
    }) as typeof res.json;

    next();
  };
};
