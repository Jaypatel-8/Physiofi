'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BookingPopup from '@/components/ui/BookingPopup'
import Breadcrumb from '@/components/conditions/Breadcrumb'
import { 
  HomeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const conditions = [
  { name: 'Low Back Pain / Sciatica', href: '/conditions/low-back-pain', color: 'bg-primary-50', iconColor: 'text-primary-600' },
  { name: 'Neck Pain / Cervical Spondylosis', href: '/conditions/neck-pain', color: 'bg-secondary-50', iconColor: 'text-secondary-600' },
  { name: 'Shoulder Pain', href: '/conditions/shoulder-pain', color: 'bg-tertiary-50', iconColor: 'text-tertiary-600' },
  { name: 'Knee Pain', href: '/conditions/knee-pain', color: 'bg-pastel-blue-50', iconColor: 'text-pastel-blue-600' },
  { name: 'Sports Injuries', href: '/conditions/sports-injuries', color: 'bg-pastel-mint-50', iconColor: 'text-pastel-mint-600' },
  { name: 'Post-Operative Rehabilitation', href: '/conditions/post-operative', color: 'bg-pastel-lavender-50', iconColor: 'text-pastel-lavender-600' },
  { name: 'Stroke Rehabilitation', href: '/conditions/stroke-rehabilitation', color: 'bg-pastel-peach-50', iconColor: 'text-pastel-peach-600' },
  { name: "Parkinson's Disease", href: '/conditions/parkinsons', color: 'bg-pastel-sage-50', iconColor: 'text-pastel-sage-600' },
  { name: 'Spinal Cord Injury', href: '/conditions/spinal-cord-injury', color: 'bg-primary-50', iconColor: 'text-primary-600' },
  { name: 'COPD / Asthma / Breathing Issues', href: '/conditions/copd-asthma', color: 'bg-pastel-lavender-50', iconColor: 'text-pastel-lavender-600' },
  { name: 'Post-COVID Recovery', href: '/conditions/post-covid', color: 'bg-pastel-peach-50', iconColor: 'text-pastel-peach-600' },
  { name: 'Pediatric Physiotherapy', href: '/conditions/pediatric-developmental', color: 'bg-pastel-sage-50', iconColor: 'text-pastel-sage-600' },
  { name: 'Torticollis (Children)', href: '/conditions/torticollis', color: 'bg-primary-50', iconColor: 'text-primary-600' },
  { name: 'Balance Problems (Geriatric)', href: '/conditions/balance-problems', color: 'bg-pastel-blue-50', iconColor: 'text-pastel-blue-600' },
  { name: 'Osteoporosis', href: '/conditions/osteoporosis', color: 'bg-pastel-mint-50', iconColor: 'text-pastel-mint-600' },
  { name: 'Pregnancy-Related Pain', href: '/conditions/pregnancy-pain', color: 'bg-pastel-lavender-50', iconColor: 'text-pastel-lavender-600' },
  { name: 'Urinary Incontinence', href: '/conditions/urinary-incontinence', color: 'bg-pastel-peach-50', iconColor: 'text-pastel-peach-600' },
]

export default function ConditionsPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    const handleOpenBooking = () => setIsBookingOpen(true)
    window.addEventListener('openBooking', handleOpenBooking)
    return () => window.removeEventListener('openBooking', handleOpenBooking)
  }, [])

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24"></div>
      <Breadcrumb items={[
        { label: 'Services', href: '/services' },
        { label: 'Conditions' }
      ]} />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-pastel-mint-50 to-pastel-sky-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-block mb-4"
            >
              <span className="bg-primary-100 text-primary-800 px-5 py-2 rounded-full text-sm font-semibold">
                Conditions We Treat
              </span>
            </motion.div>
            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 font-display leading-tight">
              Conditions We <span className="text-primary-500">Treat</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Expert physiotherapy treatment for a wide range of conditions. Our certified therapists provide personalized care to help you recover and improve your quality of life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Conditions Grid */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conditions.map((condition, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Link href={condition.href}>
                  <div className={`${condition.color} rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 h-full flex items-start gap-4 cursor-pointer group`}>
                    <div className={`w-12 h-12 ${condition.color} rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-white shadow-md group-hover:scale-110 transition-transform`}>
                      <CheckCircleIcon className={`h-6 w-6 ${condition.iconColor}`} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-black text-gray-900 mb-2 font-display group-hover:text-primary-600 transition-colors">
                        {condition.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Learn more about treatment options
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-300 via-pastel-mint-300 to-pastel-sky-300">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 font-display">
              Ready to Start Your <span className="text-yellow-200">Recovery</span>?
            </h2>
            <p className="text-xl text-white/95 mb-8 font-light">
              Book a consultation with our expert physiotherapists today
            </p>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="bg-white text-primary-700 hover:bg-gray-50 font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-xl hover:scale-105 hover:-translate-y-0.5 active:scale-95"
            >
              Book Consultation
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <BookingPopup isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </main>
  )
}



