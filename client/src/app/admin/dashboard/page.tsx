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
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
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
      if (parsedUser.role !== 'admin') {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        <Header />
        <div className="pt-16 lg:pt-20">
          <DashboardHeader subtitle="Loading admin dashboard..." user={user} />
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
              <div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-tertiary-50/30 to-accent-50/20">
      <Header />
      <div className="pt-16 lg:pt-20">
      <DashboardHeader 
        subtitle="Manage your platform, users, and appointments from one central dashboard"
        user={user}
      />

      <div className="container-custom py-10">
        {/* Primary CTA Buttons - Ultra Modern */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-wrap gap-4"
        >
          <Link
            href="/admin/patients"
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 transition-all duration-300 shadow-2xl hover:shadow-primary-500/50 transform hover:scale-[1.02] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <UserGroupIcon className="h-6 w-6 relative z-10" />
            <span className="relative z-10">Manage Patients</span>
            <ArrowRightIcon className="h-5 w-5 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
          <Link
            href="/admin/doctors"
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-secondary-500 via-secondary-600 to-secondary-700 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-secondary-600 hover:via-secondary-700 hover:to-secondary-800 transition-all duration-300 shadow-2xl hover:shadow-secondary-500/50 transform hover:scale-[1.02] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <ShieldCheckIcon className="h-6 w-6 relative z-10" />
            <span className="relative z-10">Manage Doctors</span>
            <ArrowRightIcon className="h-5 w-5 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
          <Link
            href="/admin/appointments"
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-tertiary-500 via-tertiary-600 to-tertiary-700 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-tertiary-600 hover:via-tertiary-700 hover:to-tertiary-800 transition-all duration-300 shadow-2xl hover:shadow-tertiary-500/50 transform hover:scale-[1.02] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CalendarDaysIcon className="h-6 w-6 relative z-10" />
            <span className="relative z-10">View Appointments</span>
            <ArrowRightIcon className="h-5 w-5 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </motion.div>

        {/* Stats Grid - Ultra Modern with Pastel Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients || patients.length}
            icon={<UserGroupIcon className="h-7 w-7" />}
            color="bg-pink-200"
            onClick={() => router.push('/admin/patients')}
          />
          <StatsCard
            title="Total Doctors"
            value={stats.totalDoctors || doctors.length}
            icon={<ShieldCheckIcon className="h-7 w-7" />}
            color="bg-indigo-200"
            onClick={() => router.push('/admin/doctors')}
          />
          <StatsCard
            title="Total Appointments"
            value={stats.totalAppointments || recentAppointments.length}
            icon={<CalendarDaysIcon className="h-7 w-7" />}
            color="bg-blue-200"
            onClick={() => router.push('/admin/appointments')}
          />
          <StatsCard
            title="Active Doctors"
            value={stats.activeDoctors}
            icon={<CheckCircleIcon className="h-7 w-7" />}
            color="bg-emerald-200"
            onClick={() => router.push('/admin/doctors?filter=active')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Appointments */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-tertiary-100/50 hover:border-tertiary-200 hover:shadow-tertiary-500/20 transition-all duration-300 overflow-hidden"
            >
              {/* Decorative gradient background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-tertiary-100/30 to-transparent rounded-full blur-3xl -z-0"></div>
              
              <div className="relative z-10 flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1.5 h-8 bg-gradient-to-b from-tertiary-500 to-tertiary-700 rounded-full"></div>
                    <h2 className="text-3xl font-black text-gray-900 bg-gradient-to-r from-tertiary-600 via-tertiary-700 to-tertiary-800 bg-clip-text text-transparent">Recent Appointments</h2>
                  </div>
                  <p className="text-sm text-gray-600 font-medium ml-4">Latest appointment bookings</p>
                </div>
                <Link 
                  href="/admin/appointments" 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-tertiary-50 text-tertiary-700 hover:bg-tertiary-100 font-semibold text-sm group transition-all duration-300"
                >
                  View All
                  <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-tertiary-100/50 overflow-hidden"
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-accent-100/30 to-transparent rounded-full blur-3xl -z-0"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-accent-500 to-accent-700 rounded-full"></div>
                  <span>Quick Actions</span>
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/admin/doctors?action=approve"
                    className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-green-50 hover:via-green-100/50 hover:to-transparent transition-all border border-gray-100 hover:border-green-200 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:from-green-500 group-hover:to-green-600 transition-all duration-300 shadow-md group-hover:shadow-lg">
                      <ShieldCheckIcon className="h-6 w-6 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-bold text-gray-800 group-hover:text-green-700 flex-1">Approve Doctors</span>
                    <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                  <Link
                    href="/admin/analytics"
                    className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-primary-50 hover:via-primary-100/50 hover:to-transparent transition-all border border-gray-100 hover:border-primary-200 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center group-hover:from-primary-500 group-hover:to-primary-600 transition-all duration-300 shadow-md group-hover:shadow-lg">
                      <ChartBarIcon className="h-6 w-6 text-primary-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-bold text-gray-800 group-hover:text-primary-700 flex-1">View Analytics</span>
                    <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                  <Link
                    href="/admin/patients"
                    className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-secondary-50 hover:via-secondary-100/50 hover:to-transparent transition-all border border-gray-100 hover:border-secondary-200 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl flex items-center justify-center group-hover:from-secondary-500 group-hover:to-secondary-600 transition-all duration-300 shadow-md group-hover:shadow-lg">
                      <UserGroupIcon className="h-6 w-6 text-secondary-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-bold text-gray-800 group-hover:text-secondary-700 flex-1">Manage Patients</span>
                    <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-secondary-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Recent Doctors & Patients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Doctors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-200/50"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-2 bg-gradient-to-r from-secondary-600 to-secondary-800 bg-clip-text text-transparent">Recent Doctors</h2>
                <p className="text-sm text-gray-600 font-medium">Newly registered doctors</p>
              </div>
              <Link 
                href="/admin/doctors" 
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm group"
              >
                View All
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="space-y-3">
              {doctors.length > 0 ? (
                doctors.map((doctor: any, index: number) => (
                  <motion.div
                    key={doctor._id || doctor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    onClick={() => router.push(`/admin/doctors/${doctor._id || doctor.id}`)}
                    className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-green-300 transition-all cursor-pointer hover:shadow-md"
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
                <p className="text-sm text-gray-600 font-medium">Newly registered patients</p>
              </div>
              <Link 
                href="/admin/patients" 
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm group"
              >
                View All
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="space-y-3">
              {patients.length > 0 ? (
                patients.map((patient: any, index: number) => (
                  <motion.div
                    key={patient._id || patient.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    onClick={() => router.push(`/admin/patients/${patient._id || patient.id}`)}
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
      <Footer />
    </div>
  )
}

export default AdminDashboard

