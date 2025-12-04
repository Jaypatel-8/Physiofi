'use client'

import { motion } from 'framer-motion'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  color?: string
  trend?: number
  onClick?: () => void
}

const StatsCard = ({ title, value, icon, color = 'bg-primary-500', trend, onClick }: StatsCardProps) => {
  const CardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">{title}</p>
          <p className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1">
              <ArrowTrendingUpIcon className={`h-4 w-4 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`${color} p-4 rounded-2xl shadow-lg`}
          >
            {icon}
          </motion.div>
        )}
      </div>
      {onClick && (
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-primary-600 font-semibold">View Details →</p>
        </div>
      )}
    </motion.div>
  )

  return CardContent
}

export default StatsCard
