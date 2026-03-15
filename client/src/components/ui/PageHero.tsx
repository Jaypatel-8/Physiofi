'use client'

import { motion } from 'framer-motion'

interface PageHeroProps {
  label?: string
  title: string
  subtitle?: string
  children?: React.ReactNode
  className?: string
}

export default function PageHero({ label, title, subtitle, children, className = '' }: PageHeroProps) {
  return (
    <section className={`relative overflow-hidden hero-pastel-bg ${className}`}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-card-1/30 to-white" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary-100/12 blur-[100px] animate-float-slow" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[450px] h-[450px] rounded-full bg-primary-50/15 blur-[80px] animate-float-slower" />
      </div>
      <div className="container-custom relative z-10 py-20 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {label && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-primary-600 text-sm font-medium tracking-[0.2em] uppercase mb-4"
            >
              {label}
            </motion.p>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 font-display leading-[1.1] tracking-tight mb-6"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.4 }}
              className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
