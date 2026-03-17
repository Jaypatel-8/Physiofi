/**
 * Condition icons using Heroicons – no PNG files, so no corruption issues.
 * Each condition has one icon that matches its type.
 */

import type { ComponentType } from 'react'
import {
  CubeIcon,
  Square3Stack3DIcon,
  HandRaisedIcon,
  TrophyIcon,
  WrenchScrewdriverIcon,
  HeartIcon,
  CpuChipIcon,
  CloudIcon,
  ArrowPathIcon,
  UserGroupIcon,
  UserIcon,
  ScaleIcon,
  BeakerIcon,
  BoltIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

const CONDITION_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  'low-back-pain': CubeIcon,
  'neck-pain': Square3Stack3DIcon,
  'shoulder-pain': HandRaisedIcon,
  'knee-pain': UserIcon,
  'sports-injuries': TrophyIcon,
  'post-operative': WrenchScrewdriverIcon,
  'stroke-rehabilitation': HeartIcon,
  parkinsons: CpuChipIcon,
  'spinal-cord-injury': BoltIcon,
  'copd-asthma': CloudIcon,
  'post-covid': ArrowPathIcon,
  'pediatric-developmental': UserGroupIcon,
  torticollis: UserIcon,
  'balance-problems': ScaleIcon,
  osteoporosis: CubeIcon,
  'pregnancy-pain': HeartIcon,
  'urinary-incontinence': BeakerIcon,
}

export function getConditionIcon(slug: string): ComponentType<{ className?: string }> {
  return CONDITION_ICONS[slug] ?? CheckCircleIcon
}
