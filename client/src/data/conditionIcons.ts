/**
 * Condition icons are PNG files in public/icons/conditions/ named by slug.
 * Example: low-back-pain.png, neck-pain.png, shoulder-pain.png, etc.
 * Each condition card loads the icon from this path; add PNGs for each slug.
 */

const ICONS_BASE = '/icons/conditions'

/** Returns the public path for a condition's PNG icon. File must be named {slug}.png */
export function getConditionIconPath(slug: string): string {
  return `${ICONS_BASE}/${slug}.png`
}

/** All condition slugs that have a corresponding PNG icon path */
export const CONDITION_ICON_SLUGS = [
  'low-back-pain',
  'neck-pain',
  'shoulder-pain',
  'knee-pain',
  'sports-injuries',
  'post-operative',
  'stroke-rehabilitation',
  'parkinsons',
  'spinal-cord-injury',
  'copd-asthma',
  'post-covid',
  'pediatric-developmental',
  'torticollis',
  'balance-problems',
  'osteoporosis',
  'pregnancy-pain',
  'urinary-incontinence',
] as const
