'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, memo, useCallback } from 'react'
import Image from 'next/image'
import { 
  ArrowRightIcon, 
  HomeIcon,
  VideoCameraIcon,
  ClockIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

const heroImages = [
  { 
    id: 1, 
    title: "Expert Physiotherapy Care", 
    subtitle: "Professional treatment at your doorstep",
    image: "/images/hero/home-visit.jpg"
  },
  { 
    id: 2, 
    title: "Home Visit Services", 
    subtitle: "Comfortable recovery in your space",
    image: "/images/hero/physiotherapy-care.jpg"
  },
  { 
    id: 3, 
    title: "Online Consultations", 
    subtitle: "Virtual sessions from anywhere",
    image: "/images/hero/tele-consultation.jpg"
  }
]

const stats = [
  { number: "70+", label: "Patients", color: "primary" },
  { number: "2+", label: "Years Experience", color: "secondary" },
  { number: "100%", label: "Client Satisfaction", color: "tertiary" }
]

const Hero = memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({})
  const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }, [])

  const handleSlideClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const index = Number(e.currentTarget.getAttribute('data-slide-index'))
    if (!isNaN(index)) {
      setCurrentSlide(index)
    }
  }, [])

  const handleBookHomeVisit = useCallback(() => {
    const event = new CustomEvent('openBooking')
    window.dispatchEvent(event)
  }, [])

  const handleBookTeleConsultation = useCallback(() => {
    const event = new CustomEvent('openBooking', { detail: { type: 'tele' } })
    window.dispatchEvent(event)
  }, [])

  return (
    <section id="home" className="relative bg-white pt-24 pb-16 overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Modern Typography */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <span className="bg-primary-100 text-primary-800 px-5 py-2 rounded-full text-sm font-semibold">
                ✨ Trusted Physiotherapy Services
              </span>
            </motion.div>
            
            {/* Main Heading - Modern Typography */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-7xl font-black text-gray-900 font-display leading-[1.1]"
              >
                Your Path to <span className="text-primary-500">Better</span>
                <span className="block"><span className="text-primary-500">Movement</span> Starts</span>
                <span className="block">Here</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl lg:text-2xl text-gray-600 font-light leading-relaxed max-w-xl"
              >
                Personalized physiotherapy through home visits, tele-consultation, and soon-to-open advanced clinics — designed for your comfort, recovery, and long-term wellbeing.
              </motion.p>
              
              {/* Company Slogan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4"
              >
                <p 
                  className="text-sm md:text-base text-gray-400 font-light italic"
                  style={{
                    fontFamily: 'var(--font-barbara), "Bebas Neue", "Arial", sans-serif',
                    letterSpacing: '0.1em',
                    fontWeight: 300,
                  }}
                >
                  Empowering minds, Transforming lives...
                </p>
              </motion.div>
            </div>

            {/* Stats - Smaller Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-3"
            >
              {stats.map((stat, index) => {
                const colorClasses = {
                  primary: 'bg-primary-50 text-primary-700',
                  secondary: 'bg-secondary-50 text-secondary-700',
                  tertiary: 'bg-tertiary-50 text-tertiary-700'
                }
                return (
                  <div 
                    key={index}
                    className={`${colorClasses[stat.color as keyof typeof colorClasses]} rounded-xl p-3 shadow-md hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="text-2xl font-black mb-1">{stat.number}</div>
                    <div className="text-xs font-semibold uppercase tracking-wide">{stat.label}</div>
                  </div>
                )
              })}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={handleBookHomeVisit}
                className="bg-primary-300 text-white font-bold px-8 py-4 rounded-2xl hover:bg-primary-400 transition-all duration-300 shadow-xl hover:shadow-2xl inline-flex items-center justify-center gap-2 text-lg hover:scale-105 hover:-translate-y-0.5 active:scale-95"
              >
                Book a Home Visit
                <ArrowRightIcon className="h-5 w-5" />
              </button>
              
              <button 
                onClick={handleBookTeleConsultation}
                className="bg-white text-primary-700 font-bold px-8 py-4 rounded-2xl hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2 text-lg border-2 border-primary-200 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
              >
                Start Tele-Consultation
              </button>
            </motion.div>
          </motion.div>

          {/* Right Content - Image Carousel with Rounded Corners */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-tl-[80px] rounded-br-[80px] rounded-tr-3xl rounded-bl-3xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 via-secondary-100 to-tertiary-100 relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: imageLoading[heroImages[currentSlide].id] ? 0.7 : 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    {!imageError[heroImages[currentSlide].id] ? (
                      <>
                        {/* Loading skeleton */}
                        {imageLoading[heroImages[currentSlide].id] && (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-secondary-100 to-tertiary-100 animate-pulse z-10">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 border-3 border-primary-300 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          </div>
                        )}
                        <Image
                          src={heroImages[currentSlide].image}
                          alt={heroImages[currentSlide].title}
                          fill
                          className={`object-cover transition-opacity duration-300 ${
                            imageLoading[heroImages[currentSlide].id] ? 'opacity-0' : 'opacity-100'
                          }`}
                          priority={currentSlide === 0}
                          quality={75}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                          loading={currentSlide === 0 ? "eager" : "lazy"}
                          onLoadStart={() => {
                            setImageLoading(prev => ({ ...prev, [heroImages[currentSlide].id]: true }))
                          }}
                          onLoad={() => {
                            setImageLoading(prev => ({ ...prev, [heroImages[currentSlide].id]: false }))
                          }}
                          onError={() => {
                            setImageError(prev => ({ ...prev, [heroImages[currentSlide].id]: true }))
                            setImageLoading(prev => ({ ...prev, [heroImages[currentSlide].id]: false }))
                          }}
                        />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 via-secondary-100 to-tertiary-100">
                    <div className="text-center p-8">
                      <div className="w-32 h-32 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <HomeIcon className="h-16 w-16 text-primary-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{heroImages[currentSlide].title}</h3>
                      <p className="text-gray-600">{heroImages[currentSlide].subtitle}</p>
                        </div>
                      </div>
                    )}
                    {/* Overlay gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent z-0"></div>
                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
                      <h3 className="text-2xl font-black mb-2 font-display">{heroImages[currentSlide].title}</h3>
                      <p className="text-white/90">{heroImages[currentSlide].subtitle}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Carousel Controls */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 z-10"
              >
                <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 z-10"
              >
                <ChevronRightIcon className="h-6 w-6 text-gray-700" />
              </button>
              
              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    data-slide-index={index}
                    onClick={handleSlideClick}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Floating Feature Cards - Original Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-2xl z-20"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
                  <ShieldCheckIcon className="h-7 w-7 text-primary-700" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Certified Experts</div>
                  <div className="text-sm text-gray-600">Licensed professionals</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute -top-6 -right-6 bg-white rounded-2xl p-5 shadow-2xl z-20"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-secondary-100 rounded-xl flex items-center justify-center">
                  <HomeIcon className="h-7 w-7 text-secondary-700" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Home Visits</div>
                  <div className="text-sm text-gray-600">At your doorstep</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
})

Hero.displayName = 'Hero'

export default Hero
