import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'planner_access';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
  return process.env.ACCESS_CODE_SECRET ?? 'dev-secret-change-me';
}

export function createAccessToken(code: string) {
  const issuedAt = Date.now();
  const payload = `${code}:${issuedAt}`;
  const signature = crypto
    .createHmac('sha256', getSecret())
    .update(payload)
    .digest('hex');
  return `${payload}:${signature}`;
}

export function verifyAccessToken(token: string | undefined) {
  if (!token) return false;
  const parts = token.split(':');
  if (parts.length !== 3) return false;
  const [code, issuedAt, signature] = parts;
  const payload = `${code}:${issuedAt}`;
  const expected = crypto
    .createHmac('sha256', getSecret())
    .update(payload)
    .digest('hex');
  if (expected !== signature) return false;
  const ageSeconds = (Date.now() - Number(issuedAt)) / 1000;
  return ageSeconds < SESSION_TTL_SECONDS;
}

export function readAccessCookie() {
  const cookieStore = cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export function setAccessCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_TTL_SECONDS,
    path: '/'
  });
}

export function clearAccessCookie() {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  });
}
