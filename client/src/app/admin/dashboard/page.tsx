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
  PlusIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { adminAPI } from '@/lib/api'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import AppointmentCard from '@/components/dashboard/AppointmentCard'
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
    if (loading) return
    
    if (!user) {
      window.location.href = '/login'
      return
    }
    if (user.role !== 'admin') {
      window.location.href = '/'
      return
    }
    
    // Prevent multiple loads
    if (hasLoadedRef.current) return
    
    let mounted = true
    let intervalId: NodeJS.Timeout | null = null
    
    loadDashboardData().then(() => {
      if (!mounted) return
      hasLoadedRef.current = true
      // Set up polling for real-time updates (every 60 seconds - reduced frequency)
      intervalId = setInterval(() => {
        if (!loadingRef.current) {
          loadDashboardData()
        }
      }, 60000) // Increased from 30s to 60s
    })
    
    return () => {
      mounted = false
      if (intervalId) clearInterval(intervalId)
    }
  }, [user?.id, loading])

  const loadDashboardData = async () => {
    // Prevent duplicate calls using ref
    if (loadingRef.current) return
    loadingRef.current = true
    
    try {
      setIsLoading(true)
      const [dashboardRes, appointmentsRes, doctorsRes, patientsRes] = await Promise.all([
        adminAPI.getDashboard().catch(() => ({ data: { success: false } })),
        adminAPI.getAppointments({ limit: 5, sort: 'date' }).catch(() => ({ data: { success: false } })),
        adminAPI.getDoctors({ limit: 5 }).catch(() => ({ data: { success: false } })),
        adminAPI.getPatients({ limit: 5 }).catch(() => ({ data: { success: false } }))
      ])

      if (dashboardRes.data.success) {
        setStats(dashboardRes.data.data.stats || stats)
        setAdminData(dashboardRes.data.data)
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="loading-dots mx-auto mb-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-gray-600 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      <div className="pt-16 lg:pt-20">
      <DashboardHeader 
        subtitle="Manage your physiotherapy practice with comprehensive analytics and controls"
        user={user}
      />

      <div className="container-custom py-8">
        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<UserGroupIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-primary-500 to-primary-600"
            onClick={() => router.push('/admin/patients')}
          />
          <StatsCard
            title="Total Doctors"
            value={stats.totalDoctors}
            icon={<UserCircleIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-primary-500 to-primary-600"
            onClick={() => router.push('/admin/doctors')}
          />
          <StatsCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<CalendarDaysIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-green-500 to-emerald-600"
            onClick={() => router.push('/admin/appointments')}
          />
          <StatsCard
            title="Monthly Revenue"
            value={`₹${(stats.monthlyRevenue || 0).toLocaleString()}`}
            icon={<CurrencyDollarIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-yellow-500 to-orange-500"
            onClick={() => router.push('/admin/analytics')}
          />
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Pending Appointments"
            value={stats.pendingAppointments}
            icon={<ClockIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-orange-500 to-red-500"
            onClick={() => router.push('/admin/appointments?filter=pending')}
          />
          <StatsCard
            title="Completed"
            value={stats.completedAppointments}
            icon={<CheckCircleIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-green-600 to-teal-600"
            onClick={() => router.push('/admin/appointments?filter=completed')}
          />
          <StatsCard
            title="Active Doctors"
            value={stats.activeDoctors}
            icon={<UserCircleIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-purple-500 to-indigo-600"
            onClick={() => router.push('/admin/doctors?filter=active')}
          />
          <StatsCard
            title="New Patients (Month)"
            value={stats.newPatientsThisMonth}
            icon={<StarIcon className="h-7 w-7 text-white" />}
            color="bg-gradient-to-br from-pink-500 to-rose-600"
            onClick={() => router.push('/admin/patients?filter=new')}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Appointments */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">Recent Appointments</h2>
                  <p className="text-sm text-gray-500">Latest scheduled sessions</p>
                </div>
                <Link 
                  href="/admin/appointments" 
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm group"
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
                        showPatient={true}
                        showDoctor={true}
                        onView={() => router.push(`/admin/appointments/${appointment._id || appointment.id}`)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarDaysIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-2 font-medium">No recent appointments</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

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
                href="/admin/doctors"
                className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all group border border-transparent hover:border-primary-200"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                  <UserGroupIcon className="h-5 w-5 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-semibold text-gray-700 group-hover:text-primary-700">Manage Doctors</span>
                <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-primary-600 ml-auto group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/admin/patients"
                className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all group border border-transparent hover:border-primary-200"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                  <UserCircleIcon className="h-5 w-5 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-semibold text-gray-700 group-hover:text-primary-700">Manage Patients</span>
                <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-primary-600 ml-auto group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/admin/appointments"
                className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all group border border-transparent hover:border-primary-200"
              >
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors">
                  <CalendarDaysIcon className="h-5 w-5 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-semibold text-gray-700 group-hover:text-primary-700">All Appointments</span>
                <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-primary-600 ml-auto group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/admin/analytics"
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
        </div>

        {/* Doctors & Patients Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Doctors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-1">Recent Doctors</h2>
                <p className="text-sm text-gray-500">Latest registered doctors</p>
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
                doctors.map((doctor: any) => (
                  <Link
                    key={doctor._id || doctor.id}
                    href={`/admin/doctors/${doctor._id || doctor.id}`}
                    className="block p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <UserCircleIcon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">Dr. {doctor.name || 'Doctor'}</h3>
                          <p className="text-sm text-gray-600">{doctor.specialization?.[0] || 'Physiotherapist'}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        doctor.status === 'Active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {doctor.status || 'Active'}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600">No doctors found</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Patients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-1">Recent Patients</h2>
                <p className="text-sm text-gray-500">Latest registered patients</p>
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
                patients.map((patient: any) => (
                  <Link
                    key={patient._id || patient.id}
                    href={`/admin/patients/${patient._id || patient.id}`}
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
                <div className="text-center py-8">
                  <UserCircleIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600">No patients found</p>
                </div>
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
