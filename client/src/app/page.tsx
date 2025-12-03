'use client'

import { useEffect, useState, memo } from 'react'
import dynamic from 'next/dynamic'

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
import Image from 'next/image'
// Tree-shake icon imports - only import what's needed
import { 
  UserIcon,
  ClockIcon,
  ShieldCheckIcon,
  HomeIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

// Memoize component to prevent unnecessary re-renders
const Home = memo(function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [bookingType, setBookingType] = useState<'home' | 'tele'>('home')

  useEffect(() => {
    // Initialize AOS after page load for better performance
    const initAOS = async () => {
      try {
        if (typeof window !== 'undefined' && !document.body.hasAttribute('data-aos-initialized')) {
          // Dynamically import AOS only when needed
          const AOS = (await import('aos')).default
          AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            delay: 0,
          })
          document.body.setAttribute('data-aos-initialized', 'true')
        }
      } catch (error) {
        console.warn('AOS initialization failed:', error)
      }
    }

    // Initialize AOS after page load
    const loadHandler = () => setTimeout(initAOS, 100)
    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        setTimeout(initAOS, 100)
      } else {
        window.addEventListener('load', loadHandler)
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
    const event = new CustomEvent('openBooking')
    window.dispatchEvent(event)
  }

  const handleBookTeleConsultation = () => {
    const event = new CustomEvent('openBooking', { detail: { type: 'tele' } })
    window.dispatchEvent(event)
  }

  const handleCloseBooking = () => {
    setIsBookingOpen(false)
  }

  const whyChooseUs = [
    {
      icon: <UserIcon className="h-6 w-6" />,
      title: "Personalized physiotherapy plans",
      description: "Tailored treatment plans designed specifically for your condition and recovery goals",
      bgColor: "bg-primary-50",
      textColor: "text-primary-700",
      iconBg: "bg-primary-300"
    },
    {
      icon: <ShieldCheckIcon className="h-6 w-6" />,
      title: "Certified and experienced physiotherapists",
      description: "Licensed professionals with years of expertise in evidence-based therapy",
      bgColor: "bg-pastel-blue-50",
      textColor: "text-pastel-blue-400",
      iconBg: "bg-pastel-blue-300"
    },
    {
      icon: <HomeIcon className="h-6 w-6" />,
      title: "Home visits & tele-consultation",
      description: "Flexible options for treatment at home or online consultations",
      bgColor: "bg-pastel-mint-50",
      textColor: "text-pastel-mint-400",
      iconBg: "bg-pastel-mint-300"
    },
    {
      icon: <SparklesIcon className="h-6 w-6" />,
      title: "Evidence-based advanced therapies",
      description: "Cutting-edge techniques including cupping, taping, and strength training",
      bgColor: "bg-pastel-peach-50",
      textColor: "text-pastel-peach-400",
      iconBg: "bg-pastel-peach-300"
    },
    {
      icon: <ClockIcon className="h-6 w-6" />,
      title: "Affordable and accessible care",
      description: "Transparent pricing making quality physiotherapy accessible to all",
      bgColor: "bg-pastel-sage-50",
      textColor: "text-pastel-sage-400",
      iconBg: "bg-pastel-sage-300"
    }
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      
      {/* Why Choose Us - Modern Rounded Design */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="bg-primary-100 text-primary-800 px-5 py-2 rounded-full text-sm font-semibold">
                Why Choose Us
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 font-display leading-tight"
            >
              Why Choose <span className="text-primary-500">PhysioFi</span>?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-xl mx-auto font-light"
            >
              Expert physiotherapy care delivered right at your home or online
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {whyChooseUs.map((item, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className={`${item.bgColor} rounded-2xl p-6 h-full transition-all duration-300 text-center shadow-md hover:shadow-lg flex flex-col`}
                >
                  <div className="flex flex-col h-full">
                    <div className={`w-14 h-14 ${item.iconBg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <div className="text-white">
                        {item.icon}
                      </div>
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="bg-accent-100 text-accent-800 px-5 py-2 rounded-full text-sm font-semibold">
                Conditions We Treat
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 font-display leading-tight"
            >
              <span className="text-primary-500">Expert</span> <span className="text-primary-500">Treatment</span> For
              <span className="block">Various Conditions</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto font-light"
            >
              Comprehensive physiotherapy care for a wide range of conditions and injuries
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Low Back Pain / Sciatica', href: '/conditions/low-back-pain', color: 'bg-primary-50', iconImage: '/icons/back-pain-icon.png', iconColor: 'text-primary-600' },
              { name: 'Neck Pain / Cervical Spondylosis', href: '/conditions/neck-pain', color: 'bg-pastel-blue-50', iconImage: '/icons/neck-pain-icon.png', iconColor: 'text-pastel-blue-600' },
              { name: 'Shoulder Pain', href: '/conditions/shoulder-pain', color: 'bg-pastel-mint-50', iconImage: '/icons/shoulder-pain-icon.png', iconColor: 'text-pastel-mint-600' },
              { name: 'Knee Pain', href: '/conditions/knee-pain', color: 'bg-pastel-lavender-50', iconImage: '/icons/knee-pain-icon.png', iconColor: 'text-pastel-lavender-600' },
              { name: 'Sports Injuries', href: '/conditions/sports-injuries', color: 'bg-pastel-peach-50', iconImage: '/icons/sports-injuries-icon.png', iconColor: 'text-pastel-peach-600' },
              { name: 'Post-Operative Rehabilitation', href: '/conditions/post-operative', color: 'bg-pastel-sage-50', iconImage: '/icons/post-operative-icon.png', iconColor: 'text-pastel-sage-600' },
              { name: 'Stroke Rehabilitation', href: '/conditions/stroke-rehabilitation', color: 'bg-primary-50', iconImage: '/icons/stroke-rehabilitation-icon.png', iconColor: 'text-primary-600' },
              { name: "Parkinson's Disease", href: '/conditions/parkinsons', color: 'bg-pastel-blue-50', iconImage: '/icons/parkinsons-icon.png', iconColor: 'text-pastel-blue-600' },
              { name: 'Spinal Cord Injury', href: '/conditions/spinal-cord-injury', color: 'bg-pastel-mint-50', iconImage: '/icons/spinal-cord-injury-icon.png', iconColor: 'text-pastel-mint-600' },
              { name: 'COPD / Asthma / Breathing Issues', href: '/conditions/copd-asthma', color: 'bg-pastel-lavender-50', iconImage: '/icons/copd-asthma-icon.png', iconColor: 'text-pastel-lavender-600' },
              { name: 'Post-COVID Recovery', href: '/conditions/post-covid', color: 'bg-pastel-peach-50', iconImage: '/icons/post-covid-icon.png', iconColor: 'text-pastel-peach-600' },
              { name: 'Pediatric Physiotherapy', href: '/conditions/pediatric-developmental', color: 'bg-pastel-sage-50', iconImage: '/icons/pediatric-developmental-icon.png', iconColor: 'text-pastel-sage-600' },
              { name: 'Torticollis (Children)', href: '/conditions/torticollis', color: 'bg-primary-50', iconImage: '/icons/torticollis-icon.png', iconColor: 'text-primary-600' },
              { name: 'Balance Problems (Geriatric)', href: '/conditions/balance-problems', color: 'bg-pastel-blue-50', iconImage: '/icons/balance-problems-icon.png', iconColor: 'text-pastel-blue-600' },
              { name: 'Osteoporosis', href: '/conditions/osteoporosis', color: 'bg-pastel-mint-50', iconImage: '/icons/osteoporosis-icon.png', iconColor: 'text-pastel-mint-600' },
              { name: 'Pregnancy-Related Pain', href: '/conditions/pregnancy-pain', color: 'bg-pastel-lavender-50', iconImage: '/icons/pregnancy-pain-icon.png', iconColor: 'text-pastel-lavender-600' },
              { name: 'Urinary Incontinence', href: '/conditions/urinary-incontinence', color: 'bg-pastel-peach-50', iconImage: '/icons/urinary-incontinence-icon.png', iconColor: 'text-pastel-peach-600' },
            ].map((condition, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
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
                    <div className={`w-12 h-12 ${condition.color.replace('-50', '-100')} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      {condition.iconImage && (
                        <Image 
                          src={condition.iconImage} 
                          alt={condition.name}
                          width={24}
                          height={24}
                          className="object-contain"
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
      
      {/* CTA Footer Section - Rounded Design */}
      <section className="py-20 bg-primary-300">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-6"
          >
            <span className="bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-semibold">
              Get Started Today
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-6xl font-black text-white mb-6 font-display leading-tight"
          >
            Ready to Start Your
            <span className="block"><span className="text-white">Recovery</span> <span className="text-white">Journey</span>?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/95 mb-10 max-w-xl mx-auto font-light"
          >
            Get started with expert physiotherapy care today. Quick booking, professional service.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBookHomeVisit}
              className="bg-white text-primary-700 hover:bg-gray-50 font-black px-8 py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl text-lg hover:scale-105 hover:-translate-y-0.5 active:scale-95"
            >
              Book Appointment
            </button>
            <button
              onClick={handleBookTeleConsultation}
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-primary-700 font-black px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl text-lg hover:scale-105 hover:-translate-y-0.5 active:scale-95"
            >
              Tele Consultation
            </button>
          </div>
        </div>
      </section>
      
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
