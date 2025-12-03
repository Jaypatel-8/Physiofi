'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon, 
  CalendarDaysIcon, 
  ClockIcon, 
  MapPinIcon, 
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  TagIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { adminAPI } from '@/lib/api'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const AdminAppointmentDetail = () => {
  const router = useRouter()
  const params = useParams()
  const appointmentId = params.id as string
  const { user, loading } = useAuth()
  const [appointment, setAppointment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        window.location.href = '/login'
        return
      }
      loadAppointment()
    }
  }, [user, loading, appointmentId])

  const loadAppointment = async () => {
    try {
      setIsLoading(true)
      const response = await adminAPI.getAppointment(appointmentId)
      if (response.data.success) {
        setAppointment(response.data.data)
      } else {
        toast.error('Appointment not found')
        router.push('/admin/appointments')
      }
    } catch (error: any) {
      console.error('Error loading appointment:', error)
      toast.error(error.response?.data?.message || 'Failed to load appointment')
      router.push('/admin/appointments')
    } finally {
      setIsLoading(false)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 lg:pt-20">
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-12">
        <div className="container-custom">
          <Link href="/admin/appointments" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-medium">Back to Appointments</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2">Appointment Details</h1>
              <p className="text-white/90">Complete appointment information</p>
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

            {/* Doctor Information */}
            {appointment.doctor && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
              >
                <h2 className="text-2xl font-black text-gray-900 mb-6">Doctor Information</h2>
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <UserIcon className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-gray-900 mb-2">Dr. {appointment.doctor.name || 'Doctor'}</h3>
                    <p className="text-gray-600 mb-4">{appointment.doctor.specialization?.[0] || 'Physiotherapist'}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="font-semibold text-gray-900">{appointment.doctor.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Phone</p>
                        <p className="font-semibold text-gray-900">{appointment.doctor.phone || 'N/A'}</p>
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
              transition={{ delay: 0.2 }}
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
                transition={{ delay: 0.3 }}
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
                <Link
                  href={`/admin/patients/${appointment.patient?._id || appointment.patient?.id}`}
                  className="block w-full px-4 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors text-center"
                >
                  View Patient
                </Link>
                <Link
                  href={`/admin/doctors/${appointment.doctor?._id || appointment.doctor?.id}`}
                  className="block w-full px-4 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors text-center"
                >
                  View Doctor
                </Link>
                <Link
                  href="/admin/appointments"
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
                  {appointment.payment.method && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method</span>
                      <span className="font-semibold text-gray-900">{appointment.payment.method}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  )
}

export default AdminAppointmentDetail

