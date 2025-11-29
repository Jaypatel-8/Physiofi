'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, CheckCircleIcon, QuestionMarkCircleIcon, SparklesIcon } from '@heroicons/react/24/outline'
import Modal from './Modal'

interface BookingPopupProps {
  isOpen: boolean
  onClose: () => void
  defaultServiceType?: 'home' | 'tele'
}

const BookingPopup = ({ isOpen, onClose, defaultServiceType = 'home' }: BookingPopupProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceType: defaultServiceType,
    preferredTime: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showHelper, setShowHelper] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, serviceType: defaultServiceType }))
      setShowSuccess(false)
      setShowHelper(false)
    }
  }, [isOpen, defaultServiceType])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleToggleHelper = () => {
    setShowHelper(prev => !prev)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.phone || !formData.preferredTime) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setShowSuccess(true)
      
      setTimeout(() => {
        setShowSuccess(false)
        onClose()
        setFormData({
          name: '',
          phone: '',
          serviceType: defaultServiceType,
          preferredTime: ''
        })
      }, 3000)
    } catch (error) {
      console.error('Booking error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
  ]

  const specialistGuide = [
    {
      condition: 'Back Pain, Neck Pain, Shoulder Pain',
      specialist: 'Orthopedic Physiotherapist',
      icon: '🦴',
      color: 'bg-blue-500'
    },
    {
      condition: 'Sports Injury, Athletic Recovery',
      specialist: 'Sports Physiotherapist',
      icon: '⚽',
      color: 'bg-green-500'
    },
    {
      condition: 'Post-Surgery (Knee, Hip, Spine)',
      specialist: 'Rehabilitation Specialist',
      icon: '🏥',
      color: 'bg-purple-500'
    },
    {
      condition: 'Children\'s Development, Motor Skills',
      specialist: 'Pediatric Physiotherapist',
      icon: '👶',
      color: 'bg-pink-500'
    },
    {
      condition: 'Stroke, Parkinson\'s, Neurological',
      specialist: 'Neurological Physiotherapist',
      icon: '🧠',
      color: 'bg-orange-500'
    },
    {
      condition: 'Elderly Care, Balance, Mobility',
      specialist: 'Geriatric Physiotherapist',
      icon: '👴',
      color: 'bg-teal-500'
    }
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="md">
      <AnimatePresence mode="wait">
        {!showSuccess ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-br from-blue-500 via-teal-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-3xl">📅</span>
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Your Appointment</h2>
              <p className="text-gray-600">Quick & Easy - Just 2 minutes!</p>
            </div>

            {/* Helper Button */}
            <button
              onClick={handleToggleHelper}
              className="w-full mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 active:scale-95"
            >
              <QuestionMarkCircleIcon className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-purple-700">Don't know which specialist to book?</span>
            </button>

            {/* Specialist Guide */}
            <AnimatePresence>
              {showHelper && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200"
                >
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                    <SparklesIcon className="h-5 w-5 text-purple-600" />
                    <span>Which Specialist Do You Need?</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                    {specialistGuide.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${item.color} bg-opacity-10 border-2 ${item.color.replace('bg-', 'border-')} rounded-lg p-3`}
                      >
                        <div className="flex items-start space-x-2">
                          <span className="text-2xl">{item.icon}</span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{item.condition}</p>
                            <p className="text-xs text-gray-600 mt-1">→ {item.specialist}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="+91 98765 43210"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="serviceType" className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Type *
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                >
                  <option value="home">🏠 Home Visit</option>
                  <option value="tele">💻 Tele-Consultation</option>
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="preferredTime" className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Time *
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                >
                  <option value="">Select preferred time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </motion.div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Booking...
                  </span>
                ) : (
                  '📅 Book Now'
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircleIcon className="h-12 w-12 text-white" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              🎉 Booking Confirmed!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 mb-2"
            >
              We'll contact you shortly!
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-gray-500"
            >
              Our team will reach out to you at <strong>{formData.phone}</strong>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  )
}

export default BookingPopup
