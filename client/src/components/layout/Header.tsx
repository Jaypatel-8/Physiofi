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
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const { user, logout } = useAuth()
  const router = useRouter()
  const submenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
    { name: 'Diseases', href: '#', colorClass: 'bg-accent-300', hasSubmenu: true, submenu: diseasesSubmenu },
    { name: 'Career', href: '/career', colorClass: 'bg-primary-300' },
    { name: 'Contact', href: '/contact', colorClass: 'bg-secondary-300' },
  ]

  const handleLogout = () => {
    logout()
    router.push('/')
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

  const getDashboardLink = () => {
    if (!user) return '/login'
    
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
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
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Image
                  src="/Physiofi Logo(1).png"
                  alt="PhysioFi Logo"
                  width={175}
                  height={150}
                  className="group-hover:scale-110 transition-transform duration-300"
                  priority
                />
              </div>
              
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" ref={submenuRef}>
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
                      className={`font-medium relative group transition-all duration-300 hover:text-gray-900 flex items-center gap-1 ${
                        isScrolled ? 'text-gray-900' : 'text-gray-800 drop-shadow-lg'
                      }`}
                    >
                      {item.name}
                      <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${openSubmenu === item.name ? 'rotate-180' : ''}`} />
                      <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${item.colorClass} transition-all duration-500 group-hover:w-full`}></span>
                    </button>
                    
                    <AnimatePresence>
                      {openSubmenu === item.name && item.submenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                        >
                          <div className="py-2">
                            {item.submenu.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                href={subItem.href}
                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200"
                                onClick={handleCloseSubmenu}
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
                    className={`font-medium relative group transition-all duration-300 hover:text-gray-900 ${
                      isScrolled ? 'text-gray-900' : 'text-gray-800 drop-shadow-lg'
                    }`}
                  >
                    {item.name}
                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${item.colorClass} transition-all duration-500 group-hover:w-full`}></span>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={`font-medium relative group transition-all duration-300 hover:text-gray-900 ${
                      isScrolled ? 'text-gray-900' : 'text-gray-800 drop-shadow-lg'
                    }`}
                  >
                    {item.name}
                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${item.colorClass} transition-all duration-500 group-hover:w-full`}></span>
                  </Link>
                )}
              </motion.div>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                        href={getDashboardLink()}
                        className="flex items-center space-x-2 bg-primary-300 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {getDashboardIcon()}
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
                      <Link
                        href="/login"
                        className="bg-primary-300 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Login
                      </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-900" />
            ) : (
              <Bars3Icon className={`h-6 w-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
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
            className="lg:hidden bg-white shadow-lg"
          >
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.hasSubmenu ? (
                    <div>
                      <button
                        onClick={() => setOpenSubmenu(openSubmenu === item.name ? null : item.name)}
                        className="flex items-center justify-between w-full text-lg font-medium text-gray-700 hover:text-gray-900 transition-all duration-300"
                      >
                        <span>{item.name}</span>
                        <ChevronDownIcon className={`h-5 w-5 transition-transform duration-300 ${openSubmenu === item.name ? 'rotate-180' : ''}`} />
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
                            <div className="pl-4 pt-2 space-y-2">
                              {item.submenu.map((subItem, subIndex) => (
                                <Link
                                  key={subIndex}
                                  href={subItem.href}
                                  onClick={() => {
                                    setIsMenuOpen(false)
                                    setOpenSubmenu(null)
                                  }}
                                  className="block text-base text-gray-600 hover:text-primary-600 transition-colors duration-200"
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
                      className="block text-lg font-medium text-gray-700 hover:text-gray-900 transition-all duration-300 relative group"
                    >
                      {item.name}
                      <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${item.colorClass} transition-all duration-500 group-hover:w-full`}></span>
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-lg font-medium text-gray-700 hover:text-gray-900 transition-all duration-300 relative group"
                    >
                      {item.name}
                      <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${item.colorClass} transition-all duration-500 group-hover:w-full`}></span>
                    </Link>
                  )}
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {user ? (
                  <div className="space-y-3">
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 bg-primary-300 text-white px-6 py-2.5 rounded-lg font-semibold text-sm w-full justify-center hover:bg-primary-400 transition-all duration-300"
                    >
                      {getDashboardIcon()}
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="w-full text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors duration-300 text-center"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block bg-primary-300 text-white px-6 py-2.5 rounded-lg font-semibold text-sm w-full text-center hover:bg-primary-400 transition-all duration-300"
                  >
                    Login
                  </Link>
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