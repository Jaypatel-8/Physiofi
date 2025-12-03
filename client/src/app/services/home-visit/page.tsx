'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BookingPopup from '@/components/ui/BookingPopup'
import Breadcrumb from '@/components/conditions/Breadcrumb'
import ConditionHero from '@/components/conditions/ConditionHero'
import SymptomsList from '@/components/conditions/SymptomsList'
import TreatmentList from '@/components/conditions/TreatmentList'
import WhyChooseSection from '@/components/conditions/WhyChooseSection'
import CTASection from '@/components/conditions/CTASection'
import ImageSection from '@/components/conditions/ImageSection'
import { motion } from 'framer-motion'
import { CheckCircleIcon, HomeIcon, ClockIcon, UserGroupIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function HomeVisitPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    const handleOpenBooking = () => {
      setIsBookingOpen(true)
    }
    window.addEventListener('openBooking', handleOpenBooking)
    return () => window.removeEventListener('openBooking', handleOpenBooking)
  }, [])

  const steps = [
    {
      step: "1",
      title: "Contact & Booking",
      description: "Call us or book online. Share your location and preferred time slot.",
      icon: HomeIcon
    },
    {
      step: "2",
      title: "Physiotherapist Arrives",
      description: "Our certified therapist arrives at your home at the scheduled time.",
      icon: UserGroupIcon
    },
    {
      step: "3",
      title: "Assessment",
      description: "Comprehensive evaluation of your condition and treatment needs.",
      icon: ShieldCheckIcon
    },
    {
      step: "4",
      title: "Personalized Care",
      description: "Tailored treatment session using evidence-based techniques.",
      icon: CheckCircleIcon
    },
    {
      step: "5",
      title: "Home Exercise Plan",
      description: "Receive a customized exercise plan to continue recovery at home.",
      icon: ClockIcon
    },
    {
      step: "6",
      title: "Follow-up Tracking",
      description: "Regular follow-ups to monitor progress and adjust treatment.",
      icon: CheckCircleIcon
    }
  ]

  const benefits = [
    "Comfort of your own home",
    "No travel time or parking hassles",
    "Personalized one-on-one attention",
    "Family members can observe and learn",
    "Reduced risk of infections",
    "Flexible scheduling options"
  ]

  const relatedConditions = [
    "Post-operative rehabilitation",
    "Geriatric care",
    "Pediatric physiotherapy",
    "Chronic pain management",
    "Neurological conditions",
    "Sports injury recovery"
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24"></div>
      <Breadcrumb items={[
        { label: 'Services', href: '/services' },
        { label: 'Home Visit Physiotherapy' }
      ]} />
      
      <ConditionHero
        title="Home Visit Physiotherapy"
        description="A physiotherapist visits your home for fully personalized treatment. Ideal for seniors, post-surgery patients, working individuals, children, and those needing comfort-driven recovery."
        imageAlt="Home visit physiotherapy service"
        imagePath="/images/hero/home-visit.jpg"
      />

      {/* Steps Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4 font-display">
              How It <span className="text-primary-500">Works</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              Our simple 6-step process ensures you receive the best care at home
            </p>
          </motion.div>

          <div className="relative max-w-6xl mx-auto py-12 overflow-hidden">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
              {steps.map((step, index) => {
                const isLast = index === steps.length - 1
                const isSecondLast = index === steps.length - 2
                const isThirdLast = index === steps.length - 3
                return (
                  <div key={index} className="relative">
                    {/* Visual Flow Connector */}
                    {!isLast && !isSecondLast && !isThirdLast && (
                      <div className="absolute top-1/2 left-full hidden lg:flex items-center justify-center z-0" style={{ width: 'calc(100% - 1rem)', transform: 'translateY(-50%)', marginLeft: '0.5rem' }}>
                        <div className="flex items-center gap-1 w-full max-w-[80px]">
                          <div className="flex-1 h-0.5 bg-gradient-to-r from-primary-300 to-primary-200"></div>
                          <div className="w-2.5 h-2.5 bg-primary-300 rounded-full flex-shrink-0"></div>
                          <div className="flex-1 h-0.5 bg-gradient-to-r from-primary-200 to-primary-300"></div>
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
                            <div className="w-24 h-24 mx-auto relative">
                              {/* Outer glow ring */}
                              <div className="absolute inset-0 bg-primary-300 rounded-full opacity-20 blur-xl"></div>
                              {/* Main circle */}
                              <div className="relative w-24 h-24 bg-primary-300 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                                <div className="text-white font-black text-2xl">{step.step}</div>
                              </div>
                              {/* Icon badge */}
                              <motion.div
                                initial={{ y: 0 }}
                                whileHover={{ y: -6, rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="absolute -top-1 -right-1 w-12 h-12 bg-primary-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                              >
                                <step.icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                              </motion.div>
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="space-y-2">
                            <h3 className="text-lg font-black text-gray-900 font-display">{step.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
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

      <TreatmentList
        treatments={benefits}
        title="Benefits of Home Visit Physiotherapy"
      />

      <ImageSection
        imageAlt="Physiotherapy care illustration"
        title="Expert Care at Your Doorstep"
        description="Our certified physiotherapists bring professional treatment directly to your home, ensuring comfort, convenience, and personalized attention throughout your recovery journey."
        imagePath="/images/hero/physiotherapy-care .jpg"
      />

      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-8 font-display text-center">
              Related Conditions We <span className="text-primary-500">Treat</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedConditions.map((condition, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-pastel-sage-50 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <p className="text-gray-700 font-semibold">{condition}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <WhyChooseSection />
      <CTASection />
      <Footer />
      <BookingPopup 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
      />
    </main>
  )
}

