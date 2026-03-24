'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon, 
  CalendarDaysIcon, 
  ClockIcon, 
  MapPinIcon, 
  UserIcon,
  TagIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  ArrowPathIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI, appointmentAPI } from '@/lib/api'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const DoctorAppointmentDetail = () => {
  const router = useRouter()
  const params = useParams()
  const appointmentId = params.id as string
  const { user, loading } = useAuth()
  const [appointment, setAppointment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [rescheduleData, setRescheduleData] = useState({
    newDate: '',
    newTime: '',
    reason: ''
  })

  const loadAppointment = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await doctorAPI.getAppointment(appointmentId)
      if (response.data.success) {
        setAppointment(response.data.data)
      } else {
        toast.error('Appointment not found')
        router.push('/doctor/appointments')
      }
    } catch (error: any) {
      console.error('Error loading appointment:', error)
      toast.error(error.response?.data?.message || 'Failed to load appointment')
      router.push('/doctor/appointments')
    } finally {
      setIsLoading(false)
    }
  }, [appointmentId, router])

  useEffect(() => {
    if (!loading && user) {
      if (user.role !== 'doctor') {
        window.location.href = '/'
        return
      }
      loadAppointment()
    } else if (!loading && !user) {
      window.location.href = '/login'
    }
  }, [user, loading, loadAppointment])

  const handleStatusUpdate = async (status: string) => {
    try {
      const response = await doctorAPI.updateAppointmentStatus(appointmentId, status)
      if (response.data.success) {
        toast.success(`Appointment ${status.toLowerCase()} successfully`)
        loadAppointment()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update appointment')
    }
  }

  const handleRescheduleRequest = async () => {
    if (!rescheduleData.newDate || !rescheduleData.newTime || !rescheduleData.reason) {
      toast.error('Please fill all fields')
      return
    }

    try {
      const response = await appointmentAPI.requestReschedule(appointmentId, rescheduleData)
      if (response.data.success) {
        toast.success('Reschedule request sent successfully')
        setShowRescheduleModal(false)
        setRescheduleData({ newDate: '', newTime: '', reason: '' })
        loadAppointment()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reschedule request')
    }
  }

  const handleRescheduleResponse = async (action: 'accept' | 'decline') => {
    try {
      const response = await appointmentAPI.respondToReschedule(appointmentId, action)
      if (response.data.success) {
        toast.success(`Reschedule request ${action}ed successfully`)
        loadAppointment()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${action} reschedule request`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'confirmed':
        return 'bg-primary-100 text-primary-700 border-primary-300'
      case 'reschedule requested':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-dots mx-auto mb-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-gray-600">Loading appointment details...</p>
        </div>
      </div>
    )
  }

  if (!appointment) {
    return null
  }

  const hasRescheduleRequest = appointment.rescheduleRequest && appointment.rescheduleRequest.status === 'Pending'
  const isPatientRequest = hasRescheduleRequest && appointment.rescheduleRequest.requestedBy === 'patient'

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 lg:pt-20">
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 text-white py-12">
        <div className="container-custom">
          <Link href="/doctor/appointments" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-medium">Back to Appointments</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2 text-white">Appointment Details</h1>
              <p className="text-white/90">Manage appointment and patient information</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(appointment.status)}`}>
              {appointment.status || 'Pending'}
            </span>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reschedule Request Alert */}
            {hasRescheduleRequest && isPatientRequest && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-orange-900 mb-2">Reschedule Request</h3>
                    <p className="text-orange-700">
                      Patient has requested to reschedule to{' '}
                      <span className="font-semibold">
                        {format(new Date(appointment.rescheduleRequest.newDate), 'PPP')} at {appointment.rescheduleRequest.newTime}
                      </span>
                    </p>
                    {appointment.rescheduleRequest.reason && (
                      <p className="text-sm text-orange-600 mt-2">Reason: {appointment.rescheduleRequest.reason}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleRescheduleResponse('accept')}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRescheduleResponse('decline')}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </motion.div>
            )}

            {/* Patient Information */}
            {appointment.patient && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
              >
                <h2 className="text-2xl font-black text-gray-900 mb-6">Patient Information</h2>
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <UserIcon className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-gray-900 mb-2">{appointment.patient.name || 'Patient'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Age</p>
                        <p className="font-semibold text-gray-900">{appointment.patient.age || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Gender</p>
                        <p className="font-semibold text-gray-900">{appointment.patient.gender || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="font-semibold text-gray-900">{appointment.patient.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Phone</p>
                        <p className="font-semibold text-gray-900">{appointment.patient.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Appointment Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6">Appointment Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <CalendarDaysIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date</p>
                    <p className="font-bold text-gray-900">
                      {appointment.appointmentDate ? format(new Date(appointment.appointmentDate), 'PPP') : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <ClockIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Time</p>
                    <p className="font-bold text-gray-900">{appointment.appointmentTime || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TagIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Type</p>
                    <p className="font-bold text-gray-900">{appointment.type || 'N/A'}</p>
                  </div>
                </div>

                {appointment.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <MapPinIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Address</p>
                      <p className="font-bold text-gray-900">
                        {appointment.address.street}, {appointment.address.city}, {appointment.address.pincode}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Symptoms & Medical Info */}
            {(appointment.symptoms?.length > 0 || appointment.medicalHistory) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
              >
                <h2 className="text-2xl font-black text-gray-900 mb-6">Medical Information</h2>
                {appointment.symptoms?.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Symptoms</p>
                    <div className="flex flex-wrap gap-2">
                      {appointment.symptoms.map((symptom: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {appointment.medicalHistory && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Medical History</p>
                    <p className="text-gray-600">{appointment.medicalHistory}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Treatment Plan */}
            {appointment.treatment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
              >
                <h2 className="text-2xl font-black text-gray-900 mb-6">Treatment Plan</h2>
                {appointment.treatment.plan && (
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Plan</p>
                    <p className="text-gray-600">{appointment.treatment.plan}</p>
                  </div>
                )}
                {appointment.treatment.exercises?.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Exercises</p>
                    <div className="space-y-3">
                      {appointment.treatment.exercises.map((exercise: any, index: number) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-xl">
                          <p className="font-semibold text-gray-900 mb-1">{exercise.name}</p>
                          <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span>Reps: {exercise.repetitions}</span>
                            <span>Sets: {exercise.sets}</span>
                            <span>Frequency: {exercise.frequency}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <h3 className="text-lg font-black text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                {appointment.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate('Confirmed')}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                      Accept Appointment
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('Cancelled')}
                      className="w-full px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircleIcon className="h-5 w-5" />
                      Decline Appointment
                    </button>
                  </>
                )}
                {appointment.status === 'Confirmed' && (
                  <button
                    onClick={() => handleStatusUpdate('Completed')}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    Mark as Completed
                  </button>
                )}
                {(appointment.status === 'Pending' || appointment.status === 'Confirmed') && (
                  <button
                    onClick={() => setShowRescheduleModal(true)}
                    className="w-full px-4 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                    Request Reschedule
                  </button>
                )}
                {(appointment.status === 'Pending' || appointment.status === 'Confirmed') && (
                  <button
                    onClick={() => handleStatusUpdate('Cancelled')}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircleIcon className="h-5 w-5" />
                    Cancel Appointment
                  </button>
                )}
                <Link
                  href="/doctor/appointments"
                  className="block w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-center"
                >
                  Back to Appointments
                </Link>
              </div>
            </motion.div>

            {/* Payment Info */}
            {appointment.payment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
              >
                <h3 className="text-lg font-black text-gray-900 mb-4">Payment</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-bold text-gray-900">₹{appointment.payment.amount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      appointment.payment.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {appointment.payment.status || 'Pending'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">Request Reschedule</h2>
              <button
                onClick={() => {
                  setShowRescheduleModal(false)
                  setRescheduleData({ newDate: '', newTime: '', reason: '' })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Date *
                </label>
                <input
                  type="date"
                  value={rescheduleData.newDate}
                  onChange={(e) => setRescheduleData(prev => ({ ...prev, newDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Time *
                </label>
                <select
                  value={rescheduleData.newTime}
                  onChange={(e) => setRescheduleData(prev => ({ ...prev, newTime: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select time</option>
                  {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason *
                </label>
                <textarea
                  value={rescheduleData.reason}
                  onChange={(e) => setRescheduleData(prev => ({ ...prev, reason: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Please provide a reason for rescheduling..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleRescheduleRequest}
                  className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Send Request
                </button>
                <button
                  onClick={() => {
                    setShowRescheduleModal(false)
                    setRescheduleData({ newDate: '', newTime: '', reason: '' })
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <Footer />
    </div>
    </>
  )
}

export default DoctorAppointmentDetail
