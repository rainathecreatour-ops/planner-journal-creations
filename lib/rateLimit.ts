type RateLimitOptions = {
  windowMs: number;
  max: number;
};

type RateEntry = {
  count: number;
  expiresAt: number;
};

const store = new Map<string, RateEntry>();

export function rateLimit(key: string, options: RateLimitOptions) {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || entry.expiresAt < now) {
    store.set(key, { count: 1, expiresAt: now + options.windowMs });
    return { allowed: true, remaining: options.max - 1 };
  }
  if (entry.count >= options.max) {
    return { allowed: false, remaining: 0 };
  }
  entry.count += 1;
  store.set(key, entry);
  return { allowed: true, remaining: options.max - entry.count };
}
