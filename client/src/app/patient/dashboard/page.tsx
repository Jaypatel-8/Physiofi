'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CalendarDaysIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { patientAPI } from '@/lib/api'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import AppointmentCard from '@/components/dashboard/AppointmentCard'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const PatientDashboard = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0
  })
  const [appointments, setAppointments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      loadDashboardData()
    }
  }, [user, loading, router])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const [statsRes, appointmentsRes] = await Promise.all([
        patientAPI.getStats(),
        patientAPI.getAppointments({ limit: 5 })
      ])

      if (statsRes.data.success) {
        setStats(statsRes.data.data.stats || stats)
      }

      if (appointmentsRes.data.success) {
        setAppointments(appointmentsRes.data.data.appointments || appointmentsRes.data.data || [])
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-dots mx-auto mb-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DashboardHeader title="Patient Dashboard" subtitle="Manage your appointments and treatments" />

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<CalendarDaysIcon className="h-6 w-6 text-white" />}
            color="bg-primary-500"
          />
          <StatsCard
            title="Upcoming"
            value={stats.upcomingAppointments}
            icon={<ClockIcon className="h-6 w-6 text-white" />}
            color="bg-yellow-500"
          />
          <StatsCard
            title="Completed"
            value={stats.completedAppointments}
            icon={<CheckCircleIcon className="h-6 w-6 text-white" />}
            color="bg-green-500"
          />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Appointments</h2>
          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment._id || appointment.id}
                  appointment={appointment}
                />
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">No appointments yet</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PatientDashboard
