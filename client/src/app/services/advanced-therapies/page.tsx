'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Breadcrumb from '@/components/conditions/Breadcrumb'
import Image from 'next/image'
import { 
  ArrowRightIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  BoltIcon,
  ArrowPathIcon,
  HeartIcon,
  UserIcon
} from '@heroicons/react/24/outline'

// Therapy imagery – smaller size for faster load (Unsplash)
const advancedTherapies = [
  { id: 'cupping', name: 'Cupping Therapy', description: 'A suction-based therapy using silicone or vacuum cups to relieve muscle tightness and improve blood flow.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=65', href: '/services/advanced-therapies/cupping-therapy' },
  { id: 'dry-needling', name: 'Dry Needling', description: 'Sterile needles target deep muscle trigger points for fast pain relief.', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=65', href: '/services/advanced-therapies/dry-needling' },
  { id: 'manual', name: 'Manual Therapy', description: 'Hands-on techniques for pain relief and improving joint movement.', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=65', href: '/services/advanced-therapies/manual-therapy' },
  { id: 'soft-tissue', name: 'Soft Tissue Mobilisation', description: 'Breaks muscle adhesions and reduces chronic tightness.', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=65', href: '/services/advanced-therapies/soft-tissue-mobilisation' },
  { id: 'kinesio', name: 'Kinesio Taping', description: 'Supports joints & reduces pain using elastic therapeutic tape.', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=65', href: '/services/advanced-therapies/kinesio-taping' },
  { id: 'strength', name: 'Strength & Conditioning', description: 'Exercise-based therapy for long-term recovery and fitness.', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=65', href: '/services/advanced-therapies/strength-conditioning' },
  { id: 'neuro', name: 'Neuro Physiotherapy', description: 'For movement disorders caused by neurological conditions.', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=65', href: '/services/advanced-therapies/neuro-physiotherapy' },
  { id: 'posture', name: 'Posture Correction Therapy', description: 'Fixes posture-related pain & improves alignment.', image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&q=65', href: '/services/advanced-therapies/posture-correction' },
  { id: 'balance', name: 'Balance & Gait Training', description: 'Improves walking stability and prevents falls.', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&q=65', href: '/services/advanced-therapies/balance-gait-training' },
  { id: 'pediatric', name: 'Advanced Pediatric Physiotherapy', description: 'For kids with developmental or motor delays.', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=65', href: '/services/advanced-therapies/pediatric-advanced' },
]

export default function AdvancedTherapiesPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24"></div>
      <Breadcrumb items={[
        { label: 'Services', href: '/services' },
        { label: 'Advanced Therapies' }
      ]} />

      {/* Hero Section */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="bg-primary-100 text-primary-800 px-5 py-2 rounded-full text-sm font-semibold">
                Advanced Therapies
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-display leading-tight"
            >
              <span className="text-primary-500">Advanced</span> <span className="text-primary-500">Therapies</span>
              <span className="block">Treatments</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto font-light"
            >
              Evidence-based advanced therapies including Cupping, Dry Needling, IASTM & more for comprehensive recovery
            </motion.p>
          </div>

          {/* Therapies Grid with Flip Animation */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {advancedTherapies.map((therapy, index) => (
              <motion.div
                key={therapy.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="h-80 perspective-1000"
                onMouseEnter={() => setHoveredCard(therapy.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`relative w-full h-full preserve-3d transition-transform duration-700 ${hoveredCard === therapy.id ? 'rotate-y-180' : ''}`}>
                  {/* Front of Card */}
                  <div className="absolute inset-0 backface-hidden bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="relative h-full">
                      <div className="relative h-3/4 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
                        <Image
                          src={therapy.image}
                          alt={therapy.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                          unoptimized
                          loading={index < 3 ? "eager" : "lazy"}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            if (target) target.style.display = 'none'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white">
                        <h3 className="text-xl site-card-title font-display">
                          {therapy.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Back of Card */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 site-card p-6 flex flex-col justify-between border-primary-200/60">
                    <div>
                      <h3 className="text-xl site-card-title font-display mb-4">
                        {therapy.name}
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {therapy.description}
                      </p>
                    </div>
                    <Link
                      href={therapy.href}
                      className="w-full bg-primary-300 text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-400 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl"
                    >
                      <span>Learn More</span>
                      <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Advanced Therapies Section */}
      <section className="section-py bg-primary-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 font-display">
              Why Choose Advanced Therapies?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Our advanced therapy treatments complement traditional physiotherapy, offering targeted solutions for faster recovery and better outcomes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Targeted Treatment",
                description: "Precise techniques that address specific muscle groups and trigger points for faster relief.",
                icon: CheckCircleIcon
              },
              {
                title: "Evidence-Based",
                description: "All therapies are backed by scientific research and proven to be effective.",
                icon: AcademicCapIcon
              },
              {
                title: "Faster Recovery",
                description: "Advanced techniques can accelerate healing and reduce treatment duration.",
                icon: BoltIcon
              },
              {
                title: "Comprehensive Care",
                description: "Combined with traditional physiotherapy for holistic treatment approach.",
                icon: ArrowPathIcon
              },
              {
                title: "Pain Management",
                description: "Effective solutions for chronic pain, muscle tension, and mobility issues.",
                icon: HeartIcon
              },
              {
                title: "Personalized Plans",
                description: "Each therapy is customized based on your specific condition and needs.",
                icon: UserIcon
              }
            ].map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                >
                  {/* Book Corner Effect */}
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-primary-100"></div>
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[35px] border-l-transparent border-t-[35px] border-t-primary-50"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center mb-6 border-2 border-gray-200">
                      <IconComponent className="h-8 w-8 text-gray-700" strokeWidth={2} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-3 font-display">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section - Curved Line Design */}
      <section className="section-py bg-white relative overflow-hidden">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 font-display">
              How Advanced Therapies <span className="text-primary-500">Work</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Our advanced therapy treatments are integrated into your personalized physiotherapy plan
            </p>
          </motion.div>

          <div className="relative max-w-6xl mx-auto py-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {[
                { step: "1", title: "Assessment", description: "We evaluate your condition to determine the best advanced therapy approach", icon: CheckCircleIcon },
                { step: "2", title: "Selection", description: "Choose the most suitable advanced therapy based on your needs", icon: AcademicCapIcon },
                { step: "3", title: "Treatment", description: "Receive targeted therapy sessions from certified physiotherapists", icon: BoltIcon },
                { step: "4", title: "Progress", description: "Monitor improvements and adjust treatment plan as needed", icon: ArrowPathIcon }
              ].map((step, index, array) => {
                const IconComponent = step.icon
                const isLast = index === array.length - 1
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
                      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden border-2 border-primary-100 h-full flex flex-col">
                        {/* Book Corner Effect */}
                        <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
                        <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>
                        
                        <div className="relative z-10">
                          {/* Step Number Badge */}
                          <div className="relative mb-6">
                            <div className="w-20 h-20 mx-auto relative">
                              {/* Outer glow ring */}
                              <div className="absolute inset-0 bg-primary-300 rounded-full opacity-20 blur-xl"></div>
                              {/* Main circle */}
                              <div className="relative w-20 h-20 bg-primary-300 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                                <div className="text-white font-black text-2xl">{step.step}</div>
                              </div>
                              {/* Icon badge */}
                              <motion.div
                                initial={{ y: 0 }}
                                whileHover={{ y: -6, rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="absolute -top-1 -right-1 w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                              >
                                <IconComponent className="h-5 w-5 text-white" strokeWidth={2.5} />
                              </motion.div>
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="space-y-2 flex-grow flex flex-col justify-center">
                            <h3 className="text-lg font-black text-gray-900 font-display mb-2">
                              {step.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {step.description}
                            </p>
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

      {/* CTA Section */}
      <section className="section-py bg-primary-300">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 font-display">
              Ready to Experience Advanced Therapy?
            </h2>
            <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto font-light">
              Book a consultation to learn which advanced therapy is best suited for your condition
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-primary-700 hover:bg-gray-50 font-black px-8 py-4 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl text-lg hover:scale-105 hover:-translate-y-0.5 active:scale-95 inline-block"
              >
                Book Consultation
              </Link>
              <Link
                href="/services"
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-primary-700 font-black px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl text-lg hover:scale-105 hover:-translate-y-0.5 active:scale-95 inline-block"
              >
                View All Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

