'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  UserGroupIcon, 
  CalendarDaysIcon, 
  ChartBarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  UserCircleIcon,
  StarIcon,
  BellIcon,
  ArrowRightIcon,
  PlusIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { adminAPI } from '@/lib/api'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import AppointmentCard from '@/components/dashboard/AppointmentCard'
import { StatsCardSkeleton, CardSkeleton } from '@/components/dashboard/SkeletonLoader'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [adminData, setAdminData] = useState<any>(null)
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    monthlyRevenue: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    activeDoctors: 0,
    newPatientsThisMonth: 0
  })
  const [recentAppointments, setRecentAppointments] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])
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
      router.replace('/admin/login')
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
      router.replace('/admin/login')
      return
    }
    
    // Check role from localStorage
    if (parsedUser && parsedUser.role) {
      if (parsedUser.role !== 'admin') {
        // Wrong role, redirect to home
        router.replace('/')
        return
      }
    } else {
      // No role found, redirect to login
      router.replace('/admin/login')
      return
    }
    
    // If user state is set, double-check role
    if (user && user.role !== 'admin') {
      router.replace('/')
      return
    }
    
    // Prevent multiple loads
    if (hasLoadedRef.current) return
    
    let mounted = true
    let intervalId: NodeJS.Timeout | null = null
    
    loadDashboardData().then(() => {
      if (!mounted) return
      hasLoadedRef.current = true
      // Set up polling for real-time updates (every 60 seconds)
      intervalId = setInterval(() => {
        if (!loadingRef.current) {
          loadDashboardData()
        }
      }, 60000)
    })
    
    return () => {
      mounted = false
      if (intervalId) clearInterval(intervalId)
    }
  }, [user, loading, router])

  const loadDashboardData = async () => {
    // Prevent duplicate calls using ref
    if (loadingRef.current) return
    loadingRef.current = true
    
    try {
      setIsLoading(true)
      
      const [dashboardRes, appointmentsRes, doctorsRes, patientsRes] = await Promise.all([
        adminAPI.getDashboard().catch(() => ({ data: { success: false } })),
        adminAPI.getAppointments({ limit: 10, sort: 'date' }).catch(() => ({ data: { success: false } })),
        adminAPI.getDoctors({ limit: 5, sort: 'createdAt' }).catch(() => ({ data: { success: false } })),
        adminAPI.getPatients({ limit: 5, sort: 'createdAt' }).catch(() => ({ data: { success: false } }))
      ])

      if (dashboardRes.data.success) {
        const dashboardData = dashboardRes.data.data
        setAdminData(dashboardData)
        if (dashboardData.stats) {
          setStats(dashboardData.stats)
        }
      }

      if (appointmentsRes.data.success) {
        setRecentAppointments(appointmentsRes.data.data.appointments || appointmentsRes.data.data || [])
      }

      if (doctorsRes.data.success) {
        setDoctors(doctorsRes.data.data.doctors || doctorsRes.data.data || [])
      }

      if (patientsRes.data.success) {
        setPatients(patientsRes.data.data.patients || patientsRes.data.data || [])
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
        <DashboardHeader variant="compact" subtitle="Loading admin dashboard..." user={user} />
        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><CardSkeleton /></div>
            <div><CardSkeleton /></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        variant="compact"
        subtitle="Manage your platform, users, and appointments from one central dashboard"
        user={user}
      />

      <div className="py-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap gap-3"
        >
          <Link
            href="/admin/patients"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200/50 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
          >
            <UserGroupIcon className="h-4 w-4" />
            Manage Patients
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/admin/doctors"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200/60 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
          >
            <ShieldCheckIcon className="h-4 w-4" />
            Manage Doctors
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/admin/appointments"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200/60 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
          >
            <CalendarDaysIcon className="h-4 w-4" />
            View Appointments
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients || patients.length}
            icon={<UserGroupIcon className="h-6 w-6" />}
            color=""
            index={0}
            onClick={() => router.push('/admin/patients')}
          />
          <StatsCard
            title="Total Doctors"
            value={stats.totalDoctors || doctors.length}
            icon={<ShieldCheckIcon className="h-6 w-6" />}
            color=""
            index={1}
            onClick={() => router.push('/admin/doctors')}
          />
          <StatsCard
            title="Total Appointments"
            value={stats.totalAppointments || recentAppointments.length}
            icon={<CalendarDaysIcon className="h-6 w-6" />}
            color=""
            index={2}
            onClick={() => router.push('/admin/appointments')}
          />
          <StatsCard
            title="Active Doctors"
            value={stats.activeDoctors}
            icon={<CheckCircleIcon className="h-6 w-6" />}
            color=""
            index={3}
            onClick={() => router.push('/admin/doctors?filter=active')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-white rounded-xl p-6 border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Latest appointment bookings</p>
                </div>
                <Link 
                  href="/admin/appointments" 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium text-sm transition-colors"
                >
                  View All
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {recentAppointments.length > 0 ? (
                  recentAppointments.map((appointment, index) => (
                    <motion.div
                      key={appointment._id || appointment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AppointmentCard
                        appointment={appointment}
                        onView={() => router.push(`/admin/appointments/${appointment._id || appointment.id}`)}
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
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No appointments yet</h3>
                    <p className="text-gray-500 mb-6 text-sm">Appointments will appear here once booked</p>
                    <Link
                      href="/admin/appointments"
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

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
            >
              <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/admin/doctors?action=approve"
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50/80 hover:bg-green-50 border border-transparent hover:border-green-100 transition-colors"
                >
                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShieldCheckIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-800 flex-1">Approve Doctors</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </Link>
                <Link
                  href="/admin/analytics"
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50/80 hover:bg-primary-50 border border-transparent hover:border-primary-100 transition-colors"
                >
                  <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="font-medium text-gray-800 flex-1">View Analytics</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </Link>
                <Link
                  href="/admin/patients"
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50/80 hover:bg-gray-100 border border-transparent hover:border-gray-100 transition-colors"
                >
                  <div className="w-9 h-9 bg-gray-200/80 rounded-lg flex items-center justify-center">
                    <UserGroupIcon className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-800 flex-1">Manage Patients</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-0.5">Recent Doctors</h2>
                <p className="text-sm text-gray-500">Newly registered doctors</p>
              </div>
              <Link 
                href="/admin/doctors" 
                className="flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors"
              >
                View All
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-2">
              {doctors.length > 0 ? (
                doctors.map((doctor: any, index: number) => (
                  <motion.div
                    key={doctor._id || doctor.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                    onClick={() => router.push(`/admin/doctors/${doctor._id || doctor.id}`)}
                    className="p-3 bg-gray-50/80 rounded-lg border border-gray-100 hover:bg-gray-100 hover:border-gray-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{doctor.name}</h4>
                          <p className="text-sm text-gray-600">{doctor.specialization?.[0] || 'Physiotherapist'}</p>
                        </div>
                      </div>
                      {doctor.isApproved ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Approved</span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">Pending</span>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheckIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-2 font-medium">No doctors registered yet</p>
                  <p className="text-sm text-gray-500">Doctor registrations will appear here</p>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-0.5">Recent Patients</h2>
                <p className="text-sm text-gray-500">Newly registered patients</p>
              </div>
              <Link 
                href="/admin/patients" 
                className="flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors"
              >
                View All
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-2">
              {patients.length > 0 ? (
                patients.map((patient: any, index: number) => (
                  <motion.div
                    key={patient._id || patient.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    onClick={() => router.push(`/admin/patients/${patient._id || patient.id}`)}
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
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserGroupIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-2 font-medium">No patients registered yet</p>
                  <p className="text-sm text-gray-500">Patient registrations will appear here</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

