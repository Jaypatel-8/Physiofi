'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/app/providers'
import { useRouter } from 'next/navigation'
import { 
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  VideoCameraIcon,
  UserIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const BookAppointmentPage = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  
  const [formData, setFormData] = useState({
    appointmentType: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    condition: '',
    symptoms: '',
    notes: ''
  })

  const [availableDoctors] = useState([
    {
      id: '1',
      name: 'Dr. Priya Sharma',
      specialization: 'Orthopedic Physiotherapy',
      rating: 4.9,
      experience: 8,
      consultationFee: { homeVisit: 800, teleconsultation: 500 },
      profileImage: null
    },
    {
      id: '2',
      name: 'Dr. Rajesh Patel',
      specialization: 'Sports Physiotherapy',
      rating: 4.8,
      experience: 6,
      consultationFee: { homeVisit: 750, teleconsultation: 450 },
      profileImage: null
    },
    {
      id: '3',
      name: 'Dr. Sunita Desai',
      specialization: 'Neurological Physiotherapy',
      rating: 4.7,
      experience: 10,
      consultationFee: { homeVisit: 900, teleconsultation: 600 },
      profileImage: null
    }
  ])

  const [availableSlots] = useState([
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30'
  ])

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      router.push('/login')
    }
  }, [user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Booking failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedDoctor = availableDoctors.find(d => d.id === formData.doctorId)

  if (!user || user.role !== 'patient') {
    return null
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Appointment Type</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setFormData(prev => ({ ...prev, appointmentType: 'home_visit' }))}
                className={`p-6 border-2 rounded-xl text-left transition-all duration-300 ${
                  formData.appointmentType === 'home_visit'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <MapPinIcon className="h-8 w-8 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Home Visit</h4>
                    <p className="text-sm text-gray-600">Expert physiotherapy at your doorstep</p>
                    <p className="text-sm font-medium text-green-600 mt-1">Starting from ₹800</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setFormData(prev => ({ ...prev, appointmentType: 'teleconsultation' }))}
                className={`p-6 border-2 rounded-xl text-left transition-all duration-300 ${
                  formData.appointmentType === 'teleconsultation'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <VideoCameraIcon className="h-8 w-8 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Teleconsultation</h4>
                    <p className="text-sm text-gray-600">Video consultation with specialists</p>
                    <p className="text-sm font-medium text-blue-600 mt-1">Starting from ₹500</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Doctor</h3>
            <div className="space-y-4">
              {availableDoctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => setFormData(prev => ({ ...prev, doctorId: doctor.id }))}
                  className={`w-full p-4 border-2 rounded-xl text-left transition-all duration-300 ${
                    formData.doctorId === doctor.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{doctor.experience} years exp</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600">{doctor.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ₹{formData.appointmentType === 'home_visit' ? doctor.consultationFee.homeVisit : doctor.consultationFee.teleconsultation}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Date & Time</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <select
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select time</option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Condition Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition Description *</label>
                <textarea
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Describe your condition in detail..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                <input
                  type="text"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="List your symptoms (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Any additional information..."
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/patient/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= stepNumber
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    step > stepNumber ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={step === 1}
            >
              Previous
            </Button>
            
            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={!formData.appointmentType || (step === 2 && !formData.doctorId)}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={isLoading}
                disabled={!formData.condition}
              >
                Book Appointment
              </Button>
            )}
          </div>
        </div>

        {/* Appointment Summary */}
        {(formData.appointmentType && formData.doctorId) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-xl shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Summary</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  {formData.appointmentType === 'home_visit' ? (
                    <MapPinIcon className="h-5 w-5 text-green-600" />
                  ) : (
                    <VideoCameraIcon className="h-5 w-5 text-blue-600" />
                  )}
                  <span className="font-medium text-gray-900">
                    {formData.appointmentType === 'home_visit' ? 'Home Visit' : 'Teleconsultation'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">{selectedDoctor?.name}</span>
                </div>
                {formData.appointmentDate && (
                  <div className="flex items-center space-x-3">
                    <CalendarDaysIcon className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">{formData.appointmentDate}</span>
                  </div>
                )}
                {formData.appointmentTime && (
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">{formData.appointmentTime}</span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">
                  ₹{selectedDoctor ? 
                    (formData.appointmentType === 'home_visit' 
                      ? selectedDoctor.consultationFee.homeVisit 
                      : selectedDoctor.consultationFee.teleconsultation) 
                    : '0'}
                </div>
                <div className="text-sm text-gray-500">Consultation Fee</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Appointment Booked Successfully!"
        size="md"
      >
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Appointment Confirmed</h3>
          <p className="text-gray-600 mb-6">
            Your appointment has been successfully booked. You will receive a confirmation SMS shortly.
          </p>
          <div className="flex space-x-4">
            <Button
              onClick={() => setShowSuccessModal(false)}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={() => router.push('/patient/dashboard')}
              className="flex-1"
            >
              View Dashboard
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default BookAppointmentPage












