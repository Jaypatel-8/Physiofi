'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { adminAPI } from '@/lib/api'
import AppointmentCard from '@/components/dashboard/AppointmentCard'
import DashboardSubPageHeader from '@/components/dashboard/DashboardSubPageHeader'

const AdminAppointments = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter')
  const { user, loading } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        router.replace('/admin/login')
        return
      }
      loadAppointments()
    }
  }, [user, loading, filter, router])

  const loadAppointments = async () => {
    try {
      setIsLoading(true)
      const params: any = { limit: 100, sort: 'date' }
      if (filter === 'pending') {
        params.status = 'Pending'
      } else if (filter === 'completed') {
        params.status = 'Completed'
      }

      const response = await adminAPI.getAppointments(params)
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
        <DashboardSubPageHeader title="All Appointments" subtitle="Loading..." />
        <div className="site-card p-8 flex items-center justify-center min-h-[200px]">
          <div className="loading-dots">
            <div></div><div></div><div></div><div></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardSubPageHeader
        title="All Appointments"
        subtitle="View and manage all appointments"
      />
      <div className="site-card p-6">
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id || appointment.id}
                appointment={appointment}
                showPatient={true}
                showDoctor={true}
                onView={() => router.push(`/admin/appointments/${appointment._id || appointment.id}`)}
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

export default AdminAppointments
