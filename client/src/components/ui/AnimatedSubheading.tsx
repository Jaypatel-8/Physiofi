'use client'

import { motion } from 'framer-motion'

interface AnimatedSubheadingProps {
  as?: 'p' | 'div' | 'span'
  children: React.ReactNode
  className?: string
  delay?: number
  animateOnMount?: boolean
}

const defaultTransition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] }

export function AnimatedSubheading({
  as: Tag = 'p',
  children,
  className = '',
  delay = 0.08,
  animateOnMount = false,
}: AnimatedSubheadingProps) {
  const MotionTag = motion[Tag] as typeof motion.div
  const initial = { opacity: 0, y: 16 }
  const animate = { opacity: 1, y: 0 }
  const viewport = { once: true, margin: '-40px' as const }
  const transition = { ...defaultTransition, delay }

  if (animateOnMount) {
    return (
      <MotionTag
        initial={initial}
        animate={animate}
        transition={transition}
        className={className}
      >
        {children}
      </MotionTag>
    )
  }

  return (
    <MotionTag
      initial={initial}
      whileInView={animate}
      viewport={viewport}
      transition={transition}
      className={className}
    >
      {children}
    </MotionTag>
  )
}
