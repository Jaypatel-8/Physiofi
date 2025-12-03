'use client'

import { motion } from 'framer-motion'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  color?: string
}

const StatsCard = ({ title, value, icon, color = 'bg-primary-500' }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && (
          <div className={`${color} p-3 rounded-lg`}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default StatsCard
