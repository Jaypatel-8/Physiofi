'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bars3Icon, 
  XMarkIcon, 
  PhoneIcon, 
  UserIcon,
  HomeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import NotificationBell from '@/components/ui/NotificationBell'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const submenuRef = useRef<HTMLDivElement>(null)

  // Handle client-side mounting to prevent hydration errors
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
        setOpenSubmenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const servicesSubmenu = [
    { name: 'Home Visit', href: '/services/home-visit' },
    { name: 'Tele-Consultation', href: '/services/tele-consultation' },
    { name: 'Advanced Therapies', href: '/services/advanced-therapies' },
  ]

  const diseasesSubmenu = [
    { name: 'Low Back Pain / Sciatica', href: '/conditions/low-back-pain' },
    { name: 'Neck Pain / Cervical Spondylosis', href: '/conditions/neck-pain' },
    { name: 'Shoulder Pain', href: '/conditions/shoulder-pain' },
    { name: 'Knee Pain', href: '/conditions/knee-pain' },
    { name: 'Sports Injuries', href: '/conditions/sports-injuries' },
    { name: 'Post-Operative Rehabilitation', href: '/conditions/post-operative' },
    { name: 'Stroke Rehabilitation', href: '/conditions/stroke-rehabilitation' },
    { name: "Parkinson's Disease", href: '/conditions/parkinsons' },
    { name: 'Spinal Cord Injury', href: '/conditions/spinal-cord-injury' },
    { name: 'COPD / Asthma / Breathing Issues', href: '/conditions/copd-asthma' },
    { name: 'Post-COVID Recovery', href: '/conditions/post-covid' },
    { name: 'Pediatric Physiotherapy', href: '/conditions/pediatric-developmental' },
    { name: 'Torticollis (Children)', href: '/conditions/torticollis' },
    { name: 'Balance Problems (Geriatric)', href: '/conditions/balance-problems' },
    { name: 'Osteoporosis', href: '/conditions/osteoporosis' },
    { name: 'Pregnancy-Related Pain', href: '/conditions/pregnancy-pain' },
    { name: 'Urinary Incontinence', href: '/conditions/urinary-incontinence' },
  ]

  const navigation: Array<{
    name: string
    href: string
    colorClass: string
    hasSubmenu?: boolean
    submenu?: Array<{ name: string; href: string }>
  }> = [
    { name: 'Home', href: '/', colorClass: 'bg-primary-300' },
    { name: 'About', href: '/about', colorClass: 'bg-secondary-300' },
    { name: 'Services', href: '/services', colorClass: 'bg-tertiary-300', hasSubmenu: true, submenu: servicesSubmenu },
    { name: 'Diseases', href: '/conditions', colorClass: 'bg-accent-300', hasSubmenu: true, submenu: diseasesSubmenu },
    { name: 'Career', href: '/career', colorClass: 'bg-primary-300' },
    { name: 'Contact', href: '/contact', colorClass: 'bg-secondary-300' },
  ]

  const handleLogout = () => {
    // Logout function already clears localStorage, just call it
    logout()
    // Redirect to home page immediately
    window.location.replace('/')
  }

  const handleCloseSubmenu = () => {
    setOpenSubmenu(null)
  }

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleToggleSubmenu = (itemName: string) => {
    setOpenSubmenu(openSubmenu === itemName ? null : itemName)
  }

  const handleCloseMenu = () => {
    setIsMenuOpen(false)
    setOpenSubmenu(null)
  }

  const getDashboardLinkFromUser = (userData: any): string => {
    if (!userData || !userData.role) {
      return '/login'
    }
    
    switch (userData.role) {
      case 'patient':
        return '/patient/dashboard'
      case 'doctor':
        return '/doctor/dashboard'
      case 'admin':
        return '/admin/dashboard'
      default:
        return '/login'
    }
  }

  const handleDashboardClick = () => {
    let dashboardLink = '/login'
    
    // Check user state first (most reliable)
    if (user && user.role) {
      dashboardLink = getDashboardLinkFromUser(user)
    } else if (typeof window !== 'undefined' && isMounted) {
      // Fallback to localStorage
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          dashboardLink = getDashboardLinkFromUser(parsedUser)
        }
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
    
    // Redirect
    if (dashboardLink && dashboardLink !== '/login') {
      console.log('Redirecting to:', dashboardLink)
      window.location.href = dashboardLink
    } else {
      window.location.href = '/login'
    }
  }

  const getDashboardLink = () => {
    // Check user state first (most reliable)
    if (user && user.role) {
      switch (user.role) {
        case 'patient':
          return '/patient/dashboard'
        case 'doctor':
          return '/doctor/dashboard'
        case 'admin':
          return '/admin/dashboard'
        default:
          return '/login'
      }
    }
    
    // Fallback: check localStorage if user state not ready yet (only on client after mount)
    if (isMounted && typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          if (parsedUser && parsedUser.role) {
            switch (parsedUser.role) {
              case 'patient':
                return '/patient/dashboard'
              case 'doctor':
                return '/doctor/dashboard'
              case 'admin':
                return '/admin/dashboard'
              default:
                return '/login'
            }
          }
        }
      } catch (e) {
        // Invalid user data, fall through to return /login
        console.error('Error parsing user data:', e)
      }
    }
    
    return '/login'
  }

  const getDashboardIcon = () => {
    if (!user) return <UserIcon className="h-5 w-5" />
    
    switch (user.role) {
      case 'patient':
        return <UserIcon className="h-5 w-5" />
      case 'doctor':
        return <UserGroupIcon className="h-5 w-5" />
      case 'admin':
        return <Cog6ToothIcon className="h-5 w-5" />
      default:
        return <UserIcon className="h-5 w-5" />
    }
  }

  // Only patients (or guests) see full website menu; doctors and admins see only dashboard + logout
  const getEffectiveRole = (): string | null => {
    if (user?.role) return user.role
    if (isMounted && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('user')
        if (stored) return JSON.parse(stored)?.role ?? null
      } catch { /* ignore */ }
    }
    return null
  }
  const effectiveRole = getEffectiveRole()
  const showWebsiteNavigation =
    !isMounted ||
    typeof window === 'undefined' ||
    !effectiveRole ||
    effectiveRole === 'patient'

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100/50 transition-all duration-300"
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/Physiofi Logo(1).png"
                alt="PhysioFi Logo"
                width={120}
                height={50}
                className="object-contain"
                style={{ width: 'auto', height: 'auto', maxWidth: '120px' }}
                priority
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation - full website menu only for guests and patients; doctors/admins see only dashboard */}
          {showWebsiteNavigation ? (
          <nav className="hidden lg:flex items-center space-x-1" ref={submenuRef}>
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
                onMouseEnter={() => item.hasSubmenu && setOpenSubmenu(item.name)}
                onMouseLeave={() => item.hasSubmenu && setOpenSubmenu(null)}
              >
                {item.hasSubmenu ? (
                  <div className="relative">
                    <button
                      className="font-semibold relative group transition-all duration-300 hover:text-primary-600 flex items-center gap-1.5 text-gray-800 px-4 py-2 rounded-xl hover:bg-primary-50/50"
                    >
                      {item.name}
                      <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${openSubmenu === item.name ? 'rotate-180 text-primary-600' : ''}`} />
                      <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r ${item.colorClass} transition-all duration-500 group-hover:w-3/4 rounded-full`}></span>
                    </button>
                    
                    <AnimatePresence>
                      {openSubmenu === item.name && item.submenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100/50 overflow-hidden z-50"
                        >
                          <div className="py-2">
                            {item.submenu.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                href={subItem.href}
                                className="block px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100/50 hover:text-primary-700 transition-all duration-200 group/item"
                                onClick={handleCloseSubmenu}
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary-300 opacity-0 group-hover/item:opacity-100 transition-opacity"></span>
                                  {subItem.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : item.href.startsWith('#') ? (
                    <a
                      href={item.href}
                      className="font-semibold relative group transition-all duration-300 hover:text-primary-600 text-gray-800 px-4 py-2 rounded-xl hover:bg-primary-50/50"
                    >
                    {item.name}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r ${item.colorClass} transition-all duration-500 group-hover:w-3/4 rounded-full`}></span>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="font-semibold relative group transition-all duration-300 hover:text-primary-600 text-gray-800 px-4 py-2 rounded-xl hover:bg-primary-50/50"
                  >
                    {item.name}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r ${item.colorClass} transition-all duration-500 group-hover:w-3/4 rounded-full`}></span>
                  </Link>
                )}
              </motion.div>
            ))}
          </nav>
          ) : (
            <nav className="hidden lg:flex items-center">
              <span className="text-sm font-semibold text-gray-500">Dashboard</span>
            </nav>
          )}

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {typeof window === 'undefined' || !isMounted || !user || !user.role ? (
              // Always render Login during SSR and initial render to prevent hydration mismatch
              <Link
                href="/login"
                className="group relative bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <span className="relative z-10">Login</span>
              </Link>
            ) : (
              // Show dashboard/logout only after mount and if user is authenticated
              <div className="flex items-center space-x-3">
                <NotificationBell />
                <button
                  type="button"
                  onClick={handleDashboardClick}
                  className="group relative flex items-center space-x-2 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <span className="relative z-10">{getDashboardIcon()}</span>
                  <span className="relative z-10">Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 border border-transparent hover:border-red-200"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            type="button"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-primary-50 transition-all duration-300 group"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-900 group-hover:text-primary-600 transition-colors" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-900 group-hover:text-primary-600 transition-colors" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 backdrop-blur-md shadow-2xl border-t border-gray-100/50"
          >
            <div className="px-4 py-6 space-y-3">
              {showWebsiteNavigation && navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.hasSubmenu ? (
                    <div>
                      <button
                        type="button"
                        onClick={() => setOpenSubmenu(openSubmenu === item.name ? null : item.name)}
                        className="flex items-center justify-between w-full text-base font-semibold text-gray-800 hover:text-primary-600 px-4 py-3 rounded-xl hover:bg-primary-50/50 transition-all duration-300"
                      >
                        <span>{item.name}</span>
                        <ChevronDownIcon className={`h-5 w-5 transition-transform duration-300 ${openSubmenu === item.name ? 'rotate-180 text-primary-600' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openSubmenu === item.name && item.submenu && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pt-2 space-y-1">
                              {item.submenu.map((subItem, subIndex) => (
                                <Link
                                  key={subIndex}
                                  href={subItem.href}
                                  onClick={() => {
                                    setIsMenuOpen(false)
                                    setOpenSubmenu(null)
                                  }}
                                  className="block text-sm font-medium text-gray-600 hover:text-primary-600 px-4 py-2.5 rounded-lg hover:bg-primary-50/50 transition-all duration-200"
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : item.href.startsWith('#') ? (
                    <a
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-base font-semibold text-gray-800 hover:text-primary-600 px-4 py-3 rounded-xl hover:bg-primary-50/50 transition-all duration-300"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-base font-semibold text-gray-800 hover:text-primary-600 px-4 py-3 rounded-xl hover:bg-primary-50/50 transition-all duration-300"
                    >
                      {item.name}
                    </Link>
                  )}
                </motion.div>
              ))}
              
              <div className={`space-y-3 ${showWebsiteNavigation ? 'pt-4 mt-4 border-t border-gray-200' : ''}`}>
                {typeof window === 'undefined' || !isMounted || !user || !user.role ? (
                  // Always render Login during SSR and initial render to prevent hydration mismatch
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="group relative block bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-bold text-sm w-full text-center hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    <span className="relative z-10">Login</span>
                  </Link>
                ) : (
                  // Show dashboard/logout only after mount and if user is authenticated
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <NotificationBell />
                    </div>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        handleDashboardClick()
                      }}
                      className="group relative flex items-center space-x-2 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-bold text-sm w-full justify-center hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                      <span className="relative z-10">{getDashboardIcon()}</span>
                      <span className="relative z-10">Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center justify-center space-x-2 w-full px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 border border-gray-200 hover:border-red-200"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header