'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { User } from '@/types/auth'
import UserAvatar from './UserAvatar'

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  user?: User | null
  greeting?: string
  /** Softer style for doctor/admin dashboards */
  variant?: 'default' | 'compact'
}

const DashboardHeader = ({ title, subtitle, user, greeting, variant = 'default' }: DashboardHeaderProps) => {
  const isCompact = variant === 'compact'
  const getGreeting = () => {
    if (greeting) return greeting
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const getUserName = () => {
    if (user?.name) return user.name.trim().split(' ')[0]
    return 'User'
  }

  const getTitle = () => {
    if (title) return title
    if (user?.role === 'patient') return 'Patient Dashboard'
    if (user?.role === 'doctor') return 'Doctor Dashboard'
    if (user?.role === 'admin') return 'Admin Dashboard'
    return 'Dashboard'
  }

  const profileHref = user?.role === 'patient' ? '/patient/profile' : user?.role === 'doctor' ? '/doctor/profile' : null

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`relative overflow-hidden ${isCompact
        ? 'border-b border-gray-100 bg-transparent py-6 lg:py-8 px-0'
        : 'border-b border-primary-200/40 bg-gradient-to-br from-primary-50/90 via-white to-pastel-blue-50/80 py-10 lg:py-14 px-4'
      }`}
    >
      <div className={isCompact ? 'relative z-10' : 'container-custom max-w-7xl mx-auto relative z-10'}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-start gap-4">
            {profileHref ? (
              <Link
                href={profileHref}
                className="flex items-start gap-4 rounded-xl hover:bg-white/50 -m-2 p-2 transition-colors"
                title="View profile"
              >
                <UserAvatar name={user?.name} size={isCompact ? 'md' : 'lg'} className="mt-0.5 shrink-0" />
                <div>
                  <p className={`mb-1 ${isCompact ? 'text-gray-400 text-[11px] font-medium uppercase tracking-widest' : 'text-primary-600 text-xs font-semibold uppercase tracking-widest mb-1.5'}`}>
                    {getTitle()}
                  </p>
                  <h1 className={`tracking-tight mb-0.5 ${isCompact ? 'text-2xl md:text-3xl font-semibold text-gray-900' : 'text-3xl md:text-4xl font-extrabold text-gray-900'}`}>
                    {getGreeting()}, <span className={isCompact ? 'text-primary-600 font-medium' : 'text-primary-600'}>{getUserName()}</span>
                  </h1>
                  {subtitle && (
                    <p className={`max-w-xl leading-relaxed ${isCompact ? 'text-gray-500 text-sm' : 'text-gray-600 text-sm md:text-base mt-0.5'}`}>
                      {subtitle}
                    </p>
                  )}
                </div>
              </Link>
            ) : (
              <>
                <UserAvatar name={user?.name} size={isCompact ? 'md' : 'lg'} className="mt-0.5 shrink-0" />
                <div>
                  <p className={`mb-1 ${isCompact ? 'text-gray-400 text-[11px] font-medium uppercase tracking-widest' : 'text-primary-600 text-xs font-semibold uppercase tracking-widest mb-1.5'}`}>
                    {getTitle()}
                  </p>
                  <h1 className={`tracking-tight mb-0.5 ${isCompact ? 'text-2xl md:text-3xl font-semibold text-gray-900' : 'text-3xl md:text-4xl font-extrabold text-gray-900'}`}>
                    {getGreeting()}, <span className={isCompact ? 'text-primary-600 font-medium' : 'text-primary-600'}>{getUserName()}</span>
                  </h1>
                  {subtitle && (
                    <p className={`max-w-xl leading-relaxed ${isCompact ? 'text-gray-500 text-sm' : 'text-gray-600 text-sm md:text-base mt-0.5'}`}>
                      {subtitle}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default DashboardHeader
