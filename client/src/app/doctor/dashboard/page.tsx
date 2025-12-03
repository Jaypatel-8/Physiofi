'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  PhoneIcon,
  MapPinIcon,
  VideoCameraIcon,
  HomeIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  EyeIcon,
  ChartBarIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  PencilIcon,
  DocumentTextIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI, appointmentAPI } from '@/lib/api'
import { BellIcon } from '@heroicons/react/24/outline'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import AppointmentCard from '@/components/dashboard/AppointmentCard'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

interface Appointment {
  _id: string
  appointmentDate: string | Date
  appointmentTime: string
  type: 'Home Visit' | 'Online Consultation' | 'Clinic Visit'
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'Rescheduled'
  service?: {
    name?: string
  }
  patient?: {
    _id?: string
    name?: string
    email?: string
    phone?: string
    age?: number
  }
  doctor?: {
    name?: string
    specialization?: string
  }
  address?: {
    street?: string
    city?: string
    state?: string
  }
  notes?: {
    doctor?: string
    patient?: string
  }
  progress?: {
    level?: number
    notes?: string
  }
  symptoms?: string[]
  diagnosis?: {
    primary?: string
  }
  treatment?: {
    plan?: string
  }
}

const DoctorDashboard = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [doctorData, setDoctorData] = useState<any>(null)
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])
  const [pendingRequests, setPendingRequests] = useState<Appointment[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  const [recentPatients, setRecentPatients] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePatients: 0,
    todayAppointments: 0,
    completedSessions: 0,
    averageRating: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'Home Visit' | 'Online Consultation'>('all')
  const [homeVisitAppointments, setHomeVisitAppointments] = useState<Appointment[]>([])
  const [teleConsultationAppointments, setTeleConsultationAppointments] = useState<Appointment[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)

  // Real-time data fetching
  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    loadDashboardData()

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(loadDashboardData, 30000)

    return () => clearInterval(interval)
  }, [user, router])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      // Fetch doctor profile
      const profileResponse = await doctorAPI.getProfile()
      setDoctorData(profileResponse.data.data || profileResponse.data)

      // Fetch appointments
      const appointmentsResponse = await doctorAPI.getAppointments({
        status: 'all',
        limit: 100
      })
      const appointments = appointmentsResponse.data.data?.appointments || appointmentsResponse.data.appointments || []

      // Get today's date
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const tomorrow = new Date(todayStart)
      tomorrow.setDate(tomorrow.getDate() + 1)

      // Filter appointments
      const today = appointments.filter((apt: Appointment) => {
        const aptDate = new Date(apt.appointmentDate)
        return aptDate >= todayStart && aptDate < tomorrow && apt.status !== 'Cancelled'
      })

      const pending = appointments.filter((apt: Appointment) => apt.status === 'Pending')
      const upcoming = appointments.filter((apt: Appointment) => {
        const aptDate = new Date(apt.appointmentDate)
        return aptDate >= tomorrow && apt.status !== 'Cancelled'
      })

      setTodayAppointments(today.sort((a: Appointment, b: Appointment) => {
        return a.appointmentTime.localeCompare(b.appointmentTime)
      }))
      setPendingRequests(pending)
      setUpcomingAppointments(upcoming.sort((a: Appointment, b: Appointment) => {
        return new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
      }))

      // Extract unique recent patients
      const patientMap = new Map()
      appointments.forEach((apt: Appointment) => {
        if (apt.patient && apt.patient._id) {
          if (!patientMap.has(apt.patient._id)) {
            patientMap.set(apt.patient._id, {
              ...apt.patient,
              lastAppointment: apt.appointmentDate,
              lastStatus: apt.status
            })
          }
        }
      })
      setRecentPatients(Array.from(patientMap.values()).slice(0, 5))

      // Fetch stats
      const statsResponse = await doctorAPI.getStats()
      const statsData = statsResponse.data.data || statsResponse.data
      setStats({
        totalPatients: statsData.totalPatients || patientMap.size,
        activePatients: statsData.activePatients || patientMap.size,
        todayAppointments: statsData.todayAppointments || today.length,
        completedSessions: statsData.completedSessions || appointments.filter((a: Appointment) => a.status === 'Completed').length,
        averageRating: statsData.averageRating || doctorData?.rating?.average || 0
      })

      // Load appointments by type
      try {
        const homeVisitResponse = await doctorAPI.getAppointmentsByType('Home Visit', { limit: 100 })
        const homeVisitData = homeVisitResponse.data.data?.appointments || []
        setHomeVisitAppointments(homeVisitData)

        const teleResponse = await doctorAPI.getAppointmentsByType('Online Consultation', { limit: 100 })
        const teleData = teleResponse.data.data?.appointments || []
        setTeleConsultationAppointments(teleData)
      } catch (error) {
        console.error('Error loading appointments by type:', error)
      }

    } catch (error: any) {
      console.error('Error loading dashboard data:', error)
      toast.error(error.response?.data?.message || 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptAppointment = async (appointmentId: string) => {
    try {
      await doctorAPI.updateAppointmentStatus(appointmentId, 'Confirmed')
      toast.success('Appointment accepted successfully')
      loadDashboardData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to accept appointment')
    }
  }

  const handleDeclineAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to decline this appointment?')) return

    try {
      await doctorAPI.updateAppointmentStatus(appointmentId, 'Cancelled', 'Declined by doctor')
      toast.success('Appointment declined')
      loadDashboardData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to decline appointment')
    }
  }

  const handleViewAppointment = async (appointmentId: string) => {
    try {
      const response = await appointmentAPI.getAppointment(appointmentId)
      const appointment = response.data.data || response.data
      // Navigate to appointment details page or show modal
      router.push(`/doctor/appointments/${appointmentId}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load appointment details')
    }
  }

  const handleViewPatient = (patientId: string) => {
    router.push(`/doctor/patients/${patientId}`)
  }

  if (isLoading && !doctorData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-dots mx-auto mb-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Doctor Dashboard" subtitle="Manage appointments and provide exceptional care" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500 rounded-2xl p-8 text-white mb-8 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-black mb-4 font-display">
              Welcome back, {doctorData?.name || user?.name || 'Doctor'}!
            </h2>
            <p className="text-white/90 text-lg max-w-2xl">
              Manage your appointments and provide exceptional care to your patients.
            </p>
          </div>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Link
            href="/doctor/patients"
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary-500 group"
          >
            <UserGroupIcon className="h-8 w-8 text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-gray-900 mb-1">View All Patients</h3>
            <p className="text-sm text-gray-600">Manage patient records</p>
          </Link>
          
          <Link
            href="/doctor/appointments"
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary-500 group"
          >
            <CalendarDaysIcon className="h-8 w-8 text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-gray-900 mb-1">Manage Appointments</h3>
            <p className="text-sm text-gray-600">View and update bookings</p>
          </Link>
          
          <Link
            href="/doctor/availability"
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary-500 group"
          >
            <ClockIcon className="h-8 w-8 text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-gray-900 mb-1">Set Availability</h3>
            <p className="text-sm text-gray-600">Update your schedule</p>
          </Link>
          
          <Link
            href="/doctor/analytics"
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary-500 group"
          >
            <ChartBarIcon className="h-8 w-8 text-primary-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-gray-900 mb-1">View Analytics</h3>
            <p className="text-sm text-gray-600">Performance metrics</p>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<UserGroupIcon className="h-7 w-7" />}
            color="primary"
            delay={0.1}
          />
          <StatsCard
            title="Active Patients"
            value={stats.activePatients}
            icon={<UserCircleIcon className="h-7 w-7" />}
            color="green"
            delay={0.2}
          />
          <StatsCard
            title="Today's Appointments"
            value={stats.todayAppointments}
            icon={<CalendarDaysIcon className="h-7 w-7" />}
            color="purple"
            delay={0.3}
          />
          <StatsCard
            title="Completed Sessions"
            value={stats.completedSessions}
            icon={<CheckCircleIcon className="h-7 w-7" />}
            color="accent"
            delay={0.4}
          />
          <StatsCard
            title="Average Rating"
            value={stats.averageRating.toFixed(1)}
            icon={<StarIcon className="h-7 w-7" />}
            color="orange"
            delay={0.5}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Notifications Section */}
            {unreadCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-yellow-100"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                      <BellIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 font-display">New Appointment Requests</h3>
                      <p className="text-sm text-gray-600">{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-300 font-semibold"
                  >
                    {showNotifications ? 'Hide' : 'View All'}
                  </button>
                </div>
                
                {showNotifications && (
                  <div className="space-y-4 relative z-10 max-h-96 overflow-y-auto">
                    {notifications
                      .filter(n => !n.isRead && n.type === 'appointment_request')
                      .slice(0, 5)
                      .map((notification, index) => (
                        <motion.div
                          key={notification._id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-xl p-4 border-2 border-yellow-200 shadow-md"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-gray-900">{notification.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            </div>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                              {notification.data?.appointment?.type || 'New'}
                            </span>
                          </div>
                          
                          {/* Patient Details */}
                          {notification.data?.patient && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <h5 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                                <UserCircleIcon className="h-5 w-5 text-primary-500" />
                                <span>Patient Details</span>
                              </h5>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-600">Name:</span>
                                  <span className="font-medium text-gray-900 ml-2">{notification.data.patient.name}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Age:</span>
                                  <span className="font-medium text-gray-900 ml-2">{notification.data.patient.age} years</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Gender:</span>
                                  <span className="font-medium text-gray-900 ml-2">{notification.data.patient.gender || 'N/A'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Phone:</span>
                                  <span className="font-medium text-gray-900 ml-2">{notification.data.patient.phone}</span>
                                </div>
                                {notification.data.patient.email && (
                                  <div className="col-span-2">
                                    <span className="text-gray-600">Email:</span>
                                    <span className="font-medium text-gray-900 ml-2">{notification.data.patient.email}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Appointment Details */}
                          {notification.data?.appointment && (
                            <div className="bg-blue-50 rounded-lg p-3 mb-3">
                              <h5 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                                <CalendarDaysIcon className="h-5 w-5 text-blue-500" />
                                <span>Appointment Details</span>
                              </h5>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="text-gray-600">Date & Time:</span>
                                  <span className="font-medium text-gray-900 ml-2">
                                    {new Date(notification.data.appointment.date).toLocaleDateString('en-IN', { 
                                      weekday: 'long', 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })} at {notification.data.appointment.time}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Type:</span>
                                  <span className="font-medium text-gray-900 ml-2">{notification.data.appointment.type}</span>
                                </div>
                                
                                {/* Address for Home Visit */}
                                {notification.data.appointment.type === 'Home Visit' && notification.data.appointment.address && (
                                  <div className="mt-2">
                                    <span className="text-gray-600 flex items-start space-x-2">
                                      <MapPinIcon className="h-4 w-4 mt-0.5" />
                                      <span className="font-medium text-gray-900">
                                        {notification.data.appointment.address.street && `${notification.data.appointment.address.street}, `}
                                        {notification.data.appointment.address.city && `${notification.data.appointment.address.city}, `}
                                        {notification.data.appointment.address.state && `${notification.data.appointment.address.state} - `}
                                        {notification.data.appointment.address.pincode}
                                      </span>
                                    </span>
                                  </div>
                                )}

                                {/* Symptoms */}
                                {notification.data.appointment.symptoms && notification.data.appointment.symptoms.length > 0 && (
                                  <div className="mt-2">
                                    <span className="text-gray-600">Symptoms:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {notification.data.appointment.symptoms.map((symptom: string, idx: number) => (
                                        <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                                          {symptom}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Medical History */}
                                {notification.data.appointment.medicalHistory && (
                                  <div className="mt-2">
                                    <span className="text-gray-600">Medical History:</span>
                                    <p className="text-gray-900 mt-1">{notification.data.appointment.medicalHistory}</p>
                                  </div>
                                )}

                                {/* Current Medications */}
                                {notification.data.appointment.currentMedications && notification.data.appointment.currentMedications.length > 0 && (
                                  <div className="mt-2">
                                    <span className="text-gray-600">Current Medications:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {notification.data.appointment.currentMedications.map((med: string, idx: number) => (
                                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                          {med}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Allergies */}
                                {notification.data.appointment.allergies && notification.data.appointment.allergies.length > 0 && (
                                  <div className="mt-2">
                                    <span className="text-gray-600">Allergies:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {notification.data.appointment.allergies.map((allergy: string, idx: number) => (
                                        <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                                          {allergy}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex space-x-2 mt-3">
                            <button
                              onClick={async () => {
                                if (notification.appointment) {
                                  await handleAcceptAppointment(notification.appointment._id || notification.appointment)
                                }
                                if (notification._id) {
                                  await doctorAPI.markAsRead(notification._id)
                                  loadDashboardData()
                                }
                              }}
                              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 font-semibold text-sm"
                            >
                              Accept
                            </button>
                            <button
                              onClick={async () => {
                                if (notification.appointment) {
                                  await handleDeclineAppointment(notification.appointment._id || notification.appointment)
                                }
                                if (notification._id) {
                                  await doctorAPI.markAsRead(notification._id)
                                  loadDashboardData()
                                }
                              }}
                              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 font-semibold text-sm"
                            >
                              Decline
                            </button>
                            {notification._id && (
                              <button
                                onClick={async () => {
                                  await doctorAPI.markAsRead(notification._id)
                                  loadDashboardData()
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-semibold text-sm"
                              >
                                Mark Read
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Pending Appointment Requests */}
            {pendingRequests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 relative overflow-hidden"
              >
                {/* Book Corner Effect */}
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

                <div className="flex items-center justify-between mb-6 relative z-10">
                  <h3 className="text-xl font-black text-gray-900 font-display">Pending Requests</h3>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                    {pendingRequests.length} New
                  </span>
                </div>
                <div className="space-y-4 relative z-10">
                  {pendingRequests.map((appointment, index) => (
                    <AppointmentCard
                      key={appointment._id || index}
                      appointment={appointment}
                      userRole="doctor"
                      onView={handleViewAppointment}
                      onAction={(id, action) => {
                        if (action === 'accept') handleAcceptAppointment(id)
                        else if (action === 'decline') handleDeclineAppointment(id)
                      }}
                      index={index}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Today's Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 relative overflow-hidden"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

              <h3 className="text-xl font-black text-gray-900 mb-6 font-display relative z-10">Today's Appointments</h3>
              {todayAppointments.length > 0 ? (
                <div className="space-y-4 relative z-10">
                  {todayAppointments.map((appointment, index) => (
                    <AppointmentCard
                      key={appointment._id || index}
                      appointment={appointment}
                      userRole="doctor"
                      onView={handleViewAppointment}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 relative z-10">
                  <CalendarDaysIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No appointments scheduled for today</p>
                </div>
              )}
            </motion.div>

            {/* Bookings by Type */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 relative overflow-hidden"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

              <h3 className="text-xl font-black text-gray-900 mb-6 font-display relative z-10">Patient Bookings</h3>
              
              {/* Filter Tabs */}
              <div className="flex space-x-2 mb-6 relative z-10">
                <button
                  onClick={() => setAppointmentFilter('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                    appointmentFilter === 'all'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Bookings
                </button>
                <button
                  onClick={() => setAppointmentFilter('Home Visit')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center space-x-2 ${
                    appointmentFilter === 'Home Visit'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <HomeIcon className="h-5 w-5" />
                  <span>Home Visits ({homeVisitAppointments.length})</span>
                </button>
                <button
                  onClick={() => setAppointmentFilter('Online Consultation')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center space-x-2 ${
                    appointmentFilter === 'Online Consultation'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <VideoCameraIcon className="h-5 w-5" />
                  <span>Tele Consultation ({teleConsultationAppointments.length})</span>
                </button>
              </div>

              {/* Filtered Appointments */}
              <div className="relative z-10">
                {appointmentFilter === 'all' && (
                  <div className="space-y-4">
                    {upcomingAppointments.length > 0 ? (
                      upcomingAppointments.slice(0, 5).map((appointment, index) => (
                        <AppointmentCard
                          key={appointment._id || index}
                          appointment={appointment}
                          userRole="doctor"
                          onView={handleViewAppointment}
                          index={index}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <CalendarDaysIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">No appointments found</p>
                      </div>
                    )}
                  </div>
                )}

                {appointmentFilter === 'Home Visit' && (
                  <div className="space-y-4">
                    {homeVisitAppointments.length > 0 ? (
                      homeVisitAppointments
                        .filter(apt => {
                          const aptDate = new Date(apt.appointmentDate)
                          return aptDate >= new Date() && apt.status !== 'Cancelled'
                        })
                        .slice(0, 5)
                        .map((appointment, index) => (
                          <AppointmentCard
                            key={appointment._id || index}
                            appointment={appointment}
                            userRole="doctor"
                            onView={handleViewAppointment}
                            index={index}
                          />
                        ))
                    ) : (
                      <div className="text-center py-8">
                        <HomeIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">No home visit bookings</p>
                      </div>
                    )}
                  </div>
                )}

                {appointmentFilter === 'Online Consultation' && (
                  <div className="space-y-4">
                    {teleConsultationAppointments.length > 0 ? (
                      teleConsultationAppointments
                        .filter(apt => {
                          const aptDate = new Date(apt.appointmentDate)
                          return aptDate >= new Date() && apt.status !== 'Cancelled'
                        })
                        .slice(0, 5)
                        .map((appointment, index) => (
                          <AppointmentCard
                            key={appointment._id || index}
                            appointment={appointment}
                            userRole="doctor"
                            onView={handleViewAppointment}
                            index={index}
                          />
                        ))
                    ) : (
                      <div className="text-center py-8">
                        <VideoCameraIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">No tele consultation bookings</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Upcoming Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 relative overflow-hidden"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

              <h3 className="text-xl font-black text-gray-900 mb-6 font-display relative z-10">All Upcoming</h3>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4 relative z-10">
                  {upcomingAppointments.slice(0, 5).map((appointment, index) => (
                    <AppointmentCard
                      key={appointment._id || index}
                      appointment={appointment}
                      userRole="doctor"
                      onView={handleViewAppointment}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 relative z-10">
                  <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No upcoming appointments</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 relative overflow-hidden"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

              <div className="relative z-10">
                <h3 className="text-xl font-black text-gray-900 mb-6 font-display">Doctor Profile</h3>
                {doctorData?.profileImage ? (
                  <div className="flex justify-center mb-4">
                    <Image
                      src={doctorData.profileImage}
                      alt={doctorData.name || 'Doctor'}
                      width={100}
                      height={100}
                      className="rounded-full border-4 border-primary-200"
                    />
                  </div>
                ) : (
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {(doctorData?.name || user?.name || 'D')[0].toUpperCase()}
                    </div>
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="font-semibold text-gray-900">{doctorData?.name || user?.name || 'N/A'}</div>
                  </div>
                  {doctorData?.specialization && (
                    <div>
                      <div className="text-sm text-gray-500">Specialization</div>
                      <div className="font-semibold text-gray-900">
                        {Array.isArray(doctorData.specialization)
                          ? doctorData.specialization.join(', ')
                          : doctorData.specialization}
                      </div>
                    </div>
                  )}
                  {doctorData?.experience && (
                    <div>
                      <div className="text-sm text-gray-500">Experience</div>
                      <div className="font-semibold text-gray-900">{doctorData.experience} years</div>
                    </div>
                  )}
                  {doctorData?.license && (
                    <div>
                      <div className="text-sm text-gray-500">License</div>
                      <div className="font-semibold text-gray-900">{doctorData.license}</div>
                    </div>
                  )}
                  {doctorData?.rating?.average && (
                    <div className="flex items-center space-x-2">
                      <StarIcon className="h-5 w-5 text-yellow-400" />
                      <div>
                        <div className="text-sm text-gray-500">Rating</div>
                        <div className="font-semibold text-gray-900">
                          {doctorData.rating.average.toFixed(1)}/5.0 ({doctorData.rating.count || 0} reviews)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => router.push('/doctor/profile')}
                  className="mt-6 w-full btn-primary text-sm py-2"
                >
                  Edit Profile
                </button>
              </div>
            </motion.div>

            {/* Recent Patients */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 relative overflow-hidden"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-gray-900 font-display">Recent Patients</h3>
                  <Link
                    href="/doctor/patients"
                    className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    View All
                  </Link>
                </div>
                {recentPatients.length > 0 ? (
                  <div className="space-y-4">
                    {recentPatients.map((patient, index) => (
                      <button
                        key={patient._id || index}
                        onClick={() => handleViewPatient(patient._id)}
                        className="w-full text-left border-2 border-gray-100 rounded-xl p-4 hover:border-primary-200 hover:bg-primary-50 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <UserGroupIcon className="h-6 w-6 text-primary-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate">{patient.name}</div>
                            {patient.email && (
                              <div className="text-sm text-gray-600 truncate">{patient.email}</div>
                            )}
                            {patient.lastAppointment && (
                              <div className="text-xs text-gray-500 mt-1">
                                Last visit: {new Date(patient.lastAppointment).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No recent patients</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 relative overflow-hidden"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

              <div className="relative z-10">
                <h3 className="text-xl font-black text-gray-900 mb-6 font-display">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/doctor/patients"
                    className="w-full flex items-center space-x-3 p-3 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors duration-300 border-2 border-primary-200"
                  >
                    <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                      <UserGroupIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-primary-700 font-medium">View All Patients</span>
                  </Link>
                  <Link
                    href="/doctor/appointments"
                    className="w-full flex items-center space-x-3 p-3 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors duration-300 border-2 border-secondary-200"
                  >
                    <div className="w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center">
                      <CalendarDaysIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-secondary-700 font-medium">Manage Appointments</span>
                  </Link>
                  <Link
                    href="/doctor/availability"
                    className="w-full flex items-center space-x-3 p-3 bg-accent-50 rounded-xl hover:bg-accent-100 transition-colors duration-300 border-2 border-accent-200"
                  >
                    <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center">
                      <ClockIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-accent-700 font-medium">Set Availability</span>
                  </Link>
                  <Link
                    href="/doctor/analytics"
                    className="w-full flex items-center space-x-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-300 border-2 border-purple-200"
                  >
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <ChartBarIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-purple-700 font-medium">View Analytics</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
