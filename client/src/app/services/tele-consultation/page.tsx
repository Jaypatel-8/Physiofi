'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BookingPopup from '@/components/ui/BookingPopup'
import Breadcrumb from '@/components/conditions/Breadcrumb'
import ConditionHero from '@/components/conditions/ConditionHero'
import TreatmentList from '@/components/conditions/TreatmentList'
import WhyChooseSection from '@/components/conditions/WhyChooseSection'
import CTASection from '@/components/conditions/CTASection'
import ImageSection from '@/components/conditions/ImageSection'
import { motion } from 'framer-motion'
import { VideoCameraIcon, CalendarDaysIcon, DocumentTextIcon, ClockIcon, CheckCircleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

export default function TeleConsultationPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    const handleOpenBooking = () => {
      setIsBookingOpen(true)
    }
    window.addEventListener('openBooking', handleOpenBooking)
    return () => window.removeEventListener('openBooking', handleOpenBooking)
  }, [])

  const teleProcess = [
    {
      step: "1",
      title: "Online Booking",
      description: "Schedule your consultation through our easy online booking system.",
      icon: CalendarDaysIcon
    },
    {
      step: "2",
      title: "Video Call Assessment",
      description: "Join a secure video call with our expert physiotherapist for initial assessment.",
      icon: VideoCameraIcon
    },
    {
      step: "3",
      title: "Guided Movements",
      description: "Receive real-time guidance on exercises and movements during the session.",
      icon: ChatBubbleLeftRightIcon
    },
    {
      step: "4",
      title: "Exercise Plan",
      description: "Get a personalized exercise plan delivered via PDF and video demonstrations.",
      icon: DocumentTextIcon
    },
    {
      step: "5",
      title: "Follow-ups",
      description: "Regular follow-up sessions to track progress and adjust your treatment plan.",
      icon: ClockIcon
    }
  ]

  const benefits = [
    "Convenience from anywhere",
    "No travel required",
    "Flexible scheduling",
    "Access to expert care remotely",
    "Safe during health concerns",
    "Cost-effective solution"
  ]

  const requirements = [
    "Stable internet connection",
    "Smartphone, tablet, or computer",
    "Quiet, well-lit space",
    "Comfortable clothing for movement"
  ]

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24"></div>
      <Breadcrumb items={[
        { label: 'Services', href: '/services' },
        { label: 'Tele-Consultation Physiotherapy' }
      ]} />
      
      <ConditionHero
        title="Tele-Consultation Physiotherapy"
        description="Virtual physiotherapy sessions for posture correction, mild pain, ergonomic issues, fitness guidance, and remote follow-ups."
        imageAlt="Tele-consultation physiotherapy service"
        imagePath="/images/hero/tele-consultation.jpg"
      />

      {/* Tele Process Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4 font-display">
              <span className="text-primary-500">Tele-Consultation</span> <span className="text-primary-500">Process</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              Our simple 5-step process for online physiotherapy sessions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teleProcess.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-secondary-50 to-pastel-blue-50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                {/* Book Corner Effect */}
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-gray-200 opacity-60"></div>
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[35px] border-l-transparent border-t-[35px] border-t-gray-100 opacity-80"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-secondary-300 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                    <span className="text-2xl font-black text-white">{step.step}</span>
                  </div>
                  <div className="text-secondary-500 mb-3">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3 font-display">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TreatmentList
        treatments={benefits}
        title="Benefits of Tele-Consultation"
      />

      <ImageSection
        imageAlt="Tele-consultation physiotherapy illustration"
        title="Expert Care from Anywhere"
        description="Connect with our certified physiotherapists from the comfort of your home. Receive professional assessment, guided exercises, and personalized treatment plans through secure video consultations."
        imagePath="/images/hero/tele-consultation.jpg"
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
              What You'll <span className="text-primary-500">Need</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {requirements.map((requirement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 bg-pastel-lavender-50 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-pastel-lavender-300 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <CheckCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">{requirement}</p>
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

