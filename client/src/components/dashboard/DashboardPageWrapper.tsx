'use client'

import { motion } from 'framer-motion'

interface DashboardPageWrapperProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  /** Optional action slot (e.g. "Upload" button) - right side of header */
  action?: React.ReactNode
}

/**
 * Use on dashboard sub-pages (medical records, prescriptions, etc.) for consistent
 * page title and subtitle. Same visual style as condition-style cards (pastel header strip).
 */
export default function DashboardPageWrapper({
  title,
  subtitle,
  children,
  action,
}: DashboardPageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="rounded-2xl border border-primary-200/50 bg-primary-50/80 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
      {children}
    </motion.div>
  )
}
