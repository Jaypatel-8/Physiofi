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
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
      {subtitle && (
        <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
      )}
    </motion.div>
  )
}
