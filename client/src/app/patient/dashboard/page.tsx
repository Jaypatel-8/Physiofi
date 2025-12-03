'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  CheckCircleIcon,
  PlusIcon,
  UserCircleIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BellIcon,
  ArrowRightIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { patientAPI } from '@/lib/api'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import AppointmentCard from '@/components/dashboard/AppointmentCard'
import TreatmentPlan from '@/components/dashboard/TreatmentPlan'
import ProgressTracking from '@/components/dashboard/ProgressTracking'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BookingPopup from '@/components/ui/BookingPopup'
import toast from 'react-hot-toast'

const PatientDashboard = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    activeTreatments: 0
  })
  const [appointments, setAppointments] = useState<any[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])
  const [treatmentPlans, setTreatmentPlans] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        window.location.href = '/login'
        return
      }
      if (user.role !== 'patient') {
        window.location.href = '/'
        return
      }
      loadDashboardData()
    }
  }, [user, loading])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const [statsRes, appointmentsRes, notificationsRes] = await Promise.all([
        patientAPI.getStats().catch(() => ({ data: { success: false } })),
        patientAPI.getAppointments({ limit: 10, sort: 'date' }).catch(() => ({ data: { success: false } })),
        patientAPI.getNotifications({ limit: 5 }).catch(() => ({ data: { success: false } }))
      ])

      if (statsRes.data.success) {
        setStats(statsRes.data.data.stats || stats)
      }

      if (appointmentsRes.data.success) {
        const allAppointments = appointmentsRes.data.data.appointments || appointmentsRes.data.data || []
        setAppointments(allAppointments)
        setUpcomingAppointments(allAppointments.filter((apt: any) => 
          apt.status === 'Pending' || apt.status === 'Confirmed' || apt.status === 'Scheduled'
        ).slice(0, 3))
      }

      if (notificationsRes.data.success) {
        setNotifications(notificationsRes.data.data.notifications || notificationsRes.data.data || [])
      }

      // Mock treatment plans
      setTreatmentPlans([
        {
          condition: 'Lower Back Pain',
          description: 'Physical therapy and strengthening exercises',
          duration: '6 weeks',
          sessionsCompleted: 8,
          totalSessions: 12,
          status: 'Active'
        }
      ])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookingSuccess = () => {
    loadDashboardData()
    toast.success('Appointment booked successfully!')
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="loading-dots mx-auto mb-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      <div className="pt-16 lg:pt-20">
      <DashboardHeader 
        subtitle="Track your appointments, treatments, and recovery progress all in one place"
        user={user}
      />

      <div className="container-custom py-8">
        {/* Primary CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => setIsBookingOpen(true)}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            <PlusIcon className="h-6 w-6 relative z-10" />
            <span className="relative z-10">Book New Appointment</span>
            <ArrowRightIcon className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<CalendarDaysIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-primary-500 to-primary-600"
            onClick={() => router.push('/patient/appointments')}
          />
          <StatsCard
            title="Upcoming"
            value={stats.upcomingAppointments}
            icon={<ClockIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-yellow-500 to-orange-500"
            onClick={() => router.push('/patient/appointments?filter=upcoming')}
          />
          <StatsCard
            title="Completed"
            value={stats.completedAppointments}
            icon={<CheckCircleIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-green-500 to-emerald-600"
            onClick={() => router.push('/patient/appointments?filter=completed')}
          />
          <StatsCard
            title="Active Treatments"
            value={stats.activeTreatments || treatmentPlans.length}
            icon={<HeartIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-pink-500 to-rose-600"
            onClick={() => router.push('/patient/treatment')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">Upcoming Appointments</h2>
                  <p className="text-sm text-gray-500">Your next scheduled sessions</p>
                </div>
                <Link 
                  href="/patient/appointments" 
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm group"
                >
                  View All
                  <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment._id || appointment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AppointmentCard
                        appointment={appointment}
                        onView={() => router.push(`/patient/appointments/${appointment._id || appointment.id}`)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarDaysIcon className="h-10 w-10 text-primary-600" />
                    </div>
                    <p className="text-gray-600 mb-4 font-medium">No upcoming appointments</p>
                    <button
                      onClick={() => setIsBookingOpen(true)}
                      className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Book Your First Appointment
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Quick Links & Notifications */}
          <div className="space-y-6">
            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <h3 className="text-lg font-black text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  href="/patient/profile"
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all group border border-transparent hover:border-primary-200"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                    <UserCircleIcon className="h-5 w-5 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-primary-700">My Profile</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-primary-600 ml-auto group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/patient/treatment"
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all group border border-transparent hover:border-primary-200"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                    <DocumentTextIcon className="h-5 w-5 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-primary-700">Treatment History</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-primary-600 ml-auto group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/patient/appointments"
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all group border border-transparent hover:border-primary-200"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors">
                    <CalendarDaysIcon className="h-5 w-5 text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-primary-700">All Appointments</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-primary-600 ml-auto group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-gray-900">Notifications</h3>
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BellIcon className="h-5 w-5 text-primary-600" />
                </div>
              </div>
              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors"
                    >
                      <p className="text-sm font-semibold text-gray-900 mb-1">{notification.title || 'Notification'}</p>
                      <p className="text-xs text-gray-600">{notification.message || notification.description}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <BellIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No new notifications</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Treatment Plans & Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TreatmentPlan plans={treatmentPlans} />
          <ProgressTracking progress={null} />
        </div>
      </div>
      
      <BookingPopup 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
        onBookingSuccess={handleBookingSuccess}
      />
      </div>
      <Footer />
    </div>
  )
}

export default PatientDashboard
