'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  VideoCameraIcon,
  HomeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  EyeIcon,
  XMarkIcon,
  BellIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { patientAPI, appointmentAPI } from '@/lib/api'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import AppointmentCard from '@/components/dashboard/AppointmentCard'
import BookingPopup from '@/components/ui/BookingPopup'
import toast from 'react-hot-toast'
import Image from 'next/image'

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
    name?: string
    email?: string
    phone?: string
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
}

const PatientDashboard = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [patientData, setPatientData] = useState<any>(null)
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    recoveryProgress: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [bookingType, setBookingType] = useState<'home' | 'tele'>('home')
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'Home Visit' | 'Online Consultation'>('all')
  const [homeVisitAppointments, setHomeVisitAppointments] = useState<Appointment[]>([])
  const [teleConsultationAppointments, setTeleConsultationAppointments] = useState<Appointment[]>([])

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

  useEffect(() => {
    const handleOpenBooking = (e: Event) => {
      const customEvent = e as CustomEvent
      const type = customEvent.detail?.type === 'tele' ? 'tele' : 'home'
      setBookingType(type)
      setIsBookingOpen(true)
    }

    window.addEventListener('openBooking', handleOpenBooking)
    return () => window.removeEventListener('openBooking', handleOpenBooking)
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      // Fetch patient profile
      const profileResponse = await patientAPI.getProfile()
      setPatientData(profileResponse.data.data || profileResponse.data)

      // Fetch appointments
      const appointmentsResponse = await patientAPI.getAppointments({
        status: 'all',
        limit: 50
      })
      const appointments = appointmentsResponse.data.data?.appointments || appointmentsResponse.data.appointments || []

      // Separate upcoming and past appointments
      const now = new Date()
      const upcoming = appointments.filter((apt: Appointment) => {
        const aptDate = new Date(apt.appointmentDate)
        return aptDate >= now && apt.status !== 'Cancelled'
      })
      const past = appointments.filter((apt: Appointment) => {
        const aptDate = new Date(apt.appointmentDate)
        return aptDate < now || apt.status === 'Completed' || apt.status === 'Cancelled'
      })

      setUpcomingAppointments(upcoming.sort((a: Appointment, b: Appointment) => {
        return new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
      }))
      setPastAppointments(past.sort((a: Appointment, b: Appointment) => {
        return new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
      }))

      // Load appointments by type
      try {
        const homeVisitResponse = await patientAPI.getAppointmentsByType('Home Visit', { limit: 50 })
        const homeVisitData = homeVisitResponse.data.data?.appointments || []
        setHomeVisitAppointments(homeVisitData)

        const teleResponse = await patientAPI.getAppointmentsByType('Online Consultation', { limit: 50 })
        const teleData = teleResponse.data.data?.appointments || []
        setTeleConsultationAppointments(teleData)
      } catch (error) {
        console.error('Error loading appointments by type:', error)
      }

      // Fetch stats
      const statsResponse = await patientAPI.getStats()
      const statsData = statsResponse.data.data || statsResponse.data
      setStats({
        totalAppointments: statsData.totalAppointments || appointments.length,
        completedSessions: statsData.completedSessions || past.filter((a: Appointment) => a.status === 'Completed').length,
        upcomingSessions: statsData.upcomingSessions || upcoming.length,
        recoveryProgress: statsData.recoveryProgress || patientData?.recoveryProgress || 0
      })

      // Fetch notifications
      try {
        const notificationsResponse = await patientAPI.getNotifications({ limit: 20 })
        const notificationsData = notificationsResponse.data.data?.notifications || []
        setNotifications(notificationsData)
      } catch (error) {
        console.error('Error loading notifications:', error)
      }

    } catch (error: any) {
      console.error('Error loading dashboard data:', error)
      toast.error(error.response?.data?.message || 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookAppointment = () => {
    const event = new CustomEvent('openBooking')
    window.dispatchEvent(event)
  }

  const handleViewAppointment = async (appointmentId: string) => {
    try {
      const response = await appointmentAPI.getAppointment(appointmentId)
      const appointment = response.data.data || response.data
      
      // Show appointment details in a modal or navigate to details page
      toast.success('Appointment details loaded')
      // You can implement a modal here to show full details
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load appointment details')
    }
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return

    try {
      await patientAPI.cancelAppointment(appointmentId, 'Cancelled by patient')
      toast.success('Appointment cancelled successfully')
      loadDashboardData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment')
    }
  }

  if (isLoading && !patientData) {
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
      <DashboardHeader title="Patient Dashboard" subtitle="Manage your appointments and track your recovery" />

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
              Welcome back, {patientData?.name || user?.name || 'Patient'}!
            </h2>
            <p className="text-white/90 text-lg max-w-2xl">
              Manage your appointments and track your recovery journey with PhysioFi.
            </p>
          </div>
        </motion.div>

        {/* Notifications Section */}
        {notifications.filter(n => !n.isRead).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg mb-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-blue-100"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <BellIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 font-display">Notifications</h3>
                  <p className="text-sm text-gray-600">{notifications.filter(n => !n.isRead).length} unread notification{notifications.filter(n => !n.isRead).length > 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold"
              >
                {showNotifications ? 'Hide' : 'View All'}
              </button>
            </div>
            
            {showNotifications && (
              <div className="space-y-3 relative z-10 max-h-64 overflow-y-auto">
                {notifications
                  .filter(n => !n.isRead)
                  .slice(0, 5)
                  .map((notification, index) => (
                    <motion.div
                      key={notification._id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl p-4 border-2 border-blue-200 shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.createdAt).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <button
                          onClick={async () => {
                            if (notification._id) {
                              await patientAPI.markAsRead(notification._id)
                              loadDashboardData()
                            }
                          }}
                          className="ml-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 text-xs font-semibold"
                        >
                          Mark Read
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<CalendarDaysIcon className="h-7 w-7" />}
            color="primary"
            delay={0.1}
          />
          <StatsCard
            title="Completed Sessions"
            value={stats.completedSessions}
            icon={<CheckCircleIcon className="h-7 w-7" />}
            color="green"
            delay={0.2}
          />
          <StatsCard
            title="Upcoming Sessions"
            value={stats.upcomingSessions}
            icon={<ClockIcon className="h-7 w-7" />}
            color="purple"
            delay={0.3}
          />
          <StatsCard
            title="Recovery Progress"
            value={`${stats.recoveryProgress}%`}
            icon={<ChartBarIcon className="h-7 w-7" />}
            color="accent"
            delay={0.4}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 relative overflow-hidden"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

              <h3 className="text-xl font-black text-gray-900 mb-6 font-display relative z-10">Quick Actions</h3>
              <div className="grid md:grid-cols-2 gap-4 relative z-10">
                <button
                  onClick={handleBookAppointment}
                  className="flex items-center space-x-3 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors duration-300 border-2 border-primary-200 group"
                >
                  <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <PlusIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-primary-700">Book New Appointment</div>
                    <div className="text-sm text-primary-600">Schedule a consultation</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    const event = new CustomEvent('openBooking', { detail: { type: 'tele' } })
                    window.dispatchEvent(event)
                  }}
                  className="flex items-center space-x-3 p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors duration-300 border-2 border-secondary-200 group"
                >
                  <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <VideoCameraIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-secondary-700">Online Consultation</div>
                    <div className="text-sm text-secondary-600">Video call with therapist</div>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Upcoming Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 relative overflow-hidden"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-xl font-black text-gray-900 font-display">Upcoming Appointments</h3>
                <button
                  onClick={handleBookAppointment}
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                >
                  View All
                </button>
              </div>

              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4 relative z-10">
                  {upcomingAppointments.slice(0, 5).map((appointment, index) => (
                    <AppointmentCard
                      key={appointment._id || index}
                      appointment={appointment}
                      userRole="patient"
                      onView={handleViewAppointment}
                      onAction={handleCancelAppointment}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 relative z-10">
                  <CalendarDaysIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4 font-medium">No upcoming appointments</p>
                  <button onClick={handleBookAppointment} className="btn-primary">
                    Book Appointment
                  </button>
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

              <h3 className="text-xl font-black text-gray-900 mb-6 font-display relative z-10">My Bookings</h3>
              
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
                          userRole="patient"
                          onView={handleViewAppointment}
                          onAction={handleCancelAppointment}
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
                            userRole="patient"
                            onView={handleViewAppointment}
                            onAction={handleCancelAppointment}
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
                            userRole="patient"
                            onView={handleViewAppointment}
                            onAction={handleCancelAppointment}
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

            {/* Past Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 relative overflow-hidden"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-primary-100"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-primary-50"></div>

              <h3 className="text-xl font-black text-gray-900 mb-6 font-display relative z-10">Recent Appointments</h3>
              {pastAppointments.length > 0 ? (
                <div className="space-y-4 relative z-10">
                  {pastAppointments.slice(0, 3).map((appointment, index) => (
                    <AppointmentCard
                      key={appointment._id || index}
                      appointment={appointment}
                      userRole="patient"
                      onView={handleViewAppointment}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 relative z-10">
                  <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No past appointments</p>
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
                <h3 className="text-xl font-black text-gray-900 mb-6 font-display">Profile Information</h3>
                <div className="space-y-4">
                  {patientData?.profileImage ? (
                    <div className="flex justify-center mb-4">
                      <Image
                        src={patientData.profileImage}
                        alt={patientData.name || 'Patient'}
                        width={100}
                        height={100}
                        className="rounded-full border-4 border-primary-200"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center mb-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {(patientData?.name || user?.name || 'P')[0].toUpperCase()}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-primary-500" />
                    <div>
                      <div className="text-sm text-gray-500">Name</div>
                      <div className="font-semibold text-gray-900">{patientData?.name || user?.name || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-primary-500" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-semibold text-gray-900">{patientData?.phone || user?.phone || 'N/A'}</div>
                    </div>
                  </div>
                  {patientData?.address && (
                    <div className="flex items-start space-x-3">
                      <MapPinIcon className="h-5 w-5 text-primary-500 mt-1" />
                      <div>
                        <div className="text-sm text-gray-500">Address</div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {patientData.address.street}, {patientData.address.city}, {patientData.address.state}
                        </div>
                      </div>
                    </div>
                  )}
                  {patientData?.age && (
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">Age</span>
                      <div className="font-semibold text-gray-900">{patientData.age} years</div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => router.push('/patient/profile')}
                  className="mt-6 w-full btn-primary text-sm py-2"
                >
                  Edit Profile
                </button>
              </div>
            </motion.div>

            {/* Treatment Progress */}
            {patientData?.recoveryProgress !== undefined && (
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
                  <h3 className="text-xl font-black text-gray-900 mb-6 font-display">Recovery Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                        <span className="text-sm font-bold text-primary-600">{stats.recoveryProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-primary-400 to-primary-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${stats.recoveryProgress}%` }}
                        />
                      </div>
                    </div>
                    {patientData?.currentConditions && patientData.currentConditions.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-700">Current Conditions</p>
                        {patientData.currentConditions.map((condition: any, index: number) => (
                          <div key={index} className="text-sm text-gray-600">
                            • {condition.condition} ({condition.severity})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Emergency Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 relative overflow-hidden"
            >
              {/* Book Corner Effect */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-red-100"></div>
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[45px] border-l-transparent border-t-[45px] border-t-red-50"></div>

              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                  <h3 className="text-lg font-black text-red-700 font-display">Emergency Contact</h3>
                </div>
                <p className="text-red-600 text-sm mb-4">
                  For urgent physiotherapy needs, call our emergency line.
                </p>
                <a
                  href="tel:+919998103191"
                  className="text-red-600 font-bold text-lg hover:text-red-700 transition-colors duration-300 block"
                >
                  +91 9998103191
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <BookingPopup
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        defaultServiceType={bookingType}
        onBookingSuccess={() => {
          loadDashboardData()
        }}
      />
    </div>
  )
}

export default PatientDashboard
