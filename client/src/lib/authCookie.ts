/**
 * Auth cookie helpers for middleware route protection.
 * Token is stored in cookie so Next.js middleware can read it (no localStorage access in edge).
 */

const COOKIE_NAME = 'physiofi_token'
const MAX_AGE_DAYS = 7

export function setAuthCookie(token: string) {
  if (typeof document === 'undefined') return
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60
  const secure = typeof location !== 'undefined' && location.protocol === 'https:'
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Strict${secure ? '; Secure' : ''}`
}

export function clearAuthCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Strict`
}

export function getAuthCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}
