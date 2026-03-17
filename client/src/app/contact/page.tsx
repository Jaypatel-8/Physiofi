'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/ui/PageHero'
import { formatPhoneInput, getIndianMobileError, isValidEmail } from '@/lib/validation'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)


  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email || !isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    const phoneErr = formData.phone ? getIndianMobileError(formData.phone) : 'Phone number is required'
    if (phoneErr) errors.phone = phoneErr
    
    if (!formData.subject) {
      errors.subject = 'Please select a subject'
    }
    
    if (!formData.message || formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      setValidationErrors({})
    }, 2000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'phone') {
      setFormData(prev => ({ ...prev, phone: formatPhoneInput(value) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="page-top-spacing" />

      <PageHero
        label="Contact"
        title="Get in touch"
        subtitle="Questions, appointments, or support — we're here for your recovery journey."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 py-8 sm:py-10 md:py-14 lg:py-16 bg-pastel-mesh min-h-[50vh]">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card-1 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-premium shadow-sm"
          >
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-xl font-semibold text-gray-900 mb-6 tracking-tight"
            >
              Send us a message
            </motion.h2>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent Successfully!</h3>
                <p className="text-gray-600">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors duration-300 ${
                        validationErrors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                      }`}
                      placeholder="Your full name"
                    />
                    {validationErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      maxLength={10}
                      inputMode="numeric"
                      autoComplete="tel"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors duration-300 ${
                        validationErrors.phone ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                      }`}
                      placeholder="10-digit Indian mobile (e.g. 9876543210)"
                    />
                    {validationErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 transition-colors duration-300 ${
                        validationErrors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-transparent'
                      }`}
                      placeholder="your.email@example.com"
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                    )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 transition-colors duration-300 ${
                        validationErrors.subject ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-transparent'
                      }`}
                    >
                    <option value="">Select a subject</option>
                    <option value="appointment">Book an Appointment</option>
                    <option value="consultation">Online Consultation</option>
                    <option value="service">Service Inquiry</option>
                    <option value="career">Career Opportunity</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 transition-colors duration-300 resize-none ${
                        validationErrors.message ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-transparent'
                      }`}
                      placeholder="Tell us how we can help you..."
                    />
                    {validationErrors.message && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.message}</p>
                    )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-accent-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <div className="bg-card-2 rounded-2xl p-8 border border-premium shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 tracking-tight">Contact information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="h-6 w-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+91 9082770384</p>
                    <p className="text-sm text-gray-500">Available 9 AM - 6 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <EnvelopeIcon className="h-6 w-6 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">info@physiofi.com</p>
                    <p className="text-sm text-gray-500">We&apos;ll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="h-6 w-6 text-secondary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">
                      Science City Road<br />
                      Ahmedabad, Gujarat 380060<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-teal-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Working Hours</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 2:00 PM</p>
                      <p>Sunday: Emergency Only</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-accent-50 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-accent-800 mb-3">Emergency Contact</h3>
              <p className="text-accent-700 mb-4">
                For urgent physiotherapy needs outside business hours, call our emergency line.
              </p>
              <a
                href="tel:+919082770384"
                className="text-accent-600 font-semibold text-lg hover:text-accent-700 transition-colors duration-300"
              >
                +91 9082770384
              </a>
            </div>

            {/* Service Areas */}
            <div className="bg-card-1 rounded-2xl p-8 border border-premium shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">Service areas</h3>
              <p className="text-gray-600 mb-4">
                We provide home physiotherapy services across Ahmedabad:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>• Vastrapur</div>
                <div>• Satellite</div>
                <div>• Science City</div>
                <div>• Bopal</div>
                <div>• Thaltej</div>
                <div>• Prahladnagar</div>
                <div>• Bodakdev</div>
                <div>• And more...</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ContactPage



