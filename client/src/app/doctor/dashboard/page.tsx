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
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI } from '@/lib/api'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import AppointmentCard from '@/components/dashboard/AppointmentCard'
import NotificationCard from '@/components/dashboard/NotificationCard'
import { StatsCardSkeleton, CardSkeleton } from '@/components/dashboard/SkeletonLoader'
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
  const [approvedAlertDismissed, setApprovedAlertDismissed] = useState(() => typeof window !== 'undefined' && sessionStorage.getItem('doctorApprovedAlertDismissed') === '1')
  const [cachedStatus, setCachedStatus] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem('user')
      if (stored) setCachedStatus(JSON.parse(stored)?.status)
    } catch { /* ignore */ }
  }, [user])
  const doctorStatus = (user as { status?: string } | null)?.status ?? cachedStatus

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
      <div className="space-y-6">
        <DashboardHeader variant="compact" subtitle="Loading your dashboard..." user={user} />
        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><CardSkeleton /></div>
            <div className="space-y-6"><CardSkeleton /><CardSkeleton /></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        variant="compact"
        subtitle="Manage your appointments, patients, and practice all in one place"
        user={user}
      />

      {/* Pending approval alert – under scrutiny */}
      {doctorStatus && doctorStatus !== 'Active' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
              <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-amber-900">Registration under review</h3>
              <p className="mt-1 text-sm text-amber-800">
                Your registration is under scrutiny. Our team is verifying your documentation and details. You will be notified in the system once everything is verified and your profile will then be visible to patients.
              </p>
              <p className="mt-2 text-xs text-amber-700">
                Check your notifications for any updates or requests from the admin.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Approved – green success (dismissible, disappears after dismiss) */}
      {doctorStatus === 'Active' && !approvedAlertDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-green-200 bg-green-50 p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-green-900">Account approved</h3>
              <p className="mt-1 text-sm text-green-800">
                Your profile is now visible to patients and you can receive bookings.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') sessionStorage.setItem('doctorApprovedAlertDismissed', '1')
                setApprovedAlertDismissed(true)
              }}
              className="shrink-0 rounded-lg p-1.5 text-green-600 hover:bg-green-100 transition-colors"
              aria-label="Dismiss"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}

      <div className="py-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/doctor/appointments"
            className="inline-flex items-center gap-2.5 text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200/50 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
          >
            <CalendarDaysIcon className="h-5 w-5" />
            View All Appointments
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<CalendarDaysIcon className="h-6 w-6" />}
            color=""
            index={0}
            onClick={() => router.push('/doctor/appointments')}
          />
          <StatsCard
            title="Today's Appointments"
            value={todayAppointments.length}
            icon={<ClockIcon className="h-6 w-6" />}
            color=""
            index={1}
            onClick={() => router.push('/doctor/appointments?filter=today')}
          />
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients || recentPatients.length}
            icon={<UserGroupIcon className="h-6 w-6" />}
            color=""
            index={2}
            onClick={() => router.push('/doctor/patients')}
          />
          <StatsCard
            title="Completed"
            value={stats.completedAppointments}
            icon={<CheckCircleIcon className="h-6 w-6" />}
            color=""
            index={3}
            onClick={() => router.push('/doctor/appointments?filter=completed')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-white rounded-xl p-6 border border-gray-100 overflow-hidden shadow-sm"
            >
              <div className="relative z-10 flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Appointments</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Your scheduled sessions for today</p>
                </div>
                <Link 
                  href="/doctor/appointments" 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium text-sm transition-colors"
                >
                  View All
                  <ArrowRightIcon className="h-4 w-4" />
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
                      className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 bg-primary-50 border border-primary-200/50 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
                    >
                      View All Appointments
                      <ArrowRightIcon className="h-4 w-4" />
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
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
            >
                <h3 className="text-base font-semibold text-gray-900 mb-3">Quick Links</h3>
                <div className="space-y-1.5">
                  <Link href="/doctor/profile" className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50/80 hover:bg-gray-100 border border-transparent hover:border-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                      <UserCircleIcon className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-gray-800 flex-1">My Profile</span>
                    <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                  </Link>
                  <Link href="/doctor/patients" className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50/80 hover:bg-gray-100 border border-transparent hover:border-gray-100 transition-colors">
                    <div className="w-9 h-9 bg-pastel-mint-100 rounded-lg flex items-center justify-center text-pastel-mint-600">
                      <UserGroupIcon className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-gray-800 flex-1">My Patients</span>
                    <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                  </Link>
                  <Link href="/doctor/appointments" className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50/80 hover:bg-gray-100 border border-transparent hover:border-gray-100 transition-colors">
                    <div className="w-9 h-9 bg-pastel-lavender-100 rounded-lg flex items-center justify-center text-pastel-lavender-600">
                      <CalendarDaysIcon className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-gray-800 flex-1">All Appointments</span>
                    <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                  </Link>
                </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                  <BellIcon className="h-4 w-4" />
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
                    <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 text-primary-500">
                      <BellIcon className="h-7 w-7" />
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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-0.5">Recent Patients</h2>
              <p className="text-sm text-gray-500">Patients you&apos;ve recently treated</p>
            </div>
            <Link 
              href="/doctor/patients" 
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors"
            >
              View All
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentPatients.length > 0 ? (
              recentPatients.map((patient: any, index: number) => (
                <motion.div
                  key={patient._id || patient.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  onClick={() => router.push(`/doctor/patients/${patient._id || patient.id}`)}
                  className="p-3 bg-gray-50/80 rounded-lg border border-gray-100 hover:bg-gray-100 hover:border-gray-200 transition-all cursor-pointer"
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
  )
}

export default DoctorDashboard

