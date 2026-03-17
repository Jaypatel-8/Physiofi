'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Breadcrumb from '@/components/conditions/Breadcrumb'
import ConditionHero from '@/components/conditions/ConditionHero'
import Image from 'next/image'
import { 
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function CuppingTherapyPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24"></div>
      <Breadcrumb items={[
        { label: 'Services', href: '/services' },
        { label: 'Advanced Therapies', href: '/services/advanced-therapies' },
        { label: 'Cupping Therapy' }
      ]} />

      <ConditionHero
        title="Cupping Therapy"
        description="A suction-based therapy using silicone or vacuum cups to relieve muscle tightness and improve blood flow."
        imageAlt="Cupping therapy treatment"
      />

      {/* What It Is Section */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-primary-50 rounded-3xl p-10 shadow-lg relative overflow-hidden">
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-t-[60px] border-t-primary-200"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[55px] border-l-transparent border-t-[55px] border-t-primary-100"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl font-black text-gray-900 mb-6 font-display">What It Is</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  A suction-based therapy using silicone or vacuum cups to relieve muscle tightness and improve blood flow. 
                  The cups create negative pressure that lifts the skin and underlying tissues, promoting healing and relaxation.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Used For Section */}
      <section className="section-py bg-primary-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-8 font-display text-center">Used For</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Back pain',
                'Neck stiffness',
                'Shoulder tightness',
                'Sports injuries',
                'Fibromyalgia',
                'Trigger points'
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <CheckCircleIcon className="h-6 w-6 text-primary-400 flex-shrink-0" strokeWidth={2} />
                  <span className="text-gray-700 font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How We Do It Section */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-12 font-display text-center">How We Do It</h2>
            
            <div className="relative max-w-2xl mx-auto">
              <div className="space-y-12 relative">
                {[
                  { step: '1', title: 'Apply cups', description: 'Cups are placed on the affected area' },
                  { step: '2', title: 'Gentle suction', description: 'Suction is created to lift the skin and tissues' },
                  { step: '3', title: 'Hold 5–10 min', description: 'Cups remain in place for therapeutic effect' },
                  { step: '4', title: 'Release', description: 'Cups are gently removed' },
                  { step: '5', title: 'Light massage', description: 'Gentle massage to enhance circulation' }
                ].map((step, index, array) => {
                  const isLast = index === array.length - 1
                  return (
                    <div key={index} className="relative">
                      {/* Visual Flow Connector (vertical) */}
                      {!isLast && (
                        <div className="absolute left-10 top-full hidden lg:flex flex-col items-center justify-center z-0" style={{ height: '100%', transform: 'translateX(-50%)', marginTop: '0.5rem' }}>
                          <div className="flex flex-col items-center gap-1">
                            <div className="h-8 w-0.5 bg-gradient-to-b from-primary-300 to-primary-200"></div>
                            <div className="w-2.5 h-2.5 bg-primary-300 rounded-full"></div>
                            <div className="h-8 w-0.5 bg-gradient-to-b from-primary-200 to-primary-300"></div>
                          </div>
                        </div>
                      )}
                      
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15, type: "spring" }}
                        whileHover={{ x: 8, scale: 1.02 }}
                        className="flex items-center gap-6 relative z-10"
                      >
                        {/* Enhanced Process Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden border-2 border-primary-100 flex items-center gap-6 flex-grow">
                          {/* Book Corner Effect */}
                          <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
                          <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>
                          
                          <div className="relative z-10 flex items-center gap-6 w-full">
                            {/* Step Number Badge */}
                            <div className="flex-shrink-0">
                              <div className="w-20 h-20 relative">
                                {/* Outer glow ring */}
                                <div className="absolute inset-0 bg-primary-300 rounded-full opacity-20 blur-xl"></div>
                                {/* Main circle */}
                                <div className="relative w-20 h-20 bg-primary-300 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                                  <div className="text-white font-black text-2xl">{step.step}</div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-grow">
                              <h3 className="text-xl font-black text-gray-900 mb-2 font-display">{step.title}</h3>
                              <p className="text-gray-700 leading-relaxed">{step.description}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Duration & Benefits */}
      <section className="section-py bg-primary-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg relative overflow-hidden"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                  <ClockIcon className="h-8 w-8 text-primary-600" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 font-display">Duration</h3>
              </div>
              <p className="text-lg text-gray-700">
                10–25 minutes depending on condition
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg relative overflow-hidden"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                  <CheckCircleIcon className="h-8 w-8 text-primary-600" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 font-display">Benefits</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Muscle relaxation',
                  'Pain relief',
                  'Improved circulation',
                  'Enhanced mobility'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-primary-400 flex-shrink-0" strokeWidth={2} />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-py bg-primary-300">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 font-display">
              Ready to Experience Cupping Therapy?
            </h2>
            <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto font-light">
              Book a consultation to see if cupping therapy is right for you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-primary-700 hover:bg-gray-50 font-black px-8 py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl text-lg hover:scale-105 hover:-translate-y-0.5 active:scale-95 inline-flex items-center justify-center gap-2"
              >
                <span>Book Consultation</span>
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link
                href="/services/advanced-therapies"
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-primary-700 font-black px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl text-lg hover:scale-105 hover:-translate-y-0.5 active:scale-95 inline-flex items-center justify-center gap-2"
              >
                <span>View All Therapies</span>
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

