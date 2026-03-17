/**
 * Single source of truth for all conditions we treat.
 * Each condition has a slug used for routes and to look up its icon from conditionIcons.
 */

export interface ConditionItem {
  name: string
  slug: string
  href: string
  color: string
  iconColor: string
}

export const CONDITIONS: ConditionItem[] = [
  { name: 'Low Back Pain / Sciatica', slug: 'low-back-pain', href: '/conditions/low-back-pain', color: 'bg-primary-50', iconColor: 'text-primary-600' },
  { name: 'Neck Pain / Cervical Spondylosis', slug: 'neck-pain', href: '/conditions/neck-pain', color: 'bg-secondary-50', iconColor: 'text-secondary-600' },
  { name: 'Shoulder Pain', slug: 'shoulder-pain', href: '/conditions/shoulder-pain', color: 'bg-tertiary-50', iconColor: 'text-tertiary-600' },
  { name: 'Knee Pain', slug: 'knee-pain', href: '/conditions/knee-pain', color: 'bg-pastel-blue-50', iconColor: 'text-pastel-blue-600' },
  { name: 'Sports Injuries', slug: 'sports-injuries', href: '/conditions/sports-injuries', color: 'bg-pastel-mint-50', iconColor: 'text-pastel-mint-600' },
  { name: 'Post-Operative Rehabilitation', slug: 'post-operative', href: '/conditions/post-operative', color: 'bg-pastel-lavender-50', iconColor: 'text-pastel-lavender-600' },
  { name: 'Stroke Rehabilitation', slug: 'stroke-rehabilitation', href: '/conditions/stroke-rehabilitation', color: 'bg-pastel-peach-50', iconColor: 'text-pastel-peach-600' },
  { name: "Parkinson's Disease", slug: 'parkinsons', href: '/conditions/parkinsons', color: 'bg-pastel-sage-50', iconColor: 'text-pastel-sage-600' },
  { name: 'Spinal Cord Injury', slug: 'spinal-cord-injury', href: '/conditions/spinal-cord-injury', color: 'bg-primary-50', iconColor: 'text-primary-600' },
  { name: 'COPD / Asthma / Breathing Issues', slug: 'copd-asthma', href: '/conditions/copd-asthma', color: 'bg-pastel-lavender-50', iconColor: 'text-pastel-lavender-600' },
  { name: 'Post-COVID Recovery', slug: 'post-covid', href: '/conditions/post-covid', color: 'bg-pastel-peach-50', iconColor: 'text-pastel-peach-600' },
  { name: 'Pediatric Physiotherapy', slug: 'pediatric-developmental', href: '/conditions/pediatric-developmental', color: 'bg-pastel-sage-50', iconColor: 'text-pastel-sage-600' },
  { name: 'Torticollis (Children)', slug: 'torticollis', href: '/conditions/torticollis', color: 'bg-primary-50', iconColor: 'text-primary-600' },
  { name: 'Balance Problems (Geriatric)', slug: 'balance-problems', href: '/conditions/balance-problems', color: 'bg-pastel-blue-50', iconColor: 'text-pastel-blue-600' },
  { name: 'Osteoporosis', slug: 'osteoporosis', href: '/conditions/osteoporosis', color: 'bg-pastel-mint-50', iconColor: 'text-pastel-mint-600' },
  { name: 'Pregnancy-Related Pain', slug: 'pregnancy-pain', href: '/conditions/pregnancy-pain', color: 'bg-pastel-lavender-50', iconColor: 'text-pastel-lavender-600' },
  { name: 'Urinary Incontinence', slug: 'urinary-incontinence', href: '/conditions/urinary-incontinence', color: 'bg-pastel-peach-50', iconColor: 'text-pastel-peach-600' },
]
