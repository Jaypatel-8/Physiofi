'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  CalendarDaysIcon, 
  UserGroupIcon, 
  ClockIcon,
  ChartBarIcon,
  BellIcon,
  UserCircleIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  ArrowRightIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI } from '@/lib/api'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import AppointmentCard from '@/components/dashboard/AppointmentCard'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const DoctorDashboard = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalPatients: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    monthlyEarnings: 0
  })
  const [todayAppointments, setTodayAppointments] = useState<any[]>([])
  const [recentAppointments, setRecentAppointments] = useState<any[]>([])
  const [recentPatients, setRecentPatients] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const loadingRef = useRef(false)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    if (loading) return
    
    if (!user) {
      window.location.href = '/login'
      return
    }
    if (user.role !== 'doctor') {
      window.location.href = '/'
      return
    }
    
    // Prevent multiple loads
    if (hasLoadedRef.current) return
    
    let mounted = true
    loadDashboardData().then(() => {
      if (!mounted) return
      hasLoadedRef.current = true
    })
    
    return () => {
      mounted = false
    }
  }, [user?.id, loading])

  const loadDashboardData = async () => {
    // Prevent duplicate calls using ref
    if (loadingRef.current) return
    loadingRef.current = true
    
    try {
      setIsLoading(true)
      const today = new Date().toISOString().split('T')[0]
      
      const [statsRes, appointmentsRes, patientsRes, notificationsRes] = await Promise.all([
        doctorAPI.getStats().catch(() => ({ data: { success: false } })),
        doctorAPI.getAppointments({ limit: 10, sort: 'date' }).catch(() => ({ data: { success: false } })),
        doctorAPI.getPatients({ limit: 5 }).catch(() => ({ data: { success: false } })),
        doctorAPI.getNotifications({ limit: 5 }).catch(() => ({ data: { success: false } }))
      ])

      if (statsRes.data.success) {
        setStats(statsRes.data.data.stats || stats)
      }

      if (appointmentsRes.data.success) {
        const allAppointments = appointmentsRes.data.data.appointments || appointmentsRes.data.data || []
        setRecentAppointments(allAppointments.slice(0, 5))
        setTodayAppointments(allAppointments.filter((apt: any) => 
          apt.appointmentDate === today || apt.appointmentDate?.startsWith(today)
        ))
      }

      if (patientsRes.data.success) {
        setRecentPatients(patientsRes.data.data.patients || patientsRes.data.data || [])
      }

      if (notificationsRes.data.success) {
        setNotifications(notificationsRes.data.data.notifications || notificationsRes.data.data || [])
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
      loadingRef.current = false
    }
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
        subtitle="Manage your appointments, patients, and practice efficiently"
        user={user}
      />

      <div className="container-custom py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<CalendarDaysIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-primary-500 to-primary-600"
            onClick={() => router.push('/doctor/appointments')}
          />
          <StatsCard
            title="Today's Appointments"
            value={stats.todayAppointments || todayAppointments.length}
            icon={<ClockIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-yellow-500 to-orange-500"
            onClick={() => router.push('/doctor/appointments?filter=today')}
          />
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<UserGroupIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-primary-500 to-primary-600"
            onClick={() => router.push('/doctor/patients')}
          />
          <StatsCard
            title="Monthly Earnings"
            value={`₹${(stats.monthlyEarnings || 0).toLocaleString()}`}
            icon={<CurrencyDollarIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-green-500 to-emerald-600"
            onClick={() => router.push('/doctor/analytics')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Appointments */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">Today's Appointments</h2>
                  <p className="text-sm text-gray-500">Your scheduled sessions for today</p>
                </div>
                <Link 
                  href="/doctor/appointments" 
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm group"
                >
                  View All
                  <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="space-y-4">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment._id || appointment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AppointmentCard
                        appointment={appointment}
                        showPatient={true}
                        onView={() => router.push(`/doctor/appointments/${appointment._id || appointment.id}`)}
                        onEdit={() => router.push(`/doctor/appointments/${appointment._id || appointment.id}`)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarIcon className="h-10 w-10 text-primary-600" />
                    </div>
                    <p className="text-gray-600 mb-2 font-medium">No appointments scheduled for today</p>
                    <p className="text-sm text-gray-500">You're all caught up!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions & Notifications */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <h3 className="text-lg font-black text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/doctor/availability"
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all group border border-transparent hover:border-primary-200"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                    <CalendarIcon className="h-5 w-5 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-primary-700">Update Availability</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-primary-600 ml-auto group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/doctor/patients"
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all group border border-transparent hover:border-primary-200"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                    <UserGroupIcon className="h-5 w-5 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-primary-700">View Patients</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-primary-600 ml-auto group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/doctor/appointments"
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all group border border-transparent hover:border-primary-200"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors">
                    <ClipboardDocumentListIcon className="h-5 w-5 text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-primary-700">All Appointments</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-primary-600 ml-auto group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/doctor/profile"
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all group border border-transparent hover:border-primary-200"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                    <UserCircleIcon className="h-5 w-5 text-purple-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-primary-700">My Profile</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-primary-600 ml-auto group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/doctor/conditions"
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all group border border-transparent hover:border-primary-200"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                    <ClipboardDocumentListIcon className="h-5 w-5 text-purple-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-primary-700">Conditions & Treatment Plans</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-primary-600 ml-auto group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/doctor/analytics"
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all group border border-transparent hover:border-primary-200"
                >
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:bg-yellow-500 transition-colors">
                    <ChartBarIcon className="h-5 w-5 text-yellow-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-primary-700">Analytics</span>
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

        {/* Recent Appointments & Patients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-1">Recent Appointments</h2>
                <p className="text-sm text-gray-500">Latest patient sessions</p>
              </div>
              <Link 
                href="/doctor/appointments" 
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm group"
              >
                View All
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentAppointments.length > 0 ? (
                recentAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id || appointment.id}
                    appointment={appointment}
                    showPatient={true}
                    onView={() => router.push(`/doctor/appointments/${appointment._id || appointment.id}`)}
                  />
                ))
              ) : (
                <p className="text-gray-600 text-center py-8">No recent appointments</p>
              )}
            </div>
          </motion.div>

          {/* Recent Patients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-1">Recent Patients</h2>
                <p className="text-sm text-gray-500">Your patient list</p>
              </div>
              <Link 
                href="/doctor/patients" 
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm group"
              >
                View All
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentPatients.length > 0 ? (
                recentPatients.map((patient: any) => (
                  <Link
                    key={patient._id || patient.id}
                    href={`/doctor/patients/${patient._id || patient.id}`}
                    className="block p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UserCircleIcon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{patient.name || 'Patient'}</h3>
                        <p className="text-sm text-gray-600">{patient.email || patient.phone || 'No contact info'}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-600 text-center py-8">No recent patients</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  )
}

export default DoctorDashboard
