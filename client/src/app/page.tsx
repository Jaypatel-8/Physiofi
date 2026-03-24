'use client'

import { useEffect, useState, memo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useAuth } from '@/app/providers'
import { useRouter } from 'next/navigation'

import Header from '@/components/layout/Header'
import Hero from '@/components/sections/Hero'

// Lazy load heavy sections
const About = dynamic(() => import('@/components/sections/About'), {
  loading: () => null
})
const Services = dynamic(() => import('@/components/sections/Services'), {
  loading: () => null
})

// Lazy load heavy components for better performance
const Testimonials = dynamic(() => import('@/components/sections/Testimonials'), {
  loading: () => <div className="py-12 sm:py-16 lg:py-20 bg-white"><div className="container-custom text-center">Loading...</div></div>
})
const Contact = dynamic(() => import('@/components/sections/Contact'), {
  loading: () => <div className="py-12 sm:py-16 lg:py-20 bg-white"><div className="container-custom text-center">Loading...</div></div>
})
const Footer = dynamic(() => import('@/components/layout/Footer'))
const FloatingActionButton = dynamic(() => import('@/components/ui/FloatingActionButton'))
const BookingPopup = dynamic(() => import('@/components/ui/BookingPopup'))
import { motion } from 'framer-motion'
import Link from 'next/link'
import { HOME_CONDITIONS } from '@/data/homeConditions'
// Tree-shake icon imports - only import what's needed
import { 
  ArrowRightIcon,
  UserIcon,
  ShieldCheckIcon,
  HomeIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

// Memoize component to prevent unnecessary re-renders
const Home = memo(function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [bookingType, setBookingType] = useState<'home' | 'tele'>('home')
  
  const handleDashboardClick = () => {
    if (!user) {
      router.push('/login')
      return
    }
    
    const dashboardPath = user.role === 'patient' 
      ? '/patient/dashboard' 
      : user.role === 'doctor' 
      ? '/doctor/dashboard' 
      : '/admin/dashboard'
    
    router.push(dashboardPath)
  }

  useEffect(() => {
    const handleOpenBooking = (e: Event) => {
      const customEvent = e as CustomEvent
      const type = customEvent.detail?.type === 'tele' ? 'tele' : 'home'
      setBookingType(type)
      setIsBookingOpen(true)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('openBooking', handleOpenBooking)
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('openBooking', handleOpenBooking)
      }
    }
  }, [])

  const handleBookHomeVisit = useCallback(() => {
    setBookingType('home')
    setIsBookingOpen(true)
  }, [])

  const handleBookTeleConsultation = useCallback(() => {
    setBookingType('tele')
    setIsBookingOpen(true)
  }, [])

  const handleCloseBooking = useCallback(() => {
    setIsBookingOpen(false)
  }, [])

  const conditionCardPalette = [
    { bg: 'bg-primary-50', iconBg: 'bg-primary-100', iconColor: 'text-primary-600' },
    { bg: 'bg-pastel-blue-50', iconBg: 'bg-pastel-blue-100', iconColor: 'text-pastel-blue-600' },
    { bg: 'bg-pastel-mint-50', iconBg: 'bg-pastel-mint-100', iconColor: 'text-pastel-mint-600' },
    { bg: 'bg-pastel-lavender-50', iconBg: 'bg-pastel-lavender-100', iconColor: 'text-pastel-lavender-600' },
    { bg: 'bg-pastel-peach-50', iconBg: 'bg-pastel-peach-100', iconColor: 'text-pastel-peach-600' },
    { bg: 'bg-pastel-sage-50', iconBg: 'bg-pastel-sage-100', iconColor: 'text-pastel-sage-600' },
  ]
  const cardStyle = (index: number) => conditionCardPalette[index % conditionCardPalette.length]

  const whyChooseUs = [
    { icon: UserIcon, title: "Personalized physiotherapy plans", description: "Tailored treatment plans designed specifically for your condition and recovery goals" },
    { icon: ShieldCheckIcon, title: "Certified and experienced physiotherapists", description: "Licensed professionals with years of expertise in evidence-based therapy" },
    { icon: HomeIcon, title: "Home visits & tele-consultation", description: "Flexible options for treatment at home or online consultations" },
    { icon: SparklesIcon, title: "Evidence-based advanced therapies", description: "Cutting-edge techniques including cupping, taping, and strength training" },
    { icon: ClockIcon, title: "Affordable and accessible care", description: "Transparent pricing making quality physiotherapy accessible to all" },
  ]

  const [iconLoadErrors, setIconLoadErrors] = useState<Record<string, boolean>>({})

  const handleIconError = (slug: string) => {
    setIconLoadErrors((prev) => ({ ...prev, [slug]: true }))
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Header />
      <Hero />
      {/* Why Choose Us – pastel cards */}
      <section className="py-12 sm:py-16 lg:py-20 bg-pastel-mesh">
        <div className="container-custom">
          <div className="text-center mb-10 sm:mb-14 lg:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              className="inline-block mb-4"
            >
              <span className="bg-card-1 text-primary-700 px-5 py-2 rounded-full text-sm font-semibold border border-primary-200/50">
                Why Choose Us
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 sm:mb-6 font-display leading-tight"
            >
              Why Choose <span className="text-primary-500">PhysioFi</span>?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xl mx-auto font-light"
            >
              Expert physiotherapy care delivered right at your home or online
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
            {whyChooseUs.map((item, index) => {
              const style = cardStyle(index)
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  viewport={{ once: true, margin: '-40px' }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className={`${style.bg} card-hover-premium border border-primary-200/40 rounded-2xl p-4 sm:p-5 lg:p-6 text-center flex flex-col`}
                  style={{ minHeight: '200px' }}
                >
                  <div className="flex flex-col flex-grow">
                    <div className={`w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center ${style.iconBg} ${style.iconColor}`}>
                      <Icon className="h-7 w-7" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-black mb-2 text-gray-900 font-display">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed flex-grow">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <About />
      <Services />
      
      {/* Diseases Section */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <div className="text-center mb-8 sm:mb-12 lg:mb-14">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              className="inline-block mb-4"
            >
              <span className="bg-accent-100 text-accent-800 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                Conditions We Treat
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-3 sm:mb-5 font-display leading-tight"
            >
              <span className="text-primary-500">Expert</span> <span className="text-primary-500">Treatment</span> For
              <span className="block">Various Conditions</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto font-light px-1"
            >
              Comprehensive physiotherapy care for a wide range of conditions and injuries
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {HOME_CONDITIONS.map((condition, index) => (
              <motion.div
                key={condition.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Link
                  href={condition.href}
                  className={`${condition.color} card-hover-premium rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300 group block`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-grow">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 leading-snug">{condition.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5">
                        Learn More
                        <ArrowRightIcon className="h-4 w-4" />
                      </p>
                    </div>
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 ${condition.color.replace('-50', '-100')} rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:scale-110 transition-transform duration-300 ${condition.iconColor}`}>
                      {iconLoadErrors[condition.slug] ? (
                        <CheckCircleIcon className={`h-6 w-6 ${condition.iconColor}`} />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={condition.iconSrc}
                          alt={condition.name}
                          className="h-6 w-6 object-contain"
                          onError={() => handleIconError(condition.slug)}
                        />
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <Contact />

      <Footer />
      <FloatingActionButton />
      <BookingPopup 
        isOpen={isBookingOpen} 
        onClose={handleCloseBooking}
        defaultServiceType={bookingType}
      />
    </main>
  )
})

Home.displayName = 'Home'

export default Home
