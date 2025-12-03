'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  color?: 'primary' | 'secondary' | 'accent' | 'purple' | 'orange' | 'green'
  trend?: {
    value: number
    isPositive: boolean
  }
  delay?: number
}

const StatsCard = ({ title, value, icon, color = 'primary', trend, delay = 0 }: StatsCardProps) => {
  const colorClasses = {
    primary: {
      bg: 'bg-gradient-to-br from-primary-50 to-primary-100',
      border: 'border-primary-200',
      iconBg: 'bg-primary-500',
      text: 'text-primary-700',
      value: 'text-primary-600'
    },
    secondary: {
      bg: 'bg-gradient-to-br from-secondary-50 to-secondary-100',
      border: 'border-secondary-200',
      iconBg: 'bg-secondary-500',
      text: 'text-secondary-700',
      value: 'text-secondary-600'
    },
    accent: {
      bg: 'bg-gradient-to-br from-accent-50 to-accent-100',
      border: 'border-accent-200',
      iconBg: 'bg-accent-500',
      text: 'text-accent-700',
      value: 'text-accent-600'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      border: 'border-purple-200',
      iconBg: 'bg-purple-500',
      text: 'text-purple-700',
      value: 'text-purple-600'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
      border: 'border-orange-200',
      iconBg: 'bg-orange-500',
      text: 'text-orange-700',
      value: 'text-orange-600'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      border: 'border-green-200',
      iconBg: 'bg-green-500',
      text: 'text-green-700',
      value: 'text-green-600'
    }
  }

  const colors = colorClasses[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`${colors.bg} ${colors.border} rounded-2xl p-6 shadow-lg border-2 hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
    >
      {/* Book Corner Effect */}
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100 opacity-50"></div>
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50 opacity-30"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 ${colors.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
            <div className="text-white">{icon}</div>
          </div>
          {trend && (
            <div className={`text-xs font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div>
          <p className={`text-sm ${colors.text} font-medium mb-1`}>{title}</p>
          <p className={`text-3xl font-black ${colors.value} font-display`}>{value}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default StatsCard






