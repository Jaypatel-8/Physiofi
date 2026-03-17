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
      <div className="space-y-6">
        <DashboardHeader subtitle="Loading your dashboard..." user={user} />
        <div className="py-4">
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
    )
  }

  return (
    <>
    <div className="space-y-4 sm:space-y-6">
      <DashboardHeader
          subtitle="Track your appointments, treatments, and recovery progress"
          user={user}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 sm:mb-8 flex flex-wrap gap-2 sm:gap-3"
        >
          <button
            onClick={() => setIsBookingOpen(true)}
            className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
          >
            <PlusIcon className="h-5 w-5" />
            Book Appointment
          </button>
          <button
            onClick={() => setIsBookingOpen(true)}
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl border border-primary-200 hover:bg-primary-50 transition-colors"
          >
            <VideoCameraIcon className="h-5 w-5" />
            Tele-Consultation
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<CalendarDaysIcon className="h-6 w-6" />}
            color=""
            index={0}
            onClick={() => router.push('/patient/appointments')}
          />
          <StatsCard
            title="Upcoming"
            value={stats.upcomingAppointments}
            icon={<ClockIcon className="h-6 w-6" />}
            color=""
            index={1}
            onClick={() => router.push('/patient/appointments?filter=upcoming')}
          />
          <StatsCard
            title="Completed"
            value={stats.completedAppointments}
            icon={<CheckCircleIcon className="h-6 w-6" />}
            color=""
            index={2}
            onClick={() => router.push('/patient/appointments?filter=completed')}
          />
          <StatsCard
            title="Active Treatments"
            value={stats.activeTreatments || treatmentPlans.length}
            icon={<HeartIcon className="h-6 w-6" />}
            color=""
            index={3}
            onClick={() => router.push('/patient/treatment')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="lg:col-span-2 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary-50 rounded-2xl border border-primary-200/40 p-4 sm:p-5 lg:p-6"
            >
              <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Upcoming Appointments</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Your next scheduled sessions</p>
                </div>
                <Link
                  href="/patient/appointments"
                  className="flex items-center gap-1.5 text-primary-600 font-medium text-sm hover:text-primary-700 no-underline"
                >
                  View all <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
              <div className="relative z-10 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
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
                    <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                      <CalendarDaysIcon className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">No upcoming appointments</h3>
                    <p className="text-sm text-gray-500 mb-4">Schedule your first appointment to get started</p>
                    <button
                      onClick={() => setIsBookingOpen(true)}
                      className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-colors text-sm"
                    >
                      <PlusIcon className="h-4 w-4" /> Book appointment
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-pastel-blue-50 rounded-2xl border border-pastel-blue-200/50 p-4 sm:p-5"
            >
              <h3 className="text-base font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/patient/profile" className="flex items-center gap-3 p-3 rounded-xl bg-white/80 border border-primary-200/40 hover:border-primary-300 transition-colors">
                  <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                    <UserCircleIcon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-gray-900">My Profile</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400 ml-auto" />
                </Link>
                <Link href="/patient/treatment" className="flex items-center gap-3 p-3 rounded-xl bg-white/80 border border-primary-200/40 hover:border-primary-300 transition-colors">
                  <div className="w-9 h-9 bg-pastel-mint-100 rounded-lg flex items-center justify-center text-pastel-mint-600">
                    <HeartIcon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-gray-900">Treatment Plans</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400 ml-auto" />
                </Link>
                <Link href="/patient/appointments" className="flex items-center gap-3 p-3 rounded-xl bg-white/80 border border-primary-200/40 hover:border-primary-300 transition-colors">
                  <div className="w-9 h-9 bg-pastel-lavender-100 rounded-lg flex items-center justify-center text-pastel-lavender-600">
                    <CalendarDaysIcon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-gray-900">All Appointments</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400 ml-auto" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-pastel-sage-50 rounded-2xl border border-pastel-sage-200/50 p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Notifications</h3>
                <div className="w-8 h-8 bg-pastel-sage-100 rounded-lg flex items-center justify-center text-pastel-sage-600">
                  <BellIcon className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <NotificationCard
                      key={notification._id || index}
                      notification={notification}
                      index={index}
                    />
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-500">No new notifications</p>
                    <p className="text-xs text-gray-400 mt-0.5">You&apos;re all caught up</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <QuickLinkCard href="/patient/medical-records" icon={<DocumentTextIcon className="h-5 w-5" />} title="Medical Records" description="View & upload" color="" index={0} delay={0.05} />
            <QuickLinkCard href="/patient/session-notes" icon={<DocumentTextIcon className="h-5 w-5" />} title="Session Notes" description="Treatment notes" color="" index={1} delay={0.07} />
            <QuickLinkCard href="/patient/prescriptions" icon={<ClipboardDocumentListIcon className="h-5 w-5" />} title="Prescriptions" description="View all" color="" index={2} delay={0.1} />
            <QuickLinkCard href="/patient/exercise-plans" icon={<HeartIcon className="h-5 w-5" />} title="Exercise Plans" description="Track progress" color="" index={3} delay={0.15} />
            <QuickLinkCard href="/patient/payments" icon={<ChartBarIcon className="h-5 w-5" />} title="Payments" description="View history" color="" index={4} delay={0.2} />
          </div>
        </div>

        {/* Treatment Plans & Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TreatmentPlan plans={treatmentPlans} />
          <ProgressTracking progress={stats.recoveryProgress || 0} />
        </div>
      </div>
      
      <BookingPopup 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
        onBookingSuccess={handleBookingSuccess}
      />
    </>
  )
}

export default PatientDashboard
