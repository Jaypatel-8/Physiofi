'use client'

import { motion } from 'framer-motion'

interface AnimatedHeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  children: React.ReactNode
  className?: string
  /** Delay in seconds before animation starts */
  delay?: number
  /** Use animate (for above-fold) instead of whileInView (for scroll-into-view) */
  animateOnMount?: boolean
}

const defaultTransition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] }

export function AnimatedHeading({
  as: Tag = 'h2',
  children,
  className = '',
  delay = 0,
  animateOnMount = false,
}: AnimatedHeadingProps) {
  const MotionTag = motion[Tag] as typeof motion.div
  const initial = { opacity: 0, y: 20 }
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
