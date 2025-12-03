'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, CheckCircleIcon, QuestionMarkCircleIcon, SparklesIcon } from '@heroicons/react/24/outline'
import Modal from './Modal'
import { appointmentAPI, doctorAPI } from '@/lib/api'
import { useAuth } from '@/app/providers'
import toast from 'react-hot-toast'

interface BookingPopupProps {
  isOpen: boolean
  onClose: () => void
  defaultServiceType?: 'home' | 'tele'
  onBookingSuccess?: () => void
}

const BookingPopup = ({ isOpen, onClose, defaultServiceType = 'home', onBookingSuccess }: BookingPopupProps) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    serviceType: defaultServiceType,
    symptoms: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  })
  const [availableDoctors, setAvailableDoctors] = useState<any[]>([])
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showHelper, setShowHelper] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, serviceType: defaultServiceType }))
      setShowSuccess(false)
      setShowHelper(false)
      loadDoctors()
    }
  }, [isOpen, defaultServiceType])

  const loadDoctors = async () => {
    try {
      setIsLoadingDoctors(true)
      const response = await doctorAPI.getAllDoctors({ status: 'Active', limit: 50 })
      const doctors = response.data.data?.doctors || response.data.doctors || response.data.data || []
      setAvailableDoctors(doctors)
    } catch (error: any) {
      console.error('Error loading doctors:', error)
      toast.error('Failed to load doctors')
    } finally {
      setIsLoadingDoctors(false)
    }
  }

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
    
    if (!formData.doctorId || !formData.appointmentDate || !formData.appointmentTime) {
      toast.error('Please fill all required fields')
      return
    }

    setIsSubmitting(true)
    
    try {
      const appointmentType = formData.serviceType === 'home' ? 'Home Visit' : 'Online Consultation'
      
      const appointmentData = {
        doctorId: formData.doctorId,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        type: appointmentType,
        symptoms: formData.symptoms ? [formData.symptoms] : [],
        address: formData.serviceType === 'home' ? formData.address : undefined
      }

      const response = await appointmentAPI.create(appointmentData)
      
      if (response.data.success) {
        setShowSuccess(true)
        toast.success('Appointment booked successfully!')
        
        // Refresh dashboard if callback provided
        if (onBookingSuccess) {
          setTimeout(() => {
            onBookingSuccess()
          }, 1000)
        }
        
        setTimeout(() => {
          setShowSuccess(false)
          onClose()
          setFormData({
            doctorId: '',
            appointmentDate: '',
            appointmentTime: '',
            serviceType: defaultServiceType,
            symptoms: '',
            address: {
              street: '',
              city: '',
              state: '',
              pincode: ''
            }
          })
        }, 3000)
      }
    } catch (error: any) {
      console.error('Booking error:', error)
      toast.error(error.response?.data?.message || 'Failed to book appointment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ]

  const formatTimeForDisplay = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    if (hour === 0) return `12:${minutes} AM`
    if (hour < 12) return `${hour}:${minutes} AM`
    if (hour === 12) return `12:${minutes} PM`
    return `${hour - 12}:${minutes} PM`
  }

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
                <label htmlFor="serviceType" className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Type *
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value as 'home' | 'tele' }))}
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
                transition={{ delay: 0.2 }}
              >
                <label htmlFor="doctorId" className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Doctor *
                </label>
                {isLoadingDoctors ? (
                  <div className="input-field text-center py-2">Loading doctors...</div>
                ) : (
                  <select
                    id="doctorId"
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={(e) => setFormData(prev => ({ ...prev, doctorId: e.target.value }))}
                    required
                    className="input-field"
                  >
                    <option value="">Select a doctor</option>
                    {availableDoctors.map((doctor) => (
                      <option key={doctor._id || doctor.id} value={doctor._id || doctor.id}>
                        {doctor.name} - {doctor.specialization?.[0] || 'Physiotherapist'}
                      </option>
                    ))}
                  </select>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="appointmentDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Appointment Date *
                </label>
                <input
                  type="date"
                  id="appointmentDate"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, appointmentDate: e.target.value }))}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="appointmentTime" className="block text-sm font-semibold text-gray-700 mb-2">
                  Appointment Time *
                </label>
                <select
                  id="appointmentTime"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, appointmentTime: e.target.value }))}
                  required
                  className="input-field"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{formatTimeForDisplay(time)}</option>
                  ))}
                </select>
              </motion.div>

              {formData.serviceType === 'home' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address (for Home Visit) *
                  </label>
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={formData.address.street}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, street: e.target.value } }))}
                    className="input-field mb-2"
                    required={formData.serviceType === 'home'}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.address.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, city: e.target.value } }))}
                      className="input-field"
                      required={formData.serviceType === 'home'}
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={formData.address.pincode}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, pincode: e.target.value } }))}
                      className="input-field"
                      required={formData.serviceType === 'home'}
                    />
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="symptoms" className="block text-sm font-semibold text-gray-700 mb-2">
                  Symptoms / Condition (Optional)
                </label>
                <textarea
                  id="symptoms"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                  className="input-field"
                  rows={3}
                  placeholder="Describe your symptoms or condition"
                />
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
              Your appointment has been booked successfully!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  )
}

export default BookingPopup
