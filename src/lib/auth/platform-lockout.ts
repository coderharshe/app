type AttemptState = {
  count: number;
  lockedUntil: number;
};

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;
const attempts = new Map<string, AttemptState>();

export function checkLoginLock(email: string): { locked: boolean; retryAfterMs?: number } {
  const key = email.toLowerCase();
  const current = attempts.get(key);
  if (!current) {
    return { locked: false };
  }

  const now = Date.now();
  if (current.lockedUntil > now) {
    return { locked: true, retryAfterMs: current.lockedUntil - now };
  }

  return { locked: false };
}

export function markLoginFailure(email: string) {
  const key = email.toLowerCase();
  const current = attempts.get(key) ?? { count: 0, lockedUntil: 0 };
  current.count += 1;
  if (current.count >= MAX_ATTEMPTS) {
    current.lockedUntil = Date.now() + LOCK_MS;
    current.count = 0;
  }
  attempts.set(key, current);
}

export function resetLoginFailure(email: string) {
  attempts.delete(email.toLowerCase());
}
