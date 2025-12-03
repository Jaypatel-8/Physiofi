'use client'

import { motion } from 'framer-motion'
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
import Image from 'next/image'

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
      colorScheme: {
        bg: "bg-primary-50",
        text: "text-primary-700",
        iconBg: "bg-primary-100 border-primary-300"
      }
    },
    {
      icon: VideoCameraIcon,
      title: "Tele-Consultation",
      description: "Online video consultations with our expert physiotherapists from the comfort of your home.",
      href: "/services/tele-consultation",
      colorScheme: {
        bg: "bg-pastel-blue-50",
        text: "text-pastel-blue-400",
        iconBg: "bg-pastel-blue-100 border-pastel-blue-300"
      }
    }
  ]

  const process = [
    { step: "1", title: "Book Your Appointment", description: "Schedule your consultation online or call us directly", icon: ClockIcon, color: "primary" },
    { step: "2", title: "Undergo a detailed assessment", description: "Our expert evaluates your condition, medical history, and specific needs", icon: CheckCircleIcon, color: "pastel-blue" },
    { step: "3", title: "Receive personalized treatment", description: "Evidence-based therapy tailored to your condition and recovery goals", icon: StarIcon, color: "pastel-mint" },
    { step: "4", title: "Track progress and improve", description: "Regular monitoring and adjustment of treatment based on your progress", icon: CheckCircleIcon, color: "tertiary" }
  ]

  const processColors = {
    primary: { bg: 'bg-primary-300', text: 'text-primary-500' },
    'pastel-blue': { bg: 'bg-pastel-blue-300', text: 'text-pastel-blue-400' },
    'pastel-mint': { bg: 'bg-pastel-mint-300', text: 'text-pastel-mint-400' },
    tertiary: { bg: 'bg-tertiary-300', text: 'text-tertiary-500' }
  }

  return (
    <section id="services" className="py-20 bg-white relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Header - Modern Typography */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="bg-pastel-mint-100 text-pastel-mint-400 px-5 py-2 rounded-full text-sm font-semibold">
              Our Services
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 font-display leading-tight"
          >
            Comprehensive Care
            <span className="block text-primary-400">For Every Need</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto font-light"
          >
            Professional physiotherapy services tailored to your unique recovery journey
          </motion.p>
        </div>

        {/* Services Grid - Simple Rounded Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {services.map((service, index) => {
            return (
              <motion.a
                key={index}
                href={service.href}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`${service.colorScheme.bg} rounded-2xl p-8 h-full transition-all duration-300 shadow-md hover:shadow-lg group flex flex-col`}
              >
                <div className="flex flex-col h-full">
                  <div className={`w-16 h-16 ${service.colorScheme.iconBg} border-2 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`h-8 w-8 ${service.colorScheme.text}`} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4 font-display">
                    {service.title}
                  </h3>
                  <p className="text-base text-gray-600 mb-6 leading-relaxed flex-grow">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 text-primary-700 font-bold group-hover:gap-4 transition-all duration-300">
                    <span>Learn More</span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </div>
                </div>
              </motion.a>
            )
          })}
        </div>

        {/* Advanced Therapies Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h3 className="text-4xl font-black text-gray-900 mb-4 font-display">
              <span className="text-primary-500">Advanced</span> Therapies
            </h3>
            <p className="text-lg text-gray-600 font-light">
              Evidence-based advanced treatments for comprehensive recovery
            </p>
          </div>
          <motion.a
            href="/services/advanced-therapies"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-gradient-to-br from-pastel-peach-50 to-pastel-sage-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 block max-w-2xl mx-auto group"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-pastel-peach-300 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <SparklesIcon className="h-10 w-10 text-white" />
              </div>
              <div className="flex-grow">
                <h4 className="text-2xl font-black text-gray-900 mb-2 font-display">
                  Advanced Therapy Treatments
                </h4>
                <p className="text-gray-600 mb-4">
                  Cupping, Dry Needling, IASTM, Kinesio Taping, Strength Training & more
                </p>
                <div className="flex items-center gap-2 text-primary-700 font-bold group-hover:gap-4 transition-all duration-300">
                  <span>Explore All Therapies</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
          </motion.a>
        </motion.div>

        {/* Process Section - Modern Floating Design */}
        <div className="bg-gradient-to-br from-primary-50 via-pastel-mint-50 to-pastel-sky-50 rounded-tl-[60px] rounded-br-[60px] rounded-tr-3xl rounded-bl-3xl p-10 shadow-xl">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-black text-gray-900 mb-4 font-display">
              How It <span className="text-primary-500">Works</span>
            </h3>
            <p className="text-lg text-gray-600 font-light">
              Our simple 4-step process ensures you get the best personalized care
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto py-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
            {process.map((step, index) => {
              const color = processColors[step.color as keyof typeof processColors]
                const isLast = index === process.length - 1
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
                              <div className={`absolute inset-0 ${color.bg} rounded-full opacity-20 blur-xl`}></div>
                              {/* Main circle */}
                              <div className={`relative w-20 h-20 ${color.bg} rounded-full flex items-center justify-center shadow-xl border-4 border-white`}>
                                <div className="text-white font-black text-2xl">{step.step}</div>
                              </div>
                              {/* Icon badge */}
                              <motion.div
                                initial={{ y: 0 }}
                                whileHover={{ y: -6, rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className={`absolute -top-1 -right-1 w-10 h-10 ${color.bg} rounded-full flex items-center justify-center shadow-lg border-2 border-white`}
                              >
                                <step.icon className="h-5 w-5 text-white" strokeWidth={2.5} />
                              </motion.div>
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="space-y-2">
                            <h4 className="text-lg font-black text-gray-900 font-display">{step.title}</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">{step.description}</p>
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

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-secondary-300 via-pastel-blue-300 to-tertiary-300 rounded-tl-[60px] rounded-br-[60px] rounded-tr-3xl rounded-bl-3xl p-12 text-white shadow-2xl">
            <h3 className="text-4xl font-black mb-4 font-display">
              Ready to Start Your <span className="text-white">Recovery</span> <span className="text-white">Journey</span>?
            </h3>
            <p className="text-lg mb-8 opacity-95 max-w-xl mx-auto font-light">
              Book your consultation today and take the first step towards better health.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBookHomeVisit}
                className="bg-white text-secondary-700 hover:bg-gray-50 font-bold py-4 px-8 rounded-2xl transition-all duration-300 text-center shadow-xl hover:scale-105 hover:-translate-y-0.5 active:scale-95"
              >
                Book Home Visit
              </button>
              <button
                onClick={handleBookTeleConsultation}
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-secondary-700 font-bold py-4 px-8 rounded-2xl transition-all duration-300 text-center shadow-lg hover:scale-105 hover:-translate-y-0.5 active:scale-95"
              >
                Online Consultation
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
