'use client'

import { motion } from 'framer-motion'

interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color: string
  onClick?: () => void
  trend?: {
    value: number
    isPositive: boolean
  }
}

const StatsCard = ({ title, value, icon, color, onClick, trend }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl cursor-pointer shadow-xl hover:shadow-2xl border-2 transition-all duration-300 ${color}`}
      style={{ 
        borderColor: color.includes('blue') ? 'rgba(147, 197, 253, 0.6)' :
                    color.includes('purple') ? 'rgba(196, 181, 253, 0.6)' :
                    color.includes('green') ? 'rgba(187, 247, 208, 0.6)' :
                    color.includes('pink') ? 'rgba(251, 182, 206, 0.6)' :
                    color.includes('cyan') ? 'rgba(165, 243, 252, 0.6)' :
                    color.includes('indigo') ? 'rgba(196, 181, 253, 0.6)' :
                    color.includes('emerald') ? 'rgba(167, 243, 208, 0.6)' :
                    'rgba(203, 213, 225, 0.6)'
      }}
    >
      {/* Subtle overlay on hover */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
      
      {/* Content */}
      <div className="relative p-7 z-10">
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <p className="text-gray-700 text-xs font-bold uppercase tracking-widest mb-3">{title}</p>
            <motion.p 
              className="text-5xl font-black mb-2 leading-none text-gray-900"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
            >
              {value}
            </motion.p>
            {trend && (
              <div className={`flex items-center gap-1.5 text-sm font-bold mt-3 px-3 py-1.5 rounded-lg ${
                trend.isPositive ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                <span>{trend.isPositive ? '↑' : '↓'}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          <motion.div 
            className="relative z-10"
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-white transition-all duration-300 shadow-lg border-2 border-white/50">
              <div className="text-gray-800">
                {icon}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
    </motion.div>
  )
}

export default StatsCard
