'use client'

import { useEffect, useState } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { motion } from 'framer-motion'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BookingPopup from '@/components/ui/BookingPopup'
import Link from 'next/link'
import { 
  HomeIcon, 
  VideoCameraIcon, 
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  StarIcon
} from '@heroicons/react/24/outline'

const ServicesPage = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [bookingType, setBookingType] = useState<'home' | 'tele'>('home')

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    })

    const handleOpenBooking = (e: Event) => {
      const customEvent = e as CustomEvent
      const type = customEvent.detail?.type === 'tele' ? 'tele' : 'home'
      setBookingType(type)
      setIsBookingOpen(true)
    }

    window.addEventListener('openBooking', handleOpenBooking)
    return () => window.removeEventListener('openBooking', handleOpenBooking)
  }, [])

  const handleBookHomeVisit = () => {
    setBookingType('home')
    setIsBookingOpen(true)
  }

  const handleBookTeleConsultation = () => {
    setBookingType('tele')
    setIsBookingOpen(true)
  }

  const services = [
    {
      icon: HomeIcon,
      title: "Home Visit Physiotherapy",
      description: "Professional physiotherapy services delivered directly to your doorstep. Our certified therapists bring expert care to your home.",
      href: "/services/home-visit",
      colorScheme: {
        bg: "bg-primary-50",
        iconBg: "bg-primary-300",
        text: "text-primary-700",
        badge: "bg-primary-100 text-primary-800"
      }
    },
    {
      icon: VideoCameraIcon,
      title: "Tele-Consultation",
      description: "Virtual physiotherapy sessions with our expert therapists. Get professional guidance and treatment plans from anywhere.",
      href: "/services/tele-consultation",
      colorScheme: {
        bg: "bg-pastel-blue-50",
        iconBg: "bg-pastel-blue-300",
        text: "text-pastel-blue-400",
        badge: "bg-pastel-blue-100 text-pastel-blue-800"
      }
    },
  ]

  const processSteps = [
    {
      step: "1",
      title: "Initial Consultation",
      description: "We assess your condition, medical history, and specific needs through a comprehensive evaluation.",
      icon: <CheckCircleIcon className="h-8 w-8" />
    },
    {
      step: "2", 
      title: "Treatment Planning",
      description: "Our experts create a personalized treatment plan tailored to your goals and recovery timeline.",
      icon: <ClockIcon className="h-8 w-8" />
    },
    {
      step: "3",
      title: "Therapy Sessions",
      description: "Regular therapy sessions with our certified physiotherapists using evidence-based techniques.",
      icon: <ShieldCheckIcon className="h-8 w-8" />
    },
    {
      step: "4",
      title: "Progress Monitoring",
      description: "Continuous assessment and adjustment of treatment plans based on your progress and feedback.",
      icon: <StarIcon className="h-8 w-8" />
    }
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <div className="page-top-spacing" />
      
      {/* Hero Section - Modern Design */}
      <section className="relative section-py bg-white overflow-hidden">
        
        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6 max-w-6xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl lg:text-7xl font-black text-gray-900 font-display leading-tight"
            >
              SERVICES<br /><span className="text-primary-500">TAILORED</span><br />TO <span className="text-primary-500">YOU</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="lg:ml-auto lg:max-w-md"
            >
              <p className="text-xl text-gray-600 font-medium leading-relaxed">
                Explore our comprehensive range of services designed to help you recover, regain strength, and improve your overall well-being.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.href}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className={`${service.colorScheme.bg} rounded-3xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group`}
              >
                {/* Book Corner Effect */}
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-gray-200 opacity-60"></div>
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[35px] border-l-transparent border-t-[35px] border-t-gray-100 opacity-80"></div>
                
                <div className="relative z-10">
                  <div className={`w-20 h-20 ${service.colorScheme.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-4 font-display">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 text-primary-700 font-bold group-hover:gap-4 transition-all duration-300">
                    <span>Learn More</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Modern Design */}
      <section className="section-py bg-white relative overflow-hidden">
        
        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6 mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl lg:text-7xl font-black text-gray-900 font-display leading-tight"
            >
              OUR<br />PROCESS
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="lg:ml-auto lg:max-w-md"
            >
              <p className="text-xl text-gray-600 font-medium leading-relaxed">
                Our systematic approach ensures you receive the best possible care throughout your recovery journey.
              </p>
            </motion.div>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10 py-12">
              {processSteps.map((step, index) => {
                const isLast = index === processSteps.length - 1
                return (
                  <div key={index} className="relative">
                    {/* Visual Flow Connector */}
                    {!isLast && (
                      <div className="absolute top-1/2 left-full hidden lg:flex items-center justify-center z-0" style={{ width: '100%', transform: 'translateY(-50%)', marginLeft: '0.5rem' }}>
                        <div className="flex items-center gap-1">
                          <div className="w-8 h-0.5 bg-gradient-to-r from-primary-300 to-primary-200"></div>
                          <div className="w-2 h-2 bg-primary-300 rounded-full"></div>
                          <div className="w-8 h-0.5 bg-gradient-to-r from-primary-200 to-primary-300"></div>
                        </div>
                      </div>
                    )}
                    
              <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                      transition={{ delay: index * 0.15, type: "spring" }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="text-center relative z-10"
                    >
                      {/* Enhanced Process Card */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden border-2 border-primary-100">
                        {/* Book Corner Effect */}
                        <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
                        <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>
                        
                <div className="relative z-10">
                          {/* Step Number Badge */}
                          <div className="relative mb-6">
                            <div className="w-20 h-20 mx-auto relative">
                              {/* Outer glow ring */}
                              <div className="absolute inset-0 bg-primary-300 rounded-full opacity-20 blur-xl"></div>
                              {/* Main circle */}
                              <div className="relative w-20 h-20 bg-primary-300 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                                <div className="text-white font-black text-2xl">{step.step}</div>
                              </div>
                              {/* Icon badge */}
                  <motion.div 
                                initial={{ y: 0 }}
                                whileHover={{ y: -6, rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="absolute -top-1 -right-1 w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                  >
                                <div className="text-white text-lg">
                    {step.icon}
                  </div>
                              </motion.div>
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="space-y-2">
                            <h3 className="text-lg font-black text-gray-900 font-display">
                    {step.title}
                  </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                          </div>
                        </div>
                </div>
              </motion.div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-py bg-gradient-to-br from-secondary-500 via-secondary-600 to-secondary-700">
        <div className="container-custom text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl lg:text-6xl font-bold text-white mb-6 font-display"
          >
            Get Started Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="text-xl text-white/90 mb-8 max-w-3xl mx-auto"
          >
            Book your consultation today and take the first step towards better health and wellness.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBookHomeVisit}
              className="bg-white text-secondary-700 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              <HomeIcon className="h-5 w-5" />
              Book Appointment
            </button>
            <button
              onClick={handleBookTeleConsultation}
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-secondary-700 font-bold py-4 px-8 rounded-xl transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              <VideoCameraIcon className="h-5 w-5" />
              Book Tele-Consultation
            </button>
          </div>
        </div>
      </section>

      <Footer />
      <BookingPopup 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
        defaultServiceType={bookingType}
      />
    </main>
  )
}

export default ServicesPage
