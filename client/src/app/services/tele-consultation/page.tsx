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
import { PhoneIcon, CalendarDaysIcon, DocumentTextIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function TeleConsultationPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [bookingType, setBookingType] = useState<'home' | 'tele'>('tele')

  useEffect(() => {
    const handleOpenBooking = (e: Event) => {
      const customEvent = e as CustomEvent
      const type = customEvent.detail?.type === 'tele' ? 'tele' : 'home'
      setBookingType(type)
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
      title: "Phone Consultation",
      description: "Receive a phone call from our expert physiotherapist for initial assessment and consultation.",
      icon: PhoneIcon
    },
    {
      step: "3",
      title: "Exercise Guidance",
      description: "Receive detailed guidance on exercises and movements tailored to your condition.",
      icon: DocumentTextIcon
    },
    {
      step: "4",
      title: "Exercise Plan",
      description: "Get a personalized exercise plan delivered via PDF with detailed instructions.",
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
    "Phone with good network connection",
    "Quiet space for consultation",
    "List of symptoms and concerns ready",
    "Any previous medical reports (optional)"
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
        description="Virtual physiotherapy sessions for posture correction, mild pain, ergonomic issues, fitness guidance, and remote follow-ups. Connect with our expert physiotherapists from anywhere through phone consultations and receive personalized exercise plans."
        imageAlt="Tele-consultation physiotherapy service"
        imagePath="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=70"
      />

      {/* Additional Content Section */}
      <section className="py-16 bg-gradient-to-br from-secondary-50 to-pastel-blue-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-black text-gray-900 font-display">
                Expert Care <span className="text-primary-500">From Anywhere</span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our tele-consultation service brings professional physiotherapy care directly to you, no matter where you are. Through phone consultations, our certified physiotherapists provide comprehensive assessments, personalized exercise guidance, and ongoing support for your recovery journey.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Perfect for busy professionals, individuals with mobility challenges, or those who prefer the convenience of remote consultations. Receive the same quality care and attention as in-person sessions, tailored to your specific needs and schedule.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Posture Correction', 'Pain Management', 'Ergonomic Guidance', 'Fitness Programs', 'Remote Follow-ups'].map((tag, idx) => (
                  <span key={idx} className="bg-card-1 px-4 py-2 rounded-full text-sm font-medium text-primary-700 border border-premium">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-secondary-200 to-pastel-blue-200 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <PhoneIcon className="h-16 w-16 text-secondary-600" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Phone Consultation</h3>
                    <p className="text-gray-700">Expert guidance at your convenience</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tele Process Section */}
      <section className="py-16 bg-pastel-mesh">
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
                className={`card-hover-premium rounded-2xl p-6 ${['bg-card-1', 'bg-card-2', 'bg-card-3', 'bg-card-1', 'bg-card-2'][index]}`}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-600 font-semibold flex items-center justify-center mb-4">
                  {step.step}
                </div>
                <step.icon className="h-6 w-6 text-primary-500 mb-3" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-display tracking-tight">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
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
        description="Connect with our certified physiotherapists from the comfort of your home. Receive professional assessment, guided exercises, and personalized treatment plans through phone consultations."
        imagePath="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=70"
      />

      <section className="py-16 bg-pastel-mesh">
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
        defaultServiceType={bookingType}
      />
    </main>
  )
}

