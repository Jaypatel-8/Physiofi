'use client'

import { motion } from 'framer-motion'

interface DashboardSubPageHeaderProps {
  title: string
  subtitle?: string
}

/**
 * Use on dashboard sub-pages (appointments, patients, etc.) for consistent
 * page title. Layout provides "Back to Dashboard" and user name.
 */
export default function DashboardSubPageHeader({ title, subtitle }: DashboardSubPageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mb-6"
    >
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="text-2xl md:text-3xl font-bold text-gray-900"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="text-gray-600 text-sm mt-1"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}
