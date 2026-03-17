'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  XMarkIcon,
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { patientAPI } from '@/lib/api'
import DashboardPageWrapper from '@/components/dashboard/DashboardPageWrapper'
import BookingPopup from '@/components/ui/BookingPopup'
import toast from 'react-hot-toast'

const AppointmentsPage = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all')
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'patient') {
        router.replace('/login')
        return
      }
      loadAppointments()
    }
  }, [user, loading, router])

  const loadAppointments = async () => {
    try {
      setIsLoading(true)
      const response = await patientAPI.getAppointments()
      if (response.data.success) {
        setAppointments(response.data.data.appointments || response.data.data || [])
      }
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!selectedAppointment || !cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation')
      return
    }

    try {
      await patientAPI.cancelAppointment(selectedAppointment._id || selectedAppointment.id, cancelReason)
      toast.success('Appointment cancelled successfully')
      setIsCancelModalOpen(false)
      setSelectedAppointment(null)
      setCancelReason('')
      loadAppointments()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment')
    }
  }

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true
    if (filter === 'upcoming') return ['Pending', 'Confirmed', 'Scheduled'].includes(apt.status)
    if (filter === 'completed') return apt.status === 'Completed'
    if (filter === 'cancelled') return apt.status === 'Cancelled'
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'Scheduled':
        return 'bg-green-100 text-green-700'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'Completed':
        return 'bg-blue-100 text-blue-700'
      case 'Cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
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
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardPageWrapper
      title="My Appointments"
      subtitle="View and manage your appointments"
      action={
        <button
          onClick={() => setIsBookingOpen(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-700 transition-colors text-sm"
        >
          <CalendarDaysIcon className="h-5 w-5" />
          Book Appointment
        </button>
      }
    >
      <div className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  filter === f
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Appointments List */}
          {filteredAppointments.length > 0 ? (
            <div className="space-y-6">
              {filteredAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment._id || appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                        <CalendarDaysIcon className="h-8 w-8 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-black text-gray-900">
                            {appointment.type || 'Appointment'}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4" />
                            <span>{appointment.doctor?.name || appointment.doctor?.full_name || 'Doctor'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ClockIcon className="h-4 w-4" />
                            <span>
                              {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                            </span>
                          </div>
                          {appointment.type === 'Home Visit' && appointment.address && (
                            <div className="flex items-center gap-2 md:col-span-2">
                              <MapPinIcon className="h-4 w-4" />
                              <span>{typeof appointment.address === 'string' ? appointment.address : `${appointment.address.street}, ${appointment.address.city}`}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {appointment.symptoms && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Symptoms</p>
                      <p className="text-sm text-gray-600">{appointment.symptoms}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Link
                      href={`/patient/appointments/${appointment._id || appointment.id}`}
                      className="flex-1 text-center px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                    >
                      View Details
                    </Link>
                    {['Pending', 'Confirmed', 'Scheduled'].includes(appointment.status) && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment)
                            setIsCancelModalOpen(true)
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 sm:py-14 lg:py-16">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarDaysIcon className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Appointments</h3>
              <p className="text-gray-600 mb-6">Book your first appointment to get started</p>
              <button
                onClick={() => setIsBookingOpen(true)}
                className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                <CalendarDaysIcon className="h-5 w-5" />
                Book Appointment
              </button>
            </div>
          )}

      {/* Booking Popup */}
      <BookingPopup 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
        onBookingSuccess={() => {
          setIsBookingOpen(false)
          loadAppointments()
        }}
      />

      {/* Cancel Modal */}
      {isCancelModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-gray-900">Cancel Appointment</h2>
              <button
                onClick={() => {
                  setIsCancelModalOpen(false)
                  setSelectedAppointment(null)
                  setCancelReason('')
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this appointment? Please provide a reason.
            </p>

            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
            />

            <div className="flex gap-4">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Cancel Appointment
              </button>
              <button
                onClick={() => {
                  setIsCancelModalOpen(false)
                  setSelectedAppointment(null)
                  setCancelReason('')
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Keep Appointment
              </button>
            </div>
          </motion.div>
        </div>
      )}

      </div>
    </DashboardPageWrapper>
  )
}

export default AppointmentsPage





