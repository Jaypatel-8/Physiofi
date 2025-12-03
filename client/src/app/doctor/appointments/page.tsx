'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers'
import { doctorAPI } from '@/lib/api'
import AppointmentCard from '@/components/dashboard/AppointmentCard'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-dots mx-auto mb-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 lg:pt-20">
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white py-12">
        <div className="container-custom">
          <Link href="/doctor/dashboard" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          <h1 className="text-4xl font-black mb-2">My Appointments</h1>
          <p className="text-white/90">Manage all your patient appointments</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment._id || appointment.id}
                  appointment={appointment}
                  showPatient={true}
                  onView={() => router.push(`/doctor/appointments/${appointment._id || appointment.id}`)}
                  onEdit={() => router.push(`/doctor/appointments/${appointment._id || appointment.id}`)}
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
      </div>
      <Footer />
    </div>
  )
}

export default DoctorAppointments
