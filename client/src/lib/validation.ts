/**
 * Client-side validation helpers.
 * Indian mobile: 10 digits, must start with 6, 7, 8, or 9.
 */

/** Normalize phone to digits only (strip +91, spaces, dashes). */
export function normalizePhone(value: string): string {
  return value.replace(/\D/g, '')
}

/** Indian mobile: exactly 10 digits, first digit 6–9. */
export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/

export function isValidIndianMobile(value: string): boolean {
  const digits = normalizePhone(value)
  if (digits.length === 10) return INDIAN_MOBILE_REGEX.test(digits)
  if (digits.length === 12 && digits.startsWith('91')) return INDIAN_MOBILE_REGEX.test(digits.slice(2))
  return false
}

export function getIndianMobileError(value: string): string | null {
  const digits = normalizePhone(value)
  if (!digits.length) return 'Phone number is required'
  if (digits.length !== 10) return 'Enter a valid 10-digit Indian mobile number'
  if (!/^[6-9]/.test(digits)) return 'Indian mobile number must start with 6, 7, 8, or 9'
  return null
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test((value || '').trim())
}

/** Restrict input to digits only (for phone). Max length 10, optional +91 prefix. */
export function formatPhoneInput(value: string, maxDigits = 10): string {
  const digits = value.replace(/\D/g, '').slice(0, maxDigits)
  return digits
}
