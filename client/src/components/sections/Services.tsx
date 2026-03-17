'use client'

import { LazyMotion, domAnimation, m } from 'framer-motion'
import Link from 'next/link'
import { 
  HomeIcon, 
  VideoCameraIcon, 
  CheckCircleIcon,
  ArrowRightIcon,
  ClockIcon,
  StarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
const Services = () => {
  const handleBookHomeVisit = () => {
    const event = new CustomEvent('openBooking')
    window.dispatchEvent(event)
  }

  const handleBookTeleConsultation = () => {
    const event = new CustomEvent('openBooking', { detail: { type: 'tele' } })
    window.dispatchEvent(event)
  }

  const services = [
    {
      icon: HomeIcon,
      title: "Home Visit Physiotherapy",
      description: "Professional physiotherapy services delivered directly to your doorstep. Our certified therapists bring expert care to your home.",
      href: "/services/home-visit",
    },
    {
      icon: VideoCameraIcon,
      title: "Tele-Consultation",
      description: "Online video consultations with our expert physiotherapists from the comfort of your home.",
      href: "/services/tele-consultation",
    }
  ]
  const conditionCardPalette = [
    { bg: 'bg-primary-50', iconBg: 'bg-primary-100', iconColor: 'text-primary-600' },
    { bg: 'bg-pastel-blue-50', iconBg: 'bg-pastel-blue-100', iconColor: 'text-pastel-blue-600' },
    { bg: 'bg-pastel-mint-50', iconBg: 'bg-pastel-mint-100', iconColor: 'text-pastel-mint-600' },
    { bg: 'bg-pastel-lavender-50', iconBg: 'bg-pastel-lavender-100', iconColor: 'text-pastel-lavender-600' },
    { bg: 'bg-pastel-peach-50', iconBg: 'bg-pastel-peach-100', iconColor: 'text-pastel-peach-600' },
    { bg: 'bg-pastel-sage-50', iconBg: 'bg-pastel-sage-100', iconColor: 'text-pastel-sage-600' },
  ]
  const cardStyle = (index: number) => conditionCardPalette[index % conditionCardPalette.length]

  const process = [
    { step: "1", title: "Book Your Appointment", description: "Schedule your consultation online or call us directly", icon: ClockIcon },
    { step: "2", title: "Undergo a detailed assessment", description: "Our expert evaluates your condition, medical history, and specific needs", icon: CheckCircleIcon },
    { step: "3", title: "Receive personalized treatment", description: "Evidence-based therapy tailored to your condition and recovery goals", icon: StarIcon },
    { step: "4", title: "Track progress and improve", description: "Regular monitoring and adjustment of treatment based on your progress", icon: CheckCircleIcon }
  ]

  return (
    <LazyMotion features={domAnimation} strict>
    <section id="services" className="section-py bg-pastel-mesh relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="text-center mb-10 sm:mb-16 md:mb-20">
          <m.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            className="text-primary-600 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase mb-3 sm:mb-4"
          >
            Our Services
          </m.p>
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 font-display leading-tight tracking-tight px-1"
          >
            Care for every need
          </m.h2>
          <m.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="text-gray-500 max-w-xl mx-auto text-base sm:text-lg px-1"
          >
            Tailored physiotherapy for your recovery
          </m.p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-16 md:mb-20 max-w-4xl mx-auto">
          {services.map((service, index) => {
            const style = cardStyle(index)
            return (
            <m.a
              key={index}
              href={service.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              viewport={{ once: true, margin: '-40px' }}
              className={`group relative ${style.bg} card-hover-premium border border-primary-200/40 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 h-full flex flex-col overflow-hidden`}
            >
              <div className="flex flex-col h-full relative">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${style.iconBg} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-105 transition-transform duration-300 ${style.iconColor}`}>
                  <service.icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 font-display tracking-tight">
                  {service.title}
                </h3>
                <p className="text-gray-500 mb-4 sm:mb-6 leading-relaxed flex-grow text-sm">
                  {service.description}
                </p>
                <div className={`flex items-center gap-2 ${style.iconColor} font-medium text-sm group-hover:gap-3 transition-all mt-auto`}>
                  <span>Learn more</span>
                  <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
                </div>
              </div>
            </m.a>
          )})}
        </div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          className="mb-10 sm:mb-16"
        >
          <div className="text-center mb-6 sm:mb-8">
            <m.h3
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 font-display"
            >
              <span className="text-primary-600">Advanced</span> Therapies
            </m.h3>
            <m.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-gray-600 text-sm sm:text-base"
            >
              Evidence-based advanced treatments for comprehensive recovery
            </m.p>
          </div>
          <m.a
            href="/services/advanced-therapies"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-card-3 card-hover-premium p-5 sm:p-6 md:p-8 block max-w-2xl mx-auto overflow-hidden rounded-xl sm:rounded-2xl"
          >
            <div className="flex items-center gap-4 sm:gap-6 relative">
              <div className="icon-pastel w-12 h-12 sm:w-14 sm:h-14 shrink-0 group-hover:scale-105 transition-transform duration-300">
                <SparklesIcon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.5} />
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 font-display">
                  Advanced Therapy Treatments
                </h4>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                  Cupping, Dry Needling, IASTM, Kinesio Taping, Strength Training & more
                </p>
                <div className="flex items-center gap-2 text-pastel-lavender-600 font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Explore All Therapies</span>
                  <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
                </div>
              </div>
            </div>
          </m.a>
        </m.div>

        <div className="bg-primary-50 rounded-xl sm:rounded-2xl border border-primary-200/40 p-5 sm:p-8 md:p-10 shadow-sm">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-primary-600 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase mb-2 sm:mb-3">Process</p>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 font-display tracking-tight mb-2">
              How it works
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto px-1">
              Four steps to personalized care
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {process.map((step, index) => {
              const style = cardStyle(index)
              return (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="text-center"
              >
                <div className={`group/step ${style.bg} card-hover-premium border border-primary-200/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 h-full flex flex-col relative overflow-hidden`}>
                  <div className={`w-10 h-10 rounded-lg ${style.iconBg} ${style.iconColor} font-semibold text-sm flex items-center justify-center mx-auto mb-4`}>
                    {step.step}
                  </div>
                  <step.icon className={`h-5 w-5 mx-auto mb-3 ${style.iconColor}`} strokeWidth={1.5} />
                  <h4 className="text-base font-semibold text-gray-900 font-display mb-2 tracking-tight">{step.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </m.div>
            )})}
          </div>
        </div>
      </div>
    </section>
    </LazyMotion>
  )
}

export default Services
