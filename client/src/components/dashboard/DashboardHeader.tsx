'use client'

import { motion } from 'framer-motion'
import { User } from '@/types/auth'

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  user?: User | null
  greeting?: string
}

const DashboardHeader = ({ title, subtitle, user, greeting }: DashboardHeaderProps) => {
  const getGreeting = () => {
    if (greeting) return greeting
    
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const getUserName = () => {
    if (user?.name) {
      return user.name.split(' ')[0] // First name only
    }
    return 'User'
  }

  const getTitle = () => {
    if (title) return title
    
    if (user?.role === 'patient') {
      return 'Patient Dashboard'
    } else if (user?.role === 'doctor') {
      return 'Doctor Dashboard'
    } else if (user?.role === 'admin') {
      return 'Admin Dashboard'
    }
    return 'Dashboard'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white py-16 px-4 overflow-hidden"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-800/20 to-transparent"></div>
      
      {/* Content */}
      <div className="container-custom max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-3"
            >
              <div className="w-1 h-8 bg-white/30 rounded-full"></div>
              <p className="text-primary-100 text-sm font-semibold uppercase tracking-wider">
                {getTitle()}
              </p>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-black mb-3 leading-tight text-white"
            >
              {getGreeting()}, {getUserName()}!
            </motion.h1>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-primary-100 text-lg md:text-xl max-w-2xl leading-relaxed"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-slate-50/30"></div>
    </motion.div>
  )
}

export default DashboardHeader
