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
      className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-12 px-4"
    >
      <div className="container-custom max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">
              {getGreeting()}, {getUserName()}! 👋
            </h1>
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              {getTitle()}
            </h2>
            {subtitle && (
              <p className="text-primary-100 text-lg">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default DashboardHeader
