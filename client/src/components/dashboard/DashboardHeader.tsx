'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  HomeIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
}

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const getUserInitials = () => {
    if (!user?.name) return 'U'
    const names = user.name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return user.name[0].toUpperCase()
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Image
                  src="/Physiofi Logo(1).png"
                  alt="PhysioFi Logo"
                  width={100}
                  height={40}
                  className="group-hover:scale-105 transition-transform duration-300 object-contain"
                  priority
                />
              </div>
            </Link>
            {(title || subtitle) && (
              <div className="hidden md:block border-l border-gray-200 pl-4">
                {title && (
                  <h1 className="text-xl font-black text-gray-900 font-display">{title}</h1>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
                )}
              </div>
            )}
          </div>

          {/* Right Side - Profile Dropdown */}
          <div className="flex items-center space-x-4" ref={profileRef}>
            <Link
              href="/"
              className="hidden md:flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-300"
            >
              <HomeIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Home</span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-primary-50 transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  {user?.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt={user.name || 'User'}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    getUserInitials()
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</div>
                  <div className="text-xs text-gray-500 capitalize">{user?.role || 'user'}</div>
                </div>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="py-2">
                      {/* Profile Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user?.profileImage ? (
                              <Image
                                src={user.profileImage}
                                alt={user.name || 'User'}
                                width={48}
                                height={48}
                                className="rounded-full"
                              />
                            ) : (
                              getUserInitials()
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            <p className="text-xs text-primary-600 capitalize mt-0.5">
                              {user?.role || 'user'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <Link
                        href={
                          user?.role === 'patient'
                            ? '/patient/profile'
                            : user?.role === 'doctor'
                            ? '/doctor/profile'
                            : '/admin/profile'
                        }
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200"
                      >
                        <UserCircleIcon className="h-5 w-5" />
                        <span>Profile</span>
                      </Link>

                      <Link
                        href={
                          user?.role === 'patient'
                            ? '/patient/settings'
                            : user?.role === 'doctor'
                            ? '/doctor/settings'
                            : '/admin/settings'
                        }
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200"
                      >
                        <Cog6ToothIcon className="h-5 w-5" />
                        <span>Settings</span>
                      </Link>

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false)
                            handleLogout()
                          }}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader

