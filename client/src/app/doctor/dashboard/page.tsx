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
  CurrencyDollarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI } from '@/lib/api'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import AppointmentCard from '@/components/dashboard/AppointmentCard'
import NotificationCard from '@/components/dashboard/NotificationCard'
import { StatsCardSkeleton, CardSkeleton } from '@/components/dashboard/SkeletonLoader'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'

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
    // Wait for auth context to initialize first
    if (loading) return
    
    // Check localStorage first (more reliable than state during redirect)
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    // If no localStorage data, redirect to login
    if (!storedToken || !storedUser) {
      router.replace('/login')
      return
    }
    
    // Parse user from localStorage to check role
    let parsedUser: any = null
    try {
      parsedUser = JSON.parse(storedUser)
    } catch (e) {
      // Invalid user data, clear and redirect
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.replace('/login')
      return
    }
    
    // Check role from localStorage
    if (parsedUser && parsedUser.role) {
      if (parsedUser.role !== 'doctor') {
        // Wrong role, redirect to home
        router.replace('/')
        return
      }
    } else {
      // No role found, redirect to login
      router.replace('/login')
      return
    }
    
    // If user state is set, double-check role
    if (user && user.role !== 'doctor') {
      router.replace('/')
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
  }, [user, loading, router])

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
        setStats(statsRes.data.data.stats || statsRes.data.data || stats)
      }

      if (appointmentsRes.data.success) {
        const allAppointments = appointmentsRes.data.data.appointments || appointmentsRes.data.data || []
        setRecentAppointments(allAppointments)
        const today = allAppointments.filter((apt: any) => {
          const aptDate = new Date(apt.appointmentDate).toISOString().split('T')[0]
          return aptDate === new Date().toISOString().split('T')[0]
        })
        setTodayAppointments(today)
      }

      if (patientsRes.data.success) {
        setRecentPatients(patientsRes.data.data.patients || patientsRes.data.data || [])
      }

      if (notificationsRes.data.success) {
        setNotifications(notificationsRes.data.data.notifications || notificationsRes.data.data || [])
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
      loadingRef.current = false
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        <Header />
        <div className="pt-16 lg:pt-20">
          <DashboardHeader subtitle="Loading your dashboard..." user={user} />
          <div className="container-custom py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[1, 2, 3, 4].map((i) => (
                <StatsCardSkeleton key={i} />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CardSkeleton />
              </div>
              <div className="space-y-6">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-secondary-50/30 to-primary-50/20">
      <Header />
      <div className="pt-16 lg:pt-20">
      <DashboardHeader 
        subtitle="Manage your appointments, patients, and practice all in one place"
        user={user}
      />

      <div className="container-custom py-10">
        {/* Primary CTA Button - Ultra Modern */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link
            href="/doctor/appointments"
            className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white px-12 py-6 rounded-2xl font-bold text-lg hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 transition-all duration-300 shadow-2xl hover:shadow-primary-500/50 transform hover:scale-[1.02] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CalendarDaysIcon className="h-7 w-7 relative z-10" />
            <span className="relative z-10">View All Appointments</span>
            <ArrowRightIcon className="h-6 w-6 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </motion.div>

        {/* Stats Grid - Ultra Modern with Pastel Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<CalendarDaysIcon className="h-7 w-7" />}
            color="bg-blue-200"
            onClick={() => router.push('/doctor/appointments')}
          />
          <StatsCard
            title="Today's Appointments"
            value={todayAppointments.length}
            icon={<ClockIcon className="h-7 w-7" />}
            color="bg-purple-200"
            onClick={() => router.push('/doctor/appointments?filter=today')}
          />
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients || recentPatients.length}
            icon={<UserGroupIcon className="h-7 w-7" />}
            color="bg-cyan-200"
            onClick={() => router.push('/doctor/patients')}
          />
          <StatsCard
            title="Completed"
            value={stats.completedAppointments}
            icon={<CheckCircleIcon className="h-7 w-7" />}
            color="bg-green-200"
            onClick={() => router.push('/doctor/appointments?filter=completed')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Today's Appointments */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-secondary-100/50 hover:border-secondary-200 hover:shadow-secondary-500/20 transition-all duration-300 overflow-hidden"
            >
              {/* Decorative gradient background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-secondary-100/30 to-transparent rounded-full blur-3xl -z-0"></div>
              
              <div className="relative z-10 flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1.5 h-8 bg-gradient-to-b from-secondary-500 to-secondary-700 rounded-full"></div>
                    <h2 className="text-3xl font-black text-gray-900 bg-gradient-to-r from-secondary-600 via-secondary-700 to-secondary-800 bg-clip-text text-transparent">Today&apos;s Appointments</h2>
                  </div>
                  <p className="text-sm text-gray-600 font-medium ml-4">Your scheduled sessions for today</p>
                </div>
                <Link 
                  href="/doctor/appointments" 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary-50 text-secondary-700 hover:bg-secondary-100 font-semibold text-sm group transition-all duration-300"
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
                        onView={() => router.push(`/doctor/appointments/${appointment._id || appointment.id}`)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full animate-pulse"></div>
                      <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                        <CalendarDaysIcon className="h-12 w-12 text-primary-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No appointments today</h3>
                    <p className="text-gray-500 mb-6 text-sm">You have a free schedule today</p>
                    <Link
                      href="/doctor/appointments"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      View All Appointments
                      <ArrowRightIcon className="h-5 w-5" />
                    </Link>
                  </motion.div>
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
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-200/50"
            >
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></div>
                  <span>Quick Links</span>
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/doctor/profile"
                    className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-primary-50 hover:via-primary-100/50 hover:to-transparent transition-all border border-gray-100 hover:border-primary-200 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center group-hover:from-primary-500 group-hover:to-primary-600 transition-all duration-300 shadow-md group-hover:shadow-lg">
                      <UserCircleIcon className="h-6 w-6 text-primary-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-bold text-gray-800 group-hover:text-primary-700 flex-1">My Profile</span>
                    <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                  <Link
                    href="/doctor/patients"
                    className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-secondary-50 hover:via-secondary-100/50 hover:to-transparent transition-all border border-gray-100 hover:border-secondary-200 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl flex items-center justify-center group-hover:from-secondary-500 group-hover:to-secondary-600 transition-all duration-300 shadow-md group-hover:shadow-lg">
                      <UserGroupIcon className="h-6 w-6 text-secondary-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-bold text-gray-800 group-hover:text-secondary-700 flex-1">My Patients</span>
                    <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-secondary-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                  <Link
                    href="/doctor/appointments"
                    className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-tertiary-50 hover:via-tertiary-100/50 hover:to-transparent transition-all border border-gray-100 hover:border-tertiary-200 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-tertiary-100 to-tertiary-200 rounded-xl flex items-center justify-center group-hover:from-tertiary-500 group-hover:to-tertiary-600 transition-all duration-300 shadow-md group-hover:shadow-lg">
                      <CalendarDaysIcon className="h-6 w-6 text-tertiary-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-bold text-gray-800 group-hover:text-tertiary-700 flex-1">All Appointments</span>
                    <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-tertiary-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-200/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-amber-700 rounded-full"></span>
                  Notifications
                </h3>
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center shadow-sm">
                  <BellIcon className="h-5 w-5 text-primary-600" />
                </div>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <NotificationCard
                      key={notification._id || index}
                      notification={notification}
                      index={index}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BellIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium">No new notifications</p>
                    <p className="text-xs text-gray-400 mt-1">You&apos;re all caught up!</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Recent Patients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-200/50"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-2 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Recent Patients</h2>
              <p className="text-sm text-gray-600 font-medium">Patients you&apos;ve recently treated</p>
            </div>
            <Link 
              href="/doctor/patients" 
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm group"
            >
              View All
              <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPatients.length > 0 ? (
              recentPatients.map((patient: any, index: number) => (
                <motion.div
                  key={patient._id || patient.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  onClick={() => router.push(`/doctor/patients/${patient._id || patient.id}`)}
                  className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-primary-300 transition-all cursor-pointer hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <UserCircleIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{patient.name}</h4>
                      <p className="text-sm text-gray-600">{patient.email || patient.phone}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full text-center py-12"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserGroupIcon className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-2 font-medium">No recent patients</p>
                <p className="text-sm text-gray-500">Your patient list will appear here</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      </div>
      <Footer />
    </div>
  )
}

export default DoctorDashboard

