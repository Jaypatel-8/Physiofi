import { CONDITIONS } from '@/data/conditions'

export interface HomeConditionItem {
  name: string
  slug: string
  href: string
  color: string
  iconColor: string
  iconSrc: string
}

const HOME_ICON_SRC_BY_SLUG: Record<string, string> = {
  'low-back-pain': '/icons/conditions/back-pain-icon.png',
  'neck-pain': '/icons/conditions/neck-pain-icon.png',
  'shoulder-pain': '/icons/conditions/shoulder-pain-icon.png',
  'knee-pain': '/icons/conditions/knee-pain-icon.png',
  'sports-injuries': '/icons/conditions/sports-injuries-icon.png',
  'post-operative': '/icons/conditions/post-operative-icon.png',
  'stroke-rehabilitation': '/icons/conditions/stroke-rehabilitation-icon.png',
  parkinsons: '/icons/conditions/parkinsons-icon.png',
  'spinal-cord-injury': '/icons/conditions/spinal-cord-injury-icon.png',
  'copd-asthma': '/icons/conditions/copd-asthma-icon.png',
  'post-covid': '/icons/conditions/post-covid-icon.png',
  'pediatric-developmental': '/icons/conditions/pediatric-developmental-icon.png',
  torticollis: '/icons/conditions/torticollis-icon.png',
  'balance-problems': '/icons/conditions/balance-problems-icon.png',
  osteoporosis: '/icons/conditions/osteoporosis-icon.png',
  'pregnancy-pain': '/icons/conditions/pregnancy-pain-icon.png',
  'urinary-incontinence': '/icons/conditions/urinary-incontinence-icon.png',
}

const HOME_STYLE_OVERRIDES: Record<string, { color: string; iconColor: string }> = {
  'neck-pain': { color: 'bg-pastel-blue-50', iconColor: 'text-pastel-blue-600' },
  'shoulder-pain': { color: 'bg-pastel-mint-50', iconColor: 'text-pastel-mint-600' },
  'post-operative': { color: 'bg-pastel-sage-50', iconColor: 'text-pastel-sage-600' },
  'stroke-rehabilitation': { color: 'bg-primary-50', iconColor: 'text-primary-600' },
  parkinsons: { color: 'bg-pastel-blue-50', iconColor: 'text-pastel-blue-600' },
  'spinal-cord-injury': { color: 'bg-pastel-mint-50', iconColor: 'text-pastel-mint-600' },
  'post-covid': { color: 'bg-pastel-peach-50', iconColor: 'text-pastel-peach-600' },
}

export const HOME_CONDITIONS: HomeConditionItem[] = CONDITIONS.map((condition) => {
  const style = HOME_STYLE_OVERRIDES[condition.slug] ?? {
    color: condition.color,
    iconColor: condition.iconColor,
  }
  return {
    ...condition,
    ...style,
    iconSrc: HOME_ICON_SRC_BY_SLUG[condition.slug] ?? '/icons/conditions/back-pain-icon.png',
  }
})
