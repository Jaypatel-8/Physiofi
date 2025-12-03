'use client'

import { motion } from 'framer-motion'

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  user?: any
  greeting?: string
}

const DashboardHeader = ({ title, subtitle, user, greeting }: DashboardHeaderProps) => {
  const getGreeting = () => {
    if (greeting) return greeting
    if (!user) return ''
    
    const firstName = user.name?.split(' ')[0] || 'User'
    const role = user.role || ''
    
    if (role === 'patient') {
      return `Hello ${firstName}! 👋`
    } else if (role === 'doctor') {
      return `Hello Dr. ${firstName}! 👨‍⚕️`
    } else if (role === 'admin') {
      return `Hello ${firstName}! 👨‍💼`
    }
    return `Hello ${firstName}!`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 text-white py-12 shadow-2xl overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full -ml-36 -mb-36 blur-3xl"></div>
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {greeting || user ? (
            <h1 className="text-4xl lg:text-5xl font-black mb-3 font-display tracking-tight text-white">
              {getGreeting()}
            </h1>
          ) : title ? (
            <h1 className="text-4xl lg:text-5xl font-black mb-3 font-display tracking-tight text-white">{title}</h1>
          ) : null}
          {subtitle && (
            <p className="text-white/95 text-lg lg:text-xl max-w-2xl leading-relaxed">{subtitle}</p>
          )}
          {user && (
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Online</span>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default DashboardHeader
