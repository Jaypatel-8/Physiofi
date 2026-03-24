'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, CheckCircleIcon, QuestionMarkCircleIcon, SparklesIcon, HomeIcon, VideoCameraIcon, CalendarIcon, ClockIcon, CurrencyDollarIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { 
  UserGroupIcon, // Pediatric - children/group
  HeartIcon, // Rehabilitation - recovery/heart (HeartPulseIcon not available in solid)
  BoltIcon, // Sports - energy/athletic
  CpuChipIcon, // Neurological - brain/neural
  UserIcon, // Geriatric - elderly care
  CubeIcon // Orthopedic - structure/bones
} from '@heroicons/react/24/solid'
import Modal from './Modal'
import ThemedCalendar from './ThemedCalendar'
import { appointmentAPI, doctorAPI, doctorPublicAPI } from '@/lib/api'
import { useAuth } from '@/app/providers'
import toast from 'react-hot-toast'
import { isAlpha, isNumeric } from 'validator'

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
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [availableDoctors, setAvailableDoctors] = useState<any[]>([])
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showHelper, setShowHelper] = useState(false)
  const [selectedDoctorConditions, setSelectedDoctorConditions] = useState<any[]>([])
  const [isLoadingConditions, setIsLoadingConditions] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const loadDoctors = useCallback(async () => {
    try {
      setIsLoadingDoctors(true)
      const response = await doctorAPI.getAllDoctors({ status: 'Active', limit: 50 })
      const doctors = response.data.data?.doctors || response.data.doctors || response.data.data || []
      setAvailableDoctors(doctors)
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading doctors:', error)
      }
      toast.error('Failed to load doctors')
    } finally {
      setIsLoadingDoctors(false)
    }
  }, [])

  const loadAvailabilitySlots = useCallback(async () => {
    const doctorId = formData.doctorId
    const appointmentDate = formData.appointmentDate
    const serviceType = formData.serviceType
    const appointmentTime = formData.appointmentTime
    if (!doctorId || !appointmentDate || !serviceType) {
      return
    }

    try {
      setIsLoadingSlots(true)
      const response = await doctorAPI.getAvailabilitySlots(
        doctorId,
        appointmentDate,
        serviceType
      )
      
      if (response.data.success) {
        const slots = response.data.data.availableSlots || []
        setAvailableTimeSlots(slots)
        
        // Clear selected time if it's no longer available
        if (appointmentTime && !slots.includes(appointmentTime)) {
          setFormData(prev => ({ ...prev, appointmentTime: '' }))
        }
      } else {
        setAvailableTimeSlots([])
      }
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading availability slots:', error)
      }
      setAvailableTimeSlots([])
      // Don't show error toast - just show no slots available
    } finally {
      setIsLoadingSlots(false)
    }
  }, [formData.doctorId, formData.appointmentDate, formData.serviceType, formData.appointmentTime])

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, serviceType: defaultServiceType }))
      setShowSuccess(false)
      setShowHelper(false)
      setIsCalendarOpen(false)
      setAvailableTimeSlots([])
      setFormData(prev => ({ ...prev, appointmentTime: '' }))
      loadDoctors()
    }
  }, [isOpen, defaultServiceType, loadDoctors])

  // Fetch availability slots when doctor, date, and service type are selected
  useEffect(() => {
    if (formData.doctorId && formData.appointmentDate && formData.serviceType) {
      loadAvailabilitySlots()
    } else {
      setAvailableTimeSlots([])
      setFormData(prev => ({ ...prev, appointmentTime: '' }))
    }
  }, [formData.doctorId, formData.appointmentDate, formData.serviceType, loadAvailabilitySlots])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Load doctor conditions when doctor is selected
    if (name === 'doctorId' && value) {
      loadDoctorConditions(value)
    } else if (name === 'doctorId' && !value) {
      setSelectedDoctorConditions([])
    }
  }

  const loadDoctorConditions = async (doctorId: string) => {
    try {
      setIsLoadingConditions(true)
      const response = await doctorPublicAPI.getDoctor(doctorId)
      if (response.data.success) {
        setSelectedDoctorConditions(response.data.data.conditions || [])
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading doctor conditions:', error)
      }
    } finally {
      setIsLoadingConditions(false)
    }
  }

  const handleToggleHelper = () => {
    setShowHelper(prev => !prev)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if user is logged in
    if (!user) {
      toast.error('Please login to book an appointment')
      window.location.href = '/login'
      return
    }
    
    if (!formData.doctorId || !formData.appointmentDate || !formData.appointmentTime) {
      toast.error('Please fill all required fields')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Map service type to appointment type
      let appointmentType = 'Home Visit'
      if (formData.serviceType === 'tele') {
        appointmentType = 'Online Consultation'
      } else if (formData.serviceType === 'home') {
        appointmentType = 'Home Visit'
      } else if (formData.serviceType === 'clinic') {
        appointmentType = 'Clinic Visit'
      }
      
      // Validate date is not in the past
      const selectedDate = new Date(formData.appointmentDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      selectedDate.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        toast.error('Please select a future date')
        setIsSubmitting(false)
        return
      }

      // Validate address fields for home visits
      if (formData.serviceType === 'home') {
        // Validate street address - must be alphanumeric with spaces, at least 5 characters
        if (!formData.address.street || formData.address.street.trim().length < 5) {
          toast.error('Please enter a valid street address (at least 5 characters)')
          setIsSubmitting(false)
          return
        }
        
        // Check for random gibberish in street address
        const streetWords = formData.address.street.trim().split(/\s+/)
        if (streetWords.length === 1 && formData.address.street.length > 20) {
          // Single long word might be gibberish
          if (!/^[A-Za-z0-9\s\.,\-/]+$/.test(formData.address.street)) {
            toast.error('Please enter a valid street address')
            setIsSubmitting(false)
            return
          }
        }
        
        // Validate city - must be letters and spaces only, 2-50 characters
        if (!formData.address.city || !isAlpha(formData.address.city.replace(/\s/g, ''), 'en-US') || formData.address.city.trim().length < 2 || formData.address.city.trim().length > 50) {
          toast.error('Please enter a valid city name (letters only, 2-50 characters)')
          setIsSubmitting(false)
          return
        }
        
        // Validate pincode - must be exactly 6 digits
        if (!formData.address.pincode || !isNumeric(formData.address.pincode) || formData.address.pincode.length !== 6) {
          toast.error('Please enter a valid 6-digit pincode')
          setIsSubmitting(false)
          return
        }
      }
      
      // Format address properly for home visits
      let formattedAddress = undefined
      if (formData.serviceType === 'home' && formData.address) {
        formattedAddress = {
          street: formData.address.street.trim(),
          city: formData.address.city.trim(),
          state: formData.address.state?.trim() || '',
          pincode: formData.address.pincode.trim()
        }
      }

      const appointmentData = {
        doctorId: formData.doctorId,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        type: appointmentType,
        symptoms: formData.symptoms ? (Array.isArray(formData.symptoms) ? formData.symptoms : [formData.symptoms]) : [],
        address: formattedAddress
      }

      if (process.env.NODE_ENV === 'development') {
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Booking error:', error)
        const errorDetails = error.response?.data?.received || error.response?.data?.body
        if (errorDetails) {
          console.error('Error details:', errorDetails)
        }
      }
      const errorMessage = error.response?.data?.message || error.message || 'Failed to book appointment'
      toast.error(errorMessage)
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
      icon: CubeIcon, // Structure/bones icon for orthopedic
      color: 'bg-primary-500'
    },
    {
      condition: 'Sports Injury, Athletic Recovery',
      specialist: 'Sports Physiotherapist',
      icon: BoltIcon, // Energy/athletic icon for sports
      color: 'bg-primary-600'
    },
    {
      condition: 'Post-Surgery (Knee, Hip, Spine)',
      specialist: 'Rehabilitation Specialist',
      icon: HeartIcon, // Heart for recovery/rehabilitation
      color: 'bg-secondary-500'
    },
    {
      condition: 'Children\'s Development, Motor Skills',
      specialist: 'Pediatric Physiotherapist',
      icon: UserGroupIcon, // Children/group icon for pediatric
      color: 'bg-accent-500'
    },
    {
      condition: 'Stroke, Parkinson\'s, Neurological',
      specialist: 'Neurological Physiotherapist',
      icon: CpuChipIcon, // Brain/neural processing icon for neurological
      color: 'bg-primary-700'
    },
    {
      condition: 'Elderly Care, Balance, Mobility',
      specialist: 'Geriatric Physiotherapist',
      icon: UserIcon, // Elderly care icon for geriatric
      color: 'bg-secondary-600'
    }
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="xl">
      <AnimatePresence mode="wait">
        {!showSuccess ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-14 h-14 bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3"
              >
                <CalendarIcon className="h-7 w-7 text-white" />
              </motion.div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Book Your Appointment</h2>
              <p className="text-sm text-gray-600">Quick &amp; easy — about 2 minutes</p>
            </div>

            {/* Helper Button */}
            <button
              type="button"
              onClick={handleToggleHelper}
              className="w-full mb-3 p-2.5 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <QuestionMarkCircleIcon className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-purple-700 text-sm">Don&apos;t know which specialist to book?</span>
            </button>

            {/* Specialist Guide */}
            <AnimatePresence>
              {showHelper && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 bg-gradient-to-br from-primary-50 via-secondary-50 to-tertiary-50 rounded-xl p-3 border-2 border-primary-200"
                >
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                    <SparklesIcon className="h-5 w-5 text-purple-600" />
                    <span>Which Specialist Do You Need?</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto">
                    {specialistGuide.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${item.color} bg-opacity-10 border-2 ${item.color.replace('bg-', 'border-')} rounded-lg p-3`}
                      >
                        <div className="flex items-start space-x-2">
                          <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            {item.icon && <item.icon className="h-5 w-5 text-white" />}
                          </div>
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

            <form onSubmit={handleSubmit} className="overflow-y-auto custom-scrollbar pr-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="col-span-1 lg:col-span-2"
              >
                <label htmlFor="serviceType" className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, serviceType: 'home' }))}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                      formData.serviceType === 'home'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-primary-200 hover:bg-primary-50/50'
                    }`}
                  >
                    <HomeIcon className={`h-5 w-5 ${formData.serviceType === 'home' ? 'text-primary-500' : 'text-gray-400'}`} />
                    <span className="font-medium">Home Visit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, serviceType: 'tele' }))}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                      formData.serviceType === 'tele'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-primary-200 hover:bg-primary-50/50'
                    }`}
                  >
                    <VideoCameraIcon className={`h-5 w-5 ${formData.serviceType === 'tele' ? 'text-primary-500' : 'text-gray-400'}`} />
                    <span className="font-medium">Tele-Consultation</span>
                  </button>
                </div>
                <input
                  type="hidden"
                  name="serviceType"
                  value={formData.serviceType}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="col-span-1"
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
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a doctor</option>
                    {availableDoctors.map((doctor) => (
                      <option key={doctor._id || doctor.id} value={doctor._id || doctor.id}>
                        {doctor.name} - {doctor.specialization?.[0] || 'Physiotherapist'}
                      </option>
                    ))}
                  </select>
                )}
                
                {/* Show doctor conditions */}
                {formData.doctorId && selectedDoctorConditions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-200"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Conditions Treated by This Doctor:</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedDoctorConditions.map((condition: any, index: number) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-blue-100">
                          <p className="font-semibold text-sm text-gray-900">{condition.condition}</p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{condition.treatmentPlan}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><ClockIcon className="h-3 w-3" /> {condition.duration}</span>
                            {condition.sessions > 0 && <span className="flex items-center gap-1"><DocumentTextIcon className="h-3 w-3" /> {condition.sessions} sessions</span>}
                            {condition.price > 0 && <span className="flex items-center gap-1"><CurrencyDollarIcon className="h-3 w-3" /> ₹{condition.price}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="col-span-1"
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Appointment Date *
                </label>
                {!isCalendarOpen ? (
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen(true)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white text-left hover:border-primary-300 hover:bg-primary-50/50 cursor-pointer"
                  >
                    {formData.appointmentDate ? (
                      <span className="text-gray-900 font-medium">
                        {new Date(formData.appointmentDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    ) : (
                      <span className="text-gray-400">Click to select date</span>
                    )}
                  </button>
                ) : (
                  <div className="relative">
                    <ThemedCalendar
                      selectedDate={formData.appointmentDate}
                      onDateSelect={(date) => {
                        setFormData(prev => ({ ...prev, appointmentDate: date, appointmentTime: '' }))
                        setIsCalendarOpen(false)
                      }}
                      minDate={new Date().toISOString().split('T')[0]}
                      className="w-full"
                    />
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="col-span-1"
              >
                <label htmlFor="appointmentTime" className="block text-sm font-semibold text-gray-700 mb-2">
                  Appointment Time *
                  {formData.doctorId && formData.appointmentDate && (
                    <span className="text-xs font-normal text-gray-500 ml-2">
                      (Based on doctor availability)
                    </span>
                  )}
                </label>
                {isLoadingSlots ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-center text-gray-500">
                    Loading available slots...
                  </div>
                ) : availableTimeSlots.length > 0 ? (
                  <select
                    id="appointmentTime"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, appointmentTime: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select available time</option>
                    {availableTimeSlots.map((time) => (
                      <option key={time} value={time}>{formatTimeForDisplay(time)}</option>
                    ))}
                  </select>
                ) : formData.doctorId && formData.appointmentDate ? (
                  <div className="w-full px-4 py-3 border border-amber-300 rounded-lg bg-amber-50 text-amber-700 text-center">
                    No available slots for this date. Please select another date.
                  </div>
                ) : (
                  <select
                    id="appointmentTime"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, appointmentTime: e.target.value }))}
                    required
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
                  >
                    <option value="">Select doctor and date first</option>
                  </select>
                )}
              </motion.div>

              {formData.serviceType === 'home' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="col-span-1 lg:col-span-2 space-y-3"
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address (for Home Visit) *
                  </label>
                  <input
                    type="text"
                    placeholder="Street Address (e.g., 123 Main Street, Apartment 4B)"
                    value={formData.address.street}
                    onChange={(e) => {
                      const value = e.target.value
                      // Allow alphanumeric, spaces, commas, periods, hyphens, slashes
                      if (/^[A-Za-z0-9\s\.,\-/]*$/.test(value) && value.length <= 100) {
                        setFormData(prev => ({ ...prev, address: { ...prev.address, street: value } }))
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 mb-2"
                    required={formData.serviceType === 'home'}
                    minLength={5}
                    maxLength={100}
                    title="Please enter a valid street address (5-100 characters, letters, numbers, and common punctuation only)"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.address.city}
                      onChange={(e) => {
                        const value = e.target.value
                        // Only allow letters and spaces, convert to title case
                        if (/^[A-Za-z\s]*$/.test(value) && value.length <= 50) {
                          setFormData(prev => ({ ...prev, address: { ...prev.address, city: value } }))
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      required={formData.serviceType === 'home'}
                      minLength={2}
                      maxLength={50}
                      pattern="[A-Za-z\s]{2,50}"
                      title="Please enter a valid city name (letters only, 2-50 characters)"
                    />
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter 6-digit pincode"
                        value={formData.address.pincode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                          setFormData(prev => ({ ...prev, address: { ...prev.address, pincode: value } }))
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        required={formData.serviceType === 'home'}
                        pattern="[0-9]{6}"
                        minLength={6}
                        maxLength={6}
                        title="Please enter a valid 6-digit pincode (numbers only)"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="col-span-1 lg:col-span-2"
              >
                <label htmlFor="symptoms" className="block text-sm font-semibold text-gray-700 mb-2">
                  Symptoms / Condition (Optional)
                </label>
                <textarea
                  id="symptoms"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                  placeholder="Describe your symptoms or condition"
                  maxLength={500}
                />
              </motion.div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
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
                  'Book Now'
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
              Booking Confirmed!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 mb-2"
            >
              We&apos;ll contact you shortly!
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
