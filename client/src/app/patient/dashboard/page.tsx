'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
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
  HeartIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { patientAPI } from '@/lib/api'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import AppointmentCard from '@/components/dashboard/AppointmentCard'
import TreatmentPlan from '@/components/dashboard/TreatmentPlan'
import ProgressTracking from '@/components/dashboard/ProgressTracking'
import QuickLinkCard from '@/components/dashboard/QuickLinkCard'
import NotificationCard from '@/components/dashboard/NotificationCard'
import { StatsCardSkeleton, CardSkeleton, QuickLinkSkeleton } from '@/components/dashboard/SkeletonLoader'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BookingPopup from '@/components/ui/BookingPopup'
import toast from 'react-hot-toast'

const PatientDashboard = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    activeTreatments: 0,
    recoveryProgress: 0
  })
  const [appointments, setAppointments] = useState<any[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])
  const [treatmentPlans, setTreatmentPlans] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const loadingRef = useRef(false)
  const hasLoadedRef = useRef(false)

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  const loadDashboardData = useCallback(async () => {
    // Prevent duplicate calls using ref
    if (loadingRef.current) return
    loadingRef.current = true
    
    try {
      setIsLoading(true)
      const [statsRes, appointmentsRes, notificationsRes] = await Promise.all([
        patientAPI.getStats().catch(() => ({ data: { success: false } })),
        patientAPI.getAppointments({ limit: 10, sort: 'date' }).catch(() => ({ data: { success: false } })),
        patientAPI.getNotifications({ limit: 5 }).catch(() => ({ data: { success: false } }))
      ])

      if (statsRes.data.success) {
        const statsData = statsRes.data.data.stats || statsRes.data.data || {}
        setStats((prevStats) => ({
          totalAppointments: statsData.totalAppointments ?? prevStats.totalAppointments ?? 0,
          upcomingAppointments: statsData.upcomingAppointments ?? prevStats.upcomingAppointments ?? 0,
          completedAppointments: statsData.completedAppointments ?? prevStats.completedAppointments ?? 0,
          activeTreatments: statsData.activeTreatments ?? prevStats.activeTreatments ?? 0,
          recoveryProgress: statsData.recoveryProgress ?? prevStats.recoveryProgress ?? 0
        }))
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

      // Load real treatment plans
      try {
        const treatmentPlansRes = await patientAPI.getTreatmentPlans()
        if (treatmentPlansRes.data.success) {
          const plans = treatmentPlansRes.data.data.plans || treatmentPlansRes.data.data || []
          setTreatmentPlans(plans.map((plan: any) => ({
            condition: plan.condition || plan.plan_name || 'Treatment Plan',
            description: plan.description || '',
            duration: plan.end_date ? `${Math.ceil((new Date(plan.end_date).getTime() - new Date(plan.start_date || plan.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 7))} weeks` : 'Ongoing',
            sessionsCompleted: plan.progress?.length || 0,
            totalSessions: plan.exercises?.length || 0,
            status: plan.status || 'Active',
            id: plan._id || plan.id
          })))
        }
      } catch (error) {
        console.error('Error loading treatment plans:', error)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Only show toast if we're on the client and toast is available
      if (typeof window !== 'undefined' && typeof toast !== 'undefined') {
        try {
          toast.error('Failed to load dashboard data')
        } catch (toastError) {
          // Toast might not be ready yet, just log
          console.warn('Toast not available:', toastError)
        }
      }
    } finally {
      setIsLoading(false)
      loadingRef.current = false
    }
  }, [])

  useEffect(() => {
    // Ensure we're on the client side and component is mounted
    if (typeof window === 'undefined' || !mounted) return
    
    // Wait for auth context to finish loading first
    if (loading) return
    
    try {
      // Check localStorage first (most reliable)
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      // If no token or user data at all, redirect to login
      if (!storedToken || !storedUser) {
        router.replace('/login')
        return
      }
      
      // Parse user from localStorage to check role immediately
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
      
      // Check role from localStorage first (most reliable)
      if (parsedUser && parsedUser.role) {
        if (parsedUser.role !== 'patient') {
          // Wrong role, redirect to home
          router.replace('/')
          return
        }
      }
      
      // If user state is set, double-check role
      if (user && user.role !== 'patient') {
        router.replace('/')
        return
      }
      
        // If we have valid patient data, proceed to load dashboard
      if (parsedUser && parsedUser.role === 'patient') {
        // Prevent multiple loads
        if (hasLoadedRef.current) return
        
        let isMounted = true
        loadDashboardData().then(() => {
          if (!isMounted) return
          hasLoadedRef.current = true
        }).catch((error) => {
          console.error('Error in loadDashboardData:', error)
        })
        
        // Return cleanup function
        return () => {
          isMounted = false
        }
      }
      
      // No cleanup needed if we didn't load
      return undefined
    } catch (error) {
      console.error('Error in dashboard useEffect:', error)
      // If there's an error, redirect to login for safety
      router.replace('/login')
    }
  }, [user, loading, router, loadDashboardData, mounted])

  const handleBookingSuccess = () => {
    loadDashboardData()
    // Only show toast if we're on the client and toast is available
    if (typeof window !== 'undefined' && typeof toast !== 'undefined') {
      try {
        toast.success('Appointment booked successfully!')
      } catch (toastError) {
        // Toast might not be ready yet, just log
        console.warn('Toast not available:', toastError)
      }
    }
  }

  // Show loading state during SSR or until mounted and auth is ready
  // Use the same structure for both SSR and client-side to prevent hydration mismatch
  if (typeof window === 'undefined' || !mounted || loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-purple-50/30 to-pink-50/40">
        <Header />
        <div className="pt-16 lg:pt-20">
          <DashboardHeader subtitle="Loading your dashboard..." user={null} />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-secondary-50/20">
      <Header />
      <div className="pt-16 lg:pt-20">
        <DashboardHeader 
          subtitle="Track your appointments, treatments, and recovery progress all in one place"
          user={user}
        />

        <div className="container-custom py-10">
        {/* Primary CTA Buttons - Ultra Modern Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => setIsBookingOpen(true)}
            className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 transition-all duration-300 shadow-2xl hover:shadow-primary-500/50 transform hover:scale-[1.02] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <PlusIcon className="h-6 w-6 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
            <span className="relative z-10">Book Appointment</span>
            <ArrowRightIcon className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <button
            onClick={() => {
              setIsBookingOpen(true)
            }}
            className="group relative inline-flex items-center justify-center gap-3 bg-white/90 backdrop-blur-sm text-primary-700 border-2 border-primary-200 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:border-primary-400 hover:shadow-xl transition-all duration-300 shadow-lg transform hover:scale-[1.02]"
          >
            <VideoCameraIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            <span>Book Tele-Consultation</span>
          </button>
        </motion.div>

        {/* Stats Grid - Ultra Modern Cards with Pastel Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<CalendarDaysIcon className="h-7 w-7" />}
            color="bg-blue-200"
            onClick={() => router.push('/patient/appointments')}
          />
          <StatsCard
            title="Upcoming"
            value={stats.upcomingAppointments}
            icon={<ClockIcon className="h-7 w-7" />}
            color="bg-purple-200"
            onClick={() => router.push('/patient/appointments?filter=upcoming')}
          />
          <StatsCard
            title="Completed"
            value={stats.completedAppointments}
            icon={<CheckCircleIcon className="h-7 w-7" />}
            color="bg-green-200"
            onClick={() => router.push('/patient/appointments?filter=completed')}
          />
          <StatsCard
            title="Active Treatments"
            value={stats.activeTreatments || treatmentPlans.length}
            icon={<HeartIcon className="h-7 w-7" />}
            color="bg-pink-200"
            onClick={() => router.push('/patient/treatment')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-gradient-to-br from-blue-50/90 to-blue-100/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-blue-200/60 hover:border-blue-300 hover:shadow-blue-300/30 transition-all duration-300 overflow-hidden"
            >
              {/* Decorative gradient background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/40 to-transparent rounded-full blur-3xl -z-0"></div>
              
              <div className="relative z-10 flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1.5 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                    <h2 className="text-3xl font-black text-gray-800 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">Upcoming Appointments</h2>
                  </div>
                  <p className="text-sm text-gray-700 font-medium ml-4">Your next scheduled sessions</p>
                </div>
                <Link 
                  href="/patient/appointments" 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-100 text-blue-800 hover:bg-blue-200 font-semibold text-sm group transition-all duration-300 border border-blue-200"
                >
                  View All
                  <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="relative z-10 space-y-4">
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
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20"
                  >
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full animate-pulse"></div>
                      <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <CalendarDaysIcon className="h-16 w-16 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-gray-800 mb-2">No upcoming appointments</h3>
                    <p className="text-gray-700 mb-8 text-sm">Schedule your first appointment to get started</p>
                    <button
                      onClick={() => setIsBookingOpen(true)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl font-bold hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                      <PlusIcon className="h-5 w-5" />
                      Book Your First Appointment
                    </button>
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
              className="relative bg-gradient-to-br from-purple-50/90 to-purple-100/70 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-2 border-purple-200/60 overflow-hidden"
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-200/40 to-transparent rounded-full blur-3xl -z-0"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
                  <span>Quick Links</span>
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/patient/profile"
                    className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:via-blue-100/50 hover:to-transparent transition-all border-2 border-blue-200/50 hover:border-blue-300 hover:shadow-lg bg-white/60"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-blue-300 rounded-xl flex items-center justify-center group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300 shadow-md group-hover:shadow-lg">
                      <UserCircleIcon className="h-6 w-6 text-blue-700 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-bold text-gray-800 group-hover:text-blue-700 flex-1">My Profile</span>
                    <ArrowRightIcon className="h-5 w-5 text-gray-500 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                  <Link
                    href="/patient/treatment"
                    className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-pink-50 hover:via-pink-100/50 hover:to-transparent transition-all border-2 border-pink-200/50 hover:border-pink-300 hover:shadow-lg bg-white/60"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-200 to-pink-300 rounded-xl flex items-center justify-center group-hover:from-pink-500 group-hover:to-pink-600 transition-all duration-300 shadow-md group-hover:shadow-lg">
                      <HeartIcon className="h-6 w-6 text-pink-700 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-bold text-gray-800 group-hover:text-pink-700 flex-1">Treatment Plans</span>
                    <ArrowRightIcon className="h-5 w-5 text-gray-500 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                  <Link
                    href="/patient/appointments"
                    className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-green-50 hover:via-green-100/50 hover:to-transparent transition-all border-2 border-green-200/50 hover:border-green-300 hover:shadow-lg bg-white/60"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-green-200 to-green-300 rounded-xl flex items-center justify-center group-hover:from-green-500 group-hover:to-green-600 transition-all duration-300 shadow-md group-hover:shadow-lg">
                      <CalendarDaysIcon className="h-6 w-6 text-green-700 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-bold text-gray-800 group-hover:text-green-700 flex-1">All Appointments</span>
                    <ArrowRightIcon className="h-5 w-5 text-gray-500 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-amber-50/90 to-amber-100/70 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-2 border-amber-200/60"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></span>
                  Notifications
                </h3>
                <div className="w-10 h-10 bg-gradient-to-br from-amber-200 to-amber-300 rounded-xl flex items-center justify-center shadow-sm">
                  <BellIcon className="h-5 w-5 text-amber-700" />
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

        {/* Quick Links Grid */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-black text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quick Access
            </h2>
            <p className="text-sm text-gray-700">Access your health information quickly</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <QuickLinkCard
              href="/patient/medical-records"
              icon={<DocumentTextIcon className="h-6 w-6" />}
              title="Medical Records"
              description="View & upload"
              color="from-blue-300 to-blue-400"
              delay={0.1}
            />
            <QuickLinkCard
              href="/patient/prescriptions"
              icon={<ClipboardDocumentListIcon className="h-6 w-6" />}
              title="Prescriptions"
              description="View all"
              color="from-purple-300 to-purple-400"
              delay={0.2}
            />
            <QuickLinkCard
              href="/patient/exercise-plans"
              icon={<HeartIcon className="h-6 w-6" />}
              title="Exercise Plans"
              description="Track progress"
              color="from-pink-300 to-pink-400"
              delay={0.3}
            />
            <QuickLinkCard
              href="/patient/payments"
              icon={<ChartBarIcon className="h-6 w-6" />}
              title="Payments"
              description="View history"
              color="from-green-300 to-green-400"
              delay={0.4}
            />
          </div>
        </div>

        {/* Treatment Plans & Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TreatmentPlan plans={treatmentPlans} />
          <ProgressTracking progress={stats.recoveryProgress || 0} />
        </div>
        </div>
      </div>
      
      <BookingPopup 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
        onBookingSuccess={handleBookingSuccess}
      />
      <Footer />
    </div>
  )
}

export default PatientDashboard
