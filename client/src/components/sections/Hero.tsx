'use client'

import { LazyMotion, domAnimation, m } from 'framer-motion'
import { useState, useEffect, memo, useCallback } from 'react'
import Image from 'next/image'
import { 
  ArrowRightIcon, 
  HomeIcon,
  VideoCameraIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

// Hero imagery – optimized size for faster load (Unsplash)
const HERO_IMAGES = [
  {
    id: 1,
    title: "Expert Physiotherapy Care",
    subtitle: "Professional treatment at your doorstep",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=75",
    width: 800,
    height: 533,
  },
  {
    id: 2,
    title: "Home Visit Services",
    subtitle: "Comfortable recovery in your space",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=75",
    width: 800,
    height: 533,
  },
  {
    id: 3,
    title: "Online Consultations",
    subtitle: "Virtual sessions from anywhere",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=75",
    width: 800,
    height: 533,
  },
]

const BLUR_DATA = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

const Hero = memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [imageError, setImageError] = useState<Record<number, boolean>>({})
  const [mounted, setMounted] = useState(false)

  // Defer carousel autoplay to reduce TBT; start after first paint
  useEffect(() => {
    setMounted(true)
  }, [])
  useEffect(() => {
    if (!mounted) return
    const t = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(t)
  }, [mounted])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)
  }, [])

  const handleSlideClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const index = Number(e.currentTarget.getAttribute('data-slide-index'))
    if (!isNaN(index)) setCurrentSlide(index)
  }, [])

  const handleBookHomeVisit = useCallback(() => {
    const event = new CustomEvent('openBooking')
    window.dispatchEvent(event)
  }, [])

  const handleBookTeleConsultation = useCallback(() => {
    const event = new CustomEvent('openBooking', { detail: { type: 'tele' } })
    window.dispatchEvent(event)
  }, [])

  const isFirst = currentSlide === 0
  const slide = HERO_IMAGES[currentSlide]

  return (
    <LazyMotion features={domAnimation} strict>
    <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden pt-24 pb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/40 via-white to-pastel-mint-50/30" aria-hidden />
      <div className="absolute top-0 right-0 w-[min(80%,480px)] h-[70%] rounded-full bg-primary-100/20 blur-[100px] pointer-events-none" aria-hidden />
      <div className="absolute bottom-0 left-0 w-[min(60%,360px)] h-[50%] rounded-full bg-pastel-mint-50/40 blur-[80px] pointer-events-none" aria-hidden />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
          <m.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8 max-w-xl"
          >
            <m.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.3 }}
              className="inline-block"
            >
              <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-primary-700 px-4 py-2 rounded-full text-xs font-semibold tracking-[0.2em] uppercase border border-primary-200/50 shadow-sm">
                Trusted Physiotherapy
              </span>
            </m.div>

            <div className="space-y-5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 font-display leading-[1.08] tracking-tight">
                Your Path to{' '}
                <span className="text-primary-600">Better Movement</span>
                <span className="block mt-1 text-gray-800">Starts Here</span>
              </h1>
              <div className="h-0.5 w-14 bg-primary-400/60 rounded-full" aria-hidden />
              <p className="text-lg lg:text-xl text-gray-500 font-normal leading-relaxed">
                Personalized physiotherapy through home visits, tele-consultation, and advanced care — for your comfort, recovery, and long-term wellbeing.
              </p>
              <p className="text-sm text-gray-400 font-light italic tracking-wide">
                Empowering minds, transforming lives
              </p>
            </div>

            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              className="grid grid-cols-3 gap-3"
            >
              {[
                { number: '70+', label: 'Patients', bg: 'bg-primary-50', border: 'border-primary-200/50' },
                { number: '2+', label: 'Years', bg: 'bg-pastel-blue-50', border: 'border-pastel-blue-200/50' },
                { number: '98%', label: 'Satisfaction', bg: 'bg-pastel-mint-50', border: 'border-pastel-mint-200/50' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`${stat.bg} ${stat.border} border rounded-xl px-4 py-4 backdrop-blur-sm transition-all duration-300 hover:shadow-md`}
                >
                  <div className="text-xl font-black text-gray-900 tracking-tight">{stat.number}</div>
                  <div className="text-[10px] font-semibold text-primary-600/90 uppercase tracking-widest mt-0.5">{stat.label}</div>
                </div>
              ))}
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.35 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={handleBookHomeVisit}
                className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                Book a Home Visit
                <ArrowRightIcon className="h-5 w-5" strokeWidth={2} />
              </button>
              <button
                onClick={handleBookTeleConsultation}
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-semibold px-8 py-3.5 rounded-xl border border-primary-200/60 hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200 shadow-sm"
              >
                <VideoCameraIcon className="h-5 w-5" strokeWidth={1.5} />
                Tele-Consultation
              </button>
            </m.div>
          </m.div>

          {/* Right - LCP image (priority first slide) */}
          <m.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 ring-inset">
              <div className="aspect-[4/3] bg-primary-100/50 relative" style={{ minHeight: 320 }}>
                {!imageError[slide.id] ? (
                  <>
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      priority={isFirst}
                      fetchPriority={isFirst ? 'high' : undefined}
                      quality={isFirst ? 80 : 75}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                      loading={isFirst ? 'eager' : 'lazy'}
                      placeholder="blur"
                      blurDataURL={BLUR_DATA}
                      onError={() => setImageError((p) => ({ ...p, [slide.id]: true }))}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent z-0" aria-hidden />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
                      <h3 className="text-2xl font-black mb-2 font-display">{slide.title}</h3>
                      <p className="text-white/90">{slide.subtitle}</p>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-pastel-mint-50">
                    <div className="text-center p-8">
                      <HomeIcon className="h-16 w-16 text-primary-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900">{slide.title}</h3>
                      <p className="text-gray-600 text-sm">{slide.subtitle}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Carousel controls */}
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-gray-100 hover:bg-white transition-all duration-200 z-10"
                aria-label="Previous slide"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-600" strokeWidth={2} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-gray-100 hover:bg-white transition-all duration-200 z-10"
                aria-label="Next slide"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-600" strokeWidth={2} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {HERO_IMAGES.map((_, index) => (
                  <button
                    key={index}
                    data-slide-index={index}
                    onClick={handleSlideClick}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-white w-6' : 'bg-white/50 w-1.5'
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="absolute -bottom-4 left-0 lg:-left-4 bg-white rounded-2xl p-4 shadow-lg border border-primary-200/40 z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                  <ShieldCheckIcon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Certified Experts</div>
                  <div className="text-xs text-gray-500">Licensed professionals</div>
                </div>
              </div>
            </m.div>
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute -top-4 right-0 lg:-right-4 bg-white rounded-2xl p-4 shadow-lg border border-primary-200/40 z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pastel-mint-100 rounded-xl flex items-center justify-center text-pastel-mint-600">
                  <HomeIcon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Home Visits</div>
                  <div className="text-xs text-gray-500">At your doorstep</div>
                </div>
              </div>
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
    </LazyMotion>
  )
})

Hero.displayName = 'Hero'

export default Hero
