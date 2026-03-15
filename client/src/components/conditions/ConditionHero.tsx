'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ConditionHeroProps {
  title: string
  subtitle?: string
  description: string
  imageAlt?: string
  imagePath?: string
}

const ConditionHero = ({ title, subtitle, description }: ConditionHeroProps) => {
  return (
    <section className="relative overflow-hidden hero-pastel-bg">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary-100/12 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-primary-50/15 blur-[80px]" />
      </div>
      <div className="container-custom relative z-10 py-20 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-primary-600 text-sm font-medium tracking-[0.2em] uppercase mb-4"
          >
            Expert care
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5 }}
            className="text-4xl lg:text-5xl font-bold text-gray-900 font-display leading-tight tracking-tight mb-6"
          >
            {title}
            {subtitle && <span className="block text-primary-600 mt-2">{subtitle}</span>}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="text-lg text-gray-500 leading-relaxed"
          >
            {description}
          </motion.p>
        </div>
      </div>
    </section>
  )
}

export default ConditionHero
