'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BookingPopup from '@/components/ui/BookingPopup'
import Breadcrumb from '@/components/conditions/Breadcrumb'
import { CONDITIONS } from '@/data/conditions'
import { getConditionIcon } from '@/data/conditionIcons'

function ConditionCardIcon({ slug, iconColor }: { slug: string; iconColor: string }) {
  const Icon = getConditionIcon(slug)
  return <Icon className={`h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 ${iconColor}`} />
}

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
      <div className="pt-20 sm:pt-24" />
      <Breadcrumb items={[
        { label: 'Services', href: '/services' },
        { label: 'Conditions' }
      ]} />
      
      {/* Hero Section */}
      <section className="section-py bg-gradient-to-br from-primary-50 via-pastel-mint-50 to-pastel-sky-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-block mb-3 sm:mb-4"
            >
              <span className="bg-primary-100 text-primary-800 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                Conditions We Treat
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 font-display leading-tight px-1"
            >
              Conditions We <span className="text-primary-500">Treat</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18 }}
              className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed px-1"
            >
              Expert physiotherapy treatment for a wide range of conditions. Our certified therapists provide personalized care to help you recover and improve your quality of life.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Conditions Grid */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {CONDITIONS.map((condition, index) => (
              <motion.div
                key={condition.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -2, scale: 1.01 }}
              >
                <Link href={condition.href} className="block">
                  <div className={`site-card ${condition.color} rounded-2xl p-4 sm:p-5 md:p-6 h-full flex items-start gap-3 sm:gap-4 cursor-pointer group min-w-0`}>
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 ${condition.color} rounded-xl flex items-center justify-center flex-shrink-0 border border-white/80 shadow-sm group-hover:scale-105 transition-transform`}>
                      <ConditionCardIcon slug={condition.slug} iconColor={condition.iconColor} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="text-base sm:text-lg site-card-title font-display mb-1 group-hover:text-primary-600 transition-colors leading-snug">
                        {condition.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
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
      <section className="section-py bg-gradient-to-r from-primary-300 via-pastel-mint-300 to-pastel-sky-300">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto px-1"
          >
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-4 sm:mb-6 font-display leading-tight"
            >
              Ready to Start Your <span className="text-yellow-200">Recovery</span>?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-base sm:text-xl text-white/95 mb-6 sm:mb-8 font-light"
            >
              Book a consultation with our expert physiotherapists today
            </motion.p>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="bg-white text-primary-700 hover:bg-gray-50 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
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




