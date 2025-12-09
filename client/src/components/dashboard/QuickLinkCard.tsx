'use client'

import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface QuickLinkCardProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  color: string
  delay?: number
}

const QuickLinkCard = ({ href, icon, title, description, color, delay = 0 }: QuickLinkCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <Link
        href={href}
        className="group relative block bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-gray-200/50 hover:shadow-2xl hover:border-opacity-60 transition-all duration-300 overflow-hidden"
        style={{ borderColor: color.includes('blue') ? 'rgba(147, 197, 253, 0.5)' : color.includes('purple') ? 'rgba(196, 181, 253, 0.5)' : color.includes('pink') ? 'rgba(251, 182, 206, 0.5)' : 'rgba(134, 239, 172, 0.5)' }}
      >
        {/* Gradient Background on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        
        {/* Icon Container */}
        <div className={`relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <h3 className="font-bold text-gray-800 mb-1 transition-colors text-lg" style={{ 
            color: color.includes('blue') ? '#1e40af' : color.includes('purple') ? '#6b21a8' : color.includes('pink') ? '#9f1239' : '#065f46',
            transition: 'color 0.3s'
          }}>
            {title}
          </h3>
          <p className="text-sm text-gray-700 mb-3">{description}</p>
          
          {/* Arrow Indicator */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
            color: color.includes('blue') ? '#2563eb' : color.includes('purple') ? '#7c3aed' : color.includes('pink') ? '#db2777' : '#059669'
          }}>
            <span className="text-xs font-semibold">View</span>
            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
        
        {/* Shine Effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </Link>
    </motion.div>
  )
}

export default QuickLinkCard



