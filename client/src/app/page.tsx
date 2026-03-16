'use client'

import { useEffect, useState, memo } from 'react'
import dynamic from 'next/dynamic'
import { useAuth } from '@/app/providers'
import { useRouter } from 'next/navigation'

// AOS CSS will be loaded dynamically in useEffect

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
  loading: () => <div className="py-20 bg-white"><div className="container-custom text-center">Loading...</div></div>
})
const Contact = dynamic(() => import('@/components/sections/Contact'), {
  loading: () => <div className="py-20 bg-white"><div className="container-custom text-center">Loading...</div></div>
})
const Footer = dynamic(() => import('@/components/layout/Footer'))
const FloatingActionButton = dynamic(() => import('@/components/ui/FloatingActionButton'))
const BookingPopup = dynamic(() => import('@/components/ui/BookingPopup'))
import { motion } from 'framer-motion'
import Link from 'next/link'
// Tree-shake icon imports - only import what's needed
import { 
  ArrowRightIcon,
  UserIcon,
  ShieldCheckIcon,
  HomeIcon,
  SparklesIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

// Memoize component to prevent unnecessary re-renders
const Home = memo(function Home() {
  const { user, loading } = useAuth()
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
    // Initialize AOS after page load for better performance
    const initAOS = async () => {
      try {
        if (typeof window !== 'undefined' && !document.body.hasAttribute('data-aos-initialized')) {
          // Check if user prefers reduced motion
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          
          // Only load AOS if user doesn't prefer reduced motion
          if (!prefersReducedMotion) {
            // Dynamically import AOS only when needed and after initial render
            const AOS = (await import('aos')).default
            AOS.init({
              duration: 600, // Reduced from 800
              easing: 'ease-in-out',
              once: true,
              offset: 50, // Reduced from 100 for faster triggering
              delay: 0,
              disable: false,
            })
            document.body.setAttribute('data-aos-initialized', 'true')
          } else {
            // Skip AOS for users who prefer reduced motion
            document.body.setAttribute('data-aos-initialized', 'true')
          }
        }
      } catch (error) {
        console.warn('AOS initialization failed:', error)
      }
    }

    // Initialize AOS after page load with requestIdleCallback for better performance
    const loadHandler = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(initAOS, { timeout: 2000 })
      } else {
        setTimeout(initAOS, 200)
      }
    }
    
    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        loadHandler()
      } else {
        window.addEventListener('load', loadHandler, { once: true })
      }
    }

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
        window.removeEventListener('load', loadHandler)
      }
    }
  }, [])

  const handleBookHomeVisit = () => {
    setBookingType('home')
    setIsBookingOpen(true)
  }

  const handleBookTeleConsultation = () => {
    setBookingType('tele')
    setIsBookingOpen(true)
  }

  const handleCloseBooking = () => {
    setIsBookingOpen(false)
  }

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

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Header />
      <Hero />
      {/* Why Choose Us – pastel cards */}
      <section className="py-20 bg-pastel-mesh">
        <div className="container-custom">
          <div className="text-center mb-16">
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
              className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 font-display leading-tight"
            >
              Why Choose <span className="text-primary-500">PhysioFi</span>?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-xl text-gray-600 max-w-xl mx-auto font-light"
            >
              Expert physiotherapy care delivered right at your home or online
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
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
                  className={`${style.bg} card-hover-premium border border-primary-200/40 rounded-2xl p-6 text-center flex flex-col`}
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
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              className="inline-block mb-4"
            >
              <span className="bg-accent-100 text-accent-800 px-5 py-2 rounded-full text-sm font-semibold">
                Conditions We Treat
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 font-display leading-tight"
            >
              <span className="text-primary-500">Expert</span> <span className="text-primary-500">Treatment</span> For
              <span className="block">Various Conditions</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto font-light"
            >
              Comprehensive physiotherapy care for a wide range of conditions and injuries
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Low Back Pain / Sciatica', href: '/conditions/low-back-pain', color: 'bg-primary-50', iconColor: 'text-primary-600', iconSrc: '/icons/back-pain-icon.png' },
              { name: 'Neck Pain / Cervical Spondylosis', href: '/conditions/neck-pain', color: 'bg-pastel-blue-50', iconColor: 'text-pastel-blue-600', iconSrc: '/icons/neck-pain-icon.png' },
              { name: 'Shoulder Pain', href: '/conditions/shoulder-pain', color: 'bg-pastel-mint-50', iconColor: 'text-pastel-mint-600', iconSrc: '/icons/shoulder-pain-icon.png' },
              { name: 'Knee Pain', href: '/conditions/knee-pain', color: 'bg-pastel-lavender-50', iconColor: 'text-pastel-lavender-600', iconSrc: '/icons/knee-pain-icon.png' },
              { name: 'Sports Injuries', href: '/conditions/sports-injuries', color: 'bg-pastel-peach-50', iconColor: 'text-pastel-peach-600', iconSrc: '/icons/sports-injuries-icon.png' },
              { name: 'Post-Operative Rehabilitation', href: '/conditions/post-operative', color: 'bg-pastel-sage-50', iconColor: 'text-pastel-sage-600', iconSrc: '/icons/post-operative-icon.png' },
              { name: 'Stroke Rehabilitation', href: '/conditions/stroke-rehabilitation', color: 'bg-primary-50', iconColor: 'text-primary-600', iconSrc: '/icons/stroke-rehabilitation-icon.png' },
              { name: "Parkinson's Disease", href: '/conditions/parkinsons', color: 'bg-pastel-blue-50', iconColor: 'text-pastel-blue-600', iconSrc: '/icons/parkinsons-icon.png' },
              { name: 'Spinal Cord Injury', href: '/conditions/spinal-cord-injury', color: 'bg-pastel-mint-50', iconColor: 'text-pastel-mint-600', iconSrc: '/icons/spinal-cord-injury-icon.png' },
              { name: 'COPD / Asthma / Breathing Issues', href: '/conditions/copd-asthma', color: 'bg-pastel-lavender-50', iconColor: 'text-pastel-lavender-600', iconSrc: '/icons/copd-asthma-icon.png' },
              { name: 'Post-COVID Recovery', href: '/conditions/post-covid', color: 'bg-pastel-peach-50', iconColor: 'text-pastel-peach-600', iconSrc: '/icons/post-covid-icon.png' },
              { name: 'Pediatric Physiotherapy', href: '/conditions/pediatric-developmental', color: 'bg-pastel-sage-50', iconColor: 'text-pastel-sage-600', iconSrc: '/icons/pediatric-developmental-icon.png' },
              { name: 'Torticollis (Children)', href: '/conditions/torticollis', color: 'bg-primary-50', iconColor: 'text-primary-600', iconSrc: '/icons/torticollis-icon.png' },
              { name: 'Balance Problems (Geriatric)', href: '/conditions/balance-problems', color: 'bg-pastel-blue-50', iconColor: 'text-pastel-blue-600', iconSrc: '/icons/balance-problems-icon.png' },
              { name: 'Osteoporosis', href: '/conditions/osteoporosis', color: 'bg-pastel-mint-50', iconColor: 'text-pastel-mint-600', iconSrc: '/icons/osteoporosis-icon.png' },
              { name: 'Pregnancy-Related Pain', href: '/conditions/pregnancy-pain', color: 'bg-pastel-lavender-50', iconColor: 'text-pastel-lavender-600', iconSrc: '/icons/pregnancy-pain-icon.png' },
              { name: 'Urinary Incontinence', href: '/conditions/urinary-incontinence', color: 'bg-pastel-peach-50', iconColor: 'text-pastel-peach-600', iconSrc: '/icons/urinary-incontinence-icon.png' },
            ].map((condition, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Link
                  href={condition.href}
                  className={`${condition.color} rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 group block`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{condition.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        Learn More
                        <ArrowRightIcon className="h-4 w-4" />
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${condition.color.replace('-50', '-100')} rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:scale-110 transition-transform duration-300 ${condition.iconColor}`}>
                      <img src={condition.iconSrc} alt={condition.name} className="h-7 w-7 object-contain" />
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
