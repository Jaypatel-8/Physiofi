'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!formData.phone || !/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number'
    }
    
    if (formData.message && formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setFormData({ name: '', email: '', phone: '', message: '' })
      setValidationErrors({})
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const conditionCardPalette = [
    { bg: 'bg-primary-50', iconBg: 'bg-primary-100', iconColor: 'text-primary-600' },
    { bg: 'bg-pastel-blue-50', iconBg: 'bg-pastel-blue-100', iconColor: 'text-pastel-blue-600' },
    { bg: 'bg-pastel-mint-50', iconBg: 'bg-pastel-mint-100', iconColor: 'text-pastel-mint-600' },
    { bg: 'bg-pastel-lavender-50', iconBg: 'bg-pastel-lavender-100', iconColor: 'text-pastel-lavender-600' },
    { bg: 'bg-pastel-peach-50', iconBg: 'bg-pastel-peach-100', iconColor: 'text-pastel-peach-600' },
    { bg: 'bg-pastel-sage-50', iconBg: 'bg-pastel-sage-100', iconColor: 'text-pastel-sage-600' },
  ]
  const cardStyle = (index: number) => conditionCardPalette[index % conditionCardPalette.length]

  const contactInfo = [
    { icon: PhoneIcon, title: "Phone", details: ["+91 9082770384"], description: "Call us for immediate assistance" },
    { icon: EnvelopeIcon, title: "Email", details: ["contact@physiofi.com"], description: "Send us an email anytime" },
    { icon: MapPinIcon, title: "Locations", details: ["Ahmedabad", "Mumbai"], description: "We serve in these cities" },
    { icon: ClockIcon, title: "Hours", details: ["Mon-Sat: 8AM-8PM", "Sunday: 9AM-6PM", "Emergency: 24/7"], description: "We're here when you need us" }
  ]

  return (
    <section id="contact" className="section-py bg-pastel-mesh relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="text-center mb-10 sm:mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary-600 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase mb-3 sm:mb-4"
          >
            Contact
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 font-display leading-tight tracking-tight px-1"
          >
            Get in touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-xl mx-auto text-base sm:text-lg px-1"
          >
            We're here to help with appointments and questions
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {/* Contact Information - Book Design */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display tracking-tight">
                Contact information
              </h3>
              <p className="text-gray-500 mb-8 text-sm">
                Reach us by phone, email, or visit
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const style = cardStyle(index)
                return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className={`group relative flex items-start gap-3 sm:gap-4 ${style.bg} card-hover-premium border border-primary-200/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-hidden`}
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl flex items-center justify-center ${style.iconBg} ${style.iconColor}`}>
                    <info.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-semibold text-gray-900 mb-2 font-display tracking-tight">{info.title}</h4>
                    <div className="space-y-0.5 mb-2">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-700 font-medium">{detail}</p>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">{info.description}</p>
                  </div>
                </motion.div>
              )})}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-premium shadow-sm"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-600">
                  <PhoneIcon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h4 className="font-semibold text-gray-900 font-display tracking-tight">Emergency</h4>
              </div>
              <p className="text-gray-900 font-semibold text-lg mb-1">+91 9082770384</p>
              <p className="text-gray-500 text-sm">24/7 for emergencies</p>
            </motion.div>
          </motion.div>

          {/* Contact Form - Book Design */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-primary-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 border border-primary-200/40 shadow-sm"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 font-display tracking-tight">
              Send a message
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary-300 transition-all duration-300 text-lg ${
                    validationErrors.name ? 'border-red-300 focus:border-red-300' : 'border-gray-200 focus:border-primary-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary-300 transition-all duration-300 text-lg ${
                    validationErrors.email ? 'border-red-300 focus:border-red-300' : 'border-gray-200 focus:border-primary-300'
                  }`}
                  placeholder="Enter your email address"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary-300 transition-all duration-300 text-lg ${
                    validationErrors.phone ? 'border-red-300 focus:border-red-300' : 'border-gray-200 focus:border-primary-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all duration-300 text-lg resize-none ${
                    validationErrors.message ? 'border-red-300 focus:border-red-300' : 'border-gray-200 focus:border-primary-500'
                  }`}
                  placeholder="Tell us about your needs or ask any questions..."
                />
                {validationErrors.message && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 text-white font-semibold text-lg py-5 rounded-xl hover:bg-primary-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Send Message
              </button>
            </form>

            <div className="mt-8 text-center relative z-10">
              <p className="text-sm text-gray-500 font-medium">
                We'll get back to you within 24 hours
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
