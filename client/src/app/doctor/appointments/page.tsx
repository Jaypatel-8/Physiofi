'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI } from '@/lib/api'
import AppointmentCard from '@/components/dashboard/AppointmentCard'
import DashboardSubPageHeader from '@/components/dashboard/DashboardSubPageHeader'

const DoctorAppointments = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        window.location.href = '/login'
        return
      }
      loadAppointments()
    }
  }, [user, loading])

  const loadAppointments = async () => {
    try {
      setIsLoading(true)
      const response = await doctorAPI.getAppointments({ limit: 50, sort: 'date' })
      if (response.data.success) {
        setAppointments(response.data.data.appointments || response.data.data || [])
      }
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="space-y-6">
        <DashboardSubPageHeader title="My Appointments" subtitle="Loading..." />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-center min-h-[200px]">
          <div className="loading-dots">
            <div></div><div></div><div></div><div></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardSubPageHeader title="My Appointments" subtitle="Manage all your patient appointments" />
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id || appointment.id}
                appointment={appointment}
                onView={() => router.push(`/doctor/appointments/${appointment._id || appointment.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarDaysIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No appointments found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorAppointments
