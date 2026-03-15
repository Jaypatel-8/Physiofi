'use client'

import { motion } from 'framer-motion'

const DASHBOARD_PALETTE = [
  { bg: 'bg-primary-50', iconBg: 'bg-primary-100', iconColor: 'text-primary-600', border: 'border-primary-200/50' },
  { bg: 'bg-pastel-blue-50', iconBg: 'bg-pastel-blue-100', iconColor: 'text-pastel-blue-600', border: 'border-pastel-blue-200/50' },
  { bg: 'bg-pastel-mint-50', iconBg: 'bg-pastel-mint-100', iconColor: 'text-pastel-mint-600', border: 'border-pastel-mint-200/50' },
  { bg: 'bg-pastel-lavender-50', iconBg: 'bg-pastel-lavender-100', iconColor: 'text-pastel-lavender-600', border: 'border-pastel-lavender-200/50' },
  { bg: 'bg-pastel-peach-50', iconBg: 'bg-pastel-peach-100', iconColor: 'text-pastel-peach-600', border: 'border-pastel-peach-200/50' },
  { bg: 'bg-pastel-sage-50', iconBg: 'bg-pastel-sage-100', iconColor: 'text-pastel-sage-600', border: 'border-pastel-sage-200/50' },
]

interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color: string
  onClick?: () => void
  trend?: { value: number; isPositive: boolean }
  index?: number
}

const StatsCard = ({ title, value, icon, onClick, trend, index = 0 }: StatsCardProps) => {
  const style = DASHBOARD_PALETTE[index % DASHBOARD_PALETTE.length]
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04 }}
      onClick={onClick}
      className={`group relative site-card p-4 ${style.bg} ${style.border} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500 mb-0.5">{title}</p>
          <p className="text-xl site-card-title tabular-nums">{value}</p>
          {trend && (
            <span className={`inline-block mt-2 text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${style.iconBg} ${style.iconColor} opacity-90`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

export default StatsCard
