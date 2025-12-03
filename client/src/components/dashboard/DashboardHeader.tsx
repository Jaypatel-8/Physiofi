'use client'

import { motion } from 'framer-motion'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
}

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500 text-white py-8 shadow-lg"
    >
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {subtitle && <p className="text-white/90">{subtitle}</p>}
      </div>
    </motion.div>
  )
}

export default DashboardHeader
