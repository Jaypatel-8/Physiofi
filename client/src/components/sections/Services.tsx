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
    <section id="services" className="py-32 bg-pastel-mesh relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="text-center mb-20">
          <m.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            className="text-primary-600 text-sm font-medium tracking-[0.2em] uppercase mb-4"
          >
            Our Services
          </m.p>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-display leading-tight tracking-tight">
            Care for every need
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Tailored physiotherapy for your recovery
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
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
              className={`group relative ${style.bg} card-hover-premium border border-primary-200/40 rounded-2xl p-8 h-full flex flex-col overflow-hidden`}
            >
              <div className="flex flex-col h-full relative">
                <div className={`w-12 h-12 rounded-xl ${style.iconBg} flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 ${style.iconColor}`}>
                  <service.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-display tracking-tight">
                  {service.title}
                </h3>
                <p className="text-gray-500 mb-6 leading-relaxed flex-grow text-sm">
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
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2 font-display">
              <span className="text-primary-600">Advanced</span> Therapies
            </h3>
            <p className="text-gray-600">
              Evidence-based advanced treatments for comprehensive recovery
            </p>
          </div>
          <m.a
            href="/services/advanced-therapies"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-card-3 card-hover-premium p-8 block max-w-2xl mx-auto overflow-hidden"
          >
            <div className="flex items-center gap-6 relative">
              <div className="icon-pastel w-14 h-14 shrink-0 group-hover:scale-105 transition-transform duration-300">
                <SparklesIcon className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="text-xl font-bold text-gray-900 mb-2 font-display">
                  Advanced Therapy Treatments
                </h4>
                <p className="text-gray-600 text-sm mb-4">
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

        <div className="bg-primary-50 rounded-2xl border border-primary-200/40 p-10 shadow-sm">
          <div className="text-center mb-12">
            <p className="text-primary-600 text-sm font-medium tracking-[0.2em] uppercase mb-3">Process</p>
            <h3 className="text-2xl font-semibold text-gray-900 font-display tracking-tight mb-2">
              How it works
            </h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Four steps to personalized care
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className={`group/step ${style.bg} card-hover-premium border border-primary-200/40 rounded-2xl p-6 h-full flex flex-col relative overflow-hidden`}>
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
